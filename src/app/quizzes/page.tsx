import { CourseHubList } from "@/components/CourseHubList";
import { PageHead } from "@/components/layout/PageHead";

export default function QuizzesPage() {
    return (
        <div className="practice-hub">
            <PageHead title="Courses" />
            <CourseHubList />
        </div>
    );
}
