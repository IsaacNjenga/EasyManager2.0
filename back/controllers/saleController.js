import ProductsModel from "../models/ProductsModel.js";
import SalesModel from "../models/SalesModel.js";

const addSale = async (req, res) => {
  const { pnumber, quantity } = req.body;

  try {
    const newSale = new SalesModel({ ...req.body });
    const savedSale = await newSale.save();

    const product = await ProductsModel.findOne({ number: pnumber });
    if (!product) {
      return res.status(404).json({ error: "Product not Found" });
    }
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({ success: true, savedSale });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSomeSales = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  try {
    const someSales = await SalesModel.find()
      .sort({ datesold: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalSalesCount = await SalesModel.countDocuments(); // Get total count

    res.status(200).json({
      success: true,
      someSales,
      hasMore: pageNum * limitNum < totalSalesCount, // Ensure correct hasMore value
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await SalesModel.find({});
    res.status(201).json({ success: true, sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const getSale = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await SalesModel.findById(id);
    return res.status(201).json({ success: true, sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const deleteSale = async (req, res) => {
  const { id } = req.query;
  try {
    await SalesModel.findByIdAndDelete({ _id: id });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateSale = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedSale = await SalesModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(201).json({ success: true, updatedSale });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getSale, getSales, addSale, deleteSale, updateSale, getSomeSales };
