import { Outlet } from "react-router-dom";
import Slidebar from "./Slidebar";

const Layout = () => {
  return (
    <>
      <Slidebar />

      <main className="ml-64">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;