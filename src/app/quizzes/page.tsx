import { Layers, PlayCircle } from "lucide-react";
import { AuthGateLink } from "@/components/AuthGateLink";
import { CourseHubList } from "@/components/CourseHubList";
import { PageHead } from "@/components/layout/PageHead";

export default function QuizzesPage() {
    return (
        <div className="practice-hub">
            <PageHead title="Learn" />

            <ul className="hub-tiles" aria-label="Learn modes">
                <li>
                    <AuthGateLink
                        href="/learn/question-cards"
                        className="hub-tile hub-tile--cards"
                    >
                        <span className="hub-tile-icon" aria-hidden>
                            <Layers size={22} strokeWidth={2.35} />
                        </span>
                        <strong className="hub-tile-label">Question cards</strong>
                    </AuthGateLink>
                </li>
                <li>
                    <AuthGateLink href="/learn/videos" className="hub-tile hub-tile--videos">
                        <span className="hub-tile-icon" aria-hidden>
                            <PlayCircle size={22} strokeWidth={2.35} />
                        </span>
                        <strong className="hub-tile-label">Videos</strong>
                    </AuthGateLink>
                </li>
            </ul>

            <CourseHubList />
        </div>
    );
}
