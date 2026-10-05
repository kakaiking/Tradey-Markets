import Link from "next/link";
import { quizList } from "@/lib/data";
import { QuizWidget } from "@/components/QuizWidget";
import { PageHead } from "@/components/layout/PageHead";

export function generateStaticParams() {
    return quizList.map((quiz) => ({
        slug: quiz.slug,
    }));
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const quiz = quizList.find(q => q.slug === slug);

    if (!quiz || quiz.questions.length === 0) {
        return (
            <div>
                <PageHead
                    title="Quiz coming soon"
                    lede="This quiz is not ready yet. Pick another from the list."
                    backHref="/quizzes"
                />
                <Link href="/quizzes" className="btn secondary">Back to quizzes</Link>
            </div>
        );
    }

    return (
        <div>
            <PageHead
                title={quiz.title}
                byline="Knowledge check"
                lede={`${quiz.questions.length} questions · ${quiz.difficulty}`}
                backHref="/quizzes"
            />
            <div style={{ maxWidth: "var(--measure)", marginInline: "auto" }}>
                <QuizWidget quiz={quiz} />
            </div>
        </div>
    );
}
