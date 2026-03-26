import React from 'react'
import { Navigate } from 'react-router-dom';

const LoginProtector = ({children}) => {
    const token = localStorage.getItem('userToken');
    const isLoggedIn = !!token && token !== 'null' && token !== 'undefined';

    if (isLoggedIn){
      return <Navigate to='/' replace /> 
    }
  
    return children;
}

export default LoginProtector;