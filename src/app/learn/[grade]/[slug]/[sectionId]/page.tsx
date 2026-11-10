import { redirect } from "next/navigation";

type PageProps = {
    params: Promise<{ grade: string; slug: string; sectionId: string }>;
};

export default async function LessonSectionPage({ params }: PageProps) {
    const { grade, slug, sectionId } = await params;
    redirect(`/learn/${grade}/${slug}#${sectionId}`);
}
