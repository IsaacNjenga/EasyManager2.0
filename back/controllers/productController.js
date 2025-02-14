import ProductsModel from "../models/ProductsModel.js";
const addProduct = async (req, res) => {
  try {
    const newProduct = new ProductsModel({ ...req.body });
    await newProduct.save();
    res
      .status(201)
      .json({ success: true, msg: "Product created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await ProductsModel.find({});
    res.status(201).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ success: false, msg: "Invalid ID" });
  }
  try {
    const fetchedProduct = await ProductsModel.findById(id);
    res.status(201).json({ success: true, fetchedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.query;
  try {
    await ProductsModel.findByIdAndDelete({ _id: id });
    const products = await ProductsModel.find({});
    res.status(201).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json({ success: true, updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "There was an error!" });
  }
};

export { getProduct, getProducts, addProduct, deleteProduct, updateProduct };
