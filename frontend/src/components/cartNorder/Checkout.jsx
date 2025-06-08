import classes from "./Checkout.module.css";
import { useNavigate } from "react-router-dom";

const Checkout = ({ orderData }) => {
  const navigate = useNavigate();

  const handleOrderNow = async () => {
    try {
      const profileRes = await fetch("http://localhost:5050/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        throw new Error(profileData.message || "Failed to fetch profile.");
      }

      const { address } = profileData.user;

      const isAddressComplete =
        address &&
        address.street &&
        address.city &&
        address.zipCode &&
        address.state &&
        address.country;

      if (!isAddressComplete) {
        alert("Please complete your address before placing an order.");
        navigate("/profile");
        return;
      }

      const orderRes = await fetch("http://localhost:5050/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const orderResult = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderResult.message || "Failed to place order.");
      }

      alert("✅ Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>🛒 Checkout Summary</h1>

      {orderData ? (
        <>
          <div className={classes.detailsContainer}>
            {orderData.orderItems.map((item, index) => (
              <div key={index} className={classes.card}>
                <p>
                  <span>🧾 Product Name:</span> {item.productId.title}
                </p>
                <p>
                  <span>💲 Price Per Unit:</span> ${item.productId.price}
                </p>
                <p>
                  <span>🔢 Quantity:</span> {item.quantity}
                </p>
                <p className={classes.itemTotal}>
                  <span>🧮 Total Price:</span> ${item.totalPrice}
                </p>
              </div>
            ))}
          </div>

          <p className={classes.total}>
            Grand Total:{" "}
            <span className={classes.amount}>${orderData.totalAmount}</span>
          </p>

          <div className={classes.buttonGroup}>
            <button
              className={`${classes.button} ${classes.goBack}`}
              onClick={() => navigate("/cart")}
            >
              ⬅ Go to Cart
            </button>
            <button
              className={`${classes.button} ${classes.orderNow}`}
              onClick={handleOrderNow}
            >
              ✅ Order Now
            </button>
          </div>
        </>
      ) : (
        <p className={classes.error}>No order data available.</p>
      )}
    </div>
  );
};

export default Checkout;
