"use client";

import { useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";

export type ManagedResource = { id: string; title: string; kind: string; status: string; faculty: string; degree: string; code: string; name: string; semester: number; createdAt: string };

export function AdminResourceManager({ initial }: { initial: ManagedResource[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  async function remove(item: ManagedResource) {
    if (!window.confirm(`Permanently remove “${item.title}” from the library and delete its stored file? This cannot be undone.`)) return;
    setBusy(item.id); setMessage("");
    try {
      const response = await fetch(`/api/admin/resources/${item.id}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "The resource could not be removed.");
      setItems((current) => current.filter((row) => row.id !== item.id));
      setMessage(`Removed “${item.title}” and its stored file.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "The resource could not be removed."); }
    finally { setBusy(""); }
  }
  return <div className="managed-resources" id="all-resources">
    <div className="admin-section-heading"><div><span className="section-kicker">02 / LIBRARY CONTROL</span><h2>Published files<br />& the <em>full library.</em></h2><p>Remove a post and permanently delete its uploaded file from storage.</p></div><span className="admin-count">{items.length} RECENT</span></div>
    {message && <p className="admin-action-message" role="status">{message}</p>}
    {items.length ? items.map((item) => <article className="managed-row" key={item.id}><div className="managed-meta"><span className={`managed-status ${item.status}`}>{item.status}</span><span>{item.kind.replace("_", " ")} · {item.createdAt}</span></div><strong>{item.title}</strong><small>{item.faculty} / {item.degree} / {item.code} · {item.name} · Semester {item.semester}</small><button disabled={Boolean(busy)} onClick={() => void remove(item)}>{busy === item.id ? <LoaderCircle size={14} className="spin"/> : <Trash2 size={14}/>} Delete post + file</button></article>) : <div className="empty-state"><AlertTriangle size={22}/><h3>Nothing to manage yet.</h3><p>Recent resources will appear here after students share them.</p></div>}
  </div>;
}
