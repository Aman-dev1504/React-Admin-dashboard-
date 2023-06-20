import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { makeStyles } from "@mui/styles";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import "./ManageAppoinment.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { database } from "../firebaseConfig";
import { ref, onValue, push } from "firebase/database";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(4),
  },
  table: {
    minWidth: 650,
    border: "1px solid #32324a",
    color: "#000 !important",
  },

  sectionTitle: {
    margin: theme.spacing(3, 0),
  },
  appointmentItem: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.spacing(1),
  },
}));

const ManageAppointment = () => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    startTime: "",
    endTime: "",
    studentName: "",
    teacherName: "",
    description: "",
  });

  useEffect(() => {
    const fetchAppointments = () => {
      const appointmentsRef = ref(database, "Appointment");

      onValue(appointmentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const appointmentList = Object.values(data);
          setAppointments(appointmentList);
        }
      });
    };

    const fetchStudents = () => {
      const studentsRef = ref(database, "Students");

      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const studentList = Object.values(data);
          setStudents(studentList);
        }
      });
    };

    const fetchInstructors = () => {
      const instructorsRef = ref(database, "Instructors");

      onValue(instructorsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const instructorList = Object.values(data);
          setInstructors(instructorList);
        }
      });
    };

    fetchAppointments();
    fetchStudents();
    fetchInstructors();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewAppointment({
      date: "",
      startTime: "",
      endTime: "",
      studentName: "",
      teacherName: "",
      description: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAppointment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveAppointment = () => {
    const appointmentRef = ref(database, "Appointment");
    push(appointmentRef, {
      ...newAppointment,
      createdAt: new Date().getTime(),
    });

    handleCloseDialog();
  };

  const handleEventMouseEnter = (info) => {
    const tooltip = document.createElement("div");
    tooltip.className = "appointment-tooltip";
    tooltip.innerHTML = info.event.title;
    info.el.appendChild(tooltip);
  };

  const handleEventMouseLeave = () => {
    const tooltip = document.querySelector(".appointment-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  };

  const renderAppointmentTable = (filteredAppointments) => {
    return (
      <TableContainer
        component={Table}
        className={classes.tableContainer}
        sx={{ border: "1px solid #d3d3d3" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#000" }}>Date</TableCell>
              <TableCell sx={{ color: "#000" }}>Start Time</TableCell>
              <TableCell sx={{ color: "#000" }}>End Time</TableCell>
              <TableCell sx={{ color: "#000" }}>Student Name</TableCell>
              <TableCell sx={{ color: "#000" }}>Teacher Name</TableCell>
              <TableCell sx={{ color: "#000" }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment,id) => (
              <TableRow
                key={id}
                className={classes.appointmentItem}
              >
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.startTime}</TableCell>
                <TableCell>{appointment.endTime}</TableCell>
                <TableCell>{appointment.studentName}</TableCell>
                <TableCell>{appointment.teacherName}</TableCell>
                <TableCell>{appointment.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const filterAppointmentsByDate = (status) => {
    const currentDate = new Date();
    let filteredAppointments = [];

    if (status === "history") {
      filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate < currentDate;
      });
    } else if (status === "upcoming") {
      filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= currentDate;
      });
    } else if (status === "done") {
      filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate < currentDate &&
          appointment.endTime < currentDate.toLocaleTimeString()
        );
      });
    }

    return filteredAppointments;
  };

  return (
    <div>
      <div className="Add-Btn">
        <Button onClick={handleOpenDialog} variant="contained" color="primary">
          Add Appointment
          <EditCalendarIcon />
        </Button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={appointments.map((appointment) => ({
          title: appointment.description,
          start: appointment.date + "T" + appointment.startTime,
          end: appointment.date + "T" + appointment.endTime,
          extendedProps: {
            studentName: appointment.studentName,
            teacherName: appointment.teacherName,
            description: appointment.description,
          },
        }))}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Appointment</DialogTitle>
        <DialogContent>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={newAppointment.date}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="startTime"
            label="Start Time"
            type="time"
            value={newAppointment.startTime}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="endTime"
            label="End Time"
            type="time"
            value={newAppointment.endTime}
            onChange={handleInputChange}
            fullWidth
          />
          <Select
            name="studentName"
            value={newAppointment.studentName}
            onChange={handleInputChange}
            fullWidth
          >
            <MenuItem value="">Select Student</MenuItem>
            {students.map((student) => (
              <MenuItem key={student.id} value={student.name}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            name="teacherName"
            value={newAppointment.teacherName}
            onChange={handleInputChange}
            fullWidth
          >
            <MenuItem value="">Select Teacher</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.name}>
                {instructor.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            name="description"
            label="Description"
            value={newAppointment.description}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAppointment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <h2 className={classes.sectionTitle}>Appointment History</h2>
        {renderAppointmentTable(filterAppointmentsByDate("history"))}
      </div>

      <div>
        <h2 className={classes.sectionTitle}>Upcoming Appointments</h2>
        {renderAppointmentTable(filterAppointmentsByDate("upcoming"))}
      </div>

      <div>
        <h2 className={classes.sectionTitle}>Completed Appointments</h2>
        {renderAppointmentTable(filterAppointmentsByDate("done"))}
      </div>
    </div>
  );
};

export default ManageAppointment;
