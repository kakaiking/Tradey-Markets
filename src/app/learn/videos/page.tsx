import { VideosFeedClient } from "@/components/VideosFeedClient";
import { loadVideoLessonContent } from "@/lib/videoLessonContent";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
    const lessonContentBySlug = await loadVideoLessonContent();

    return <VideosFeedClient lessonContentBySlug={lessonContentBySlug} />;
}
