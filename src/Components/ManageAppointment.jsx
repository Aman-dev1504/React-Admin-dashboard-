import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import "./ManageAppoinment.css";
import { database } from "../firebaseConfig";
import { ref, onValue, push } from "firebase/database";

const ManageAppointment = () => {
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
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventMouseEnter = (info) => {
    setSelectedEvent(info.event);
  };

  const handleEventMouseLeave = () => {
    setSelectedEvent(null);
  };
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

  return (
    <div>
      <Button onClick={handleOpenDialog} variant="contained" color="primary" className="">
        Add Appointment <EditCalendarIcon />
      </Button>
      <div>
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
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          views={{
            dayGridMonth: {
              buttonText: "Month",
            },
            timeGridWeek: {
              buttonText: "Week",
            },
            timeGridDay: {
              buttonText: "Day",
            },
          }}
        />
        {selectedEvent && (
          <div className="Event-popup" onMouseLeave={handleEventMouseLeave}>
            <CloseIcon
              onClick={handleEventMouseLeave}
              style={{ cursor: "pointer" }}
            />
            <h4>Title: {selectedEvent.title}</h4>
            <p>Start Time: {selectedEvent.start.toLocaleString()}</p>
            <p>End Time: {selectedEvent.end.toLocaleString()}</p>
            <p>Student: {selectedEvent.extendedProps.studentName}</p>
            <p>Teacher: {selectedEvent.extendedProps.teacherName}</p>
            <p>Description:{selectedEvent.extendedProps.description}</p>
          </div>
        )}
      </div>
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
            <MenuItem value="Select Student">Select Student</MenuItem>
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
            <MenuItem value="Select Teacher">Select Teacher</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.name}>
                {instructor.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            value={newAppointment.description}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveAppointment}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAppointment;
