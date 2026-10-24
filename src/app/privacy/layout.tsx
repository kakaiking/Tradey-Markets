import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Pipsology",
    description: "Learn how Pipsology protects your data and respects your privacy. Our comprehensive privacy policy outlines our commitment to your data security.",
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}


