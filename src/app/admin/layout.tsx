"use client";

import { FeedbackProvider } from "@/components/admin/FeedbackProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <FeedbackProvider>{children}</FeedbackProvider>;
}
