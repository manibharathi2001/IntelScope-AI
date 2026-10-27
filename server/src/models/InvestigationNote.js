import mongoose from "mongoose";

const investigationNoteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  evidenceId: { type: String, default: null }
}, { timestamps: true });

export const InvestigationNote = mongoose.model("InvestigationNote", investigationNoteSchema);
