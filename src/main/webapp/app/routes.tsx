/* eslint-disable @typescript-eslint/await-thenable */
import { setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Switch, useHistory } from "react-router-dom";
import setupAxiosInterceptors from "./config/axios-interceptor";
import ChangePassword from "./modules/changePassword/ChangePassword";
import Loading from "./modules/commons/Loading";
import { ScreenLockAlert } from "./modules/commons/ScreenLockAlert";
import Login from "./modules/login/Login";
import router from "./routes/router";
import PrivateRoute from "./shared/auth/PrivateRoute";
import { IRootState } from "./shared/reducers";

export interface IRoutesProps extends StateProps, DispatchProps {}
const Routes = (props: IRoutesProps) => {
  const history = useHistory();

  setupAxiosInterceptors(() => {
    history.push(router.login);
  });

  useEffect(() => {
    setTimeout(() => {
      props.setMessageText("");
      props.setSeverityType("success");
    }, 5000);
  }, [props.messageText, props.severityType]);

  // close error message dialog
  const onCloseError = React.useCallback(() => {
    props.setMessageText("");
  }, [props.setMessageText]);

  return (
    <div className="view-routes">
      {(props.loading || props.loadingStatus) && <Loading />}
      <ScreenLockAlert
        open={!!props.messageText}
        onClose={onCloseError}
        message={props.messageText}
        severity={props.severityType}
      />
      <Switch>
        <PrivateRoute path={router.topPage} exact component={Login} />
        <PrivateRoute path={router.changePassword} exact component={ChangePassword} />
        <PrivateRoute path={router.login} component={Login} />
      </Switch>
    </div>
  );
};

const mapStateToProps = ({ userInfoState, authentication }: IRootState) => ({
  loading: authentication.loading,
  loadingStatus: userInfoState.loadingStatus,
  messageText: authentication.messageText,
  severityType: authentication.serverityType,
});

const mapDispatchToProps = {
  setMessageText,
  setSeverityType,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
