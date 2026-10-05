"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type GradeRow = {
    id: string;
    title: string;
    subtitle?: string;
    progress: number;
};

function gradeState(progress: number, index: number, grades: GradeRow[]) {
    if (progress === 100) return "completed" as const;
    if (progress > 0) return "active" as const;
    const prevDone = index === 0 || (grades[index - 1]?.progress ?? 0) === 100;
    if (prevDone) return "available" as const;
    return "locked" as const;
}

export default function CurriculumMap() {
    const [grades, setGrades] = useState<GradeRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGradesAndProgress() {
            try {
                const [gradesRes, progressRes] = await Promise.all([
                    fetch("/api/grades"),
                    fetch("/api/user/progress/"),
                ]);

                let fetchedGrades: GradeRow[] = [];
                let progressData: { progress?: Record<string, number> } = {};

                if (gradesRes.ok) {
                    const gradesData = await gradesRes.json();
                    fetchedGrades = gradesData.grades || [];
                }

                if (progressRes.ok) {
                    progressData = await progressRes.json();
                }

                fetchedGrades = fetchedGrades.map((g) => ({
                    ...g,
                    progress: progressData.progress?.[g.id] ?? 0,
                }));

                setGrades(fetchedGrades);
            } catch (err) {
                console.error("Failed to fetch curriculum map data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchGradesAndProgress();
    }, []);

    if (loading) {
        return (
            <ul className="choice-list" aria-busy="true">
                {[1, 2, 3].map((n) => (
                    <li key={n}>
                        <div className="choice-card" style={{ opacity: 0.5 }}>
                            <div className="choice-copy">
                                <strong>Loading…</strong>
                                <span className="choice-meta">Grade</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    if (grades.length === 0) {
        return <p className="status">No grades published yet.</p>;
    }

    return (
        <ul className="choice-list">
            {grades.map((grade, index) => {
                const state = gradeState(grade.progress, index, grades);
                const locked = state === "locked";
                const trail =
                    state === "completed"
                        ? "Done"
                        : state === "active"
                          ? `${grade.progress}%`
                          : state === "locked"
                            ? "Locked"
                            : "Open";

                const inner = (
                    <>
                        <div className="choice-copy">
                            <strong>{grade.title}</strong>
                            <span className="choice-meta">
                                {grade.subtitle || `Grade ${index + 1}`}
                            </span>
                        </div>
                        <span
                            className={`choice-trail ${
                                locked ? "locked" : state === "active" ? "active" : ""
                            }`}
                        >
                            {trail}
                        </span>
                    </>
                );

                return (
                    <li key={grade.id}>
                        {locked ? (
                            <div className="choice-card locked" aria-disabled="true">
                                {inner}
                            </div>
                        ) : (
                            <Link href={`/learn/${grade.id}`} className="choice-card">
                                {inner}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
