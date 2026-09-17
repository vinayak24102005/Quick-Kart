import {createContext, useState, useEffect, useContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const login =()=>{
        setIsLoggedin(true);
        setToken(token);
        setUser(user);
    }

    const logout =()=>{
        setIsLoggedin(false);
        setToken(null);
        setUser(null);
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