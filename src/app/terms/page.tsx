"use client";
import { Scale, UserCheck, ShieldAlert, MessageSquare, AlertTriangle } from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";
import LegalAccordion from "@/components/LegalAccordion";

export default function TermsOfService() {
    const lastUpdated = "April 24, 2026";

    const sections = [
        {
            icon: Scale,
            title: "1. Acceptance of Terms",
            content: `By accessing or using Tradey Markets, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
        },
        {
            icon: UserCheck,
            title: "2. Use License",
            content: `Permission is granted to temporarily download one copy of the materials on Tradey Markets's website for personal, non-commercial viewing only.

Under this license you may not:
• Modify or copy the materials
• Use the materials for any commercial purpose
• Attempt to decompile or reverse engineer any software
• Remove any copyright or other proprietary notations`,
        },
        {
            icon: ShieldAlert,
            title: "3. Disclaimer",
            content: `The materials on Tradey Markets's website are provided on an 'as is' basis. Tradey Markets makes no warranties, expressed or implied, and hereby disclaims all other warranties including merchantability, fitness for a particular purpose, or non-infringement of intellectual property.`,
        },
        {
            icon: MessageSquare,
            title: "4. User Conduct",
            content: `Users are expected to conduct themselves professionally within our community. Harassment, hate speech, or sharing of misleading financial advice is strictly prohibited and can result in immediate account termination.`,
        },
        {
            icon: AlertTriangle,
            title: "5. Risk Warning",
            content: `Trading Forex and Cryptocurrencies involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose. The information provided by Tradey Markets is for educational purposes only and does not constitute financial advice.`,
        },
    ];

    return (
        <div>
            <PageHead
                title="Terms of Service"
                byline="Legal framework"
                lede={`Your rights and responsibilities as a Tradey Markets member. Last updated ${lastUpdated}.`}
                backHref="/"
            />
            <LegalAccordion sections={sections} />
            <div className="card" style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <h2 className="font-display" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Need clarification?</h2>
                <p className="lede" style={{ marginBottom: "1rem" }}>Our team can walk you through any section of these terms.</p>
                <a href="mailto:legal@tradeymarkets.com" className="btn secondary">Contact legal</a>
            </div>
        </div>
    );
}
