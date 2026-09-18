import axios from "axios";
import api from "./apiClient";

export const registerUser = async (userData) => {
    try{
        const response = await api.post("/auth/register", userData);
        return response.data;
    }catch(error){
        alert(error)
    }
    
};
export const loginUser = async (userData) => {
    try{
        const response = await api.post("/auth/login", userData);
        return response.data;
    }catch(error){
        alert(error)
    }
}