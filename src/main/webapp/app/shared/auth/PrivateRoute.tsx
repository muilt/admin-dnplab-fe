import React, { useCallback } from "react";
import { connect } from "react-redux";
import { Route, RouteProps, useLocation } from "react-router-dom";

import { paths } from "app/routes/appRoutes";
import ErrorBoundary from "app/shared/error/ErrorBoundary";

interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[];
}

export interface IPrivateRouteProps extends IOwnProps, StateProps {}

export const PrivateRouteComponent = ({
  component: Component,
  ...rest
}: IPrivateRouteProps) => {
  const location = useLocation()
  const checkAuthorities = (props) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  const renderRedirect = useCallback((props) => {
    return checkAuthorities(props);
  }, [rest]);

  // Set screen scroll amount to 0 when page transitions
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  React.useEffect(() => {
    const arrayPathname = rest.path.toString().split("/");
    const pageDetail = arrayPathname[arrayPathname.length - 1];
    Object.values(paths).forEach((data) => {
      if (data.path === rest.path || `${data.path}/${pageDetail}` === rest.path) {
        document.title = data.title;
      }
    });
  }, [rest]);

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

  return <Route {...rest} render={renderRedirect} />;
};

const mapStateToProps = () => ({});

type StateProps = ReturnType<typeof mapStateToProps>;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export const PrivateRoute = connect(mapStateToProps, null, null, { pure: false })(PrivateRouteComponent);

export default PrivateRoute;
