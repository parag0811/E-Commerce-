import { Suspense, useState } from "react";
import NavigationBar from "../components/navigation/NavigationBar";
import { Await, useLoaderData, useLocation } from "react-router-dom";
import Checkout from "../components/cartNorder/Checkout";
import Sidebar from "../components/navigation/Sidebar";
import Spinner from "../spinner/spinner";

export default function CheckoutPage() {
  const data = useLoaderData();
  const orderData = data?.orderData || [];

  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);

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
        <Await resolve={orderData}>
          {(loadedOrderData) => <Checkout orderData={loadedOrderData} />}
        </Await>
      </Suspense>
      </main>
    </>
  );
}

export async function checkoutLoader() {
  const response = await fetch(`http://localhost:5050/checkout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Checkout Failed.");
    error.status = response.status || 500;
    throw error;
  }

  return data;
}

export async function loader() {
  return {
    orderData: await checkoutLoader(),
  };
}
