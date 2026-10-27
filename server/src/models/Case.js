import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  scenario: { type: String, required: true, trim: true, maxlength: 10000 },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  status: { type: String, enum: ["draft", "generating", "ready", "failed"], default: "draft" },
  generatedAt: Date
}, { timestamps: true });

export const Case = mongoose.model("Case", caseSchema);
