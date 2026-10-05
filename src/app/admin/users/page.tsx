"use client";

import React, { useState, useEffect } from "react";
import { PageHead } from "@/components/layout/PageHead";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: "0",
    activeToday: "0",
    newThisWeek: "0",
    pendingVerification: "0"
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setStats(data.stats || {
          totalStudents: "0",
          activeToday: "0",
          newThisWeek: "0",
          pendingVerification: "0"
        });
      } else {
        console.error("Failed to fetch users:", res.statusText);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u: any) => {
    const search = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.role.toLowerCase().includes(search)
    );
  });

  const statCards = [
    { label: "Total students", value: stats.totalStudents },
    { label: "Active today", value: stats.activeToday },
    { label: "New this week", value: stats.newThisWeek },
    { label: "Pending verification", value: stats.pendingVerification },
  ];

  return (
    <div>
      <PageHead
        title="Users"
        byline="Admin"
        lede="Manage student accounts, permissions, and learning progress."
        backHref="/admin"
        trail={
          <button type="button" className="btn secondary" style={{ width: "auto", minHeight: 44, padding: "0.5rem 1rem" }}>
            Add user
          </button>
        }
      />

      <div className="admin-stat-grid" style={{ marginBottom: "var(--space-5)" }}>
        {statCards.map((stat) => (
          <div key={stat.label} className="admin-stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label className="label" htmlFor="user-search">Search</label>
        <input
          id="user-search"
          type="text"
          className="field"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="card status" style={{ textAlign: "center" }}>Loading users…</div>
      ) : filteredUsers.length === 0 ? (
        <div className="card status" style={{ textAlign: "center" }}>
          No users found{searchTerm ? ` matching “${searchTerm}”` : ""}.
        </div>
      ) : (
        <ul className="choice-list">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <div className="choice-card" style={{ cursor: "default" }}>
                <div className="choice-copy">
                  <strong>{user.name}</strong>
                  <span className="choice-meta">{user.email}</span>
                  <span className="choice-meta" style={{ marginTop: "0.25rem" }}>
                    {user.role} · Joined {user.joined} · Progress {user.progress}
                  </span>
                  {user.progress && user.progress !== "N/A" ? (
                    <div className="heat" style={{ marginTop: "0.5rem", maxWidth: "12rem" }}>
                      <div className="heat-fill" style={{ width: user.progress }} />
                    </div>
                  ) : null}
                </div>
                <span className={`badge ${user.status === "Active" ? "badge-chalk" : ""}`}>
                  {user.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
