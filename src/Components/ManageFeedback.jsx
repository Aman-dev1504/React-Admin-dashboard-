import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./ManageFeedback.css";
import Graph from "./HomeComponent/Graph";

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterOption, setFilterOption] = useState("default");

  useEffect(() => {
    const fetchFeedbacks = () => {
      const feedbackRef = ref(database, "Feedbacks");

      onValue(feedbackRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const feedbackList = Object.values(data).filter(
            (feedback) => feedback.isApproved
          );
          setFeedbacks(feedbackList);
        }
      });
    };

    fetchFeedbacks();
  }, []);

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const filterFeedbacks = () => {
    let filteredFeedbacks = [...feedbacks];

    switch (filterOption) {
      case "alphabetical":
        filteredFeedbacks.sort((a, b) =>
          a.studentName.localeCompare(b.studentName)
        );
        break;
      case "rating-high-low":
        filteredFeedbacks.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low-high":
        filteredFeedbacks.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return filteredFeedbacks;
  };

  const renderedFeedbacks = filterFeedbacks();

  return (
    <div>
      <h3 className="sub-heading">Manage Feedbacks</h3>
      <div className="chart-container">
        <Graph ratings={feedbacks} />
      </div>

      <div className="filter-container">
        <FormControl variant="outlined">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            label="Filter"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="alphabetical">Alphabetical Order</MenuItem>
            <MenuItem value="rating-high-low">Rating (High to Low)</MenuItem>
            <MenuItem value="rating-low-high">Rating (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="wrapTable">
        <TableContainer className="tableContainer">
          <Table className="table">
            <TableHead className="th">
              <TableRow>
                <TableCell>Feedback id</TableCell>
                <TableCell>studentId</TableCell>
                <TableCell>studentName</TableCell>
                <TableCell>feedback</TableCell>
                <TableCell>rating</TableCell>
                <TableCell>instructorName</TableCell>
                <TableCell>instructorId</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderedFeedbacks.map((feedback) => (
                <TableRow key={feedback.id} className="tr">
                  <TableCell className="tc">{feedback.id}</TableCell>
                  <TableCell className="tc">{feedback.studentId}</TableCell>
                  <TableCell className="tc">{feedback.studentName}</TableCell>
                  <TableCell className="tc">{feedback.feedback}</TableCell>
                  <TableCell className="tc">{feedback.rating}</TableCell>
                  <TableCell className="tc">
                    {feedback.instructorName}
                  </TableCell>
                  <TableCell className="tc">{feedback.instructorId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ManageFeedback;
