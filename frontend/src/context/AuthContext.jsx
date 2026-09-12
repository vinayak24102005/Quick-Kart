import {createContext, useState, useEffect, useContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [isLoggedin, setIsLoggedin] = useState(false);
    
    const login =()=>{
        setIsLoggedin(true);
    }

    const logout =()=>{
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