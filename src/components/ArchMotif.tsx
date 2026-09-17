type ArchMotifProps = {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

/**
 * The arch silhouette pulled from the Glam Glim logo.
 * Reused across hero, section dividers, and footer as the
 * brand's recurring structural signature.
 */
export function ArchMotif({
  className,
  strokeColor = "#7A1438",
  strokeWidth = 1.5,
}: ArchMotifProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30 400V160C30 84.4 91.6 23 167 23H167C242.4 23 270 84.4 270 160V400"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <path
        d="M30 400V165C30 89.4 91.6 28 167 28"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity="0.4"
      />
    </svg>
  );
}

export function SparkleStar({
  className,
  color = "#E0469E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C12 7.5 12 9 8 12C12 12 12 13.5 12 22C12 13.5 12 12 16 12C12 9 12 7.5 12 2Z"
        fill={color}
      />
    </svg>
  );
}
