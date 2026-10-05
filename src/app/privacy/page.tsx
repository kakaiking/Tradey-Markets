"use client";
import { Shield, Lock, Eye, Globe, Bell, Info } from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";
import LegalAccordion from "@/components/LegalAccordion";

export default function PrivacyPolicy() {
    const lastUpdated = "April 24, 2026";

    const sections = [
        {
            icon: Shield,
            title: "1. Information We Collect",
            content: `We collect information to provide better services to all our users. The types of personal information we collect include:
            
• Personal identifiers (such as name, email address, and account credentials)
• Trading data (such as journal entries, strategy backtests, and performance metrics)
• Technical data (such as IP address, browser type, and device information)
• Usage data (how you interact with our educational content and tools)`,
        },
        {
            icon: Lock,
            title: "2. How We Use Your Information",
            content: `Tradey Markets uses the collected data for various purposes:
            
• To provide and maintain our Service
• To notify you about changes to our Service
• To provide customer support
• To gather analysis or valuable information so that we can improve our Service
• To monitor the usage of our Service
• To detect, prevent and address technical issues`,
        },
        {
            icon: Eye,
            title: "3. Data Sharing and Disclosure",
            content: `We do not sell your personal data. We may share your information only in the following circumstances:
            
• With service providers to monitor and analyze the use of our Service
• To comply with legal obligations
• To protect and defend the rights or property of Tradey Markets
• With your explicit consent`,
        },
        {
            icon: Globe,
            title: "4. Cookies and Tracking",
            content: `We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
            
Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
        },
        {
            icon: Bell,
            title: "5. Your Data Rights",
            content: `Depending on your location, you may have the following rights regarding your personal data:
            
• The right to access, update or delete the information we have on you
• The right of rectification
• The right to object
• The right of restriction
• The right to data portability
• The right to withdraw consent`,
        },
        {
            icon: Info,
            title: "6. Security of Data",
            content: `The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.

While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.`,
        },
    ];

    return (
        <div>
            <PageHead
                title="Privacy Policy"
                byline="Legal & compliance"
                lede={`How we protect your data at Tradey Markets. Last updated ${lastUpdated}.`}
                backHref="/"
            />
            <LegalAccordion sections={sections} />
            <div className="card" style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <h2 className="font-display" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Questions about privacy?</h2>
                <p className="lede" style={{ marginBottom: "1rem" }}>Reach our Data Protection Officer anytime.</p>
                <a href="mailto:privacy@tradeymarkets.com" className="btn">Contact privacy team</a>
            </div>
        </div>
    );
}
