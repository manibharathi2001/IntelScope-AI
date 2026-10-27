import mongoose from "mongoose";

const investigationReportSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, unique: true },
  submittedCulprit: { type: String, required: true },
  theory: { type: String, required: true },
  selectedEvidenceIds: [String],
  isCorrect: { type: Boolean, required: true },
  supportedEvidenceIds: [String],
  overlookedEvidenceIds: [String],
  feedback: { type: String, required: true },
  solutionRevealed: { type: Boolean, default: false },
  actualCulprit: { type: String, select: false },
  solutionExplanation: { type: String, select: false }
}, { timestamps: true });

export const InvestigationReport = mongoose.model("InvestigationReport", investigationReportSchema);
