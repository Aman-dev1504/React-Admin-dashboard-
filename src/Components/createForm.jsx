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
  FormLabel,
  Radio,
} from "@mui/material";

const CreateForm = ({ onCreate, onClose }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    email: "",
    userName: "",
    contactNo: "",
    status: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    password: false,
    email: false,
  });

  const handleSubmit = () => {
    const formErrors = {
      name: newUser.name === "",
      password: newUser.password.length !== 6 || newUser.password.length > 6 ,
      email: !validateEmail(newUser.email),
    };

    setErrors(formErrors);

    if (!Object.values(formErrors).some((error) => error)) {
      onCreate(newUser);
      onClose();
    }
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          value={newUser.name}
          onChange={(e) =>
            setNewUser((prevState) => ({
              ...prevState,
              name: e.target.value,
            }))
          }
          fullWidth
          margin="dense"
          error={errors.name}
          helperText={errors.name && "Name is required"}
        />
        <TextField
          name="contactNo"
          label="Contact Number"
          value={newUser.contactNo}
          onChange={(e) =>
            setNewUser((prevState) => ({
              ...prevState,
              contactNo: e.target.value,
            }))
          }
          fullWidth
          margin="dense"
        />
        <TextField
          name="email"
          label="Email"
          value={newUser.email}
          onChange={(e) =>
            setNewUser((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
          fullWidth
          margin="dense"
          error={errors.email}
          helperText={errors.email && "Invalid email"}
        />
        <TextField
          name="userName"
          label="Username"
          value={newUser.userName}
          onChange={(e) =>
            setNewUser((prevState) => ({
              ...prevState,
              userName: e.target.value,
            }))
          }
          fullWidth
          margin="dense"
        />
        <TextField
          name="password"
          label="Password"
          value={newUser.password}
          onChange={(e) =>
            setNewUser((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
          fullWidth
          margin="dense"
          type="password"
          error={errors.password}
          helperText={errors.password && "Password must be 6 characters long"}
        />
        <FormControl component="fieldset" margin="dense">
          <FormLabel component="legend">Status</FormLabel>
          <RadioGroup
            row
            aria-label="Status"
            name="status"
            value={newUser.status}
            onChange={(e) =>
              setNewUser((prevState) => ({
                ...prevState,
                status: e.target.value,
              }))
            }
          >
            <FormControlLabel value="Active" control={<Radio />} label="Active" />
            <FormControlLabel value="Blocked" control={<Radio />} label="Blocked" />
          </RadioGroup>
        </FormControl>
        <br />
        <FormControl component="fieldset" margin="dense">
          <FormLabel component="legend">Role</FormLabel>
          <RadioGroup
            row
            aria-label="Role"
            name="role"
            value={newUser.role}
            onChange={(e) =>
              setNewUser((prevState) => ({
                ...prevState,
                role: e.target.value,
              }))
            }
          >
            <FormControlLabel value="Teacher" control={<Radio />} label="Teacher" />
            <FormControlLabel value="Student" control={<Radio />} label="Student" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="success">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForm;
