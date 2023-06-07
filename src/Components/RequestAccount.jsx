import { useState, useEffect,useRef } from 'react';
import { ref, onValue, remove, set } from 'firebase/database';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';
import { database } from '../firebaseConfig';
import ForgotPassword from './ForgotPassword';
import '../Components/RequestAccount.css';
const RequestAccount = () => {
  const [requests, setRequests] = useState([]);
  const forgotPasswordRef = useRef(null);
  const [forgotId, setForgotId] = useState('');
  const [forgotName, setForgotName] = useState('');
  const [forgotAccountType, setForgotAccountType] = useState('');
  useEffect(() => {
    const requestsRef = ref(database, 'Requests');
  
    const fetchRequests = () => {
      const unsubscribe = onValue(requestsRef, (snapshot) => {
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
            // Handle case when "Requests" collection is empty
            console.log("Requests collection is empty");
          }
        } catch (error) {
          // Handle any error that occurs during data retrieval
          console.error("Error fetching requests:", error);
        }
      }, (error) => {
        // Handle any Firebase database error
        console.error("Firebase database error:", error);
      });
  
      return () => {
        // Unsubscribe from Firebase listener when the component unmounts
        unsubscribe();
      };
    };
  
    fetchRequests();
  }, []);
  

  const handleCreate = (id, type) => {
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    if (type === 'student') {
      // Add user to the Students collection
      const { name, requestType } = request;
      const studentData = {
        name,
        requestType,
        // Add any other properties specific to students
      };

      // Write the student data to the Students collection in Firebase
      set(ref(database, 'Students', id), studentData);
    } else if (type === 'instructor') {
      // Add user to the Instructors collection
      const { name, requestType } = request;
      const instructorData = {
        name,
        requestType,
        // Add any other properties specific to instructors
      };

      // Write the instructor data to the Instructors collection in Firebase
      set(ref(database, 'Instructors', id), instructorData);
    }

   
  };

  const handleDecline = (id) => {
    // Remove the request from the Requests collection in Firebase
    remove(ref(database, 'Requests', id));
  };
  const handleForgot = (id, name, type) => {
    setForgotId(id);
    setForgotName(name);
    setForgotAccountType(type);
    forgotPasswordRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <h2>Request Accounts</h2>
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
  {request.request === 'Request Account' ? (
    <Button
  variant="contained"
  color="primary"
  onClick={() => handleCreate(request.id, request.type)}
  className='createBtn'
>
  Create
</Button>
  ) : (
    <Button
  variant="contained"
  color="primary"
  onClick={() => handleForgot(request.id, request.name, request.type)}
  className='createBtn'
>
  Forgot Password
</Button>
  )}
 
  <Button
    variant="contained"
    color="error"
    onClick={() => handleDecline(request.id)}
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
      <div ref={forgotPasswordRef}>

      <ForgotPassword
          id={forgotId}
          name={forgotName}
          accountType={forgotAccountType}
        />
      </div>
      
    </>
  );
};

export default RequestAccount;
