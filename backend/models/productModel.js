import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // cloudinary URL
    category: { type: String, required: true },
    description: { type: String },
    weights: [{ 
      label: { type: String, required: true }, // e.g., "500g", "1kg"
      price: { type: Number, required: true }  // price for this weight
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);