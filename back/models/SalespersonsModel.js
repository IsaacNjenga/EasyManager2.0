import mongoose from "mongoose";

const salepersonSchema = new mongoose.Schema(
  {
    id: { type: Number },
    firstname: { type: String },
    lastname: { type: String },
    datejoined: { type: String },
    image: { type: String },
    number: { type: Number },
  },
  { collection: "staff" }
);

const SalepersonsModel = mongoose.model("Staff", salepersonSchema);
export default SalepersonsModel;
