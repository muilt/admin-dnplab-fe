import { createTheme } from "@mui/material"

const fontFamily = [
  "Arial",
  "Meiryo",
  // Fonts can be used by writing below
].join(",")

export const theme = createTheme({
  palette: {
    black: "#000000",
    white: "#ffffff",
    type: "light",
    primary: {
      light: "#CCEDF9",
      main: "#00587C",
    },
    success: {
      light: "#D2F5F3",
      main: "#C3E8E0",
      dark: "#60827B",
    },
    error: {
      light: "#FFE5E5",
      main: "#FF0000",
    },
    darkGray: {
      light: "#666666",
      main: "#707070",
      dark: "#999999",
    },
    lightGray: {
      light: "#999999",
      main: "#ADADAD",
      dark: "#CCCCCC",
    },
    offWhite: {
      light: "#EFEFEF",
      main: "#F5F5F5",
      dark: "#F8F8F8",
    },
    text: {
      primary: "#333333",
      secondary: "#000000",
    },
    bg: {
      blue: {
        light: "linear-gradient(90deg, #E5F7F8, #A6E3E7)",
      },
    },
  },
  // table cellはfontSize基本13pxなんでtable cellで設定します。
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold",
    },
    h2: {
      fontSize: 20,
      fontWeight: "bold",
    },
    h3: {
      fontSize: 16,
    },
    body1: {
      fontSize: 14,
    },
    body2: {
      fontSize: 12,
    },
  },
})

// change the style of textfield
theme.overrides = {
  MuiCssBaseline: {
    "@global": {
      body: {
        minWidth: "1000px",
      },
    },
  },
  MuiTextField: {
    root: {
      outline: "solid",
    },
  },
  MuiTableCell: {
    // root: {
    //   minWidth: "150px",
    // },
    head: {
      backgroundColor: "#333333",
      color: "white",
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}
