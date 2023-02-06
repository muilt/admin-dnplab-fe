import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

const ButtonComponent = (props) => {
  const classes = useStyles();

  const handleClick = React.useCallback(
    (e) => {
      if (e.detail === 1) {
        props.handleClick(e);
      }
    },
    [props]
  );

  return (
    <Box className="button-component">
      <Button
        className={`button-name ${props.disable && "button-disabled"}`}
        onClick={handleClick}
        disabled={props.disable}
      >
        <div className={`${props.limitEntry ? classes.button : ""} fs-14-text`}>
          <span className={`${classes.textButton} fs-14-text`}>{props.name}</span>
          {props.limitEntry && <span className="fs-14-text">{props.limitEntry}</span>}
        </div>
      </Button>
    </Box>
  );
};

const useStyles = makeStyles({
  button: {
    display: "flex",
    flexDirection: "column",
    padding: "0 20px",
    marginBottom: "3px",
    "& span": {
      height: "15px",
    },
  },
  textButton: {
    whiteSpace: "nowrap",
    textTransform: "initial",
  },
});

export default ButtonComponent;
