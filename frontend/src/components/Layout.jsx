import { Outlet, useNavigate } from "react-router-dom";
import {useAuth} from '../context/AuthContext'
import Slidebar from "./Slidebar";
import { useEffect } from "react";

const Layout = () => {
    const {isLoggedin} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedin){
            navigate('/login');
        }
    })
    
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