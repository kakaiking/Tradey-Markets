"use client";
import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface Section {
    icon?: LucideIcon;
    title: string;
    content: string;
}

interface LegalAccordionProps {
    sections: Section[];
}

export default function LegalAccordion({ sections }: LegalAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <ul className="choice-list">
            {sections.map((section, i) => {
                const Icon = section.icon;
                const open = openIndex === i;
                return (
                    <li key={i}>
                        <button
                            type="button"
                            className="choice-card"
                            style={{
                                gridTemplateColumns: "1fr auto",
                                alignItems: "start",
                                ...(open ? { background: "color-mix(in srgb, var(--highlighter) 18%, var(--raised))" } : {}),
                            }}
                            onClick={() => setOpenIndex(open ? null : i)}
                            aria-expanded={open}
                        >
                            <div className="choice-copy">
                                <strong style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    {Icon ? <Icon size={18} /> : null}
                                    {section.title}
                                </strong>
                                {open ? (
                                    <span className="lede" style={{ fontSize: "0.95rem", whiteSpace: "pre-line", marginTop: "0.5rem" }}>
                                        {section.content}
                                    </span>
                                ) : null}
                            </div>
                            <span className={`choice-trail${open ? " active" : ""}`}>
                                <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }} />
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
