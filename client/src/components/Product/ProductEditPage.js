import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    availability: 'In stock',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/${productId}`);
        const data = response.data;

        setProduct({
          ...data,
          price: data.price || '',
          availability: data.availability ? "In stock" : "Out of stock",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError('Failed to fetch product data');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('availability', product.availability === "In stock");

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    try {
      await axios.put(`${API_URL}/edit/${productId}`, formData);

      Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/admin/productlist');
      });
    } catch (error) {
      console.error("Error:", error);
      setError('Error updating product');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="container py-4" style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <div className="card shadow-lg rounded-3 p-4" style={{ backgroundColor: "#FFFFFF", maxWidth: "900px", margin: "0 auto" }}>
        <h2 className="text-primary fw-bold text-center mb-4">
          <i className="bi bi-pencil-square me-2"></i> Edit Product
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">Product Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-semibold">Category</label>
              <input
                type="text"
                className="form-control"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="price" className="form-label fw-semibold">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="availability" className="form-label fw-semibold">Availability</label>
              <select
                className="form-select"
                id="availability"
                name="availability"
                value={product.availability}
                onChange={handleChange}
              >
                <option value="In stock">In stock</option>
                <option value="Out of stock">Out of stock</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                value={product.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-12">
              <label htmlFor="images" className="form-label fw-semibold">Product Images</label>
              <input
                type="file"
                className="form-control"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {/* Optional: preview current images */}
              <div className="mt-3 d-flex flex-wrap gap-2">
                {product.images && product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="product"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                  />
                ))}
              </div>
            </div>

            <div className="col-12 text-end mt-3">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 fw-semibold rounded"
              >
                <i className="bi bi-save2 me-2"></i>Update Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
