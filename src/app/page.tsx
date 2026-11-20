import { BrandLogo } from "@/components/BrandLogo";
import { HomeExplore } from "@/components/HomeExplore";
import { CourseHero } from "@/components/CourseHero";
import { getCoursesForRequest } from "@/lib/nextCourse";

export default async function HomePage() {
    const { courses } = await getCoursesForRequest();

    return (
        <div className="home-app">
            <div className="home-brand-row">
                <BrandLogo href={null} size="hero" className="home-brand-logo" priority />
            </div>

            <CourseHero courses={courses} />

            <HomeExplore />
        </div>
    );
}
