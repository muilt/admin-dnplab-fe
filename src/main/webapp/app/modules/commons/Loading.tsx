import { CircularProgress, Backdrop, makeStyles } from "@material-ui/core";
import React from "react";

const Loading = (props: any) => {
  const { isLoadingLine } = props;
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.modal + 10000,
      color: "#fff",
    },
    backdropline: {
      position: "absolute",
      zIndex: 1,
      color: "#fff",
      opacity: "0.8!important",
    },
    circularprogress: {
      position: "absolute",
      left: "560px",
    },
  }));

  const classes = useStyles();

  return (
    <Backdrop className={isLoadingLine ? classes.backdropline : classes.backdrop} open={true}>
      <CircularProgress
        className={isLoadingLine ? classes.circularprogress : ""}
        color="inherit"
        size={isLoadingLine ? 10 : 40}
      />
    </Backdrop>
  );
};

export default Loading;
