import {createContext, useState, useContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    
    const login =(token,userData)=>{
        localStorage.setItem("token", token);
        setIsLoggedin(true);
        localStorage.setItem("user",JSON.stringify(userData));
        setUser(userData);
    }
    const logout =()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedin(false);
        setUser(null)
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