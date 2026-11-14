import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import './style/Theam.css';

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) return navigate("/UserLogin");

    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/usercart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.cart);
        calculateTotal(res.data.cart);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load your cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const calculateTotal = (cart) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = async (productId) => {
    if (!token) return Swal.fire("Error", "Please log in", "error");

    try {
      setCartLoading(true);
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Removed", res.data.message, "success");
      const updatedCart = cartItems.filter((item) => item._id !== productId);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (err) {
      Swal.fire("Error", "Could not remove item", "error");
    } finally {
      setCartLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/user/UserCheckout", { state: { cartItems, totalPrice } });
  };

  if (loading) {
    return <div className="centered-loading"><div className="custom-spinner" /></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5 rounded-pill fw-semibold px-4 py-3 shadow-sm fs-5">{error}</div>;
  }

  return (
    <div className="section-bg py-5" style={{ minHeight: "100vh" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center"
        >
          <h2 className="lux-heading"><i className="bi bi-cart-fill me-2"></i>Your Cart</h2>
          <p className="lux-subheading">Elegant selections curated for your lifestyle</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <div className="text-center text-muted fs-5 mt-5">
            <i className="bi bi-cart-x me-2" /> Your cart is empty.
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  className="glass-card d-flex flex-wrap p-3 gap-3 align-items-center rounded-4 shadow-sm mb-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={
                      item.images?.[0]
                        ? `${process.env.REACT_APP_API_URL}/product_image/${item.images[0]}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={item.name}
                    className="rounded-4"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: "2px solid var(--accent-100)",
                    }}
                  />

                  <div className="flex-grow-1">
                    <h5 className="fw-semibold text-dark mb-1">{item.name}</h5>
                    <p className="text-muted small mb-1">{item.description}</p>
                    <p className="mb-0">₹{item.price} × {item.quantity}</p>
                    <p className="text-muted small mb-0">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm rounded-circle ms-auto"
                    onClick={() => handleRemoveFromCart(item._id)}
                    disabled={cartLoading}
                    title="Remove"
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="col-lg-4">
              <motion.div
                className="glass-card p-4 rounded-4 shadow-lg"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h5 className="text-center text-gold mb-3">
                  <i className="bi bi-receipt me-2"></i>Order Summary
                </h5>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-gold w-100 mt-4 shadow-sm rounded-pill fw-semibold"
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0}
                >
                  <i className="bi bi-credit-card-2-front-fill me-2"></i>Proceed to Checkout
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCart;
