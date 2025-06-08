import { useState } from "react";
import classes from "./Products.module.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Products({ products, totalPages, currentPage }) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const goToProduct = (id) => {
    navigate(`/all-products/${id}`);
  };

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (searchInput.trim())
      query.append("category", searchInput.trim().toLowerCase());
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    query.set("page", 1);

    navigate(`?${query.toString()}`);
  };

  return (
    <div className={classes.productsPage}>
      <div className={classes.sideBar}>
        <div className={classes.searchBar}>
          <input
            type="text"
            placeholder="Search products..."
            className={classes.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className={classes.searchButton} onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        <div className={classes.filterByPrice}>
          <h3>Filter by Price</h3>

          <label>Min Price: ${minPrice}</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={minPrice}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value <= maxPrice) setMinPrice(value);
            }}
            className={classes.priceRange}
          />

          <label>Max Price: ${maxPrice}</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={classes.priceRange}
          />

          <div className={classes.priceNfilter}>
            <button className={classes.filterButton} onClick={handleSearch}>
              FILTER
            </button>
            <p>
              Price:{" "}
              <span>
                ${minPrice} – ${maxPrice}
              </span>
            </p>
          </div>
        </div>

        <div className={classes.categories}>
          <h3>Categories</h3>
          <ul>
            <li onClick={() => navigate("/all-products?gender=unisex")}>
              Unisex
            </li>
            <li onClick={() => navigate("/all-products?gender=men")}>Men</li>
            <li onClick={() => navigate("/all-products?gender=women")}>
              Women
            </li>
          </ul>
        </div>

        <div className={classes.newsletter}>
          <h3>Subscribe to our Newsletter</h3>
          <p>Get updates on the latest products and offers.</p>
          <input
            type="email"
            placeholder="Enter your email"
            className={classes.emailInput}
          />
          <button className={classes.subscribeButton}>Subscribe</button>
        </div>
      </div>
      <div className={classes.productGrid}>
        <div className={classes.breadcrumbs}>Home / Store</div>
        <div className={classes.gridContainer}>
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={index}
                className={classes.productCard}
                onClick={() => goToProduct(product._id)}
              >
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className={classes.productImage}
                />
                <h3 className={classes.productName}>{product.title}</h3>
                <p className={classes.productCategory}>{product.category}</p>
                <p className={classes.productPrice}>$ {product.price}</p>
                <div className={classes.productBrand}>{product.brand}</div>
              </div>
            ))
          ) : (
            <div className={classes.noProductsFound}>No Products found!</div>
          )}
        </div>
        {totalPages > 1 && (
          <div className={classes.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${classes.pageButton} ${
                  currentPage === i + 1 ? classes.activePage : ""
                }`}
                onClick={() => {
                  const query = new URLSearchParams(window.location.search);
                  query.set("page", i + 1);
                  navigate(`?${query.toString()}`);
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
