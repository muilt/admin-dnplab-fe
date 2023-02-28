/* eslint-disable @typescript-eslint/await-thenable */
import { setIsAuthent, setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import { Auth } from "aws-amplify";
import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { Switch, useHistory } from "react-router-dom";
import setupAxiosInterceptors from "./config/axios-interceptor";
import ChangePassword from "./modules/changePassword/ChangePassword";
import Loading from "./modules/commons/Loading";
import { ScreenLockAlert } from "./modules/commons/ScreenLockAlert";
import EventDetail from "./modules/eventDetail/EventDetail";
import EventList from "./modules/eventList/EventList";
import Login from "./modules/login/Login";
import SmsAuthen from "./modules/login/SmsAuthen";
import MemberDetail from "./modules/memberDetail/MemberDetail";
import MemberList from "./modules/memberList/MemberList";
import { paths } from "./routes/appRoutes";
import router, { pageNotFound } from "./routes/router";
import PrivateRoute from "./shared/auth/PrivateRoute";
import PageNotFound from "./shared/error/PageNotFound";
import { IRootState } from "./shared/reducers";
import { LOGIN } from "./shared/util/pagination.constants";

export interface IRoutesProps extends StateProps, DispatchProps {}
const Routes = (props: IRoutesProps) => {
  const history = useHistory();
  const pathName = history.location.pathname;
  const arrayPathname = pathName.split("/");
  const pageDetail = arrayPathname[arrayPathname.length - 1];

  setupAxiosInterceptors(() => {
    history.push(router.login);
  });

  // handle check authenticated user
  const checkAuthenticated = useCallback(() => {
    checkUser();
  }, []);

  // check user
  const checkUser = () => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        props.setIsAuthent(true);
        if (
          !Object.values(router).includes(pathName) &&
          pathName !== `${router.eventDetail}${pageDetail}` &&
          pathName !== `${router.memberDetail}${pageDetail}`
        ) {
          history.push(pageNotFound);
        }
      })
      .catch(() => {
        checkPage();
      });
  };

  const checkPage = () => {
    if (pathName === router.changePassword || pathName === router.smsAuthen) {
      if (!props.loggingUser || Object.keys(props.loggingUser)?.length <= 0) {
        history.push(router.login);
      }
    } else {
      props.setIsAuthent(false);
      Object.values(paths).forEach((item) => {
        if ((item.path === pathName || pathName === `${item.path}${pageDetail}`) && item.role.includes(LOGIN)) {
          history.push(router.login);
        } else {
          checkPageNotFound();
        }
      });
    }
  };

  // check page not found
  const checkPageNotFound = () => {
    if (
      !Object.values(router).includes(pathName) &&
      pathName !== `${router.eventDetail}${pageDetail}` &&
      pathName !== `${router.memberDetail}${pageDetail}`
    ) {
      history.push(pageNotFound);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, [props.isAuthenticated]);

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
      {props.loading && <Loading />}
      <ScreenLockAlert
        open={!!props.messageText}
        onClose={onCloseError}
        message={props.messageText}
        severity={props.severityType}
      />
      <Switch>
        <PrivateRoute path={router.topPage} exact component={EventList} />
        <PrivateRoute path={router.event} exact component={EventList} />
        <PrivateRoute path={`${router.eventDetail}:id`} exact component={EventDetail} />
        <PrivateRoute path={router.changePassword} exact component={ChangePassword} />
        <PrivateRoute path={router.login} component={Login} />
        <PrivateRoute path={router.memberList} component={MemberList} />
        <PrivateRoute path={`${router.memberDetail}:id`} component={MemberDetail} />
        <PrivateRoute path={router.smsAuthen} component={SmsAuthen} />
        <PrivateRoute path={pageNotFound} component={PageNotFound} />
      </Switch>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  loading: authentication.loading,
  messageText: authentication.messageText,
  severityType: authentication.serverityType,
  isAuthenticated: authentication.isAuthenticated,
  loggingUser: authentication.loggingUser,
});

const mapDispatchToProps = {
  setMessageText,
  setSeverityType,
  setIsAuthent,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
