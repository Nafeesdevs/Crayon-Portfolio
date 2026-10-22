import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    start: { type: String, default: '' }, // free text e.g. "Jan 2024"
    end: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
