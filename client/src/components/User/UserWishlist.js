import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style/Theam.css";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) return navigate("/UserLogin");

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/userwishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.wishlist);
      } catch (err) {
        setError("Failed to load your wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      Swal.fire("Removed!", "Product removed from wishlist.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to remove product.", "error");
    }
  };

  const handleAddToCart = async (product) => {
    if (!token) return Swal.fire("Error", "Please log in first.", "error");
    if (!product.availability) return Swal.fire("Unavailable", "This product is currently out of stock.", "warning");

    try {
      setCartLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/cart`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Added!", res.data.message, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add to cart.", "error");
    } finally {
      setCartLoading(false);
    }
  };

  const handleViewProductClick = (product) => {
    const imageHtml = product.images?.length
      ? product.images.map(
          (img) =>
            `<img src="${process.env.REACT_APP_API_URL}/product_image/${img}"
                  class="img-fluid rounded shadow-sm mb-2"
                  style="max-height: 250px; object-fit: cover;" />`
        ).join("")
      : "<p>No images available.</p>";

    Swal.fire({
      title: product.name,
      html: `
        <div style="display:flex;flex-wrap:wrap;gap:20px;">
          <div style="flex:1;">
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Status:</strong> ${product.availability ? "✅ In Stock" : "❌ Out of Stock"}</p>
            <p><strong>Price:</strong> ₹${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
          </div>
          <div style="flex:1;">${imageHtml}</div>
        </div>
      `,
      confirmButtonText: "Close",
      showCloseButton: true,
      customClass: {
        popup: "glass-modal",
      },
      width: "50%",
    });
  };

  return (
    <section className="section-bg" style={{ padding: "4rem 1rem", background: "#f2f2f7" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-accent" style={{ fontFamily: "Poppins, sans-serif" }}>
            ❤️ Your Wishlist
          </h2>
          <p className="text-muted fs-5">Your saved luxury selections</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : wishlist.length === 0 ? (
          <div className="text-center text-muted fs-5">
            <i className="bi bi-emoji-frown me-2" />
            Your wishlist is empty.
          </div>
        ) : (
          <motion.div layout className="row g-4">
            {wishlist.map((product) => (
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
                      className={`badge position-absolute top-0 end-0 m-2 ${
                        product.availability ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {product.availability ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-3 d-flex flex-column justify-content-between flex-grow-1">
                    <div className="text-center">
                      <h5 className="fw-bold mb-2 text-dark">{product.name}</h5>
                      <p className="text-muted small">{product.description}</p>
                      <h5 className="text-accent">₹ {product.price}</h5>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass btn-outline-danger"
                        onClick={() => handleRemoveFromWishlist(product._id)}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Remove
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass btn-outline-primary"
                        onClick={() => handleAddToCart(product)}
                        disabled={cartLoading || !product.availability}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        {cartLoading ? "Adding..." : "Add to Cart"}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass btn-outline-dark"
                        onClick={() => handleViewProductClick(product)}
                      >
                        <i className="bi bi-eye-fill me-1"></i>
                        View Details
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

export default UserWishlist;
