"use client";

import React, { useState, useEffect } from "react";
import LevelDetailPanel from "@/components/LevelDetailPanel";
import { loadGradesWithProgress } from "@/lib/clientCache";

export default function LevelStories() {
  const [grades, setGrades] = useState<any[]>([]);
  const [active, setActive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGradesAndProgress() {
      try {
        setLoading(true);
        const { grades: fetched } = await loadGradesWithProgress();
        setGrades(fetched);
        if (fetched.length > 0) {
          setActive(fetched[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch grades and progress in LevelStories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGradesAndProgress();
  }, []);

  return (
    <section className="mb-10">

      <div className="flex flex-col lg:flex-row lg:gap-12 gap-6 items-start">
        {/* Bubbles - horizontal on small, vertical left column on large */}
        <div className="flex-shrink-0 w-full lg:w-72">
          <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:gap-3">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="flex-shrink-0 flex flex-row items-center gap-3 animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="h-4 bg-white/10 rounded w-24 shrink-0" />
                </div>
              ))
            ) : (
              grades.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActive(g.id)}
                  aria-current={active === g.id}
                  className={`flex-shrink-0 flex flex-row items-center gap-3 text-left ${active === g.id ? "scale-105" : "opacity-80 hover:opacity-100 transition-opacity"}`}
                >
                  <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${g.progress === 100 ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/60"}`}>
                    {g.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-white/80 whitespace-nowrap">{g.title}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right panel: render the selected grade's lessons (inline) */}
        <div className="flex-1 min-w-0">
          <LevelDetailPanel gradeId={active} />
        </div>
      </div>
    </section>
  );
}


