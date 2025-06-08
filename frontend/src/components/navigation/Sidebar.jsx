import classes from "./Sidebar.module.css";
import profileIcon from "../../assets/icons/profile.svg";
import cartIcon from "../../assets/icons/cart.svg";
import shoppingCart from "../../assets/icons/shoppingcart.svg";
import logout from "../../assets/icons/logout.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const isSmallScreen = window.innerWidth <= 850;
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const sideBarColor =
    location.pathname === "/" ? classes.sidebarTrans : classes.sidebarWhite;

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    navigate("/auth/login");
  };
  const sideBarData = [
    {
      title: "Profile",
      icon: profileIcon,
      link: "/profile",
    },
    {
      title: "Products",
      icon: cartIcon,
      link: "/all-products",
    },
    ...(isSmallScreen
      ? [
          {
            title: "Men",
            icon: cartIcon,
            link: "/all-products?gender=men",
          },
          {
            title: "Women",
            icon: cartIcon,
            link: "/all-products?gender=women",
          },
          {
            title: "Unisex",
            icon: cartIcon,
            link: "/all-products?gender=unisex",
          },
        ]
      : []),
    ,
    {
      title: "Cart",
      icon: shoppingCart,
      link: "/cart",
    },
    {
      title: "Orders",
      icon: profileIcon,
      link: "/orders",
    },
    {
      title: "Your Product",
      icon: cartIcon,
      link: "/admin/products",
    },
    {
      title: "Logout",
      icon: logout,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={sideBarColor}>
      <ul className={classes.sideBarData}>
        {sideBarData.map((val, key) => {
          return (
            <li className={classes.eachSubBar} key={key}>
              <img src={val.icon} />
              {val.title === "Logout" ? (
                <button
                  className={classes.eachSubBarButton}
                  onClick={val.onClick}
                >
                  {val.title}
                </button>
              ) : (
                <NavLink to={val.link}>{val.title}</NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
