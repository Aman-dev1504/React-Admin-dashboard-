import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { db } from "../firebaseConfig";
import "./SignIn.css";
import fulllogo from "../Assets/fulllogo.png";
import EmailIcon from "@mui/icons-material/Email";
import { collection,  query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../Auth/AuthContext";
import Lock from "@mui/icons-material/Lock";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isAuthenticated } = React.useContext(AuthContext);
  const handleSignIn = async () => {
    try {
      const q = query(collection(db, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password === password) {
          login(userData.role, userData.name); 
          navigate("/dashboard");
        } else {
          setError("Incorrect password");
        }
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError("Sign in error");
      console.log("Sign in error:", error);
    }
  };

 
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="container">
      <div className="logo">{/* Add your logo here */}</div>
      <div className="form">
        <img src={fulllogo} alt="Logo" />
        <h2>Sign In</h2>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <EmailIcon />,
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <Lock />,
          }}
        />
        <Button variant="contained" onClick={handleSignIn}>
          Sign In
        </Button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
