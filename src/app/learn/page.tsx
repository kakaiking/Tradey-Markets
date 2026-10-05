import { prisma } from "@/lib/prisma";
import CurriculumMap from "@/components/CurriculumMap";
import { PageHead } from "@/components/layout/PageHead";

export default async function LearnPage() {
    let gradeCount = 0;
    if (prisma) {
        try {
            gradeCount = await prisma.grade.count();
        } catch (error) {
            console.error("Error counting grades:", error);
        }
    }

    return (
        <div>
            <PageHead
                title="Learn"
                lede={
                    gradeCount > 0
                        ? "Pick a grade. Finish it before the next one unlocks."
                        : "Grades will show here once they are published."
                }
                backHref="/"
            />
            <CurriculumMap />
        </div>
    );
}
