import React from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';


export default function SignOut() {
  const {  logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="contained" color="error" sx={{ borderColor: '#fff', color: '#fff', margin: 1 }}>
      Logout
    </Button>
  )
}
