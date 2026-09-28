"use client";

import Link from "next/link";
import { ArrowUpRight, Check, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

export type PendingResource = { id: string; title: string; filename: string; kind: string; description: string; createdAt: string; courseCode: string; courseName: string; degreeName: string; facultyName: string; semester: number; uploaderEmail: string };

export function ModerationList({ initial }: { initial: PendingResource[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function decide(item: PendingResource, status: "approved" | "rejected") {
    setBusy(item.id); setError("");
    try {
      const response = await fetch(`/api/admin/resources/${item.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not save this review.");
      setItems((current) => current.filter((resource) => resource.id !== item.id));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save this review."); }
    finally { setBusy(""); }
  }

  return <>
    {error && <div className="auth-error" role="alert">{error}</div>}
    <div className="review-list">{items.length ? items.map((item) => <article className="review-card" key={item.id}><div><span className="resource-kind">{item.kind.replace("_", " ")} · {item.createdAt}</span><h2>{item.title}</h2><p>{item.facultyName} / {item.degreeName} / {item.courseCode} · {item.courseName} · Semester {item.semester}</p><p>{item.description || "No description supplied."}</p><small>Uploaded by {item.uploaderEmail} · {item.filename}</small></div><div className="review-actions"><Link href={`/api/resources/${item.id}/file`} target="_blank" className="review-open">Open file <ArrowUpRight size={14} /></Link><button type="button" className="review-approve" disabled={Boolean(busy)} onClick={() => void decide(item, "approved")}>{busy === item.id ? <LoaderCircle size={14} className="spin" /> : <Check size={14} />} Approve</button><button type="button" className="review-reject" disabled={Boolean(busy)} onClick={() => void decide(item, "rejected")}><X size={14} /> Reject</button></div></article>) : <div className="empty-state"><span>✳</span><h3>All caught up.</h3><p>There are no resources waiting for review.</p></div>}</div>
  </>;
}

