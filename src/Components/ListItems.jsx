import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GradeIcon from '@mui/icons-material/Grade';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
const MainListItems = ({ setSelectedComponent }) => {
  const handleItemClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div>
      <ListItem button onClick={() => handleItemClick('home')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Home' />
      </ListItem>

      <ListItem button onClick={() => handleItemClick('ManageUser')}>
        <ListItemIcon>
          <PeopleAltIcon />
        </ListItemIcon>
        <ListItemText primary='Manage Users' />
      </ListItem>


      <ListItem button onClick={() => handleItemClick('RequestAccount')}>
        <ListItemIcon>
          <EditCalendarIcon />
        </ListItemIcon>
        <ListItemText primary='Requested Accounts' />
      </ListItem>

      <ListItem button onClick={() => handleItemClick('manage-feedback')}>
        <ListItemIcon>
          <FeedbackIcon />
        </ListItemIcon>
        <ListItemText primary='Manage Feedback' />
      </ListItem>

      <ListItem button onClick={() => handleItemClick('teachers-evaluation')}>
        <ListItemIcon>
          <EngineeringIcon />
        </ListItemIcon>
        <ListItemText primary='Teacher Evaluation' />
      </ListItem>

      <ListItem button onClick={() => handleItemClick('Manage-appointment')}>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary='Manage Appointment' />
      </ListItem>

      <ListItem button onClick={() => handleItemClick('Manage-reviews')}>
        <ListItemIcon>
          <GradeIcon />
        </ListItemIcon>
        <ListItemText primary='Manage Reviews' />
      </ListItem>
    </div>
  );
};

export default MainListItems;
