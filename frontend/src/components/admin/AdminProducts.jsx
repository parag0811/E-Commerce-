import classes from "./AdminProducts.module.css";

import { NavLink, useLoaderData, useNavigate } from "react-router-dom";

export default function AdminProductsComponent({ products }) {
  const navigate = useNavigate();

  const goToProductDetails = (id) => {
    navigate(`/admin/products/${id}`);
  };

  return (
    <div className={classes.productGrid}>
      <div className={classes.breadcrumbs}>
        <NavLink to="/admin/create-products" className={classes.createButton}>
          Create Product
        </NavLink>

        <p>
          {products.length > 0
            ? "What are you selling today"
            : "No products of yours."}
        </p>
      </div>
      <div className={classes.gridContainer}>
        {products.map((product, index) => (
          <div key={index} className={classes.productCard}>
            <img
              src={product.imageURL}
              alt={product.name}
              className={classes.productImage}
            />
            <h3 className={classes.productName}>{product.name}</h3>
            <p className={classes.productCategory}>{product.category}</p>
            <p className={classes.productPrice}>${product.price}</p>
            <div className={classes.productRating}>{product.brand}</div>
            <div className={classes.buttonWrapper}>
              <button
                className={classes.productButton}
                onClick={() => goToProductDetails(product._id)}
              >
                Go to Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
