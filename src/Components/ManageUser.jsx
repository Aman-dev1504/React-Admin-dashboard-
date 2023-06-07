import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { database } from "../firebaseConfig";
import "../Components/ManageUser.css";
const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

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
    // Handle edit functionality based on the user role (student or teacher)
    if (role === "student") {
      // Implement edit logic for students
      console.log(`Edit student with ID: ${id}`);
    } else if (role === "teacher") {
      // Implement edit logic for teachers
      console.log(`Edit teacher with ID: ${id}`);
    }
  };

  const handleDelete = (id, role) => {
    // Handle delete functionality based on the user role (student or teacher)
    if (role === "student") {
      // Implement delete logic for students
      console.log(`Delete student with ID: ${id}`);
    } else if (role === "teacher") {
      // Implement delete logic for teachers
      console.log(`Delete teacher with ID: ${id}`);
    }
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
  return (
    <>
      <h2 className="main-heading">Manage Users</h2>
     
      <h3 className="sub-heading">Students</h3>
      <div className="wrapTable">
        <TableContainer className="tableContainer">
          <Table className="table">
            <TableHead className="th">
              <TableRow >
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
                      <EditIcon className="editIcon"/>
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(teacher.id, "teacher")}
                    >
                      <DeleteIcon className="deleteIcon"/>
                    </IconButton>
                    <IconButton onClick={() =>
                        handlePasswordVisibilityToggle(teacher.id, "teacher")
                      }>
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
