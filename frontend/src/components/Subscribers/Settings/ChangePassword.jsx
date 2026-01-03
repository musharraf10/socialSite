import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePasswordAPI } from "../../../APIServices/users/usersAPI"; // Import API function
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //! Use Mutation for changing password
  const mutation = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      setPasswordError(error.response?.data?.message || "Failed to update password.");
    },
  });

  //! Handle Save Password
  const handleSavePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");
    
    // Call mutation function
    mutation.mutate({ oldPassword, newPassword });
  };

  return (
    <>
      <Card>
        <Box sx={{ mb: 1 }}>
          <Typography level="title-md">Privacy & Security</Typography>
          <Typography level="body-sm">
            Update your password to keep your account secure.
          </Typography>
        </Box>
        <Divider />
        <Stack spacing={2} sx={{ mt: 2 }}>
          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <Input
              size="sm"
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              size="sm"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              size="sm"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          {passwordError && <Typography color="danger">{passwordError}</Typography>}
        </Stack>
        <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
            <Button size="sm" variant="outlined" color="neutral">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSavePassword} disabled={mutation.isLoading}>
              {mutation.isLoading ? "Saving..." : "Save"}
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </>
  );
}

// original