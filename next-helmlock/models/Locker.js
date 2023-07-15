import mongoose from 'mongoose';

const lockerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    lockerNumber: { type: Number, required: true },
    duration: { type: Number, required: false },
    status: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Locker =
  mongoose.models && 'Locker' in mongoose.models
    ? mongoose.models.Locker
    : mongoose.model('Locker', lockerSchema);
export default Locker;
