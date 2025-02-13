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
  const id = req.params.id;
  try {
    const fetchedProduct = await ProductsModel.findById(id);
    res.status(201).json({ success: true, fetchedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    ProductsModel.findByIdAndDelete({ _id: id })
      .then((products) => res.json(products))
      .catch((err) => res.json(err));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};
const updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

export { getProduct, getProducts, addProduct, deleteProduct, updateProduct };
