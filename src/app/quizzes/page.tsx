import Link from "next/link";
import { Layers, PlayCircle } from "lucide-react";
import { quizList } from "@/lib/data";
import { QuizWidget } from "@/components/QuizWidget";
import { PageHead } from "@/components/layout/PageHead";

export default function QuizzesPage() {
    const featuredQuiz = quizList[0];
    return (
        <div className="practice-hub">
            <PageHead
                title="Practice"
                lede="Quick quizzes and games. Sign in to save your scores."
            />

            <ul className="hub-list" style={{ marginBottom: "1.25rem" }}>
                <li>
                    <Link href="/learn/question-cards" className="shortcut-row">
                        <span className="shortcut-icon shortcut-icon--practice" aria-hidden>
                            <Layers size={20} strokeWidth={2.25} />
                        </span>
                        <span className="shortcut-copy">
                            <strong>Question cards</strong>
                            <span>Flip through bite-size checks.</span>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/learn/videos" className="shortcut-row">
                        <span className="shortcut-icon shortcut-icon--words" aria-hidden>
                            <PlayCircle size={20} strokeWidth={2.25} />
                        </span>
                        <span className="shortcut-copy">
                            <strong>Videos</strong>
                            <span>Watch a short explain, then quiz yourself.</span>
                        </span>
                    </Link>
                </li>
            </ul>

            <div className="split">
                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                        All quizzes
                    </p>
                    <ul className="choice-list">
                        {quizList.map((quiz) => (
                            <li key={quiz.slug}>
                                <Link href={`/quizzes/${quiz.slug}`} className="choice-card">
                                    <div className="choice-copy">
                                        <strong>{quiz.title}</strong>
                                        <span className="choice-meta">
                                            {quiz.questions.length || 0} questions · {quiz.difficulty}
                                        </span>
                                    </div>
                                    <span className={`choice-trail ${quiz.score === null ? "locked" : ""}`}>
                                        {quiz.score !== null ? `${quiz.score}%` : "Start"}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                        Try it now
                    </p>
                    <QuizWidget quiz={featuredQuiz} />
                </div>
            </div>
        </div>
    );
}
