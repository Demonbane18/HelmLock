import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        duration: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    lockerDuration: {
      duration: { type: Number, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isEnded: { type: Boolean, required: true, default: false },
    isPenalty: { type: Boolean, required: true, default: false },
    penaltyDuration: { type: Number, required: true, default: false },
    penaltyPrice: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    endedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models?.Order || mongoose.model('Order', orderSchema);
export default Order;
