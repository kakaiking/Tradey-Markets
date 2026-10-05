"use client";

import React, { useState, useEffect } from "react";
import { PageHead } from "@/components/layout/PageHead";

export default function AdminEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        type: "Webinar",
        description: "",
        impact: "medium"
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/admin/events");
            if (response.ok) {
                const data = await response.json();
                setEvents(data.events || []);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(prev => [...prev, data.event]);
                setIsModalOpen(false);
                setNewEvent({
                    title: "",
                    date: "",
                    time: "",
                    type: "Webinar",
                    description: "",
                    impact: "medium"
                });
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to create event");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event");
        }
    };

    const handleDeleteEvent = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/events?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setEvents(events.filter(event => event.id !== id));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Error deleting event");
        }
    };

    return (
        <div>
            <PageHead
                title="Events"
                byline="Admin"
                lede="Schedule and manage community events, webinars, and meetups."
                backHref="/admin"
                trail={
                    <button type="button" className="btn" style={{ width: "auto", minHeight: 44, padding: "0.5rem 1rem" }} onClick={() => setIsModalOpen(true)}>
                        Create event
                    </button>
                }
            />

            {events.length === 0 ? (
                <div className="card status" style={{ textAlign: "center" }}>No events yet. Create one to get started.</div>
            ) : (
                <ul className="choice-list">
                    {events.map((event) => (
                        <li key={event.id}>
                            <div className="choice-card" style={{ cursor: "default" }}>
                                <div className="choice-copy">
                                    <strong>{event.title}</strong>
                                    <span className="choice-meta">
                                        {event.date} · {event.time} · {event.type}
                                    </span>
                                    {event.description ? (
                                        <span className="lede" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>{event.description}</span>
                                    ) : null}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                                    <span className={`badge ${event.impact === "high" ? "badge-pencil" : event.impact === "medium" ? "badge-mark" : "badge-chalk"}`}>
                                        {event.impact}
                                    </span>
                                    <button type="button" className="btn ghost" style={{ width: "auto", minHeight: 36, padding: "0.35rem 0.75rem", color: "var(--pencil)" }} onClick={() => handleDeleteEvent(event.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "color-mix(in srgb, var(--ink) 45%, transparent)" }}>
                    <div className="card" style={{ width: "min(100%, 28rem)", maxHeight: "90vh", overflow: "auto" }}>
                        <h2 className="font-display" style={{ fontSize: "1.35rem", marginBottom: "1rem" }}>Create new event</h2>
                        <form onSubmit={handleAddEvent} style={{ display: "grid", gap: "1rem" }}>
                            <div>
                                <label className="label">Event title</label>
                                <input type="text" required className="field" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g., Weekly Market Outlook" />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="label">Date</label>
                                    <input type="date" required className="field" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label">Time</label>
                                    <input type="text" required className="field" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} placeholder="10:00 AM EST" />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="label">Type</label>
                                    <select className="field" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                                        <option value="Webinar">Webinar</option>
                                        <option value="Live Stream">Live Stream</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Workshop">Workshop</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Impact</label>
                                    <select className="field" value={newEvent.impact} onChange={(e) => setNewEvent({ ...newEvent, impact: e.target.value })}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea className="field" rows={3} value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Describe the event..." />
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <button type="button" className="btn secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn">Create event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
