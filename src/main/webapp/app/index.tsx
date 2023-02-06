import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { MuiThemeProvider } from "@material-ui/core";
import Box from "@mui/material/Box";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import AppComponent from "./app";
import DevTools from "./config/devtools";
import initStore from "./config/store";
import "./i18n";
import ErrorBoundary from "./shared/error/ErrorBoundary";
import { theme } from "./themeConfig";
import Footer from "./modules/commons/Footer";
const devTools = process.env.NODE_ENV === "development" ? <DevTools /> : null;
const store = initStore();

const rootEl = document.getElementById("root");

const render = (Component) =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <ErrorBoundary>
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <I18nextProvider i18n={i18next}>
              {devTools}
              <Component />
              <Footer />
            </I18nextProvider>
          </MuiThemeProvider>
        </Provider>
      </ErrorBoundary>
    </Box>,
    rootEl
  );

render(AppComponent);
