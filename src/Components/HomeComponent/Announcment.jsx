import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { ref, push, onValue } from 'firebase/database';
import { database } from '../../firebaseConfig';
import { Add } from '@mui/icons-material';
import './Announcement.css';
const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    // Fetch announcements from Firebase Realtime Database
    const fetchAnnouncements = () => {
      const announcementRef = ref(database, 'Announcements');
      
      onValue(announcementRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const announcementList = Object.values(data);
  
          // Sort announcements by creation time in descending order
          const sortedAnnouncements = announcementList.sort(
            (a, b) => b.createdAt - a.createdAt
          );
  
          setAnnouncements(sortedAnnouncements);
        }
      });
    };

    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewAnnouncement({
        title: '',
      description: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAnnouncement((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveAnnouncement = () => {
    const announcementRef = ref(database, 'Announcements');
    push(announcementRef, {
      ...newAnnouncement,
      createdAt: new Date().getTime(),
    });

    handleCloseDialog();
  };

  return (
    <div className=' announcement-container'>
    <div className=' announcement-head'>
    <Typography variant="h4" component="h4" gutterBottom>  Announcements </Typography>
    <Button onClick={handleCreateAnnouncement}  variant="contained" color="primary">
      <Add />
    </Button>
    </div>
    <div className=' announcement-list'>
    {announcements.map((announcement,id) => (
      <Card  key={id} style={{ marginBottom: '10px' }} className='announcement-card'>
        <CardContent>
          <Typography variant="h6" component="h2">
            {announcement.title}
          </Typography>
          <Typography color="textSecondary">
            {announcement.createdAt}
          </Typography>
          <Typography variant="body2" component="p">
            {announcement.description}
          </Typography>
        </CardContent>
      </Card>
    ))}
    </div>

    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Create Announcement</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="topic"
          label="Topic"
          fullWidth
          value={newAnnouncement.topic}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={newAnnouncement.description}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSaveAnnouncement} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);
};

export default Announcement;
