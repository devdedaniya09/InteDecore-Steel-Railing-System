import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("adminAccessToken");
                if (!token) {
                    setError("Unauthorized: Please log in first.");
                    setLoading(false);
                    return;
                }

                // Include availability filter in API request based on filterType
                const availabilityParam = filterType === "all" ? "" : filterType === "inStock" ? "true" : "false";
                
                const response = await axios.get(`${API_URL}?availability=${availabilityParam}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProducts(response.data.products);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error.response?.data?.message || "Forbidden: You do not have access.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filterType]); // Re-run the effect when filterType changes

    const handleAddProductClick = () => navigate("/admin/products");

    const handleViewProductClick = (product) => {
        const formatDate = (date) =>
            new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            });

        const imagesHtml = product.images.length > 0
            ? product.images.map((image, index) => `
                <img key=${index} src="http://localhost:5000/product_image/${image}" 
                alt="Product Image" class="img-fluid mb-2 rounded border" 
                style="max-height: 300px; object-fit: contain;"/>
            `).join('')
            : '<p>No images available</p>';

        Swal.fire({
            title: `${product.name}`,
            html: `
                <div class="d-flex justify-content-between gap-4 text-start">
                    <div class="flex-fill pe-3">
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Availability:</strong> ${product.availability ? 'In Stock' : 'Out of Stock'}</p>
                        <p><strong>Description:</strong> ${product.description}</p>
                        <p><strong>Price:</strong> $${product.price}</p>
                        <p><strong>Created At:</strong> ${formatDate(product.createdAt)}</p>
                        <p><strong>Updated At:</strong> ${formatDate(product.updatedAt)}</p>
                    </div>
                    <div class="flex-fill">
                        <p><strong>Images:</strong></p>
                        ${imagesHtml}
                    </div>
                </div>
            `,
            icon: "info",
            confirmButtonText: "Close",
            width: '60%',
        });
    };

    const handleEditProductClick = (productId) => navigate(`/admin/editproduct/${productId}`);

    const handleDeleteProductClick = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This product will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    Swal.fire('Error!', 'Unauthorized: Please log in first.', 'error');
                    return;
                }

                await axios.delete(`${API_URL}/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProducts(products.filter((product) => product._id !== productId));
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            } catch (error) {
                console.error("Error deleting product:", error);
                Swal.fire('Error!', error.response?.data?.message || 'Failed to delete product.', 'error');
            }
        }
    };

    return (
        <div className="container py-3 bg-light min-vh-100">
            <div className="card shadow-lg rounded-3 p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-primary mb-1">
                            <i className="bi bi-box-seam-fill me-2"></i>
                            Product Catalog
                        </h2>
                        <p className="text-muted mb-0">Manage and view product details efficiently.</p>
                    </div>

                    <button
                        onClick={handleAddProductClick}
                        className="btn btn-primary text-white fw-semibold px-4"
                    >
                        <i className="bi bi-plus-circle me-2"></i>Add Product
                    </button>
                </div>

                {/* Filter Dropdown */}
                <div className="mb-4">
                    <label htmlFor="filterType" className="form-label fw-bold text-secondary">
                        <i className="bi bi-funnel-fill me-2 text-secondary"></i>Filter Products
                    </label>
                    <select
                        id="filterType"
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Products</option>
                        <option value="inStock">In Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>
                </div>

                {/* Product Cards */}
                <div className="row g-4">
                    {loading ? (
                        <div className="col-12 text-center">
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="col-12 text-center text-danger">
                            <p>{error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-12 text-center">
                            <p>No products available</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="col-md-6 col-lg-4">
                                <div className="card shadow-sm rounded-3">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={`http://localhost:5000/product_image/${product.images[0]}`}
                                            alt={product.name}
                                            className="card-img-top img-fluid rounded-top-3"
                                            style={{ maxHeight: "250px", objectFit: "contain" }}
                                        />
                                    ) : (
                                        <div className="text-center py-3 text-muted">No image available</div>
                                    )}
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-3">{product.name}</h5>
                                        <p className="text-muted">{product.description}</p>
                                        <p className="text-muted"><strong>Category:</strong> {product.category}</p>
                                        <p className="text-muted"><strong>Price:</strong> ${product.price}</p>
                                        <p className="text-muted"><strong>Availability:</strong> {product.availability ? 'In Stock' : 'Out of Stock'}</p>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                onClick={() => handleViewProductClick(product)}
                                                className="btn btn-outline-info w-100"
                                            >
                                                <i className="bi bi-eye"></i> View Details
                                            </button>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                onClick={() => handleEditProductClick(product._id)}
                                                className="btn btn-outline-warning w-100"
                                            >
                                                <i className="bi bi-pencil-square"></i> Edit
                                            </button>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                onClick={() => handleDeleteProductClick(product._id)}
                                                className="btn btn-outline-danger w-100"
                                            >
                                                <i className="bi bi-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
