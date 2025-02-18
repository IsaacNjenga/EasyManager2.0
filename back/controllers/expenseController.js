import ExpensesModel from "../models/ExpensesModel.js";

const getExpenses = async (req, res) => {
  try {
    const expenses = await ExpensesModel.find({});
    res.status(201).json({ success: true, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const getExpense = async (req, res) => {
  const { id } = req.query;
  try {
    const expense = await ExpensesModel.findById(id);
    return res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const addExpense = async (req, res) => {
  try {
    const newExpense = new ExpensesModel({ ...req.body });
    await newExpense.save();
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.query;
  try {
    await ExpensesModel.findByIdAndDelete({ _id: id });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.query;
  try {
    const updatedExpense = await ExpensesModel.findByIdAndUpdate(
      {
        _id: id,
      },
      { $set: req.body },
      { new: true }
    );
    res.status(201).json({ success: true, updatedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

export { getExpense, getExpenses, addExpense, deleteExpense, updateExpense };
