import {createContext, useState, useEffect, useContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));

    const login =(token)=>{
        localStorage.setItem("token", token);
        setIsLoggedin(true);
    }

    const logout =()=>{
        localStorage.removeItem("token");
        setIsLoggedin(false);
    }

    return (
        <AuthContext.Provider value={{isLoggedin, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () =>{
    return useContext(AuthContext);
}