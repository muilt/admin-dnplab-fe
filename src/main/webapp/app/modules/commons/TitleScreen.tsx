import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@mui/material";
import React from "react";

export const TitleScreen = ({ children, _ref = null, ...rest }) => {
  const theme = useTheme();

  return (
    <Box mb={1.875} borderBottom={1} borderColor={[theme.palette.grey?.[200]]} {...rest}>
      <Typography className="fs-22-text font-weight-bold">{children}</Typography>
    </Box>
  );
};
