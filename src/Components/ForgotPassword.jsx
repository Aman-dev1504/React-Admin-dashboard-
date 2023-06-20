import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { database } from "../firebaseConfig";
import { ref, set, get } from "firebase/database";

const ForgotPassword = ({ id, name, accountType, onClose, onSnackbarOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(accountType);

  useEffect(() => {
    setEmail(""); // Reset email field when the component is re-opened
  }, [accountType]);

  const handleForgotPassword = () => {
    if (password !== confirmPassword) {
      onSnackbarOpen("Password and Confirm Password do not match", "error");
      return;
    }

    const userRef =
      selectedAccountType === "Teacher"
        ? ref(database, `Instructors/${id}`)
        : ref(database, `Students/${id}`);

    get(userRef)
      .then((snapshot) => {
        const userData = snapshot.val();

        if (
          !userData ||
          userData.name !== name ||
          userData.accountType !== accountType
        ) {
          onSnackbarOpen("Invalid name or account type", "error");
          return;
        }

        set(userRef, { password })
          .then(() => {
            onSnackbarOpen("Password updated successfully", "success");
            onClose(); // Close the dialog after password update
          })
          .catch((error) => {
            onSnackbarOpen("Failed to update password", "error");
          });
      })
      .catch((error) => {
        onSnackbarOpen("Failed to fetch user data", "error");
      });
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle style={{ color: "#28282B" }}>Forgot Password</DialogTitle>
      <DialogContent>
        <TextField label="ID" value={id} fullWidth margin="normal" disabled />

        <TextField
          label="Name"
          value={name}
          fullWidth
          margin="normal"
          disabled
        />

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Account Type</FormLabel>
          <RadioGroup
            aria-label="account-type"
            name="accountType"
            value={selectedAccountType}
            onChange={(e) => setSelectedAccountType(e.target.value)}
          >
            <FormControlLabel
              value="teacher"
              control={<Radio />}
              label="Teacher"
            />
            <FormControlLabel
              value="student"
              control={<Radio />}
              label="Student"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleForgotPassword}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
