import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    time_elapsed: {type: Number, required: false},
    status: {type: String, required: true, enum: ['occupied', 'vacant']},
    image: { type: String, required: true },
    price: { type: Number, required: true },

  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;