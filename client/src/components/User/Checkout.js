import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style/Theam.css";

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchUserData();
    fetchCartData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setSelectedAddress(response.data.shippingAddress);
    } catch {
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/usercart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
    } catch {
      setError("Failed to load cart data.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/placeorder`,
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      navigate("/user/UserOders");
    } catch {
      alert("Failed to place order. Please try again.");
    }
  };

  const renderAddress = () => {
    if (!selectedAddress) return "No address found.";
    return (
      <>
        {selectedAddress.street}, {selectedAddress.city},<br />
        {selectedAddress.state} - {selectedAddress.pincode},<br />
        {selectedAddress.country}
      </>
    );
  };

  if (loading) {
    return <div className="text-center py-5 text-subtle">Loading your checkout details...</div>;
  }

  return (
    <div className="section-bg py-3" style={{ minHeight: "100vh" }}>
      <div className="container">
        {error && (
          <div className="alert alert-danger text-center rounded-pill shadow-sm mb-4 fs-5 fw-semibold">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center"
        >
          <h2 className="lux-heading">
            <i className="bi bi-truck me-2" />
            Checkout
          </h2>
          <p className="lux-subheading">Secure and fast – complete your purchase with confidence</p>
        </motion.div>

        <div className="row gy-4">
          {/* LEFT: Checkout Steps */}
          <div className="col-md-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-4 mb-4"
            >
              <h6 className="text-gold fw-bold mb-3">1️⃣ LOGIN</h6>
              {user ? (
                <>
                  <p className="mb-1 fw-semibold">Welcome, {user.name}</p>
                  <p className="mb-1 text-subtle">{user.email}</p>
                  <p className="mb-0">Mobile: {user.mobile || "Not Provided"}</p>
                </>
              ) : (
                <p className="text-danger">Please log in to proceed.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="glass-card p-4 mb-4"
            >
              <h6 className="text-gold fw-bold mb-3">2️⃣ DELIVERY ADDRESS</h6>
              {selectedAddress ? (
                <div className="form-check">
                  <input className="form-check-input me-2" type="radio" checked readOnly />
                  <label className="form-check-label fw-semibold">{renderAddress()}</label>
                </div>
              ) : (
                <p className="text-danger">No address found. Please update your profile.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-4 mb-4"
            >
              <h6 className="text-gold fw-bold mb-3">3️⃣ ORDER SUMMARY</h6>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between border-bottom py-2">
                    <p className="mb-0">{item.name} (x{item.quantity || 1})</p>
                    <p className="mb-0 fw-semibold text-dark">
                      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-danger">Your cart is empty.</p>
              )}
            </motion.div>
          </div>

          {/* RIGHT: Price Summary */}
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-4 shadow-lg"
            >
              <h6 className="text-gold fw-bold mb-3">4️⃣ PAYMENT OPTIONS</h6>
              <select
                className="form-select rounded-pill border-2 border-dark shadow-sm"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="PayPal">PayPal</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>

              <h6 className="fw-bold text-center text-gold mb-3 mt-5">
                <i className="bi bi-cash-coin me-2" />
                PRICE DETAILS
              </h6>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cart.length})</span>
                <span>
                  ₹{cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0).toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>
                  ₹{cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0).toFixed(2)}
                </span>
              </div>
              <button
                className="btn btn-gold w-100 mt-4 shadow-sm rounded-pill fw-semibold"
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
              >
                <i className="bi bi-bag-check-fill me-2" />
                Place Order
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
