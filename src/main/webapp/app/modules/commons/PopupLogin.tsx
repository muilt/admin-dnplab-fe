import Box from "@material-ui/core/Box";
import loginLogout from "app/lang/ja/headerFooter";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import { setLoading } from "app/shared/reducers/authentication";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { OverLay } from "./OverLay";

const PopupLogin = (props) => {
  const [isOpen, setIsOpen] = React.useState(props.isOpen);

  // handle closing popup login
  const handleSetOpenPopup = React.useCallback(() => {
    setIsOpen(false);
    props.closePopupLogin();
  }, []);

  return (
    <OverLay isOpen={isOpen} setIsOpen={handleSetOpenPopup}>
      <Box className="popup-confirm-login">
        <Box>
          <img src="/content/images/logo.ico" className="header-page-logo" style={{ width: 200 }} />
        </Box>
        <Box className="fs-14-text">
          {loginLogout.popupLogin.note1}
          <Link to={{ pathname: `${router.login}`, state: { prevPath: location.pathname } }}>
            {loginLogout.popupLogin.buttonLogin}
          </Link>
          {loginLogout.popupLogin.note2}
          <Link to={{ pathname: `${router.terms}`, state: { prevPath: location.pathname } }}>
            {loginLogout.popupLogin.buttonLogin}
          </Link>
          {loginLogout.popupLogin.note3}
        </Box>
      </Box>
    </OverLay>
  );
};

const mapDispatchToProps = { setLoading };

const mapStateToProps = ({ userInfoState }: IRootState) => ({
  userInfo: userInfoState.userInfo,
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupLogin);
