import React from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import router from "app/routes/router";
import { isMobile } from "app/shared/reducers/authentication";
import CloseIcon from "@material-ui/icons/Close";

export const OverLay = ({ isOpen, setIsOpen, children, width = 760, py = 6.25, px = 6.25, front = false }) => {
  const classes = useStyles({ front });
  const theme = useTheme();
  const pathName = window.location.pathname;

  React.useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden !important";
    } else {
      document.body.style.overflow = "auto !important";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // set popup open/close value
  const setIsOpenPopup = React.useCallback(() => {
    setIsOpen();
  }, [isOpen]);

  return (
    <Backdrop className={`${classes.backdrop} ${isOpen && classes.backdrop}`} open={Boolean(isOpen)}>
      <Box
        className={`${isMobile ? "popup-overlay" : ""} ${classes.wrapper} ${
          pathName === router.mypage && classes.background
        }`}
        bgcolor={theme.palette.background.default}
        width={width}
        py={py}
        px={px}
      >
        <Box className={classes.cancel} onClick={setIsOpenPopup}>
          <span className={classes.closeIcon}>
            <CloseIcon />
          </span>
        </Box>
        {children}
      </Box>
    </Backdrop>
  );
};

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: (front) => (front ? 3000 : theme.zIndex.drawer + 1),
  },
  wrapper: {
    position: "relative",
    textAlign: "center",
    padding: "20px 50px",
  },
  background: {
    backgroundColor: "#bfc0c0",
  },
  cancel: {
    position: "absolute",
    top: 0,
    right: 20,
    fontSize: "40px",
    color: "black",
    "&:hover": {
      cursor: "pointer",
    },
  },
  closeIcon: {
    "&:hover": {
      opacity: "80%",
    },
  },
}));
