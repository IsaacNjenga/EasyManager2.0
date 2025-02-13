import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    number: { type: String },
    description: { type: String },
    colour: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    code: { type: String },
    location: { type: String },
    bnumber: { type: String },
    summary: { type: String },
    image: { type: [String] },
    imageId: { type: [String] },
  },
  { collection: "products", timestamps: true }
);

const ProductsModel = mongoose.model("Product", productSchema);
export default ProductsModel;
