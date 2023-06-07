import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./Auth/AuthContext";
import SignIn from "./Pages/Signin";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./Pages/Error";

const App = () => {
  const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, userRole } = React.useContext(AuthContext);
  
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
  
    if (userRole !== 'Admin') {
      return <Navigate to="/unauthorized" />;
    }
  
    return <Component {...rest} />;
  };
  

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard/*" element={<ProtectedRoute roles={['admin']} component={Dashboard} />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
