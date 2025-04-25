import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = ({ setShowEdit, productData, setProductData }) => {
  // Initialize toast notifications
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

      const response = await fetch(`https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/product/edit/${productData._id}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      notifySuccess(); // Show success toast
      setShowEdit(false);

    } catch (error) {
      console.error('Error updating product:', error);
      notifyError('Failed to update product: ' + error.message); // Show error toast
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
                name="type"
                value={productData.type || ""}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select type</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="type3">Type 3</option>
              </select>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Parent Category</label>
              <select
                name="parent"
                value={productData.parent || ""}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select parent</option>
                <option value="parent1">Parent 1</option>
                <option value="parent2">Parent 2</option>
                <option value="parent3">Parent 3</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Child Category</label>
              <select
                name="child"
                value={productData.child || ""}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select child</option>
                <option value="child1">Child 1</option>
                <option value="child2">Child 2</option>
                <option value="child3">Child 3</option>
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
              <label className="form-label">Discount</label>
              <input
                type="number"
                name="discount"
                value={productData.discount}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter discount if any"
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
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={productData.status || ""}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* MEDIA */}
          <h5 className="mb-3 mt-4">Media</h5>
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">Main Product Image</label>
              <input
                type="file"
                name="mainImage"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">YouTube Video ID</label>
              <input
                type="text"
                name="videoId"
                value={productData.videoId}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., dQw4w9WgXcQ"
              />
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
