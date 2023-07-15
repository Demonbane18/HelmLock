import mongoose from 'mongoose';

const closedDaySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const ClosedDay =
  mongoose.models && 'ClosedDay' in mongoose.models
    ? mongoose.models.ClosedDay
    : mongoose.model('ClosedDay', closedDaySchema);
export default ClosedDay;
