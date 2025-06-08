import NavigationBar from "../components/navigation/NavigationBar";
import { Outlet, useLocation } from "react-router-dom";
import Front from "../components/frontpage/Front";
import Sidebar from "../components/navigation/Sidebar";
import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import classes from "./Root.module.css";

function RootLayout() {
  const { scrollY } = useScroll();
  const yBgImg = useTransform(scrollY, [0, 200, 400, 600], [0, -30, -60, -90]);

  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const [makeWhite, setMakeWhite] = useState(false);

  const toggleSidebar = () => setSidebarIsVisible((prev) => !prev);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setMakeWhite(latest > 800);
  });

  const location = useLocation();
  const path = location.pathname;

  return (
    <div className={classes.rootContainer}>
      <motion.div className={classes.background} style={{ y: yBgImg }} />
      <div className={classes.contentWrapper}>
        <NavigationBar
          path={path}
          onClickVisible={toggleSidebar}
          isWhite={makeWhite}
        />
        {sidebarIsVisible && <Sidebar isWhite={makeWhite} />}
        <Front />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
