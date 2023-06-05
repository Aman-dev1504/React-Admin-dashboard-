import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Auth/AuthContext';
import SignIn from './Pages/Signin';
import StudentDashboard from './Pages/StudentDashboard';
import TeacherDashboard from './Pages/TeacherDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import ErrorPage from './Pages/Error';

const App = () => {
  const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
    const { isAuthenticated, userRole } = React.useContext(AuthContext);

    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    if (roles && roles.length > 0 && !roles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component {...rest} />;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/student/*" element={<ProtectedRoute roles={['student']} component={StudentDashboard} />} />
          <Route path="/teacher/*" element={<ProtectedRoute roles={['teacher']} component={TeacherDashboard} />} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']} component={AdminDashboard} />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
