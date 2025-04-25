import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/order/get-orders");
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

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <p className="p-3">Loading orders...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📦 Pending Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {orders.map((order, index) => (
            <div className="col" key={order._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{order.user?.name || order.name || "Guest"}</h6>
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <span className={`badge ${order.status === "confirmed" ? "bg-success" : "bg-warning text-dark"}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <div><strong>Total:</strong> Rs. {order.totalAmount}</div>
                    <div><strong>Items:</strong> {order.cart?.length || 0}</div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleExpand(order._id)}
                    >
                      {expandedOrder === order._id ? (
                        <>
                          <FaChevronUp className="me-1" /> Hide Details
                        </>
                      ) : (
                        <>
                          <FaChevronDown className="me-1" /> Show Details
                        </>
                      )}
                    </button>
                    
                    <button
                      className="btn btn-sm btn-success"
                      disabled={order.status === "confirmed"}
                      onClick={() => handleConfirm(index)}
                    >
                      {order.status === "confirmed" ? (
                        <>
                          <FaCheckCircle className="me-1" /> Confirmed
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="mt-3">
                      <div className="mb-2">
                        <strong>Contact:</strong> {order.contact || "N/A"}<br />
                        <strong>Email:</strong> {order.email || "N/A"}<br />
                        <strong>Address:</strong> {order.address || "N/A"}
                      </div>
                      
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.cart?.map((item, i) => (
                              <tr key={i}>
                                <td>{item.name || item.title || "N/A"}</td>
                                <td>Rs. {item.price || "N/A"}</td>
                                <td>{item.quantity || item.qty || 1}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
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