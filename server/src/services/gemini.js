import { GoogleGenerativeAI } from "@google/generative-ai";

const generationShape = {
  summary: "string",
  incident: "string",
  suspects: [{ name: "string", profile: "string", motive: "string", relationship: "string", alibi: "string", alibiStatus: "verified|unverified|contradicted" }],
  clues: ["string"],
  evidence: [{ evidenceId: "string", type: "chat|image|video|statement|document|record", title: "string", content: "string", timestamp: "string", location: "string", relatedSuspectNames: ["string"], isFictional: true }],
  solution: { culpritName: "string", explanation: "string", decisiveEvidenceIds: ["string"] }
};

function cleanJson(text) {
  const withoutFence = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Gemini returned no JSON object");
  return JSON.parse(withoutFence.slice(start, end + 1));
}

function validateGeneration(data) {
  if (!data || typeof data.summary !== "string" || typeof data.incident !== "string") throw new Error("Generated case is missing its summary or incident");
  if (!Array.isArray(data.suspects) || data.suspects.length < 2) throw new Error("Generated case must contain at least two suspects");
  if (!Array.isArray(data.evidence) || data.evidence.length < 3) throw new Error("Generated case must contain at least three evidence items");
  if (!data.solution?.culpritName || !data.solution?.explanation) throw new Error("Generated case is missing its hidden solution");
  const evidenceIds = new Set(data.evidence.map((item) => item.evidenceId));
  if (evidenceIds.size !== data.evidence.length) throw new Error("Generated evidence IDs must be unique");
  if (data.solution.decisiveEvidenceIds?.some((id) => !evidenceIds.has(id))) throw new Error("Solution references unknown evidence");
  return data;
}

export async function generateMystery({ title, scenario, difficulty }) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.0-flash" });
  const prompt = `You are the case-generation engine for IntelScope, a fictional mystery investigation game.
Create a coherent, solvable fictional investigation from the user's scenario.
Never use real people, real private data, or authentic-looking claims. Every evidence item must be clearly fictional.
The culprit and solution must be determined now and must remain consistent with all clues and evidence.
Return ONLY valid JSON matching this shape: ${JSON.stringify(generationShape)}
Rules: create 3-5 suspects, 5-10 evidence items, at least one misleading clue, and make the solution provable from multiple evidence items.
Case title: ${title}
Difficulty: ${difficulty}
User scenario: ${scenario}`;
  const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.7 } });
  return validateGeneration(cleanJson(result.response.text()));
}

export async function askInvestigator({ caseData, question, history = [] }) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.0-flash" });
  const publicCase = { title: caseData.title, summary: caseData.summary, incident: caseData.incident, suspects: caseData.suspects, clues: caseData.clues, evidence: caseData.evidence };
  const prompt = `You are IntelScope's evidence-grounded investigation assistant. Answer the investigator's question using ONLY the fictional case data below.
Never reveal or guess a hidden solution. Clearly separate established evidence from assumptions. If the data is insufficient, say so.
Return ONLY valid JSON with: {"answer":"string","evidenceReferences":["evidence ID"],"uncertainties":["string"]}.
Case data: ${JSON.stringify(publicCase)}
Recent conversation: ${JSON.stringify(history.slice(-6))}
Question: ${question}`;
  const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } });
  const answer = cleanJson(result.response.text());
  if (typeof answer.answer !== "string" || !Array.isArray(answer.evidenceReferences)) throw new Error("Assistant returned an invalid response");
  const validIds = new Set((caseData.evidence || []).map((item) => item.evidenceId));
  answer.evidenceReferences = answer.evidenceReferences.filter((id) => validIds.has(id));
  return answer;
}
