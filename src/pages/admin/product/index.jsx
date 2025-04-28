import FormProduct from '@/components/admin/addproduct/FormProduct';
import Navbar from '@/components/admin/navbar/navbar';
import Sidebar from '@/components/admin/sidebar/sidebar';
import Wrapper from '@/layout/wrapper';
import React, { useEffect, useState } from 'react';
import ShowProducts from '@/components/admin/addproduct/ShowProducts';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';

const ProductManagement = () => {
  const [view, setView] = useState('list'); 
    const [products, setProducts] = useState([]);

   useEffect(() => {
          const fetchProducts = async () => {
              try {
                  const res = await fetch("https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/product/all");
                  const data = await res.json();
                  if (data.data) {
                      setProducts(data.data);
                  }
              } catch (error) {
                  toast.error("Failed to fetch products.");
              }
          };
  
          fetchProducts();
      }, []);

  return (
    <AdminProtectedRoute>
      <Wrapper>
        <Sidebar />
        <main className="main-content py-0">
          <Navbar />

          <div className="px-4 py-3 d-flex justify-content-between" style={{backgroundColor:"#cecece"}}>
            <h3>Product Management</h3>

            {view === 'list' && (
              <button
                className="btn btn-primary"
                onClick={() => setView('form')}
              >
                Add Product
              </button>
            )}
            {view === 'form' && (
              <button
                className="btn btn-secondary"
                onClick={() => setView('list')}
              >
                Show Products
              </button>
            )}
          </div>

          {view === 'form' ? <FormProduct /> : <ShowProducts setProducts={setProducts} products={products} />}
        </main>
      </Wrapper>
    </AdminProtectedRoute>

  );
};

export default ProductManagement;