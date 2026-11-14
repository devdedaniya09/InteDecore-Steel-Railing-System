import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "./User/style/Theam.css";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;
const coral = "#FF6F61";

const PublicProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data.products);
      } catch (err) {
        setError("Error fetching products: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);
      } catch (err) {
        console.error("User info error", err);
      }
    };

    fetchProducts();
    fetchUser();
  }, [token]);

  const handleAddToWishlist = async (productId) => {
    if (!token) return Swal.fire("Login Required", "Please log in to add items to your wishlist.", "warning");
    try {
      setWishlistLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", res.data.message, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) return Swal.fire("Login Required", "Please log in to add items to your cart.", "warning");
    try {
      setCartLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/cart`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Added to Cart", res.data.message, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setCartLoading(false);
    }
  };

  const handleViewProductClick = (product) => {
    const imageHtml =
      product.images?.length > 0
        ? product.images
            .map(
              (img) =>
                `<img src="${process.env.REACT_APP_API_URL}/product_image/${img}" alt="Product" style="width:100%; max-height:250px; object-fit:cover; border-radius:12px; margin-bottom:10px;" />`
            )
            .join("")
        : "<p>No images available</p>";

    Swal.fire({
      title: product.name,
      html: `
        <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-start; font-size: 1rem;">
          <div style="flex: 1 1 200px;">
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Status:</strong> ${product.availability ? "✅ In Stock" : "❌ Out of Stock"}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
          </div>
          <div>${imageHtml}</div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "Close",
      width: "50%",
      customClass: {
        popup: "glass-modal",
      },
    });
  };

  return (
    <section className="section-bg" style={{ padding: "2rem 1rem", background: "#f2f2f7" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-3 fw-bold" style={{ color: coral, fontFamily: "Poppins, sans-serif" }}>
            ✨ InteDecor Steel Railing
          </h2>
          <p className="text-muted fs-5">
            {userData ? `Welcome back, ${userData.name}! Browse your favorite styles.` : "Modern Stainless Systems for Luxury Spaces"}
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <motion.div layout className="row g-4">
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="col-xl-3 col-lg-4 col-md-6"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="glass-card d-flex flex-column h-100 p-3 position-relative"
                >
                  <div className="position-relative">
                    {product.images?.[0] && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/product_image/${product.images[0]}`}
                        alt={product.name}
                        className="rounded-4 shadow img-fluid"
                        style={{ objectFit: "cover", height: "250px", width: "100%" }}
                      />
                    )}
                    <span className="badge rounded-pill bg-accent position-absolute top-0 start-0 m-2">
                      {product.category}
                    </span>
                    <span
                      className={`badge position-absolute top-0 end-0 m-2 ${product.availability ? "bg-success" : "bg-secondary"}`}
                    >
                      {product.availability ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-3 d-flex flex-column justify-content-between flex-grow-1">
                    <div className="text-center">
                      <h5 className="fw-bold mb-2 text-dark">{product.name}</h5>
                      <p className="text-muted small">{product.description}</p>
                      <h5 className="text-accent">$ {product.price}</h5>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass btn-outline-danger"
                        onClick={() => handleAddToWishlist(product._id)}
                        disabled={wishlistLoading}
                      >
                        ❤️ {wishlistLoading ? "Adding..." : "Add to Wishlist"}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass btn-outline-primary"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={cartLoading || !product.availability}
                      >
                        🛒 {cartLoading ? "Adding..." : "Add to Cart"}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass btn-outline-dark"
                        onClick={() => handleViewProductClick(product)}
                      >
                        👁 View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PublicProductList;
