import { Router } from "express";
import { Case } from "../models/Case.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

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

export default router;
