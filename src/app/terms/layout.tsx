import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Tradey Markets",
    description: "Read the terms and conditions for using Tradey Markets. Our terms outline the rules and regulations for using our platform and educational resources.",
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}


