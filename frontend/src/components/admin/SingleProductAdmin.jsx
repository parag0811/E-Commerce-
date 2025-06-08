import {  useNavigate } from "react-router-dom";
import classes from "./SingleProductAdmin.module.css";

export default function AdminSingleProductDetails({ product }) {
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate(`/admin/editProducts/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5050/admin/product/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete product.");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  };

  return (
    <div className={classes.outerContainer}>
      <div className={classes.container}>
        <div className={classes.imageSection}>
          <img src={product.imageURL} alt={product.title} />
        </div>

        <div className={classes.detailsSection}>
          <p className={classes.breadcrumb}>{product.brand}</p>
          <p className={classes.category}>{product.gender}</p>
          <h2 className={classes.title}>{product.title}</h2>

          <p className={classes.price}>
            ${product.price} <span>+ Free Shipping</span>
          </p>

          <div className={classes.divider}></div>

          <p className={classes.description}>{product.description}</p>

          <div className={classes.buttonGroup}>
            <button
              className={classes.editButton}
              onClick={() => handleEditClick(product._id)}
            >
              Edit Product
            </button>
            <button
              className={classes.deleteButton}
              onClick={() => handleDeleteClick(product._id)}
            >
              Delete Product
            </button>
          </div>

          <p className={classes.meta}>SKU: N/A</p>
        </div>
      </div>
    </div>
  );
}
