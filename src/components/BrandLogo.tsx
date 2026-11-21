import Image from "next/image";
import Link from "next/link";

/** Heights for the horizontal lockup (chart left, wordmark right). */
const HEIGHTS = {
    sm: 22,
    md: 28,
    lg: 36,
    xl: 48,
    hero: 44,
} as const;

/** Cropped asset aspect ratio (width / height). */
const LOGO_ASPECT = 420 / 171;

type BrandLogoProps = {
    href?: string | null;
    size?: keyof typeof HEIGHTS;
    className?: string;
    priority?: boolean;
    /** Accessible label; defaults to brand name */
    alt?: string;
};

export function BrandLogo({
    href = "/",
    size = "md",
    className = "",
    priority = false,
    alt = "Tradey Market",
}: BrandLogoProps) {
    const height = HEIGHTS[size];
    const width = Math.round(height * LOGO_ASPECT);
    const img = (
        <Image
            src="/tradey-market-logo.png"
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className={`brand-logo ${className}`.trim()}
            style={{ width, height, objectFit: "contain" }}
        />
    );

    if (href === null) return img;

    return (
        <Link href={href} className="brand-logo-link" aria-label={alt}>
            {img}
        </Link>
    );
}
