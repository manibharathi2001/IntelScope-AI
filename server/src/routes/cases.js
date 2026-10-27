import { Router } from "express";
import { Case } from "../models/Case.js";
import { requireAuth } from "../middleware/auth.js";
import { generateMystery } from "../services/gemini.js";

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
