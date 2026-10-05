"use client";

import React, { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";

export default function AdminVideosPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [previewId, setPreviewId] = useState<string | null>(null);

    const extractVideoId = (inputUrl: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = inputUrl.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        const id = extractVideoId(newUrl);
        setPreviewId(id);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !url) {
            setStatus("error");
            return;
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            setStatus("error");
            return;
        }

        console.log("New Video to Add:", {
            id: `v${Date.now()}`,
            title,
            description,
            videoId,
        });

        setStatus("success");
        setTimeout(() => {
            setTitle("");
            setDescription("");
            setUrl("");
            setPreviewId(null);
            setStatus("idle");
        }, 3000);
    };

    return (
        <div>
            <PageHead
                title="Videos"
                byline="Admin"
                lede="Add and manage YouTube videos for the library."
                backHref="/admin"
            />

            <div className="split">
                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                        <div>
                            <label className="label" htmlFor="video-url">YouTube URL</label>
                            <input
                                id="video-url"
                                type="text"
                                className="field"
                                value={url}
                                onChange={handleUrlChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="video-title">Video title</label>
                            <input
                                id="video-title"
                                type="text"
                                className="field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Advanced Price Action Strategies"
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="video-desc">Description</label>
                            <textarea
                                id="video-desc"
                                className="field"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the video content..."
                                rows={4}
                            />
                        </div>

                        <button type="submit" className="btn">Add video to library</button>

                        {status === "success" && (
                            <p className="status" style={{ color: "var(--chalk)", textAlign: "center" }}>
                                Video successfully added to the library!
                            </p>
                        )}
                        {status === "error" && (
                            <p className="error" style={{ textAlign: "center" }}>
                                Please fill in all fields with a valid YouTube URL.
                            </p>
                        )}
                    </form>
                </div>

                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Live preview</p>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ aspectRatio: "16 / 9", background: "var(--sunken)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            {previewId ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${previewId}`}
                                    title={title || "Video Preview"}
                                    style={{ border: 0, position: "absolute", inset: 0 }}
                                    allowFullScreen
                                />
                            ) : (
                                <span className="status">No video selected</span>
                            )}
                        </div>
                        <div style={{ padding: "var(--space-4)" }}>
                            <strong className="font-display" style={{ display: "block", marginBottom: "0.35rem" }}>
                                {title || "Video title preview"}
                            </strong>
                            <p className="lede" style={{ fontSize: "0.95rem" }}>
                                {description || "The description will appear here as you type."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
