import "react-toastify/dist/ReactToastify.css";
import "./app.scss";

import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import { Amplify } from "aws-amplify";
import awsconfig from "./aws-config";
import setupAxiosInterceptors from "./config/axios-interceptor";
import Header from "./modules/commons/Header";
import Routes from "./routes";
import ErrorBoundaryRoute from "./shared/error/ErrorBoundaryRoute";
import { IRootState } from "./shared/reducers";

const baseHref = document.querySelector("base").getAttribute("href").replace(/\/$/, "");

// DNP aws account, DNPMei user pool
Amplify.configure({
  Auth: {
    // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: "ap-northeast-1:34563ddf-cb89-4415-ba30-0dfcde821309",

    // (required)- Amazon Cognito Region
    region: awsconfig.aws_cognito_region,

    // (optional) - Amazon Cognito User Pool ID
    userPoolId: awsconfig.aws_user_pools_id,

    // (optional) - Amazon Cognito Web Client ID (26-char alphanumeric string, App client secret needs to be disabled)
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,

    // (optional) - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
  },
});

function DesktopComponent() {
  return (
    <div className="app-container">
      <Routes />
    </div>
  );
}

export const App = (props) => {
  const [device, setDevice] = useState(window.innerWidth < 992 ? "mobile" : "desktop");

  setupAxiosInterceptors(() => {});

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        if (props.isMobile) {
          setDevice("mobile");
        } else {
          setDevice("desktop");
        }
      },
      false
    );
  }, [device]);

  return (
    <div className={device}>
      <div className="layout">
        <Router basename={baseHref}>
          <Header />
          <Switch>
            <ErrorBoundaryRoute path="*" component={DesktopComponent} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isMobile: authentication.isMobile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
