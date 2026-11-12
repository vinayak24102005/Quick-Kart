import {createContext, useState, useContext} from "react";

// Keeps "who is logged in" in one place so every page can read it.
// The token and user are also saved in localStorage so a refresh keeps you logged in.
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
    // Used by the Settings page after the name is changed
    const updateUser =(userData)=>{
        localStorage.setItem("user",JSON.stringify(userData));
        setUser(userData);
    }

    return (
        <AuthContext.Provider value={{isLoggedin, user, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () =>{
    return useContext(AuthContext);
}
