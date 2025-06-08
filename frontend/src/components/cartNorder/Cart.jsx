import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";

export default function Cart({ cart, cartTotalPrice }) {
  const navigation = useNavigate();

  async function handleDeleteFromCart(productId) {
    try {
      const response = await fetch(
        `http://localhost:5050/cart/${productId._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error("Failed to delete item from cart.");
      }

      alert("Item removed from cart.");
      navigation("/cart");
    } catch (error) {
      alert("Failed to Delete item currently.");
    }
  }

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.heading}>Your Cart</h2>
      {cart.length === 0 ? (
        <p className={styles.message}>Your cart is empty.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((item, index) => (
              <li key={index} className={styles.cartItem}>
                <img
                  src={item.productId.imageURL}
                  alt={item.productId.title}
                  className={styles.productImage}
                />
                <div className={styles.details}>
                  <h3 className={styles.productTitle}>
                    {item.productId.title}
                  </h3>
                  <p>
                    <strong>Price:</strong> ${item.productId.price}
                  </p>
                  <p>
                    <strong>Size:</strong> {item.size}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> ${item.totalPrice}
                  </p>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.cartFooter}>
            <h3 className={styles.total}>
              Total Cart Value : ${cartTotalPrice}
            </h3>
            <button
              onClick={() => navigation("/checkout")}
              className={styles.checkoutBtn}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
