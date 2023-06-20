import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  IconButton, 
} from "@mui/material";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import MuiAlert from "@mui/material/Alert";
const ManageReviews = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    const fetchFeedbacks = () => {
      const feedbackRef = ref(database, "Feedbacks");
  
      onValue(feedbackRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const feedbackList = Object.values(data).filter((feedback) => !feedback.isApproved);
          setFeedbacks(feedbackList);
        }
      });
    };
  
    fetchFeedbacks();
  }, []);
  
  const handleApprove = (id) => {
    const feedback = feedbacks.find((feedback) => feedback.id === id);
    if (feedback) {
      const instructorId = feedback.instructorId;
      const instructorFeedbackRef = ref(database, `Instructors/${instructorId}/feedbacks/${id}`);
      set(instructorFeedbackRef, { ...feedback, isApproved: true })
        .then(() => {
          setSnackbarMessage("Approved successfully");
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setSnackbarMessage(`Error: ${error.message}`);
          setSnackbarOpen(true);
        });
    }
  };
  
  const handleDecline = (id) => {
    const feedback = feedbacks.find((feedback) => feedback.id === id);
    if (feedback) {
      const instructorId = feedback.instructorId;
      const instructorFeedbackRef = ref(database, `Instructors/${instructorId}/feedbacks/${id}`);
      set(instructorFeedbackRef, { ...feedback, isApproved: false })
        .then(() => {
          setSnackbarMessage("Declined successfully");
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setSnackbarMessage(`Error: ${error.message}`);
          setSnackbarOpen(true);
        });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div>
      <h3 className="sub-heading">Manage Reviews</h3>

      <div className="wrapTable">
        <TableContainer className="tableContainer">
          <Table className="table">
            <TableHead className="th">
              <TableRow>
                <TableCell>Feedback Id</TableCell>
                <TableCell>Student Id</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Instructor Id</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((feedbacks) => (
                <TableRow key={feedbacks.id} className="tr">
                  <TableCell className="tc">{feedbacks.id}</TableCell>
                  <TableCell className="tc">{feedbacks.studentId}</TableCell>
                  <TableCell className="tc">{feedbacks.studentName}</TableCell>
                  <TableCell className="tc">{feedbacks.feedback}</TableCell>
                  <TableCell className="tc">{feedbacks.rating}</TableCell>
                  <TableCell className="tc">{feedbacks.instructorId}</TableCell>
                  <TableCell className="tc">
                    <IconButton
                      onClick={() => handleApprove(feedbacks.id)}
                    >
                      <AssignmentTurnedInIcon className="editIcon" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDecline(feedbacks.id)}
                    >
                      <ThumbDownOffAltIcon className="deleteIcon" />
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
    </div>
  );
};

export default ManageReviews;
