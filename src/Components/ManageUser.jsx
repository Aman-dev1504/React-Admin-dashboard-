import { useEffect, useState } from "react";
import { ref, onValue, update, remove, push, set } from "firebase/database";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { database } from "../firebaseConfig";
import "../Components/ManageUser.css";
import CloseIcon from "@mui/icons-material/Close";
import CreateForm from "../Components/createForm";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editedStudent, setEditedStudent] = useState(null);
  const [editedTeacher, setEditedTeacher] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditFormTeacher, setShowEditFormTeacher] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    const studentsRef = ref(database, "Students");
    const teachersRef = ref(database, "Instructors");
    const fetchStudents = () => {
      const unsubscribe = onValue(studentsRef, (snapshot) => {
        const studentsData = snapshot.val();
        if (studentsData) {
          const studentsArray = Object.entries(studentsData).map(
            ([key, value]) => ({
              id: key,
              ...value,
            })
          );
          setStudents(studentsArray);
        }
      });

      return () => {
        // Unsubscribe from Firebase listener when the component unmounts
        unsubscribe();
      };
    };

    const fetchTeachers = () => {
      const unsubscribe = onValue(teachersRef, (snapshot) => {
        const teachersData = snapshot.val();
        if (teachersData) {
          const teachersArray = Object.entries(teachersData).map(
            ([key, value]) => ({
              id: key,
              ...value,
            })
          );
          setTeachers(teachersArray);
        }
      });

      return () => {
        // Unsubscribe from Firebase listener when the component unmounts
        unsubscribe();
      };
    };

    fetchStudents();
    fetchTeachers();
  }, []);

  const handleEdit = (id, role) => {
    if (role === "Student") {
      const student = students.find((student) => student.id === id);
      setEditedStudent(student);
      setShowEditForm(true);
    } else if (role === "Teacher") {
      const teacher = teachers.find((teacher) => teacher.id === id);
      setEditedTeacher(teacher);
      setShowEditFormTeacher(true);
    }
  };

  const handleUpdate = () => {
    if (editedStudent && editedStudent.role === "Student") {
      const studentRef = ref(database, `Students/${editedStudent.id}`);
      update(studentRef, editedStudent)
        .then(() => {
          console.log("Student updated successfully");
        })
        .catch((error) => {
          console.error("Error updating student:", error);
        });
    } else if (editedTeacher) {
      const teacherRef = ref(database, `Instructors/${editedTeacher.id}`);
      update(teacherRef, editedTeacher)
        .then(() => {
          console.log("Teacher updated successfully");
          setSnackbarMessage("Teacher updated successfully");
          setSnackbarOpen(true);
          setShowEditFormTeacher(false);
        })
        .catch((error) => {
          console.error("Error updating teacher:", error);
        });
    } else {
      console.error("Invalid role or data");
    }
  };

  const handleDelete = (id, role) => {
    let databasePath = "";

    if (role === "Teacher") {
      databasePath = `Instructors/${id}`;
    } else if (role === "Student") {
      databasePath = `Students/${id}`;
    } else {
      console.error("Invalid role");
      return;
    }

    const userRef = ref(database, databasePath);

    remove(userRef)
      .then(() => {
        console.log(`${role} deleted successfully with ID: ${id}`);
      })
      .catch((error) => {
        console.error(`Error deleting ${role} with ID: ${id}`, error);
      });
  };

  const handlePasswordVisibilityToggle = (id, role) => {
    if (role === "Student") {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id
            ? { ...student, passwordVisible: !student.passwordVisible }
            : student
        )
      );
    } else if (role === "Teacher") {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === id
            ? { ...teacher, passwordVisible: !teacher.passwordVisible }
            : teacher
        )
      );
    }
  };
  const handleCreate = (newUser) => {
    const { role, ...userData } = newUser;

    const newUserId = push(
      ref(database, role === "Student" ? "Students" : "Instructors")
    ).key;
    const newUserRef = ref(
      database,
      `${role === "Student" ? "Students" : "Instructors"}/${newUserId}`
    );

    set(newUserRef, userData)
      .then(() => {
        console.log(`${role} created successfully`);
        setSnackbarMessage(`${role} created successfully`);
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(`Error creating ${role}:`, error);
        setSnackbarMessage(`Error creating ${role}`);
        setSnackbarOpen(true);
      });

    setIsCreateFormOpen(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCreateFormOpen = () => {
    setIsCreateFormOpen(true);
  };

  const handleCreateFormClose = () => {
    setIsCreateFormOpen(false);
  };
  return (
    <>
      {showEditForm && editedStudent && (
        <div className="edit-form">
          <div className="edit-form-content">
            <div className="headEdit">
              <h4>Edit Student</h4>
              <IconButton
                className="close-icon"
                onClick={() => setShowEditForm(false)}
              >
                <CloseIcon className="close-icon" />
              </IconButton>
            </div>

            <TextField
              label="Name"
              value={editedStudent.name}
              onChange={(e) =>
                setEditedStudent((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup
                aria-label="account-type"
                name="accountType"
                value={editedStudent.status}
                onChange={(e) =>
                  setEditedStudent((prevState) => ({
                    ...prevState,
                    status: e.target.value,
                  }))
                }
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Block"
                  control={<Radio />}
                  label="Block"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Contact Number"
              value={editedStudent.contactNo}
              onChange={(e) =>
                setEditedStudent((prevState) => ({
                  ...prevState,
                  contactNo: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="UserName"
              value={editedStudent.userName}
              onChange={(e) =>
                setEditedStudent((prevState) => ({
                  ...prevState,
                  userName: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              value={editedStudent.password}
              onChange={(e) =>
                setEditedStudent((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />

            {/* Update button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              className="Update-btn"
            >
              Update
            </Button>
          </div>
        </div>
      )}
      {showEditFormTeacher && editedTeacher && (
        <div className="edit-form">
          <div className="edit-form-content">
            <div className="headEdit">
              <h4>Edit Teacher</h4>
              <IconButton
                className="close-icon"
                onClick={() => setShowEditFormTeacher(false)}
              >
                <CloseIcon className="close-icon" />
              </IconButton>
            </div>

            {/* Teacher form fields */}
            {/* Modify the input fields based on your requirements */}
            <TextField
              label="Name"
              value={editedTeacher.name}
              onChange={(e) =>
                setEditedTeacher((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Number"
              value={editedTeacher.contactNo}
              onChange={(e) =>
                setEditedTeacher((prevState) => ({
                  ...prevState,
                  contactNo: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              value={editedTeacher.password}
              onChange={(e) =>
                setEditedTeacher((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Specialization"
              value={editedTeacher.specialization}
              onChange={(e) =>
                setEditedTeacher((prevState) => ({
                  ...prevState,
                  specialization: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              value={editedTeacher.address}
              onChange={(e) =>
                setEditedTeacher((prevState) => ({
                  ...prevState,
                  address: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Username"
              value={editedTeacher.username}
              onChange={(e) =>
                setEditedTeacher((prevState) => ({
                  ...prevState,
                  username: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup
                aria-label="account-type"
                name="accountType"
                value={editedTeacher.status}
                onChange={(e) =>
                  setEditedTeacher((prevState) => ({
                    ...prevState,
                    status: e.target.value,
                  }))
                }
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Block"
                  control={<Radio />}
                  label="Block"
                />
              </RadioGroup>
            </FormControl>
            <br />
            {/* Add other fields as needed */}

            {/* Update button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              className="Update-btn"
            >
              Update
            </Button>
          </div>
        </div>
      )}

      <h2 style={{ color: "#28282B" }}>Manage Users</h2>
      <div className="btn-box">
        <Button
          variant="contained"
          className="Update-btn"
          onClick={handleCreateFormOpen}
        >
          Create New User
        </Button>

        {isCreateFormOpen && (
          <CreateForm onCreate={handleCreate} onClose={handleCreateFormClose} />
        )}
      </div>
      <h3 className="sub-heading">Students</h3>

      <div className="wrapTable">
        <TableContainer className="tableContainer">
          <Table className="table">
            <TableHead className="th">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="tr">
                  <TableCell className="tc">{student.id}</TableCell>
                  <TableCell className="tc">{student.name}</TableCell>
                  <TableCell className="tc">{student.contactNo}</TableCell>
                  <TableCell className="tc">
                    {student.passwordVisible ? (
                      <input type="text" value={student.password} />
                    ) : (
                      <TextField
                        type="password"
                        value={student.password}
                        disabled
                      />
                    )}
                  </TableCell>
                  <TableCell className="tc">{student.status}</TableCell>
                  <TableCell className="tc">{student.userName}</TableCell>
                  <TableCell className="tc">
                    <IconButton
                      onClick={() => handleEdit(student.id, "Student")}
                    >
                      <EditIcon className="editIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(student.id, "Student")}
                    >
                      <DeleteIcon className="deleteIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handlePasswordVisibilityToggle(student.id, "Student")
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* teachers table */}
      <h3 className="sub-heading"> Teachers</h3>

      <div className="wrapTable">
        <TableContainer>
          <Table>
            <TableHead className="th">
              <TableRow>
                <TableCell className="tc">ID</TableCell>
                <TableCell className="tc">Name</TableCell>
                <TableCell className="tc">Contact Number</TableCell>
                <TableCell className="tc">Password</TableCell>
                <TableCell className="tc">Status</TableCell>
                <TableCell className="tc">Username</TableCell>
                <TableCell className="tc">Specialization</TableCell>
                <TableCell className="tc">Address</TableCell>
                <TableCell className="tc">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="tc">{teacher.id}</TableCell>
                  <TableCell className="tc">{teacher.name}</TableCell>
                  <TableCell className="tc">{teacher.contactNo}</TableCell>
                  <TableCell className="tc">
                    {teacher.passwordVisible ? (
                      <input type="text" value={teacher.password} />
                    ) : (
                      <TextField
                        type="password"
                        value={teacher.password}
                        disabled
                      />
                    )}
                  </TableCell>
                  <TableCell className="tc">{teacher.status}</TableCell>
                  <TableCell className="tc">{teacher.username}</TableCell>
                  <TableCell className="tc">
                    {" "}
                    {teacher.specialization}
                  </TableCell>
                  <TableCell className="tc">{teacher.address}</TableCell>
                  <TableCell className="tc">
                    <IconButton
                      onClick={() => handleEdit(teacher.id, "Teacher")}
                    >
                      <EditIcon className="editIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(teacher.id, "Teacher")}
                    >
                      <DeleteIcon className="deleteIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handlePasswordVisibilityToggle(teacher.id, "Teacher")
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ManageUsers;
