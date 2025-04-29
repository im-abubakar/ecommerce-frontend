import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = ({ setShowEdit, productData, setProductData }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`);
      const data = await res.json();
      if (data.result) {
        setCategories(data.result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const uniqueTypes = [...new Set(categories.map(cat => cat.productType).filter(Boolean))];
  const uniqueParents = [...new Set(categories.map(cat => cat.parent).filter(Boolean))];
  const selectedParent = categories.find(cat => cat.parent === productData.parent);
  const childCategories = selectedParent ? selectedParent.children : [];

  const notifySuccess = () => toast.success("Product updated successfully!");
  const notifyError = (message) => toast.error(message);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      for (const key in productData) {
        const value = productData[key];

        if (key === "tags" && Array.isArray(value)) {
          value.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
          });
        } else if (key === "mainImage" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/edit/${productData._id}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      notifySuccess();
      setShowEdit(false);
    } catch (error) {
      console.error('Error updating product:', error);
      notifyError('Failed to update product: ' + error.message);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "file") {
      newValue = files[0];
    } else if (name === "tags") {
      newValue = value.split(",").map(tag => tag.trim());
    } else {
      newValue = value;
    }

    setProductData(prev => {
      const updatedData = {
        ...prev,
        [name]: newValue
      };

      if (name === "title" && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        updatedData.slug = generateSlug(value);
      }

      return updatedData;
    });
  };

  return (
    <div
      className="position-absolute top-0 start-0 w-100 d-flex justify-content-center align-items-start"
      style={{
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        paddingTop: '40px',
        overflowY: 'auto',
      }}
    >
      <div
        className="card shadow border-0 w-100 mx-3"
        style={{
          backgroundColor: '#f8f9fa',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <div className="card-body px-3 px-md-4 py-4">
          <h2 className="card-title mb-4 text-center">Edit Product</h2>

          {/* BASIC INFORMATION */}
          <h5 className="mb-3">Basic Information</h5>
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                name="title"
                value={productData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter product title"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Product Slug</label>
              <input
                type="text"
                name="slug"
                value={productData.slug}
                onChange={handleChange}
                className="form-control"
                placeholder="Auto-generated or custom slug"
              />
            </div>
          </div>

          {/* PRODUCT CLASSIFICATION */}
          <h5 className="mb-3 mt-4">Product Classification</h5>
          <div className="row mb-3">
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Product Type</label>
              <select
                name="productType"
                value={productData.productType}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Product Type</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Parent Category</label>
              <select
                name="parent"
                value={productData.parent}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Parent</option>
                {uniqueParents.map((parent) => (
                  <option key={parent} value={parent}>
                    {parent}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Child Category</label>
              <select
                name="children"
                value={productData.children}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Child</option>
                {childCategories.map((child) => (
                  <option key={child} value={child}>
                    {child}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRICING AND INVENTORY */}
          <h5 className="mb-3 mt-4">Pricing and Inventory</h5>
          <div className="row mb-3">
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Price *</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter price"
                required
              />
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">SKU</label>
              <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter SKU"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter available quantity"
              />
            </div>
          </div>

          {/* STATUS TOGGLES */}
          <h5 className="mb-3 mt-4">Status</h5>
          <div className="row mb-3">
            <div className="col-4 d-flex align-items-center">
              <label className="form-label me-2 mb-0">Featured:</label>
              <input
                type="checkbox"
                name="featured"
                checked={productData.featured}
                onChange={handleChange}
              />
            </div>
            <div className="col-4 d-flex align-items-center">
              <label className="form-label me-2 mb-0">Active:</label>
              <input
                type="checkbox"
                name="active"
                checked={productData.active}
                onChange={handleChange}
              />
            </div>
            <div className="col-4 d-flex align-items-center">
              <label className="form-label me-2 mb-0">Trending:</label>
              <input
                type="checkbox"
                name="trending"
                checked={productData.trending}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* MEDIA */}
          <h5 className="mb-3 mt-4">Media</h5>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">Product Images</label>
              <div className="d-flex flex-wrap gap-2">
                {productData.imageURL ? (
                  productData.imageURL.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Product ${index}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ))
                ) : (
                  <p>No images uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(false)}>
              Cancel
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;