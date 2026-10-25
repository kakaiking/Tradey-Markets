import Link from "next/link";
import { Layers, PlayCircle } from "lucide-react";
import CurriculumMap from "@/components/CurriculumMap";
import { PageHead } from "@/components/layout/PageHead";

export default function QuizzesPage() {
    return (
        <div className="practice-hub">
            <PageHead
                title="Learn"
                lede="Lessons, question cards, and short videos."
            />

            <ul className="hub-tiles" aria-label="Practice modes">
                <li>
                    <Link href="/learn/question-cards" className="hub-tile hub-tile--cards">
                        <span className="hub-tile-icon" aria-hidden>
                            <Layers size={22} strokeWidth={2.35} />
                        </span>
                        <strong className="hub-tile-label">Question cards</strong>
                    </Link>
                </li>
                <li>
                    <Link href="/learn/videos" className="hub-tile hub-tile--videos">
                        <span className="hub-tile-icon" aria-hidden>
                            <PlayCircle size={22} strokeWidth={2.35} />
                        </span>
                        <strong className="hub-tile-label">Videos</strong>
                    </Link>
                </li>
            </ul>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                All lessons
            </p>
            <CurriculumMap />
        </div>
    );
}
