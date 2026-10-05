"use client";

import React, { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <div>
      <PageHead
        title="Settings"
        byline="Admin"
        lede="Configure site preferences, security, and integrations."
        backHref="/admin"
        trail={
          <button type="button" className="btn" style={{ width: "auto", minHeight: 44, padding: "0.5rem 1rem" }}>
            Save changes
          </button>
        }
      />

      <div className="split">
        <ul className="choice-list">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className={`choice-card${activeTab === tab.id ? "" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { background: "var(--highlighter)" } : undefined}
              >
                <div className="choice-copy">
                  <strong>{tab.label}</strong>
                </div>
                <span className={`choice-trail${activeTab === tab.id ? " active" : ""}`}>
                  {activeTab === tab.id ? "On" : "→"}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div>
          {activeTab === "general" && (
            <div className="card" style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <p className="kicker" style={{ marginBottom: "0.75rem" }}>General information</p>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label className="label">Site name</label>
                    <input type="text" defaultValue="Tradey Markets" className="field" />
                  </div>
                  <div>
                    <label className="label">Admin contact email</label>
                    <input type="email" defaultValue="admin@tradeymarkets.com" className="field" />
                  </div>
                </div>
              </div>

              <div>
                <p className="kicker" style={{ marginBottom: "0.75rem" }}>Platform visibility</p>
                <ul className="choice-list">
                  {[
                    { label: "Maintenance mode", desc: "Only admins can access the site when active.", on: false },
                    { label: "Public registration", desc: "Allow new students to sign up.", on: true },
                    { label: "Beta features", desc: "Enable experimental features for all users.", on: false },
                  ].map((toggle) => (
                    <li key={toggle.label}>
                      <div className="choice-card" style={{ cursor: "default" }}>
                        <div className="choice-copy">
                          <strong>{toggle.label}</strong>
                          <span className="choice-meta" style={{ textTransform: "none", letterSpacing: 0 }}>{toggle.desc}</span>
                        </div>
                        <span className={`badge ${toggle.on ? "badge-chalk" : ""}`}>{toggle.on ? "On" : "Off"}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card" style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <p className="kicker" style={{ marginBottom: "0.75rem" }}>Password requirements</p>
                <ul className="choice-list">
                  <li>
                    <div className="choice-card" style={{ cursor: "default" }}>
                      <div className="choice-copy">
                        <strong>Enforce strong passwords</strong>
                        <span className="choice-meta" style={{ textTransform: "none", letterSpacing: 0 }}>Require uppercase, numbers, and symbols.</span>
                      </div>
                      <span className="badge badge-chalk">On</span>
                    </div>
                  </li>
                  <li>
                    <div className="choice-card" style={{ cursor: "default" }}>
                      <div className="choice-copy">
                        <strong>Two-factor authentication</strong>
                        <span className="choice-meta" style={{ textTransform: "none", letterSpacing: 0 }}>Recommend 2FA for all users.</span>
                      </div>
                      <span className="badge">Off</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <p className="kicker" style={{ marginBottom: "0.75rem" }}>API access</p>
                <div className="card" style={{ background: "var(--sunken)", boxShadow: "none" }}>
                  <span className="choice-meta">Main API key</span>
                  <p className="font-tape" style={{ marginTop: "0.5rem", wordBreak: "break-all" }}>
                    pk_live_51Msz34Lkjf98Hjksd9823Hkjfd8...
                  </p>
                  <button type="button" className="btn secondary" style={{ marginTop: "0.75rem" }}>Regenerate</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card" style={{ textAlign: "center" }}>
              <h3 className="font-display" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Notification settings</h3>
              <p className="lede">Configure system alerts, user messages, and platform updates.</p>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="card" style={{ textAlign: "center" }}>
              <h3 className="font-display" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>App integrations</h3>
              <p className="lede">Connect Tradey Markets with Stripe, Slack, Mailchimp, and more.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
