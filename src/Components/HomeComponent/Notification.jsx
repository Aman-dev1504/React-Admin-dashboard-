import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { ref, push, onValue,set } from 'firebase/database';
import { database } from '../../firebaseConfig';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import './Notification.css';
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
  });

  useEffect(() => {
    // Fetch notifications from Firebase Realtime Database
    const fetchNotifications = () => {
      const notificationRef = ref(database, 'Notifications');
      
      onValue(notificationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notificationList = Object.values(data);
  
          // Sort notifications by creation time in descending order
          const sortedNotifications = notificationList.sort(
            (a, b) => b.createdAt - a.createdAt
          );
  
          setNotifications(sortedNotifications);
        }
      });
    };

    fetchNotifications();
  }, []);

  const handleCreateNotification = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewNotification({
      title: '',
      body: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewNotification((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveNotification = () => {
    const newNotificationId = push(ref(database, 'Notifications')).key;
  
    const notificationRef = ref(database, `Notifications/${newNotificationId}`);
    set(notificationRef, {
      ...newNotification,
      createdAt: new Date().getTime(),
      id: newNotificationId,
    });
  
    handleCloseDialog();
  };

  return (
    <div className=' notification-container'>
    <div className='notifi-head'>
        <Typography variant="h4" component="h4" gutterBottom> Notifications </Typography>
      <Button onClick={handleCreateNotification}  variant="contained" color="primary">
        <NotificationAddIcon />
      </Button>
      </div>
      <div className=' notification-list'>
      {notifications.map((notification,id ) => (
        <Card  key={id} style={{ marginBottom: '10px' }} className='notification-card'>
          <CardContent key={notification.id}>
            <Typography variant="h6" component="h2">
              {notification.title}
            </Typography>
            <Typography color="textSecondary">
              {notification.createdAt}
            </Typography>
            <Typography variant="body2" component="p">
              {notification.body}
            </Typography>
          </CardContent>
        </Card>
      ))}
        </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={newNotification.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="body"
            label="Content"
            fullWidth
            value={newNotification.body}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveNotification} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Notification;
