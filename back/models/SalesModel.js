import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    number: { type: String },
    description: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    total: { type: Number },
    datesold: { type: String },
    saleperson: { type: String },
    commission: { type: Number },
    image: { type: String },
    pnumber: { type: String },
    code: { type: String },
    colour: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
  },
  { collection: "sales", timestamps: true }
);

const SalesModel = mongoose.model("Sale", saleSchema);
export default SalesModel;
