import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("In stock");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("availability", availability === "In stock");

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(`${API_URL}/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Product added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAvailability("In stock");
      setImages([]);
    } catch (error) {
      console.error("Error adding product:", error);

      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map((err) => err.msg).join(", ");
        Swal.fire("Validation Failed", errorMessages, "error");
      } else {
        Swal.fire("Error", "Failed to add product", "error");
      }
    }
  };

  return (
    <div
      className="container py-4"
      style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg rounded-3 p-4"
        style={{ backgroundColor: "#FFFFFF", maxWidth: "900px", margin: "0 auto" }}
      >
        <header className="mb-4 text-primary text-center">
          <h2 className="fw-bold">
            <i className="bi bi-plus-square me-2"></i> Add New Product
          </h2>
          <p className="text-muted">Enter details to add a new product to inventory.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-semibold">
                Category
              </label>
              <input
                type="text"
                className="form-control"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="price" className="form-label fw-semibold">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="availability" className="form-label fw-semibold">
                Availability
              </label>
              <select
                className="form-select"
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="In stock">In stock</option>
                <option value="Out of stock">Out of stock</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label fw-semibold">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="col-12">
              <label htmlFor="images" className="form-label fw-semibold">
                Product Images
              </label>
              <input
                type="file"
                className="form-control"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>

            <div className="col-12 text-end mt-3">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                style={{ borderRadius: "10px", fontWeight: "600" }}
              >
                <i className="bi bi-check2-circle me-2"></i> Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
