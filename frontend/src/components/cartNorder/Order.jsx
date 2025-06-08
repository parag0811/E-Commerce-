import { useEffect, useState } from "react";
import classes from "./Orders.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5050/orders", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>📦 Orders Overview</h2>
      {loading ? (
        <p className={classes.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className={classes.empty}>No orders found.</p>
      ) : (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.transactionId}</td>
                <td>{order.user}</td>
                <td>${order.totalAmount}</td>
                <td>
                  <span
                    className={
                      order.paymentStatus === "completed"
                        ? classes.statusCompleted
                        : classes.statusPending
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      classes[`order_${order.orderStatus}`] ||
                      classes.order_pending
                    }
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
