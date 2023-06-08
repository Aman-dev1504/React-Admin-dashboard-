import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const CreateForm = ({ onCreate, onClose }) => {
  const [newStudent, setNewStudent] = useState({
    name: "",
    password: "",
    userName: "",
    contactNo: "",
    status: "",
    // Add other properties as needed
  });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewStudent((prevStudent) => ({
//       ...prevStudent,
//       [name]: value,
//     }));
//   };

//   const handleStatusChange = (e) => {
//     setNewStudent((prevStudent) => ({
//       ...prevStudent,
//       status: e.target.value,
//     }));
//   };

  const handleSubmit = () => {
    onCreate(newStudent);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Create Student</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
          fullWidth
          margin="dense"
        />
        <TextField
          name="Contactno"
          label="Contact Number"
          value={newStudent.contactNo}
          onChange={(e) =>
            setNewStudent((prevState) => ({
                  ...prevState,
                  contactNo: e.target.value,
                }))
              }
          fullWidth
          margin="dense"
        />
        <TextField
          name="Username"
          label="Username"
          value={newStudent.userName}
          onChange={(e) =>
            setNewStudent((prevState) => ({
                  ...prevState,
                  userName: e.target.value,
                }))
              }
          fullWidth
          margin="dense"
        />
         <TextField
          name="Password"
          label="Password"
          value={newStudent.password}
          onChange={(e) =>
            setNewStudent((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
          fullWidth
          margin="dense"
        />
         <FormControl component="fieldset" margin="dense">
          <RadioGroup
            name="status"
            value={newStudent.status}
            onChange={(e) =>
                setNewStudent((prevState) => ({
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
              value="Blocked"
              control={<Radio />}
              label="Blocked"
            />
          </RadioGroup>
        </FormControl>
        {/* Add other fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained"
              color="success">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForm;
