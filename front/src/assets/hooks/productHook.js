import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.log("Error", error);
        Swal.fire({
          icon: "warning",
          title: "Could not fetch products",
          text: "Try refreshing the page",
        });
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, productsLoading };
};

export default useProducts;
