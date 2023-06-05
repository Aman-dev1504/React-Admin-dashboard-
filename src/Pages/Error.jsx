import React from "react";
import { useNavigate } from "react-router-dom";
import Error from '../Assets/Error.png';
import {  Button } from "@mui/material";
import "./Error.css";
const Error404 = () => {
  const navigate = useNavigate();

  // Redirect the user to the login page
  const redirectToLogin = () => {
    navigate("/"); // Update the path to the login page
  };

  return (
    <div className="container">
      <img src={Error} alt="Error" className="pageNotfoundImage"/>
      <h2 className="pageNotfound">Page not found</h2>
      <Button onClick={redirectToLogin} variant="contained">Go to Login</Button>
    </div>
  );
};

export default Error404;
