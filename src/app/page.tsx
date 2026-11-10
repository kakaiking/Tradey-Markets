import { HomeExplore } from "@/components/HomeExplore";
import { CourseHero } from "@/components/CourseHero";
import { getCoursesForRequest } from "@/lib/nextCourse";

export default async function HomePage() {
    const { courses } = await getCoursesForRequest();

    return (
        <div className="home-app">
            <div className="home-brand-row">
                <span className="home-brand">Tradey Markets</span>
            </div>

            <CourseHero courses={courses} />

            <HomeExplore />
        </div>
    );
}
