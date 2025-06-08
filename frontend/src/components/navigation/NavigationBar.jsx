import { NavLink, useLocation, useNavigate } from "react-router-dom";
import classes from "./NavigationBar.module.css";
import brandLogo from "../../assets/logo/brandLogo.png";
import cartIcon from "../../assets/icons/cart.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function NavigationBar({ path, onClickVisible, isWhite }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      try {
        const { exp } = jwtDecode(token);
        const remainingTime = exp * 1000 - Date.now();

        if (remainingTime <= 0) {
          logout();
        } else {
          setIsLoggedIn(true);
          const username = sessionStorage.getItem("username");
          setFirstName(username ? username.split(" ")[0] : "");

          const timer = setTimeout(() => {
            logout();
          }, remainingTime);

          return () => clearTimeout(timer);
        }
      } catch (err) {
        logout();
      }
    }
  }, [location]);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    setIsLoggedIn(false);
    setFirstName("");
    navigate("/auth/login");
  };

  const query = new URLSearchParams(location.search);
  const gender = query.get("gender");
  const isActiveCategory = (gen) => gender === gen;
  const isProductsPage = location.pathname === "/all-products" && !gender;

  let customNavStyle;
  if (path === "/") {
    customNavStyle = classes.mainHeader;
  } else {
    customNavStyle = classes.productsNav;
  }

  return (
    <header className={` ${customNavStyle} ${isWhite ? classes.white : ""}`}>
      <nav>
        <div className={classes.leftNav}>
          <NavLink to="/" className={classes.logo}>
            <img src={brandLogo} alt="Brand Logo" />
          </NavLink>
          <NavLink
            to="/all-products"
            className={`${classes.navLink}  ${classes.productsLink} ${
              isProductsPage ? classes.active : ""
            }`}
          >
            Products
          </NavLink>
          <div className={classes.leftNavLinks}>
            <NavLink
              to="/all-products?gender=men"
              className={`${classes.navLink} ${
                isActiveCategory("men") ? classes.active : ""
              }`}
            >
              Men
            </NavLink>
            <NavLink
              to="/all-products?gender=women"
              className={`${classes.navLink} ${
                isActiveCategory("women") ? classes.active : ""
              }`}
            >
              Women
            </NavLink>
            <NavLink
              to="/all-products?gender=unisex"
              className={`${classes.navLink} ${
                isActiveCategory("unisex") ? classes.active : ""
              }`}
            >
              Unisex
            </NavLink>
          </div>
        </div>
        <div className={classes.rightNav}>
          <NavLink to="/cart" className={classes.navIcon}>
            <img src={cartIcon} alt="Checkout" />
          </NavLink>
          {isLoggedIn && (
            <div
              className={classes.navIconProfile}
              onClick={() => onClickVisible()}
            >
              <div className={classes.hamburger}>
                <img src={hamburger} alt="Profile View" />
              </div>
              Hey, {firstName}
            </div>
          )}
          {!isLoggedIn && (
            <NavLink to="/auth/login" className={classes.navLink}>
              Login Now
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;
