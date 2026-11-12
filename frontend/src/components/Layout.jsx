import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'
import Slidebar from "./Slidebar";

const Layout = () => {
  const { isLoggedin } = useAuth();

  if (!isLoggedin) return <Navigate to="/login" replace />;

  return (
    <>
      <Slidebar />

      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen bg-slate-50/50">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
