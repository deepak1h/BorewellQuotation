// src/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust the import path as needed

const PrivateRoute = ({ children }) => {
  const { currentUser, loading, setLoading} = useAuth();

  console.log("lol", currentUser, loading)
  if(loading){
    console.log("loading")
    return <div>Loading....</div>
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  console.log(children);

  return children;
};

export default PrivateRoute;
