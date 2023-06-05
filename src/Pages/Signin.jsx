import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { db } from "../firebaseConfig";
import "./SignIn.css";
import fulllogo from "../Assets/fulllogo.png";
import { AccountCircle, Lock } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "../Auth/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isSignUp, setIsSignUp] = useState(false); // Track if it's a sign-up form
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      const q = query(collection(db, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password === password) {
          // Set the user role in the authentication context
          login(role);

          // Redirect to respective dashboards based on role
          switch (role) {
            case "student":
              navigate("/student");
              break;
            case "teacher":
              navigate("/teacher");
              break;
            case "admin":
              navigate("/admin");
              break;
            default:
              break;
          }
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

  const requestAccount = async (email, name, password, role) => {
    try {
      // Validate email parameter
      if (typeof email !== "string" || !email.trim()) {
        throw new Error("Invalid email value");
      }

      // Create a new document in the "accountRequests" collection
      await addDoc(collection(db, "accountRequests"), {
        email: email.trim(),
        name,
        password,
        role,
        timestamp: serverTimestamp(),
      });
      setSuccessMessage(
        "Account request submitted successfully. Please wait for the admin to approve"
      );
      // Account request saved successfully
    } catch (error) {
      console.error("Request user account error:", error);
      throw error;
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Toggle between sign-in and sign-up forms
  };

  return (
    <div className="container">
      <div className="logo">{/* Add your logo here */}</div>
      <div className="form">
        <img src={fulllogo} alt="Logo" />
        {isSignUp ? (
          <>
            <h2>Request Account</h2>
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
              label="Username"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: <AccountCircle />,
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
            <div>
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <Button
              variant="contained"
              onClick={() => requestAccount(email, name, password, role)}
            >
              Request Account
            </Button>

            {successMessage && (
              <p className="success-message">{successMessage}✅</p>
            )}
            <p>
              Already have an account?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Sign In
              </span>
            </p>
          </>
        ) : (
          <>
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
            <div>
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button variant="contained" onClick={handleSignIn}>
              Sign In
            </Button>
            {error && <p className="error-message">{error}</p>}
            <p>
              Don't have an account?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Request Account
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
