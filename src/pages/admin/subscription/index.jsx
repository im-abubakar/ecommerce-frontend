import Navbar from '@/components/admin/navbar/navbar'
import Sidebar from '@/components/admin/sidebar/sidebar'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Wrapper from '@/layout/wrapper'
import React, { useState } from 'react'

const Subscription = () => {
      const [view, setView] = useState('showList'); // Manage which view to show
  
  return (

    <AdminProtectedRoute>
      <Wrapper>
        <Sidebar />
        <main className="main-content py-0">
                    <Navbar />
                    <div className="px-4 py-3 d-flex justify-content-between" style={{ backgroundColor: "#cecece" }}>
                        <h3>Subscription List</h3>

                        {view === "addOrder" ? (
                            <button className="btn btn-primary" onClick={() => setView('showList')}>Pending</button>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setView('addOrder')}>Show list</button>
                        )}
                    </div>

                    <div className='bg-white d-flex justify-content-center p-md-5 px-3 overflow-scroll h-100'>
                        {view === "showList" ? "" : ""}
                    </div>
                </main>
      </Wrapper>
    </AdminProtectedRoute>

  )
}

export default Subscription