import { makeStyles } from "@material-ui/core/styles"
import MuiAlert from "@material-ui/lab/Alert"
import React from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    "& .MuiAlert-standardSuccess": {
      backgroundColor: "#c8efe1",
      "& .MuiAlert-icon": {
        color: "#008000"
      }
    }
  },
}))

export const Alert = ({ severity, onClose, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MuiAlert severity={severity} onClose={onClose}>
        {children}
      </MuiAlert>
    </div>
  )
}
