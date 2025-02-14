import SalepersonsModel from "../models/SalepersonsModel.js";

const getSalespersons = async (req, res) => {
  try {
    const salespersons = await SalepersonsModel.find({});
    return res.status(201).json({ success: true, salespersons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error", error });
  }
};

const getSalesperson = async (req, res) => {
  const { id } = req.params;
  try {
    const salesperson = await SalepersonsModel.findById(id);
    return res.statu(201).json({ success: true, salesperson });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error", error });
  }
};

const addSalespersons = async (req, res) => {
  try {
    const newStaff = new SalepersonsModel({ ...req.body });
    await newStaff.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error", error });
  }
};

const deleteSalespersons = async (req, res) => {
  const { id } = req.query;
  try {
    await SalepersonsModel.findByIdAndDelete({ _id: id });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error", error });
  }
};

const updateSalespersons = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedStaff = await SalepersonsModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(201).json({ success: true, updatedStaff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error", error });
  }
};

export {
  getSalespersons,
  getSalesperson,
  addSalespersons,
  updateSalespersons,
  deleteSalespersons,
};
