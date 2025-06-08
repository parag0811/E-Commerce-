import { Suspense, useState } from "react";
import Cart from "../components/cartNorder/Cart.jsx";
import NavigationBar from "../components/navigation/NavigationBar";
import { Await, useLoaderData, useLocation } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Spinner from "../spinner/spinner.jsx";

export default function CartPage() {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const data = useLoaderData();

  const toggleSidebar = () => {
    setSidebarIsVisible((prev) => !prev);
  };

  const location = useLocation();
  const path = window.location.pathname;

  return (
    <>
      <NavigationBar path={path} onClickVisible={toggleSidebar} />
      {sidebarIsVisible && <Sidebar />}
      <main style={{ paddingTop: "80px" }}>
      <Suspense fallback={<Spinner />}>
        <Await resolve={data.cartData}>
          {(loadedCartData) => (
            <Cart
              cart={loadedCartData.cart}
              cartTotalPrice={loadedCartData.cartTotalPrice}
            />
          )}
        </Await>
      </Suspense>
      </main>
    </>
  );
}

async function loadCart() {
  const response = await fetch("http://localhost:5050/cart", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || "Could not fetch cart.");
    error.status = response.status || 500;
    throw error;
  }

  return resData;
}

export async function loader() {
  return {
    cartData: loadCart(),
  };
}
