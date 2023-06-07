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
const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editedStudent, setEditedStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
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
    const student = students.find((student) => student.id === id);

    // Set the edited student and toggle show edit form
    setEditedStudent(student);
    setShowEditForm(true);
    //editRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdate = () => {
    const studentRef = ref(database, `Students/${editedStudent.id}`);

    update(studentRef, {
      name: editedStudent.name,
      status: editedStudent.status,
      contactNo: editedStudent.contactNo,
      userName: editedStudent.userName,
      password: editedStudent.password,

      // Update other fields here
    })
      .then(() => {
        // Update successful
        console.log("Student updated successfully");
        // Close the edit form
        setShowEditForm(false);
      })
      .catch((error) => {
        // Error occurred during update
        console.error("Error updating student:", error);
        // Handle the error as needed (e.g., display an error message)
      });
    setEditedStudent(null);
  };
  const handleDelete = (id, role) => {
    const studentRef = ref(database, `Students/${id}`);

    remove(studentRef)
      .then(() => {
        // Deletion successful
        console.log("Student deleted successfully");
      })
      .catch((error) => {
        // Error occurred during deletion
        console.error("Error deleting student:", error);
        // Handle the error as needed (e.g., display an error message)
      });
  };
  const handlePasswordVisibilityToggle = (id, role) => {
    if (role === "student") {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id
            ? { ...student, passwordVisible: !student.passwordVisible }
            : student
        )
      );
    } else if (role === "teacher") {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === id
            ? { ...teacher, passwordVisible: !teacher.passwordVisible }
            : teacher
        )
      );
    }
  };
  const handleCreate = (newStudent) => {
    const newStudentId = push(ref(database, "Students")).key;
    const newStudentRef = ref(database, `Students/${newStudentId}`);

    set(newStudentRef, newStudent)
      .then(() => {
        console.log("Student created successfully");
      })
      .catch((error) => {
        console.error("Error creating student:", error);
      });
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

            {/* Display the form fields and allow editing */}
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

      <h2 style={{ color: "#28282B" }}>Manage Users</h2>
      <div className="btn-box">
      <Button variant="contained" className="Update-btn" onClick={handleCreateFormOpen}>
          Create New Student
        </Button>
      {/* </div> */}

      {/* Render the CreateForm component if isCreateFormOpen is true */}
      {isCreateFormOpen && (
        <CreateForm onCreate={handleCreate} onClose={handleCreateFormClose} />
      )}
      
      </div>
      {/* <Button
        variant="variant"
        color="primary"
        onClick={handleCreate}
        className="Update-btn"
      >
        Create New User
      </Button>
       */}

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
                      onClick={() => handleEdit(student.id, "student")}
                    >
                      <EditIcon className="editIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(student.id, "student")}
                    >
                      <DeleteIcon className="deleteIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handlePasswordVisibilityToggle(student.id, "student")
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

      <h3 className="sub-heading"> Teachers</h3>
      <Button variant="contained" className="Update-btn" onClick={handleCreateFormOpen}>
          Create New Teacher
        </Button>
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
                      onClick={() => handleEdit(teacher.id, "teacher")}
                    >
                      <EditIcon className="editIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(teacher.id, "teacher")}
                    >
                      <DeleteIcon className="deleteIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handlePasswordVisibilityToggle(teacher.id, "teacher")
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
    </>
  );
};

export default ManageUsers;
