"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGateLink } from "@/components/AuthGateLink";
import type { NextCourse } from "@/lib/nextCourse";

const SLIDE_MS = 2000;

type CourseHeroProps = {
    courses: NextCourse[];
};

export function CourseHero({ courses }: CourseHeroProps) {
    const slides = courses.length > 0 ? courses : null;
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (!slides || slides.length < 2 || paused) return;

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const id = window.setInterval(() => {
            setActive((current) => (current + 1) % slides.length);
        }, SLIDE_MS);

        return () => window.clearInterval(id);
    }, [slides, paused]);

    if (!slides) {
        return (
            <section className="lesson-hero" aria-labelledby="next-course-title">
                <h2 id="next-course-title">Your curriculum will show up here.</h2>
                <Link href="/quizzes" className="lesson-hero-cta">
                    Browse courses.
                </Link>
            </section>
        );
    }

    const course = slides[active] ?? slides[0];

    return (
        <section
            className="lesson-hero course-hero"
            role="region"
            aria-roledescription="carousel"
            aria-labelledby="next-course-title"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setPaused(false);
                }
            }}
        >
            <div key={course.slug} className="course-hero-slide">
                <h2 id="next-course-title">{course.title}</h2>
                <AuthGateLink href={course.href} className="lesson-hero-cta">
                    {course.ctaLabel}
                </AuthGateLink>
            </div>
            <ul className="lesson-ticks" aria-label="Course slides">
                {slides.map((slide, i) => (
                    <li key={slide.slug} className={i === active ? "on" : undefined}>
                        <button
                            type="button"
                            className="course-hero-dot"
                            aria-label={`Show ${slide.title}`}
                            aria-current={i === active ? "true" : undefined}
                            onClick={() => setActive(i)}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
