import styles from "./SideBar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Footer />
    </div>
  );
}
