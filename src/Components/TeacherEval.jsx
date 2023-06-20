import React, { useState, useEffect, useMemo } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import "./TeacherEval.css";

const EvaluationPage = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchEvaluations = () => {
      const evaluationsRef = ref(database, "Evaluations");
      onValue(evaluationsRef, (snapshot) => {
        const evaluationList = [];
        snapshot.forEach((childSnapshot) => {
          evaluationList.push(childSnapshot.val());
        });
        setEvaluations(evaluationList);
      });
    };

    const fetchStudents = () => {
      const studentsRef = ref(database, "Students");
      onValue(studentsRef, (snapshot) => {
        const studentList = [];
        snapshot.forEach((childSnapshot) => {
          studentList.push(childSnapshot.val().name);
        });
        setStudents(studentList);
      });
    };
    const fetchTeachers = () => {
      const teachersRef = ref(database, "Instructors");
      onValue(teachersRef, (snapshot) => {
        const teacherList = [];
        snapshot.forEach((childSnapshot) => {
          teacherList.push(childSnapshot.val().name);
        });
        setTeachers(teacherList);
      });
    };
  
    fetchEvaluations();
    fetchStudents();
    fetchTeachers();
  }, []);

  useEffect(() => {
    // Apply filters to evaluations
    let filteredData = evaluations;

    if (studentFilter) {
      filteredData = filteredData.filter(
        (evaluation) => evaluation.student === studentFilter
      );
    }

    if (teacherFilter) {
      filteredData = filteredData.filter(
        (evaluation) => evaluation.teacher === teacherFilter
      );
    }

    setFilteredEvaluations(filteredData);
  }, [evaluations, studentFilter, teacherFilter]);

  const sortedFilteredEvaluations = useMemo(() => {
    if (ratingFilter === "low") {
      return [...filteredEvaluations].sort((a, b) => a.rating - b.rating);
    } else if (ratingFilter === "high") {
      return [...filteredEvaluations].sort((a, b) => b.rating - a.rating);
    }
    return filteredEvaluations;
  }, [filteredEvaluations, ratingFilter]);

  const handleStudentFilterChange = (event) => {
    setStudentFilter(event.target.value);
  };

  const handleTeacherFilterChange = (event) => {
    setTeacherFilter(event.target.value);
  };

  const handleRatingFilterChange = (event) => {
    const value = event.target.value;
    if (value === "low" || value === "high") {
      setRatingFilter(value);
    } else {
      setRatingFilter("");
    }
  };

  return (
    <div className="evaluation-page">
      <h2>Teacher Evaluation</h2>
      <div className="dashboard">
        <div className="filter">
          <div className="filter-div">
            <label htmlFor="student-filter">Filter By Student:</label>
            <Select
              id="student-filter"
              value={studentFilter || "all"}
              onChange={handleStudentFilterChange}
              className="select-input"
            >
              <MenuItem value="all">All</MenuItem>
              {students.map((student, index) => (
                <MenuItem key={index} value={student}>
                  {student}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="filter-div">
            <label htmlFor="student-filter">Filter By Teacher:</label>
            <Select
              id="teacher-filter"
              value={teacherFilter || "all"}
              onChange={handleTeacherFilterChange}
              className="select-input"
            >
              <MenuItem value="all">All</MenuItem>
              {teachers.map((teacher, index) => (
                <MenuItem key={index} value={teacher}>
                  {teacher}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="filter-div">
            <label htmlFor="student-filter">Filter By Rating:</label>
            <Select
              id="rating-filter"
              value={ratingFilter || "all"}
              onChange={handleRatingFilterChange}
              className="select-input"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </div>
        </div>

        <TableContainer className="tableContainer">
          <Table className="table">
            <TableHead className="th">
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Teacher Ratings</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Session Outcomes</TableCell>
                <TableCell>Teaching Effectiveness</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFilteredEvaluations.map((evaluation, index) => (
                <TableRow key={index} className="tr">
                  <TableCell className="tc">{evaluation.student}</TableCell>
                  <TableCell className="tc">{evaluation.teacher}</TableCell>
                  <TableCell className="tc">{evaluation.rating}</TableCell>
                  <TableCell className="tc">{evaluation.feedback}</TableCell>
                  <TableCell className="tc">
                    {evaluation.sessionOutcomes}
                  </TableCell>
                  <TableCell className="tc">
                    {evaluation.teachingEffectiveness}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>
        <h2>Areas for Improvement</h2>
        <div className="EvalText">
          {filteredEvaluations.map((evaluation, index) => (
            <ul key={index}>
              <li>{evaluation.areasforImprovement}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
