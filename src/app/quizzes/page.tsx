import Link from "next/link";
import { quizList } from "@/lib/data";
import { QuizWidget } from "@/components/QuizWidget";
import { PageHead } from "@/components/layout/PageHead";

export default function QuizzesPage() {
    const featuredQuiz = quizList[0];
    return (
        <div>
            <PageHead
                title="Forex Quizzes"
                byline="Knowledge testing"
                lede="Test yourself on every topic from the School of Pipsology. Sign in to save scores."
            />

            <div className="split">
                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>All quizzes</p>
                    <ul className="choice-list">
                        {quizList.map((quiz) => (
                            <li key={quiz.slug}>
                                <Link href={`/quizzes/${quiz.slug}`} className="choice-card">
                                    <div className="choice-copy">
                                        <strong>{quiz.title}</strong>
                                        <span className="choice-meta">
                                            {quiz.questions.length || 0} questions · {quiz.difficulty} · {quiz.completions} completed
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
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Try it now</p>
                    <QuizWidget quiz={featuredQuiz} />
                </div>
            </div>
        </div>
    );
}
