import FormProduct from '@/components/admin/addproduct/FormProduct';
import Navbar from '@/components/admin/navbar/navbar';
import Sidebar from '@/components/admin/sidebar/sidebar';
import Wrapper from '@/layout/wrapper';
import React, { useState } from 'react';
import ShowProducts from '@/components/admin/addproduct/ShowProducts';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';

const ProductManagement = () => {
  const [view, setView] = useState('list'); // 'form' or 'list'

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

          {view === 'form' ? <FormProduct /> : <ShowProducts />}
        </main>
      </Wrapper>
    </AdminProtectedRoute>

  );
};

export default ProductManagement;