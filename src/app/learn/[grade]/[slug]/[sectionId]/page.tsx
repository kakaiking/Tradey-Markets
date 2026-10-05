import Link from "next/link";
import { ChevronLeft, ChevronRight, Youtube, Sparkles, CheckCircle, Lightbulb } from "lucide-react";
import { generateInDepthContent } from "@/lib/lessonHelpers";
import { prisma } from "@/lib/prisma";
import { PageHead } from "@/components/layout/PageHead";

export const dynamic = "force-dynamic";

const extractVideoId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default async function SectionPage({ params }: { params: Promise<{ grade: string, slug: string, sectionId: string }> }) {
    const { grade, slug, sectionId } = await params;
    const currentGrade = await prisma.grade.findUnique({
        where: { id: grade }
    });
    
    // Find all lessons for this grade
    const lessons = await prisma.lesson.findMany({
        where: { gradeId: grade },
        orderBy: { createdAt: "asc" },
        include: {
            sections: {
                orderBy: { order: "asc" }
            }
        }
    });
    
    const currentIndex = lessons.findIndex((l: any) => l.slug === slug);
    const currentLesson = lessons[currentIndex] as any;

    if (!currentLesson) {
        return (
            <div className="py-20 text-center">
                <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Lesson not found</h1>
                <Link href="/learn" className="text-[var(--chalk)] hover:underline mt-4 inline-block font-semibold">Back to Curriculum</Link>
            </div>
        );
    }

    const sections = currentLesson.sections || [];

    const sectionIndex = sections.findIndex((s: any) => s.id === sectionId);
    const currentSection = sections[sectionIndex];

    if (!currentSection) {
        return (
            <div className="py-20 text-center">
                <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Section not found</h1>
                <Link href={`/learn/${grade}/${slug}`} className="text-[var(--chalk)] hover:underline mt-4 inline-block font-semibold">Back to Lesson</Link>
            </div>
        );
    }

    const inDepthContent = currentSection.inDepth || generateInDepthContent(currentSection.title, currentSection.text || []);
    const videoId = extractVideoId(currentSection.videoUrl);

    const prevSection = sectionIndex > 0 ? sections[sectionIndex - 1] : null;
    const nextSection = sectionIndex < sections.length - 1 ? sections[sectionIndex + 1] : null;

    return (
        <div className="pb-16 max-w-7xl mx-auto relative">
            <PageHead
                title={currentSection.title}
                byline={`Deep dive · Part ${sectionIndex + 1} of ${sections.length}`}
                lede={`${currentGrade?.title || grade} · ${currentLesson.title}`}
                backHref={`/learn/${grade}/${slug}`}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Deep Dive Text */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="card relative overflow-hidden">
                        <div className="lesson-prose space-y-6">
                            {inDepthContent.map((paragraph: string, index: number) => {
                                if (index === 0) {
                                    const firstLetter = paragraph.charAt(0);
                                    const restOfParagraph = paragraph.slice(1);
                                    return (
                                        <p key={index}>
                                            <span className="float-left text-5xl md:text-6xl font-extrabold font-display text-[var(--chalk)] mr-3 mt-1 select-none leading-none">
                                                {firstLetter}
                                            </span>
                                            {restOfParagraph}
                                        </p>
                                    );
                                }
                                
                                const hasKeyTerm = paragraph.includes("Regulation") || paragraph.includes("Technical analysis") || paragraph.includes("Risk management");
                                if (hasKeyTerm) {
                                    return (
                                        <p key={index} className="border-l-4 border-[var(--highlighter)] pl-4 py-1 italic bg-[color-mix(in_srgb,var(--highlighter)_18%,var(--raised))] rounded-r-[var(--radius-sm)] my-6">
                                            {paragraph}
                                        </p>
                                    );
                                }

                                return (
                                    <p key={index}>{paragraph}</p>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Footer Inside Article */}
                    <div className="step-footer !static !bg-transparent !p-0 !mt-0 flex-wrap">
                        {prevSection ? (
                            <Link 
                                href={`/learn/${grade}/${slug}/${prevSection.id}`} 
                                className="btn secondary !w-auto group"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-left">
                                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[var(--muted)]">Previous</span>
                                    <span className="font-semibold max-w-[180px] truncate block">{prevSection.title}</span>
                                </span>
                            </Link>
                        ) : (
                            <div className="hidden sm:block w-10" />
                        )}

                        <Link 
                            href={`/learn/${grade}/${slug}`}
                            className="btn ghost !w-auto"
                        >
                            Lesson Overview
                        </Link>

                        {nextSection ? (
                            <Link 
                                href={`/learn/${grade}/${slug}/${nextSection.id}`} 
                                className="btn chalk !w-auto group"
                            >
                                <span className="text-right">
                                    <span className="block text-[10px] uppercase tracking-wider font-bold opacity-70">Next</span>
                                    <span className="font-extrabold max-w-[180px] truncate block">{nextSection.title}</span>
                                </span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <Link 
                                href={`/learn/${grade}/${slug}`} 
                                className="btn !w-auto group"
                            >
                                <span className="text-right">
                                    <span className="block text-[10px] uppercase tracking-wider font-bold opacity-70">All Done</span>
                                    <span className="font-extrabold block">Finish Lesson</span>
                                </span>
                                <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Column: Video & Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Interactive Video Box */}
                    {videoId && (
                        <div className="card">
                            <div className="kicker flex items-center gap-2 text-[var(--chalk)] mb-3">
                                <Youtube size={14} className="text-[var(--pencil)]" />
                                Watch Video Lesson
                            </div>
                            <div className="rounded-[var(--radius-sm)] overflow-hidden aspect-video border-2 border-[var(--ink)] bg-[var(--sunken)]">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                    title={`${currentSection.title} Video`}
                                    frameBorder="0"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* Lesson Curriculum Outline Widget */}
                    <div className="card">
                        <h3 className="kicker mb-4 flex items-center gap-2 !normal-case tracking-wider text-[var(--ink)]">
                            <Sparkles size={14} className="text-[var(--highlighter)]" />
                            Lesson Curriculum
                        </h3>
                        <div className="choice-list">
                            {sections.map((sec: any, idx: number) => {
                                const isCurrent = sec.id === sectionId;
                                return (
                                    <Link 
                                        key={sec.id}
                                        href={`/learn/${grade}/${slug}/${sec.id}`}
                                        className={`choice-card !grid-cols-[auto_1fr] ${
                                            isCurrent 
                                                ? "!bg-[color-mix(in_srgb,var(--highlighter)_28%,var(--raised))]" 
                                                : ""
                                        }`}
                                    >
                                        <div className={`w-7 h-7 rounded-[0.5rem] flex items-center justify-center font-bold text-xs border border-[var(--ink)] ${
                                            isCurrent 
                                                ? "bg-[var(--highlighter)] text-[var(--ink)]" 
                                                : "bg-[var(--sunken)] text-[var(--muted)]"
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="choice-copy min-w-0">
                                            <strong className="truncate block text-sm">{sec.title}</strong>
                                            <span className="choice-meta">
                                                {isCurrent ? "Reading Now" : `${sec.videoUrl ? "Video + " : ""}Read`}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Takeaway Card */}
                    <div className="card bg-[color-mix(in_srgb,var(--chalk)_10%,var(--raised))]">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] rounded-[var(--radius-sm)] text-[var(--chalk)] border-2 border-[var(--ink)] mt-0.5">
                                <Lightbulb size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-[var(--chalk)] mb-1">Key Takeaway</h4>
                                <p className="text-sm text-[var(--muted)] leading-relaxed font-reading">
                                    Focus on understanding the mechanical details of {currentSection.title}. This builds the structural framework for consistent, successful trades in the global marketplace.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
