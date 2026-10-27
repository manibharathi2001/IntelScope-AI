import mongoose from "mongoose";

const suspectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile: { type: String, required: true },
  motive: { type: String, required: true },
  relationship: String,
  alibi: String,
  alibiStatus: { type: String, enum: ["verified", "unverified", "contradicted"], default: "unverified" }
}, { _id: false });

const evidenceSchema = new mongoose.Schema({
  evidenceId: { type: String, required: true },
  type: { type: String, enum: ["chat", "image", "video", "statement", "document", "record"], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: String,
  location: String,
  relatedSuspectNames: [String],
  isFictional: { type: Boolean, default: true }
}, { _id: false });

const solutionSchema = new mongoose.Schema({
  culpritName: { type: String, required: true },
  explanation: { type: String, required: true },
  decisiveEvidenceIds: [String]
}, { _id: false });

const caseSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  scenario: { type: String, required: true, trim: true, maxlength: 10000 },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  status: { type: String, enum: ["draft", "generating", "ready", "failed"], default: "draft" },
  summary: String,
  incident: String,
  suspects: [suspectSchema],
  clues: [String],
  evidence: [evidenceSchema],
  solution: { type: solutionSchema, select: false },
  generationError: String,
  generatedAt: Date
}, { timestamps: true });

export const Case = mongoose.model("Case", caseSchema);
