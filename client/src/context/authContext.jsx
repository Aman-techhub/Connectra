import axios from "axios";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{

    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:6001/auth';


    const login = async (inputs) =>{
        try{
            const res = await axios.post(`${API_BASE_URL}/login`, inputs);
            localStorage.setItem('userToken', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            localStorage.setItem('userName', res.data.user.username);
            localStorage.setItem('userEmail', res.data.user.email);
            navigate('/');
            return res.data;
        }catch(err){
            const message = err?.response?.data?.msg || err?.response?.data?.error || 'Login failed';
            throw new Error(message);
        }
    }



    const register = async (inputs) =>{
        try{
            const res = await axios.post(`${API_BASE_URL}/register`, inputs);
            localStorage.setItem('userToken', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            localStorage.setItem('userName', res.data.user.username);
            localStorage.setItem('userEmail', res.data.user.email);
            navigate('/');
            return res.data;
        }catch(err){
            const message = err?.response?.data?.msg || err?.response?.data?.error || 'Registration failed';
            throw new Error(message);
        }
    }




    const logout = async () =>{
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/');
    }


    

    return(
        <AuthContext.Provider value={{login, register, logout}}>{children}</AuthContext.Provider>
    )


}