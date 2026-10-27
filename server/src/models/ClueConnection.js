import mongoose from "mongoose";

const clueConnectionSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, index: true },
  fromEvidenceId: { type: String, required: true },
  toEvidenceId: { type: String, required: true },
  relationship: { type: String, enum: ["supports", "contradicts", "related"], required: true },
  explanation: { type: String, required: true },
  accepted: { type: Boolean, default: true }
}, { timestamps: true });

export const ClueConnection = mongoose.model("ClueConnection", clueConnectionSchema);
