import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/order/get-orders");
        const data = await res.json();
        if (data.success && data.data) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirm = (index) => {
    setOrders((prev) => {
      const updated = [...prev];
      updated[index].status = "confirmed";
      return updated;
    });
  };

  if (loading) return <p className="p-3">Loading orders...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📦 All Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="d-flex flex-column gap-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {orders.map((order, index) => (
            <div className="card shadow-sm border-0" key={order._id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">{order.user?.name || order.name || "Guest"}</h5>
                  <span
                    className={`badge ${order.status === "confirmed" ? "bg-success" : "bg-warning text-dark"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="d-flex flex-row">
                  <div className="mb-1"><strong>Email:</strong> {order.email}</div>
                  <div className="mb-1"><strong>Contact:</strong> {order.contact}</div>
                  <div className="mb-1"><strong>Address:</strong> {order.address}</div>
                  <div className="mb-1"><strong>Total:</strong> Rs. {order.totalAmount}</div>
                  <div className="mb-3"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary mb-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#products-${order._id}`}
                  aria-expanded="false"
                  aria-controls={`products-${order._id}`}
                >
                  View Products
                </button>

                <div className="collapse" id={`products-${order._id}`}>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.cart?.map((item, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.name || item.title || "N/A"}</td>
                            <td>Rs. {item.price || "N/A"}</td>
                            <td>{item.quantity || item.qty || 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    className="btn btn-success"
                    disabled={order.status === "confirmed"}
                    onClick={() => handleConfirm(index)}
                  >
                    {order.status === "confirmed" ? (
                      <>
                        <FaCheckCircle className="me-1" /> Confirmed
                      </>
                    ) : (
                      "Confirm Order"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowOrder;
