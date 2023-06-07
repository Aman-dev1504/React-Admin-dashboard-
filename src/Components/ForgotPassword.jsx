import { useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { database } from "../firebaseConfig";
import { ref,  set } from "firebase/database";

const ForgotPassword= ({ id, name, accountType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(accountType);

  const handleForgotPassword = () => {
    if (password !== confirmPassword) {
      console.log("Password and Confirm Password do not match");
      return;
    }

    const updateUserPassword = () => {
      const userRef =
        selectedAccountType === "teacher"
          ? ref(database, `Instructors/${id}`)
          : ref(database, `Students/${id}`);

      set(userRef, { password });
      console.log("Password updated successfully");
    };

    updateUserPassword();
  };

  return (
    <>
      <h3>Forgot Password</h3>

      <TextField
        label="ID"
        value={id}
        fullWidth
        margin="normal"
        disabled
      />

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

      <Button
        variant="contained"
        color="primary"
        onClick={handleForgotPassword}
        className="button-pass"
      >
        Change Password
      </Button>
    </>
  );
};

export default ForgotPassword;
