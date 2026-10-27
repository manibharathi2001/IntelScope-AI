import { Router } from "express";
import { Case } from "../models/Case.js";
import { requireAuth } from "../middleware/auth.js";
import { askInvestigator, generateMystery } from "../services/gemini.js";
import { InvestigationNote } from "../models/InvestigationNote.js";
import { ClueConnection } from "../models/ClueConnection.js";

const router = Router();
router.use(requireAuth);

function publicCase(mysteryCase) {
  const result = mysteryCase.toObject();
  delete result.solution;
  return result;
}

router.get("/", async (req, res, next) => {
  try { res.json(await Case.find({ owner: req.user.id }).sort({ updatedAt: -1 })); } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, scenario, difficulty = "medium" } = req.body;
    if (!title?.trim() || !scenario?.trim()) return res.status(400).json({ message: "Title and scenario are required" });
    const mysteryCase = await Case.create({ owner: req.user.id, title: title.trim(), scenario: scenario.trim(), difficulty, status: "draft" });
    res.status(201).json(mysteryCase);
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const mysteryCase = await Case.findOne({ _id: req.params.id, owner: req.user.id });
    if (!mysteryCase) return res.status(404).json({ message: "Case not found" });
    res.json(mysteryCase);
  } catch (error) { next(error); }
});

router.get("/:id/notes", async (req, res, next) => {
  try {
    const ownsCase = await Case.exists({ _id: req.params.id, owner: req.user.id });
    if (!ownsCase) return res.status(404).json({ message: "Case not found" });
    res.json(await InvestigationNote.find({ caseId: req.params.id, owner: req.user.id }).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.post("/:id/notes", async (req, res, next) => {
  try {
    const ownsCase = await Case.exists({ _id: req.params.id, owner: req.user.id });
    if (!ownsCase) return res.status(404).json({ message: "Case not found" });
    if (!req.body.content?.trim()) return res.status(400).json({ message: "Note content is required" });
    const note = await InvestigationNote.create({ owner: req.user.id, caseId: req.params.id, content: req.body.content, evidenceId: req.body.evidenceId || null });
    res.status(201).json(note);
  } catch (error) { next(error); }
});

router.get("/:id/timeline", async (req, res, next) => {
  try {
    const mysteryCase = await Case.findOne({ _id: req.params.id, owner: req.user.id });
    if (!mysteryCase) return res.status(404).json({ message: "Case not found" });
    const timeline = (mysteryCase.evidence || []).filter((item) => item.timestamp).sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp))).map((item) => ({ evidenceId: item.evidenceId, title: item.title, timestamp: item.timestamp, location: item.location || null }));
    res.json(timeline);
  } catch (error) { next(error); }
});

router.get("/:id/connections", async (req, res, next) => {
  try {
    if (!await Case.exists({ _id: req.params.id, owner: req.user.id })) return res.status(404).json({ message: "Case not found" });
    res.json(await ClueConnection.find({ caseId: req.params.id, owner: req.user.id }).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.post("/:id/connections", async (req, res, next) => {
  try {
    const mysteryCase = await Case.findOne({ _id: req.params.id, owner: req.user.id });
    if (!mysteryCase) return res.status(404).json({ message: "Case not found" });
    const { fromEvidenceId, toEvidenceId, relationship, explanation } = req.body;
    const validIds = new Set((mysteryCase.evidence || []).map((item) => item.evidenceId));
    if (!validIds.has(fromEvidenceId) || !validIds.has(toEvidenceId) || !["supports", "contradicts", "related"].includes(relationship) || !explanation?.trim()) return res.status(400).json({ message: "Valid evidence IDs, relationship, and explanation are required" });
    res.status(201).json(await ClueConnection.create({ owner: req.user.id, caseId: req.params.id, fromEvidenceId, toEvidenceId, relationship, explanation: explanation.trim() }));
  } catch (error) { next(error); }
});

router.post("/:id/assistant", async (req, res, next) => {
  try {
    const mysteryCase = await Case.findOne({ _id: req.params.id, owner: req.user.id });
    if (!mysteryCase) return res.status(404).json({ message: "Case not found" });
    if (mysteryCase.status !== "ready") return res.status(409).json({ message: "Generate the investigation before asking questions" });
    if (!req.body.question?.trim()) return res.status(400).json({ message: "Question is required" });
    const answer = await askInvestigator({ caseData: mysteryCase.toObject(), question: req.body.question.trim(), history: req.body.history });
    res.json(answer);
  } catch (error) { next(error); }
});

router.post("/:id/generate", async (req, res, next) => {
  try {
    const mysteryCase = await Case.findOne({ _id: req.params.id, owner: req.user.id });
    if (!mysteryCase) return res.status(404).json({ message: "Case not found" });
    if (mysteryCase.status === "generating") return res.status(409).json({ message: "This case is already being generated" });
    mysteryCase.status = "generating";
    mysteryCase.generationError = undefined;
    await mysteryCase.save();
    try {
      const generated = await generateMystery(mysteryCase);
      Object.assign(mysteryCase, generated, { status: "ready", generatedAt: new Date(), generationError: undefined });
      await mysteryCase.save();
      res.status(201).json(publicCase(mysteryCase));
    } catch (generationError) {
      mysteryCase.status = "failed";
      mysteryCase.generationError = generationError.message;
      await mysteryCase.save();
      res.status(502).json({ message: "Mystery generation failed", detail: generationError.message });
    }
  } catch (error) { next(error); }
});

export default router;
