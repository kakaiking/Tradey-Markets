import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Tradey Market",
    description: "Learn how Tradey Market protects your data and respects your privacy. Our comprehensive privacy policy outlines our commitment to your data security.",
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}


