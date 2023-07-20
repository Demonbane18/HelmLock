import mongoose from 'mongoose';

const servoLockSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, default: 'open' },
    servo_number: { type: Number, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const ServoLock =
  mongoose.models && 'ServoLock' in mongoose.models
    ? mongoose.models.ServoLock
    : mongoose.model('ServoLock', servoLockSchema);
export default ServoLock;
