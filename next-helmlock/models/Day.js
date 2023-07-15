import mongoose from 'mongoose';

const daySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dayOfWeek: { type: Number, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Day =
  mongoose.models && 'Day' in mongoose.models
    ? mongoose.models.Day
    : mongoose.model('Day', daySchema);
export default Day;
