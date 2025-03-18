import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IDocument extends MongoDocument {
  userId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  extractedText: string;
  summary: string;
  insights: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    extractedText: { type: String, required: true },
    summary: { type: String, required: false },
    insights: [{ type: String }],
    embedding: [{ type: Number }],
  },
  { timestamps: true }
);

// Create indexes for faster queries
DocumentSchema.index({ userId: 1, createdAt: -1 });
DocumentSchema.index({ embedding: 1 }, { sparse: true });

export default mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);
