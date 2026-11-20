import Image from "next/image";
import Link from "next/link";

const SIZES = {
    sm: 28,
    md: 40,
    lg: 56,
    xl: 88,
    hero: 120,
} as const;

type BrandLogoProps = {
    href?: string | null;
    size?: keyof typeof SIZES;
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
    const px = SIZES[size];
    const img = (
        <Image
            src="/tradey-market-logo.png"
            alt={alt}
            width={px}
            height={px}
            priority={priority}
            className={`brand-logo ${className}`.trim()}
            style={{ width: px, height: px, objectFit: "contain" }}
        />
    );

    if (href === null) return img;

    return (
        <Link href={href} className="brand-logo-link" aria-label={alt}>
            {img}
        </Link>
    );
}
