/* eslint-disable no-irregular-whitespace */
import { Avatar, Box, Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { linkPortal } from "app/config/constants";
import commonText from "app/lang/ja/commonText";
import { default as headerFooter, default as loginLogout } from "app/lang/ja/headerFooter";
import { paths } from "app/routes/appRoutes";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import { isMobile, logout, setLoading, setMessageText } from "app/shared/reducers/authentication";
import { IS_SHOW_MENU, LOGIN } from "app/shared/util/pagination.constants";
import { Auth } from "aws-amplify";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ButtonComponent from "./Button";
import { OverLay } from "./OverLay";

const Header = (props: any) => {
  const [isLogout, setIsLogout] = React.useState(false);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // handle logout button
  const handleLogout = React.useCallback(async () => {
    try {
      props.setLoading(true);
      setIsLogout(false);
      await Auth.signOut({ global: true });
      await props.logout();
      props.setLoading(false);
      history.push(router.login);
    } catch (error) {
      props.setMessageText(commonText.cognitoLogout[error.name] || commonText.cognito[error.name]);
      props.setLoading(false);
      setTimeout(() => {
        history.push(router.login);
      }, 2000);
    }
  }, [props]);

  // handle closing menu
  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  // open the logout popup
  const setIsLogoutTrue = React.useCallback(() => {
    setIsLogout(true);
  }, []);

  // close popup logout
  const setIsLogoutFalse = React.useCallback(() => {
    setIsLogout(false);
  }, []);

  // handle menu display
  const showMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <header className="header">
        <div className="header__wrap">
          <div className="header__inner">
            <h1 className="logo">
              <a href={linkPortal} rel="noreferrer" target="_blank">
                <img src={"/content/images/logo_head.jpg"} alt={headerFooter.header.altLogo} />
              </a>
            </h1>
            <div className="nav">
              {props.isAuthenticated && (
                <div className="sp-only">
                  <button className="nav__button" onClick={showMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                  <Menu
                    className="menu-item-mobile"
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box className="menu-list-mobile" style={{ maxWidth: 150 }}>
                      {props.isAuthenticated && (
                        <>
                          {Object.values(paths).map((page, i) => {
                            if (page.role.includes(IS_SHOW_MENU))
                              return (
                                <MenuItem key={i.valueOf()}>
                                  <Button href={page.path}>{page.title}</Button>
                                </MenuItem>
                              );
                          })}
                          <MenuItem>
                            <Button onClick={setIsLogoutTrue} style={{ color: "black" }}>
                              {loginLogout.logout.buttonLogout}
                            </Button>
                          </MenuItem>
                        </>
                      )}
                    </Box>
                  </Menu>
                </div>
              )}
              {isMobile && props.isAuthenticated && (
                <Box className="header-icon-mypage">
                  <Button href={""}>
                    <Avatar alt="My Page" className="icon-avatar" />
                  </Button>
                  <Tooltip title={loginLogout.myPageTitle} arrow>
                    <Typography sx={{ color: "black" }} className="fs-12-text pointer">
                      <Button href={""} className={`mypage-name ${isMobile ? "fs-14-text" : "fs-12-text"}`}>
                        {loginLogout.myPageTitle}
                      </Button>
                    </Typography>
                  </Tooltip>
                </Box>
              )}
              {props.isAuthenticated ? (
                <div className="pc-only">
                  <ul className="nav__list nav-left">
                    {Object.values(paths).map((page, i) => {
                      if (page.role.includes(IS_SHOW_MENU))
                        return (
                          <li key={i.valueOf()}>
                            <a href={page.path} className="fs-16-text">
                              {page.title}
                            </a>
                          </li>
                        );
                    })}
                    <li>
                      <a
                        onClick={() => setIsLogout(true)}
                        className="href-logout fs-14-text"
                        style={{ color: "#474747" }}
                      >
                        {loginLogout.logout.buttonLogout}
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="pc-only">
                  <ul className="nav__list">
                    {Object.values(paths).map((page, i) => {
                      if (page.role.includes(IS_SHOW_MENU) && !page.role.includes(LOGIN))
                        return (
                          <li key={i.valueOf()}>
                            <a href={page.path} className="fs-16-text">
                              {page.title}
                            </a>
                          </li>
                        );
                    })}
                  </ul>
                </div>
              )}
              {props.isAuthenticated && !isMobile && (
                <Box className="header-icon-mypage">
                  <Button href={router.mypage}>
                    <Avatar alt="My Page" className="icon-avatar" />
                  </Button>
                  <Tooltip title={loginLogout.myPageTitle} arrow>
                    <Typography sx={{ color: "black" }} className="fs-12-text pointer">
                      <Button href={router.mypage} className="mypage-name fs-14-text">
                        {loginLogout.myPageTitle}
                      </Button>
                    </Typography>
                  </Tooltip>
                </Box>
              )}
              {!props.isAuthenticated && (
                <div className="login">
                  <a href={router.login} className="fs-14-text">
                    <span style={{ color: "white" }}>{loginLogout.login.buttonLogin}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <OverLay isOpen={isLogout} setIsOpen={setIsLogoutFalse}>
        <Box>
          <Box mb={3} mt={3} sx={{ color: "black" }} className="fs-12-text">
            {loginLogout.logout.description}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box mr={1} className="background-cancel-reg">
              <ButtonComponent name={commonText.buttonCancel} handleClick={setIsLogoutFalse} />
            </Box>
            <ButtonComponent name={loginLogout.logout.buttonSubmitLogout} handleClick={handleLogout} />
          </Box>
        </Box>
      </OverLay>
    </>
  );
};
const mapDispatchToProps = { logout, setLoading, setMessageText };

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  isMobile: authentication.isMobile,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
