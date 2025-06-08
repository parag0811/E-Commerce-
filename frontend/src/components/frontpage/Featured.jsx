import { useEffect, useState } from "react";
import classes from "./Featured.module.css";

export default function Featured() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const response = await fetch("http://localhost:5050/products");
        const resData = await response.json();

        if (!response.ok) {
          throw new Error("Could not fetch products.");
        }

        const firstTen = resData.products.slice(0, 10);
        setProducts(firstTen);
      } catch (error) {
        setError(error.message);
        console.error("Error loading products:", error.message);
      } finally {
        setLoading(false); // Set loading to false in both success and error cases
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <>
      <div className={classes.featured}>
        <h2>Featured Products</h2>
        <hr className={classes.small} />

        {loading && <p className={classes.loading}>Loading products...</p>}
        {products.length === 0 && (
          <p className={classes.loading}>No products at the moment!</p>
        )}
        {error && <p className={classes.error}>{error}</p>}

        {!loading && !error && (
          <div className={classes.gridContainer}>
            {products.map((product) => (
              <div key={product._id} className={classes.productCard}>
                {product.sale && <span className={classes.saleTag}>Sale!</span>}
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className={classes.productImage}
                />
                <h3 className={classes.productTitle}>{product.title}</h3>
                <p className={classes.category}>{product.category}</p>
                <p className={classes.price}>
                  {product.oldPrice && (
                    <span className={classes.oldPrice}>{product.oldPrice}</span>
                  )}
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr />
    </>
  );
}
