import { useState, useEffect } from "react";
import { ref, onValue, remove, set, push } from "firebase/database";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { database } from "../firebaseConfig";
import "../Components/RequestAccount.css";
import CreateForm from "../Components/createForm";
import ForgotPassword from "./ForgotPassword";

const RequestAccount = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  useEffect(() => {
    const requestsRef = ref(database, "Requests");

    const fetchRequests = () => {
      const unsubscribe = onValue(
        requestsRef,
        (snapshot) => {
          try {
            const requestsData = snapshot.val();
            if (requestsData) {
              const requestsArray = Object.entries(requestsData).map(
                ([key, value]) => ({
                  id: key,
                  ...value,
                })
              );
              setRequests(requestsArray);
            } else {
              console.log("Requests collection is empty");
            }
          } catch (error) {
            console.error("Error fetching requests:", error);
          }
        },
        (error) => {
          console.error("Firebase database error:", error);
        }
      );

      return () => {
        unsubscribe();
      };
    };

    fetchRequests();
  }, []);

  const handleDecline = (id) => {
    const requestsRef = ref(database, `Requests/${id}`);

    remove(requestsRef)
      .then(() => {
        console.log("Student deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const handleForgot = (request) => {
    setSelectedRequest(request);
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

  const handleForgotPasswordClose = () => {
    setSelectedRequest(null);
  };
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <h2 style={{ color: "#28282B" }}>Request Accounts</h2>
      <div className="wrapTable">
        <TableContainer className="tableContainer">
          <Table className="table">
            <TableHead className="th">
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Request</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="tc">{request.id}</TableCell>
                  <TableCell className="tc">{request.name}</TableCell>
                  <TableCell className="tc">{request.request}</TableCell>
                  <TableCell className="tc">{request.type}</TableCell>
                  <TableCell>
                    {request.request === "Request Account" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormOpen}
                        className="createBtn"
                      >
                        Create
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleForgot(request)}
                        className="createBtn"
                      >
                        Forgot Password
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDecline(request.id, "request")}
                    >
                      Decline
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {selectedRequest && (
        <ForgotPassword
          id={selectedRequest.id}
          name={selectedRequest.name}
          accountType={selectedRequest.type}
          onClose={handleForgotPasswordClose}
          onSnackbarOpen={handleSnackbarOpen}
        />
      )}
      {isCreateFormOpen && (
        <CreateForm onCreate={handleCreate} onClose={handleCreateFormClose} />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RequestAccount;
