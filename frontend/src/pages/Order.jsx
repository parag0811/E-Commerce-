import { Suspense, useState } from "react";
import NavigationBar from "../components/navigation/NavigationBar";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Spinner from "../spinner/spinner";
import Orders from "../components/cartNorder/Order";

export default function OrdersPage() {
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
        <Orders />
      </Suspense>
      </main>
    </>
  );
}
