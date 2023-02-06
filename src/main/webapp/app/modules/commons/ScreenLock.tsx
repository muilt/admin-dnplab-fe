import { makeStyles } from "@material-ui/core";
import { Box } from "@mui/system";
import React from "react";
import { UseLockBodyScroll } from "./UseLockBodyScroll";

export const ScreenLock = () => {
  const classes = useStyles();
  UseLockBodyScroll();
  return <Box className={classes.root}></Box>;
};

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0)",
    zIndex: 1350,
  },
});
