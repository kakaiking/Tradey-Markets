"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHead } from "@/components/layout/PageHead";

interface StatItem {
  name: string;
  value: string;
  change: string;
  type: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || []);
          setRecentActivity(data.recentActivity || []);
        } else {
          console.error("Failed to fetch dashboard data:", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <PageHead
        title="Admin dashboard"
        byline="Overview"
        lede="What's happening across lessons, videos, and students."
        backHref="/learn"
      />

      <div className="admin-stat-grid" style={{ marginBottom: "var(--space-5)" }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="admin-stat">
                <strong>—</strong>
                <span>Loading</span>
              </div>
            ))
          : stats.map((stat) => (
              <div key={stat.name} className="admin-stat">
                <strong>{stat.value}</strong>
                <span>{stat.name}</span>
                <p className="choice-meta" style={{ marginTop: "0.4rem", color: "var(--chalk)" }}>{stat.change}</p>
              </div>
            ))}
      </div>

      <div className="split">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <p className="kicker" style={{ margin: 0 }}>Recent activity</p>
            <Link href="/admin/users" className="choice-meta" style={{ color: "var(--chalk)" }}>View all</Link>
          </div>
          {isLoading ? (
            <div className="card status">Loading activity…</div>
          ) : recentActivity.length === 0 ? (
            <div className="card status">No recent activity recorded.</div>
          ) : (
            <ul className="choice-list">
              {recentActivity.map((activity) => (
                <li key={activity.id}>
                  <div className="choice-card" style={{ cursor: "default" }}>
                    <div className="choice-copy">
                      <strong style={{ fontWeight: 600 }}>
                        <span style={{ color: "var(--muted)", fontWeight: 500 }}>{activity.user}</span> {activity.action}
                      </strong>
                      <span className="choice-meta">{activity.time}</span>
                    </div>
                    <span className="choice-trail">{activity.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Quick actions</p>
          <ul className="choice-list">
            <li>
              <Link href="/admin/videos" className="choice-card">
                <div className="choice-copy">
                  <strong>New video</strong>
                  <span className="choice-meta">Add to library</span>
                </div>
                <span className="choice-trail">→</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/lessons" className="choice-card">
                <div className="choice-copy">
                  <strong>New lesson</strong>
                  <span className="choice-meta">Curriculum</span>
                </div>
                <span className="choice-trail">→</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/events" className="choice-card">
                <div className="choice-copy">
                  <strong>Schedule event</strong>
                  <span className="choice-meta">Community</span>
                </div>
                <span className="choice-trail">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
