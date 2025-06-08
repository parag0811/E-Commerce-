import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "../../components/navigation/NavigationBar";
import { useState } from "react";
import Sidebar from "../../components/navigation/Sidebar";
import ErrorPage from "../Error";

export default function AdminLayout() {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarIsVisible((prev) => !prev);
  };

  const { pathname } = useLocation();
  return (
    <>
      <NavigationBar path={pathname} onClickVisible={toggleSidebar} />
      {sidebarIsVisible && <Sidebar />}
      <main style={{ paddingTop: "80px" }}>
        {pathname === "/admin" ? <ErrorPage /> : null}
        <main>
          <Outlet />
        </main>
      </main>
    </>
  );
}
