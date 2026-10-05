"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ChevronLeft, 
  Save, 
  BookOpen, 
  Plus, 
  Type, 
  Link as LinkIcon, 
  GraduationCap, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  X,
  ArrowLeft,
  Video,
  Settings,
  HelpCircle
} from "lucide-react";
import { useFeedback } from "@/components/admin/FeedbackProvider";
const getYouTubeId = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function EditLessonForm() {
  const router = useRouter();
  const params = useParams();
  const { grade: gradeParam, slug: slugParam } = params;
  const { showSuccess, showError } = useFeedback();

  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [grades, setGrades] = useState<any[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const res = await fetch("/api/admin/grades");
        if (res.ok) {
          const data = await res.json();
          setGrades(data.grades || []);
        }
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      }
    }
    fetchGrades();
  }, []);

  useEffect(() => {
    async function fetchLesson() {
      const gradeId = gradeParam as string;
      const lessonSlug = slugParam as string;
      
      if (gradeId && lessonSlug) {
        try {
          const res = await fetch(`/api/admin/lessons/${gradeId}/${lessonSlug}`);
          if (res.ok) {
            const data = await res.json();
            const lesson = data.lesson;
            if (lesson) {
              setTitle(lesson.title || "");
              setGrade(lesson.gradeId || gradeId);
              setSlug(lesson.slug || "");
              setContent(lesson.sections || []);
            }
          } else {
            console.error("Lesson not found in DB");
          }
        } catch (error) {
          console.error("Failed to fetch lesson:", error);
        }
      }
      setIsLoading(false);
    }
    fetchLesson();
  }, [gradeParam, slugParam]);

  useEffect(() => {
    if (title && !slugParam) {
      setSlug(title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""));
    }
  }, [title, slugParam]);

  const addContentBlock = () => {
    setContent([...content, {
      id: `block-${Date.now()}`,
      title: "",
      text: [""],
      visualType: "default",
      videoUrl: "",
      questionCards: []
    }]);
  };

  const updateContentBlock = (index: number, field: string, value: any) => {
    const newContent = [...content];
    if (field === "text") {
      newContent[index][field] = value.split("\n");
    } else {
      newContent[index][field] = value;
    }
    setContent(newContent);
  };

  const removeContentBlock = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const addQuestionToBlock = (blockIndex: number) => {
    const newContent = [...content];
    const block = newContent[blockIndex];
    if (!block.questionCards) {
      block.questionCards = [];
    }
    block.questionCards.push({
      id: `q-${Date.now()}-${Math.random()}`,
      question: "",
      description: "",
      options: ["", "", "", ""],
      correctIndex: 0
    });
    setContent(newContent);
  };

  const updateQuestionInBlock = (blockIndex: number, qIndex: number, field: string, value: any) => {
    const newContent = [...content];
    const block = newContent[blockIndex];
    if (!block.questionCards) block.questionCards = [];
    const question = block.questionCards[qIndex];
    if (field === "options") {
      const newOptions = [...question.options];
      newOptions[value.index] = value.optionVal;
      question.options = newOptions;
    } else {
      question[field] = value;
    }
    setContent(newContent);
  };

  const removeQuestionFromBlock = (blockIndex: number, qIndex: number) => {
    const newContent = [...content];
    const block = newContent[blockIndex];
    if (block.questionCards) {
      block.questionCards = block.questionCards.filter((_: any, i: number) => i !== qIndex);
    }
    setContent(newContent);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !grade || !slug) return;

    try {
      const res = await fetch(`/api/admin/lessons/${gradeParam}/${slugParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          gradeId: grade,
          slug,
          content
        })
      });

      if (res.ok) {
        showSuccess("Lesson saved successfully!");
        router.push("/admin/lessons");
      } else {
        const err = await res.json();
        showError(`Error: ${err.message || "Failed to save lesson"}`);
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      showError("An unexpected error occurred.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin/lessons")}
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/50 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
              {slugParam ? "Edit Lesson" : "Create New Lesson"}
            </h1>
            <p className="text-white/50">Configure lesson details and educational content.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/admin/lessons")}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Details Card */}
        <div className="bg-[#0d1411] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-green-400" />
              General Information
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Lesson Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type size={18} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Understanding Pip Calculations"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Grade Level</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap size={18} className="text-white/40" />
                  </div>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all cursor-pointer"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id} className="bg-[#0d1411]">
                        {g.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={18} className="text-white/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced / SEO Settings Accordion */}
            <div className="border-t border-white/5 pt-6 mt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 font-bold transition-all focus:outline-none bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5"
              >
                <Settings size={16} />
                <span>{showAdvanced ? "Hide Advanced / SEO Settings" : "Show Advanced / SEO Settings"}</span>
                {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {showAdvanced && (
                <div className="mt-4 p-6 bg-black/20 rounded-2xl border border-white/5 space-y-4 transition-all duration-300 ease-in-out">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">URL Slug</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={18} className="text-white/40" />
                      </div>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="understanding-pip-calculations"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-white/40 mt-2 pl-1">
                      Customize the unique URL path for this lesson. Leave as-is to use the automatically generated slug.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-[#0d1411] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-green-400" />
              Lesson Curriculum
            </h3>
            <button
              type="button"
              onClick={addContentBlock}
              className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Add Section
            </button>
          </div>
          
          <div className="p-8 space-y-6">
            {content.map((block, index) => (
              <div key={block.id || index} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4 relative group/block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-white/40 flex items-center justify-center font-mono text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h4 className="font-bold text-white/90">Section Block</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContentBlock(index)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/30 uppercase tracking-wider mb-2">Section Title</label>
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => updateContentBlock(index, "title", e.target.value)}
                      placeholder="e.g., The Core Concepts"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/30 uppercase tracking-wider mb-2">Section Content</label>
                    <textarea
                      value={block.text.join("\n")}
                      onChange={(e) => updateContentBlock(index, "text", e.target.value)}
                      placeholder="Enter the lesson text here. Use new lines for separate paragraphs."
                      rows={5}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/30 uppercase tracking-wider mb-2">YouTube Video Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Video size={18} className="text-white/40" />
                      </div>
                      <input
                        type="text"
                        value={block.videoUrl || ""}
                        onChange={(e) => updateContentBlock(index, "videoUrl", e.target.value)}
                        placeholder="e.g., https://www.youtube.com/watch?v=..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                      />
                    </div>

                    {block.videoUrl && getYouTubeId(block.videoUrl) && (
                      <div className="mt-3 p-3 bg-black/60 border border-white/5 rounded-2xl flex items-center gap-4 transition-all duration-300 ease-in-out">
                        <div className="relative w-36 aspect-video rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#0d1411]">
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeId(block.videoUrl)}/mqdefault.jpg`}
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-0.5">YouTube Preview</span>
                          <span className="text-xs text-white/60 font-mono block truncate">{block.videoUrl}</span>
                          <span className="text-[10px] text-white/30 font-medium block mt-1">ID: {getYouTubeId(block.videoUrl)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Cards Section */}
                  <div className="border-t border-white/5 pt-4 mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle size={14} className="text-green-400" />
                        Question Cards ({(block.questionCards || []).length})
                      </h5>
                      <button
                        type="button"
                        onClick={() => addQuestionToBlock(index)}
                        className="px-3 py-1.5 border border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Question Card
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(block.questionCards || []).map((card: any, qIdx: number) => (
                        <div key={card.id || qIdx} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3 relative group/q-card">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-green-400/80 bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10">
                              Question Card {qIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeQuestionFromBlock(index, qIdx)}
                              className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            {/* Question Input */}
                            <div>
                              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Question Text</label>
                              <input
                                type="text"
                                required
                                value={card.question}
                                onChange={(e) => updateQuestionInBlock(index, qIdx, "question", e.target.value)}
                                placeholder="e.g., What is the primary purpose of a Stop Loss?"
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                            </div>

                            {/* Description / Explanation Input */}
                            <div>
                              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Description / Card Explanation</label>
                              <textarea
                                required
                                value={card.description}
                                onChange={(e) => updateQuestionInBlock(index, qIdx, "description", e.target.value)}
                                placeholder="Write the details shown on the card face or the explanation for correct/incorrect choices..."
                                rows={2}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                              />
                            </div>

                            {/* Choices Options */}
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider">Answer Options & Correct Key</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[0, 1, 2, 3].map((optIdx) => {
                                  const optionLabel = ["A", "B", "C", "D"][optIdx];
                                  const isCorrect = card.correctIndex === optIdx;
                                  return (
                                    <div key={optIdx} className="flex items-center gap-2 bg-black/20 border border-white/5 rounded-lg px-2 py-1.5">
                                      <button
                                        type="button"
                                        onClick={() => updateQuestionInBlock(index, qIdx, "correctIndex", optIdx)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                          isCorrect
                                            ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                        }`}
                                      >
                                        {optionLabel}
                                      </button>
                                      <input
                                        type="text"
                                        required
                                        value={card.options[optIdx] || ""}
                                        onChange={(e) => updateQuestionInBlock(index, qIdx, "options", { index: optIdx, optionVal: e.target.value })}
                                        placeholder={`Option ${optionLabel}`}
                                        className="bg-transparent text-xs text-white placeholder-white/20 focus:outline-none w-full"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(block.questionCards || []).length === 0 && (
                        <div className="text-center py-6 bg-black/10 border border-dashed border-white/5 rounded-xl">
                          <p className="text-xs text-white/30">No custom question cards configured for this section.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {content.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} className="text-white/10" />
                </div>
                <h4 className="text-white/50 font-bold mb-2">No Content Sections</h4>
                <p className="text-white/20 text-sm mb-6">Start building your lesson by adding your first content block.</p>
                <button
                  type="button"
                  onClick={addContentBlock}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-bold"
                >
                  Add Your First Section
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar (Mobile only or redundant) */}
        <div className="flex md:hidden flex-col gap-3">
          <button 
            type="submit"
            className="w-full py-4 bg-green-500 text-black font-bold rounded-xl"
          >
            Save Lesson
          </button>
          <button 
            onClick={() => router.push("/admin/lessons")}
            className="w-full py-4 bg-white/5 text-white font-bold rounded-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
