import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    number: { type: String },
    description: { type: String },
    cost: { type: Number },
    category: { type: String },
    date: { type: String },
  },
  { collection: "expenses" }
);

const ExpensesModel = mongoose.model("Expense", expenseSchema);
export default ExpensesModel;
