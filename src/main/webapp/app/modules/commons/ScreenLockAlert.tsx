import { Alert } from "../commons/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import { ScreenLock } from "../commons/ScreenLock";
import React from "react";

export const ScreenLockAlert = ({ open, onClose, message = "", lock = true, severity = "success" }) => {
  return (
    <>
      <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={severity} onClose={onClose}>
          <Typography>{message}</Typography>
        </Alert>
      </Snackbar>
      {open && lock && <ScreenLock />}
    </>
  );
};
