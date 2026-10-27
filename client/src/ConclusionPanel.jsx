import React, { useState } from "react";

const API = "http://localhost:5000/api";

async function callApi(path, options, token) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function ConclusionPanel({ token, caseId, suspects = [], evidence = [] }) {
  const [culpritName, setCulpritName] = useState(""); const [theory, setTheory] = useState(""); const [selectedIds, setSelectedIds] = useState([]); const [report, setReport] = useState(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  function toggleEvidence(id) { setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  async function submit(event) { event.preventDefault(); setBusy(true); setError(""); try { setReport(await callApi(`/cases/${caseId}/conclusion`, { method: "POST", body: JSON.stringify({ culpritName, theory, evidenceIds: selectedIds }) }, token)); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  async function reveal() { try { setReport(await callApi(`/cases/${caseId}/report/reveal`, { method: "POST" }, token)); } catch (err) { setError(err.message); } }
  return <section className="panel conclusion-panel"><div><p className="eyebrow">FINAL ACCUSATION</p><h2>What is your theory?</h2><p className="muted">Submit only when the evidence supports your conclusion.</p></div><form className="conclusion-form" onSubmit={submit}><select required value={culpritName} onChange={(event) => setCulpritName(event.target.value)}><option value="">Select a suspected culprit</option>{suspects.map((suspect) => <option key={suspect.name} value={suspect.name}>{suspect.name}</option>)}</select><textarea required placeholder="Explain your theory and the contradictions that support it…" value={theory} onChange={(event) => setTheory(event.target.value)} /><div className="evidence-checks">{evidence.map((item) => <label key={item.evidenceId}><input type="checkbox" checked={selectedIds.includes(item.evidenceId)} onChange={() => toggleEvidence(item.evidenceId)} />{item.evidenceId} · {item.title}</label>)}</div><button className="primary" disabled={busy}>{busy ? "Evaluating…" : "Submit conclusion"}</button></form>{error && <p className="error">{error}</p>}{report && <div className="report-result"><p className="eyebrow">INVESTIGATION REPORT</p><strong className={report.isCorrect ? "correct" : "incorrect"}>{report.isCorrect ? "Conclusion supported" : "Conclusion needs revision"}</strong><p>{report.feedback}</p><small>Supported evidence: {report.supportedEvidenceIds?.join(", ") || "None"}</small>{report.overlookedEvidenceIds?.length > 0 && <small>Overlooked decisive evidence: {report.overlookedEvidenceIds.join(", ")}</small>}{report.solutionRevealed ? <div className="solution"><strong>Solution: {report.actualCulprit}</strong><p>{report.solutionExplanation}</p></div> : <button className="secondary" onClick={reveal}>Reveal stored solution</button>}</div>}</section>;
}
