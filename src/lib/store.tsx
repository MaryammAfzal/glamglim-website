"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Product, ProductVariant } from "./sample-data";
import { supabase } from "./supabase";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  checkoutMethod: "COD" | "WhatsApp";
  created_at?: string;
};

type ShopContextType = {
  products: Product[];
  cart: CartItem[];
  orders: Order[];

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;

  placeOrder: (shippingInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    checkoutMethod: "COD" | "WhatsApp";
  }) => Promise<Order | null>;

  addProduct: (
    product: Omit<Product, "id" | "rating" | "reviewsCount"> & {
      image?: string;
    }
  ) => Promise<void>;

  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => Promise<void>;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  refreshData: () => Promise<void>;
};

const ShopContext = createContext<ShopContextType | undefined>(
  undefined
);

export function ShopProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // =========================================================
  // FETCH PRODUCTS + VARIANTS
  // =========================================================

  const fetchProducts = async () => {
  try {
    // 1. Fetch products
    const {
      data: productData,
      error: productError,
    } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productError) {
      console.error("Products fetch error:", productError);
      return;
    }

    // 2. Fetch variants separately
    const {
      data: variantData,
      error: variantError,
    } = await supabase
      .from("product_variants")
      .select(`
        id,
        product_id,
        options,
        price,
        compare_at_price,
        inventory,
        image
      `);

    if (variantError) {
      console.error("Product variants fetch error:", variantError);

      // Products can still load even if variants fail
      if (productData) {
        setProducts(
          productData.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory || "",
            price: Number(p.price) || 0,
            compareAtPrice: Number(p.compare_at_price) || 0,
            shortDescription: p.short_description || "",
            description: p.description || "",
            ingredients: p.ingredients || "",
            howToUse: p.how_to_use || "",
            inventory: Number(p.inventory) || 0,
            image: p.image || "/lipstick_matte.png",
            badge: p.badge || "",
            isPublished: Boolean(p.is_published),
            rating: Number(p.rating) || 0,
            reviewsCount: Number(p.reviews_count) || 0,
            variants: [],
          }))
        );
      }

      return;
    }

    // 3. Attach variants to their products
    const formattedProducts = (productData || []).map(
      (p: any) => {
        let productVariants = (variantData || [])
          .filter(
            (variant: any) =>
              String(variant.product_id) === String(p.id)
          )
          .map((variant: any) => ({
            id: variant.id,
            options:
              variant.options &&
              typeof variant.options === "object"
                ? variant.options
                : {},
            price: Number(variant.price) || 0,
            compareAtPrice:
              Number(variant.compare_at_price) || 0,
            inventory: Number(variant.inventory) || 0,
            image: variant.image || "",
          }));

        // Normalize bad variant data entry (where the first option is used as the key)
        if (productVariants.length > 0) {
          const firstVariantKeys = Object.keys(productVariants[0].options);
          if (firstVariantKeys.length === 1) {
            const badKey = firstVariantKeys[0];
            const isStandardKey = ["color", "shade", "size", "variant", "option"].includes(badKey.toLowerCase());
            
            if (!isStandardKey) {
              // Rename the key to "Shade" for all existing variants
              productVariants = productVariants.map(v => {
                const newOptions = { "Shade": v.options[badKey] };
                return { ...v, options: newOptions };
              });
              
              // Add the missing base variant (since the key itself was the first option)
              productVariants.unshift({
                id: p.id + "-base-variant",
                options: { "Shade": badKey },
                price: Number(p.price) || 0,
                compareAtPrice: Number(p.compare_at_price) || 0,
                inventory: Number(p.inventory) || 0,
                image: p.image || "",
              });
            }
          }
        }

        return {
          id: p.id,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory || "",
          price: Number(p.price) || 0,
          compareAtPrice:
            Number(p.compare_at_price) || 0,
          shortDescription:
            p.short_description || "",
          description: p.description || "",
          ingredients: p.ingredients || "",
          howToUse: p.how_to_use || "",
          inventory: Number(p.inventory) || 0,
          image:
            p.image || "/lipstick_matte.png",
          badge: p.badge || "",
          isPublished: Boolean(p.is_published),
          rating: Number(p.rating) || 0,
          reviewsCount:
            Number(p.reviews_count) || 0,
          variants: productVariants,
        };
      }
    );

    // 4. Update products state
    setProducts(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      // Silently fail as non-admins are blocked by RLS
      return;
    }

    if (data) {
      const formattedOrders: Order[] = data.map(
        (o: any) => ({
          id: o.id,
          customerName: o.customer_name,
          phone: o.phone,
          address: o.address,
          city: o.city,
          total: o.total,
          status: o.status,
          checkoutMethod: o.checkout_method,
          date: o.created_at,
          created_at: o.created_at,

          items: (o.order_items || []).map(
            (item: any) => ({
              productId: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })
          ),
        })
      );

      setOrders(formattedOrders);
    }
  };

  // =========================================================
  // REFRESH ALL DATA
  // =========================================================

  const refreshData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
    ]);
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    try {
      const storedCart =
        localStorage.getItem("gg_cart");

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error(
        "Could not access localStorage",
        e
      );
    }

    refreshData().then(() =>
      setInitialized(true)
    );
  }, []);

  // =========================================================
  // SAVE CART TO LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    if (!initialized) return;

    try {
      localStorage.setItem(
        "gg_cart",
        JSON.stringify(cart)
      );
    } catch (e) {
      console.error(
        "Could not save cart to localStorage",
        e
      );
    }
  }, [cart, initialized]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = (
    product: Product,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          product,
          quantity,
        },
      ];
    });

    setCartOpen(true);
  };

  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  const removeFromCart = (
    productId: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.product.id !== productId
      )
    );
  };

  // =========================================================
  // UPDATE CART QUANTITY
  // =========================================================

  const updateCartQuantity = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    setCart([]);
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const placeOrder = async (shippingInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    checkoutMethod: "COD" | "WhatsApp";
  }): Promise<Order | null> => {
    if (cart.length === 0) {
      return null;
    }

    // Calculate total
    const total = cart.reduce(
      (acc, item) =>
        acc +
        item.product.price *
          item.quantity,
      0
    );

    // =======================================================
    // 1. CREATE ORDER
    // =======================================================

    const {
      data: orderData,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        customer_name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        total,
        status: "Pending",
        checkout_method:
          shippingInfo.checkoutMethod,
      })
      .select()
      .single();

    if (
      orderError ||
      !orderData
    ) {
      console.error(
        "Error creating order",
        orderError
      );

      return null;
    }

    // =======================================================
    // 2. CREATE ORDER ITEMS
    // =======================================================

    const orderItems = cart.map(
      (item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })
    );

    const {
      error: itemsError,
    } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error(
        "Error creating order items",
        itemsError
      );
    }

    // =======================================================
    // 3. UPDATE INVENTORY
    // =======================================================

    const updatedProducts =
      products.map((prod) => {
        const cartItem = cart.find(
          (item) =>
            item.product.id ===
            prod.id
        );

        if (cartItem) {
          const newInv = Math.max(
            0,
            prod.inventory -
              cartItem.quantity
          );

          // Update base product inventory
          supabase
            .from("products")
            .update({
              inventory: newInv,
            })
            .eq("id", prod.id)
            .then();

          return {
            ...prod,
            inventory: newInv,
          };
        }

        return prod;
      });

    setProducts(updatedProducts);

    // =======================================================
    // 4. CREATE LOCAL ORDER
    // =======================================================

    const newOrder: Order = {
      id: orderData.id,
      customerName:
        orderData.customer_name,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      total: orderData.total,
      status: orderData.status,
      checkoutMethod:
        orderData.checkout_method,
      date: orderData.created_at,

      items: cart.map(
        (item) => ({
          productId:
            item.product.id,
          name:
            item.product.name,
          price:
            item.product.price,
          quantity:
            item.quantity,
        })
      ),
    };

    setOrders((prev) => [
      newOrder,
      ...prev,
    ]);

    clearCart();

    return newOrder;
  };

  // =========================================================
  // ADD PRODUCT
  // =========================================================

  const addProduct = async (
    newProduct: Omit<
      Product,
      "id" | "rating" | "reviewsCount"
    > & {
      image?: string;
    }
  ) => {
    const {
      data,
      error,
    } = await supabase
      .from("products")
      .insert({
        name: newProduct.name,
        category: newProduct.category,

        // SUBCATEGORY
        subcategory:
          newProduct.subcategory,

        price: newProduct.price,
        compare_at_price:
          newProduct.compareAtPrice,

        short_description:
          newProduct.shortDescription,

        description:
          newProduct.description,

        ingredients:
          newProduct.ingredients,

        how_to_use:
          newProduct.howToUse,

        inventory:
          newProduct.inventory || 10,

        image:
          newProduct.image ||
          "/lipstick_matte.png",

        badge: newProduct.badge,

        is_published:
          newProduct.isPublished,
      })
      .select()
      .single();

    if (!error && data) {
      setProducts((prev) => [
        {
          ...data,

          subcategory:
            data.subcategory,

          price:
            Number(data.price) || 0,

          compareAtPrice:
            Number(
              data.compare_at_price
            ) || 0,

          shortDescription:
            data.short_description,

          howToUse:
            data.how_to_use,

          isPublished:
            data.is_published,

          reviewsCount:
            data.reviews_count,

          variants: [],
        } as Product,

        ...prev,
      ]);
    }
  };

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================

  const updateProduct = async (
    updatedProduct: Product
  ) => {
    const {
      error,
    } = await supabase
      .from("products")
      .update({
        name:
          updatedProduct.name,

        category:
          updatedProduct.category,

        // SUBCATEGORY
        subcategory:
          updatedProduct.subcategory,

        price:
          updatedProduct.price,

        compare_at_price:
          updatedProduct.compareAtPrice,

        short_description:
          updatedProduct.shortDescription,

        description:
          updatedProduct.description,

        ingredients:
          updatedProduct.ingredients,

        how_to_use:
          updatedProduct.howToUse,

        inventory:
          updatedProduct.inventory,

        image:
          updatedProduct.image,

        badge:
          updatedProduct.badge,

        is_published:
          updatedProduct.isPublished,
      })
      .eq(
        "id",
        updatedProduct.id
      );

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedProduct.id
            ? updatedProduct
            : p
        )
      );
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const deleteProduct = async (
    productId: string
  ) => {
    // Delete variants first
    const {
      error: variantDeleteError,
    } = await supabase
      .from("product_variants")
      .delete()
      .eq(
        "product_id",
        productId
      );

    if (variantDeleteError) {
      console.error(
        "Error deleting product variants:",
        variantDeleteError
      );

      return;
    }

    // Delete product
    const {
      error,
    } = await supabase
      .from("products")
      .delete()
      .eq(
        "id",
        productId
      );

    if (!error) {
      setProducts((prev) =>
        prev.filter(
          (p) =>
            p.id !== productId
        )
      );
    } else {
      console.error(
        "Error deleting product:",
        error
      );
    }
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    const {
      error,
    } = await supabase
      .from("orders")
      .update({
        status,
      })
      .eq(
        "id",
        orderId
      );

    if (!error) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
              }
            : o
        )
      );
    }
  };

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        placeOrder,

        addProduct,
        updateProduct,
        deleteProduct,

        updateOrderStatus,

        cartOpen,
        setCartOpen,

        refreshData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

// ===========================================================
// USE SHOP
// ===========================================================

export function useShop() {
  const context =
    useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used within a ShopProvider"
    );
  }

  return context;
}