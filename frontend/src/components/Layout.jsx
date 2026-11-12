import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

// Wraps every page that needs a login: shows the sidebar, and sends
// visitors who are not logged in to the login page.
const Layout = () => {
  const { isLoggedin } = useAuth();

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
