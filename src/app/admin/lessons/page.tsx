"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/layout/PageHead";
import { useFeedback } from "@/components/admin/FeedbackProvider";

export default function AdminLessonsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { showSuccess, showError, showWarning, confirm } = useFeedback();

  const [grades, setGrades] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [newGradeTitle, setNewGradeTitle] = useState("");
  const [newGradeSubtitle, setNewGradeSubtitle] = useState("");
  const [newGradeColor, setNewGradeColor] = useState("#1f7a62");

  const [editingGrade, setEditingGrade] = useState<any | null>(null);
  const [editGradeTitle, setEditGradeTitle] = useState("");
  const [editGradeSubtitle, setEditGradeSubtitle] = useState("");
  const [editGradeColor, setEditGradeColor] = useState("#1f7a62");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const gradesRes = await fetch("/api/admin/grades");
      let fetchedGrades = [];
      if (gradesRes.ok) {
        const gradesData = await gradesRes.json();
        fetchedGrades = gradesData.grades || [];
        setGrades(fetchedGrades);
      }

      const lessonsRes = await fetch("/api/admin/lessons");
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData.lessons || []);
      }
    } catch (error) {
      console.error("Failed to fetch curriculum data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditLesson = (lesson: any, gradeId: string) => {
    router.push(`/admin/lessons/${gradeId}/${lesson.slug}`);
  };

  const handleDeleteLesson = (lesson: any) => {
    confirm({
      title: "Delete Lesson",
      message: `Are you sure you want to delete lesson "${lesson.title}"?`,
      confirmText: "Delete",
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/lessons/${lesson.gradeId}/${lesson.slug}`, {
            method: "DELETE"
          });
          if (res.ok) {
            showSuccess(`Lesson "${lesson.title}" deleted successfully.`);
            setLessons(prev => prev.filter(l => l.id !== lesson.id));
          } else {
            const err = await res.json();
            showError(`Failed to delete lesson: ${err.message || "Unknown error"}`);
          }
        } catch (error) {
          console.error("Error deleting lesson:", error);
          showError("An error occurred during deletion.");
        }
      }
    });
  };

  const handleAddGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeTitle) return;

    try {
      const res = await fetch("/api/admin/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGradeTitle,
          subtitle: newGradeSubtitle,
          color: newGradeColor
        })
      });

      if (res.ok) {
        showSuccess("Group level created successfully!");
        setNewGradeTitle("");
        setNewGradeSubtitle("");
        setNewGradeColor("#1f7a62");
        setShowAddGradeModal(false);
        fetchData();
      } else {
        const err = await res.json();
        showError(`Error: ${err.message || "Failed to create group"}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      showError("An unexpected error occurred.");
    }
  };

  const handleStartEditGrade = (grade: any) => {
    setEditingGrade(grade);
    setEditGradeTitle(grade.title);
    setEditGradeSubtitle(grade.subtitle || "");
    setEditGradeColor(grade.color || "#1f7a62");
  };

  const handleEditGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGradeTitle || !editingGrade) return;

    try {
      const res = await fetch(`/api/admin/grades/${editingGrade.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editGradeTitle,
          subtitle: editGradeSubtitle,
          color: editGradeColor
        })
      });

      if (res.ok) {
        showSuccess("Group level updated successfully!");
        setEditingGrade(null);
        fetchData();
      } else {
        const err = await res.json();
        showError(`Error: ${err.message || "Failed to update group"}`);
      }
    } catch (error) {
      console.error("Error updating group:", error);
      showError("An unexpected error occurred.");
    }
  };

  const handleDeleteGrade = (grade: any) => {
    confirm({
      title: "Delete Group Level",
      message: `WARNING: Deleting the group "${grade.title}" will PERMANENTLY delete ALL of its lessons and their contents!\n\nAre you absolutely sure you want to proceed?`,
      confirmText: "Delete All",
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/grades/${grade.id}`, {
            method: "DELETE"
          });
          if (res.ok) {
            showSuccess(`Group "${grade.title}" and all its lessons have been successfully deleted.`);
            fetchData();
          } else {
            const err = await res.json();
            showError(`Failed to delete: ${err.message || "Unknown error"}`);
          }
        } catch (error) {
          console.error("Error deleting group:", error);
          showError("An error occurred during deletion.");
        }
      }
    });
  };

  const handleCreateLesson = (gradeId?: string) => {
    if (grades.length === 0) {
      showWarning("Please create at least one Group Level (grade) first before creating lessons!");
      return;
    }
    if (gradeId) {
      router.push(`/admin/lessons/new?gradeId=${gradeId}`);
    } else {
      router.push("/admin/lessons/new");
    }
  };

  const filteredGrades = grades.map(grade => ({
    ...grade,
    actualLessons: lessons.filter((l: any) => l.gradeId === grade.id)
  })).filter(grade =>
    grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (grade.subtitle && grade.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    grade.actualLessons.some((l: any) => l.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const GradeModal = ({
    open,
    title,
    onClose,
    onSubmit,
    gradeTitle,
    setGradeTitle,
    gradeSubtitle,
    setGradeSubtitle,
    gradeColor,
    setGradeColor,
    submitLabel,
  }: {
    open: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    gradeTitle: string;
    setGradeTitle: (v: string) => void;
    gradeSubtitle: string;
    setGradeSubtitle: (v: string) => void;
    gradeColor: string;
    setGradeColor: (v: string) => void;
    submitLabel: string;
  }) => {
    if (!open) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "color-mix(in srgb, var(--ink) 45%, transparent)" }}>
        <div className="card" style={{ width: "min(100%, 28rem)", maxHeight: "90vh", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 className="font-display" style={{ fontSize: "1.25rem", margin: 0 }}>{title}</h3>
            <button type="button" className="btn ghost" style={{ width: "auto", minHeight: 36, padding: "0.35rem 0.75rem" }} onClick={onClose}>Close</button>
          </div>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Group title</label>
              <input type="text" required className="field" placeholder="e.g., Preschool, Advanced Forex" value={gradeTitle} onChange={(e) => setGradeTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input type="text" className="field" placeholder="e.g., Learn support & resistance" value={gradeSubtitle} onChange={(e) => setGradeSubtitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Accent color</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input type="color" value={gradeColor} onChange={(e) => setGradeColor(e.target.value)} style={{ width: 48, height: 48, border: "2px solid var(--ink)", borderRadius: "0.65rem", background: "transparent", cursor: "pointer" }} />
                <span className="font-tape status">{gradeColor}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn">{submitLabel}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHead
        title="Curriculum"
        byline="Admin"
        lede="Manage learning paths, groups, lessons, and content sections."
        backHref="/admin"
        trail={
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button type="button" className="btn secondary" style={{ width: "auto", minHeight: 44, padding: "0.5rem 0.9rem" }} onClick={() => setShowAddGradeModal(true)}>
              New group
            </button>
            <button type="button" className="btn" style={{ width: "auto", minHeight: 44, padding: "0.5rem 0.9rem" }} onClick={() => handleCreateLesson()}>
              New lesson
            </button>
          </div>
        }
      />

      <div style={{ marginBottom: "1.25rem" }}>
        <label className="label" htmlFor="lesson-search">Search</label>
        <input
          id="lesson-search"
          type="text"
          className="field"
          placeholder="Search lessons or groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <GradeModal
        open={showAddGradeModal}
        title="Create group level"
        onClose={() => setShowAddGradeModal(false)}
        onSubmit={handleAddGradeSubmit}
        gradeTitle={newGradeTitle}
        setGradeTitle={setNewGradeTitle}
        gradeSubtitle={newGradeSubtitle}
        setGradeSubtitle={setNewGradeSubtitle}
        gradeColor={newGradeColor}
        setGradeColor={setNewGradeColor}
        submitLabel="Create group"
      />

      <GradeModal
        open={!!editingGrade}
        title="Edit group level"
        onClose={() => setEditingGrade(null)}
        onSubmit={handleEditGradeSubmit}
        gradeTitle={editGradeTitle}
        setGradeTitle={setEditGradeTitle}
        gradeSubtitle={editGradeSubtitle}
        setGradeSubtitle={setEditGradeSubtitle}
        gradeColor={editGradeColor}
        setGradeColor={setEditGradeColor}
        submitLabel="Save changes"
      />

      {isLoading ? (
        <div className="card status" style={{ textAlign: "center" }}>Loading curriculum…</div>
      ) : filteredGrades.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <h3 className="font-display" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No groups yet</h3>
          <p className="lede" style={{ marginBottom: "1rem" }}>Define learning tiers first to structure the roadmap.</p>
          <button type="button" className="btn" onClick={() => setShowAddGradeModal(true)}>Create first group</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {filteredGrades.map((grade) => (
            <div key={grade.id} className="card" style={{ padding: 0, overflow: "hidden", borderLeft: `6px solid ${grade.color || "var(--chalk)"}` }}>
              <div style={{ padding: "var(--space-4)", borderBottom: "2px solid var(--ink)", display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h3 className="font-display" style={{ fontSize: "1.2rem", margin: 0 }}>{grade.title}</h3>
                    <span className="badge">{grade.actualLessons.length} lessons</span>
                  </div>
                  {grade.subtitle ? <p className="lede" style={{ fontSize: "0.95rem", marginTop: "0.25rem" }}>{grade.subtitle}</p> : null}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn chalk" style={{ width: "auto", minHeight: 40, padding: "0.4rem 0.8rem", fontSize: "0.85rem" }} onClick={() => handleCreateLesson(grade.id)}>Add lesson</button>
                  <button type="button" className="btn secondary" style={{ width: "auto", minHeight: 40, padding: "0.4rem 0.8rem", fontSize: "0.85rem" }} onClick={() => handleStartEditGrade(grade)}>Edit</button>
                  <button type="button" className="btn ghost" style={{ width: "auto", minHeight: 40, padding: "0.4rem 0.8rem", fontSize: "0.85rem", color: "var(--pencil)" }} onClick={() => handleDeleteGrade(grade)}>Delete</button>
                </div>
              </div>

              {grade.actualLessons.length === 0 ? (
                <div style={{ padding: "var(--space-5)", textAlign: "center" }}>
                  <p className="status" style={{ marginBottom: "0.75rem" }}>No lessons in this group yet.</p>
                  <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={() => handleCreateLesson(grade.id)}>Add first lesson</button>
                </div>
              ) : (
                <ul className="choice-list" style={{ padding: "var(--space-3)" }}>
                  {grade.actualLessons.map((lesson: any, index: number) => (
                    <li key={lesson.id}>
                      <div className="choice-card" style={{ cursor: "default" }}>
                        <div className="choice-copy">
                          <strong>{String(index + 1).padStart(2, "0")}. {lesson.title}</strong>
                          <span className="choice-meta">{lesson.sections?.length || 0} sections</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <button type="button" className="btn secondary" style={{ width: "auto", minHeight: 36, padding: "0.35rem 0.7rem", fontSize: "0.8rem" }} onClick={() => handleEditLesson(lesson, grade.id)}>Edit</button>
                          <button type="button" className="btn ghost" style={{ width: "auto", minHeight: 36, padding: "0.35rem 0.7rem", fontSize: "0.8rem", color: "var(--pencil)" }} onClick={() => handleDeleteLesson(lesson)}>Delete</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
