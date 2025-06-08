import classes from "./SingleProduct.module.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../../spinner/spinner";
import { useState } from "react";

export default function SingleProduct({ product }) {
  const [loadingImage, setLoadingImage] = useState(true);
  const [selectedSize, setSelectedSize] = useState(product.size[0] || "");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  async function handleAddToCart() {
    try {
      const response = await fetch("http://localhost:5050/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          size: selectedSize,
          quantity: 1,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to add to cart.");
      }

      setErrorMessage("");
      navigate("/cart");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong!");
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.imageSection}>
        {loadingImage && <Spinner />}
        <img
          src={product.imageURL}
          alt={product.category}
          onLoad={() => setLoadingImage(false)}
          style={{ display: loadingImage ? "none" : "block" }}
        />
      </div>

      <div className={classes.detailsSection}>
        <p className={classes.breadcrumb}>{product.brand}</p>
        <p className={classes.category}>{product.gender}</p>
        <h2 className={classes.title}>{product.title}</h2>
        <p className={classes.price}>
          ${product.price}
          <span>+ Free Shipping</span>
        </p>

        <p className={classes.description}>{product.description}</p>

        <div className={classes.sizeSelector}>
          <label htmlFor="size">Select Size: </label>
          <select
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className={classes.selectBox}
          >
            {product.size.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className={classes.cartSection}>
          <button
            className={classes.addToCart}
            onClick={() => handleAddToCart()}
          >
            ADD TO CART
          </button>
        </div>
        {errorMessage && <div className={classes.errorBox}>{errorMessage}</div>}

        <p className={classes.meta}>
          SKU: N/A &nbsp;&nbsp;&nbsp; {product.stock} items
        </p>
      </div>
    </div>
  );
}
