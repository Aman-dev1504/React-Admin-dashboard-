import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality
    navigate('/login'); // Redirect to the login page after logout
  };

  // Get the user role from your authentication system
  const userRole = 'student'; // Replace with the actual user role

  // Render specific components based on user role
  const renderStudentDashboard = () => {
    return (
      <>
        <Typography variant="h4" component="h2" align="center" sx={{ my: 4 }}>
          Student Dashboard
        </Typography>
        {/* Render components specific to the student role */}
        {/* e.g., Bookings, Calendar, Teacher List */}
        <Outlet />
      </>
    );
  };

  const renderTeacherDashboard = () => {
    return (
      <>
        <Typography variant="h4" component="h2" align="center" sx={{ my: 4 }}>
          Teacher Dashboard
        </Typography>
        {/* Render components specific to the teacher role */}
        {/* e.g., Manage Bookings, Availability, Statistics */}
        <Outlet />
      </>
    );
  };

  const renderAdminDashboard = () => {
    return (
      <>
        <Typography variant="h4" component="h2" align="center" sx={{ my: 4 }}>
          Admin Dashboard
        </Typography>
        {/* Render components specific to the admin role */}
        {/* e.g., Manage Users, Approve Bookings, Analytics */}
        <Outlet />
      </>
    );
  };

  // Render the dashboard based on the user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return renderStudentDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      {renderDashboard()}
      <Button variant="outlined" onClick={handleLogout} sx={{ mt: 4 }}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
