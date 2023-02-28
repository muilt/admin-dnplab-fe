/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable no-irregular-whitespace */
import { IconButton, InputAdornment } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { CssBaseline, Grid, TextField } from "@mui/material";
import commonText from "app/lang/ja/commonText";
import loginLogout from "app/lang/ja/headerFooter";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import {
  login,
  logout,
  mfaType,
  setIsAuthent,
  setLoading,
  setMessageText,
  setSeverityType,
} from "app/shared/reducers/authentication";
import { Auth } from "aws-amplify";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ButtonComponent from "../commons/Button";
import { TitleScreen } from "../commons/TitleScreen";

const defaultValues = {
  email: "",
  password: "",
};

const Login = (props) => {
  const [formValues, setFormValues] = React.useState(defaultValues);
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [errorLogin, setErrorLogin] = React.useState({
    email: "",
    password: "",
    login: "",
  });

  const history = useHistory();
  let listKeyError = [];

  // assign values ​​to input cells
  const handleInputChange = React.useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  // check validate input
  const checkValidate = () => {
    const listError = [];
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key] || (!formValues[key].trim() && key === "email")) {
        listError.push(key);
        setErrorLogin((prev) => {
          return {
            ...prev,
            [key]: commonText.errorRequire,
            login: "",
          };
        });
      }
    });
    listKeyError = listError;
  };

  // call api login cognito
  const handleLogin = async (email: any, password: any) => {
    if (listKeyError?.length <= 0) {
      props.setLoading(true);
      let user = null;

      // login with cognito
      try {
        user = await Auth.signIn(email?.toLowerCase(), password);
        await props.login(user, password);
      } catch (err) {
        if (err.name === "NotAuthorizedException" && err.message === "Password attempts exceeded") {
          setErrorLogin({
            email: "",
            password: "",
            login: commonText.cognito.maxError,
          });
        } else {
          setErrorLogin({
            email: "",
            password: "",
            login: commonText.cognito[err.name],
          });
        }
      }
      setToken(user);
    }
  };

  // call set access token
  const setToken = async (user: any) => {
    if (user != null) {
      props.setLoading(false);
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        await props.setIsAuthent(false);
        history.push(router.changePassword);
      } else {
        if (user.challengeName === mfaType) {
          history.push(router.smsAuthen);
        } else {
          await props.setIsAuthent(true);
          history.push(router.event);
        }
      }
    }
    props.setLoading(false);
  };

  // handle login button
  const handleSubmitLogin = React.useCallback(() => {
    setErrorLogin(() => {
      return {
        email: "",
        password: "",
        login: "",
      };
    });
    checkValidate();
    handleLogin(formValues.email, formValues.password);
  }, [formValues]);

  // handle show input password
  const handleClickShowPassword = React.useCallback(() => {
    setIsShowPassword(!isShowPassword);
  }, [isShowPassword]);

  // handle removing terminal white characters
  const handleSetValue = React.useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormValues({
        ...formValues,
        [name]: value ? value.trim() : "",
      });
    },
    [formValues]
  );

  // handle deleting local storage
  const clearToken = () => {
    props.logout();
    props.setIsAuthent(false);
    window.localStorage.clear();
  };

  // handling when pressing enter key in search box
  const handleEnterLogin = React.useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSubmitLogin();
      }
    },
    [formValues]
  );

  React.useEffect(() => {
    clearToken();
  }, []);

  return (
    <div className="d-flex justify-content-center">
      <div style={{ padding: 20 }} className="page-content form-login">
        <CssBaseline />
        <Box textAlign="center">
          <TitleScreen>{loginLogout.login.title}</TitleScreen>
        </Box>
        <form onSubmit={handleSubmitLogin}>
          <Box sx={{ width: "100%" }}>
            <Box className="form-login-email" mt={3}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text">
                    {loginLogout.login.userID}
                    <span className="input-require">{commonText.textRequire}</span>
                  </Box>
                  <TextField
                    inputProps={{
                      maxLength: 200,
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    className="input-textfield fs-14-text"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    onBlur={handleSetValue}
                    onKeyPress={handleEnterLogin}
                  />
                  {errorLogin.email && <p className="error-message fs-14-text">{errorLogin.email}</p>}
                </Grid>
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text">
                    {loginLogout.login.password}
                    <span className="input-require">{commonText.textRequire}</span>
                  </Box>
                  <TextField
                    id="input-with-icon-textfield"
                    type={isShowPassword ? "text" : "password"}
                    variant="outlined"
                    size="small"
                    className="input-textfield fs-14-text"
                    name="password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}>
                            {isShowPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 128,
                    }}
                    onChange={handleInputChange}
                    onKeyPress={handleEnterLogin}
                  />
                  {errorLogin.password ? (
                    <p className="error-message fs-14-text">{errorLogin.password}</p>
                  ) : (
                    errorLogin.login && <p className="error-message fs-14-text">{errorLogin.login}</p>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box textAlign="center" mt={5}>
            <ButtonComponent name={loginLogout.login.buttonLogin} handleClick={handleSubmitLogin} />
          </Box>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  errorMessage: authentication.errorMessage,
});

const mapDispatchToProps = {
  login,
  setLoading,
  setIsAuthent,
  logout,
  setSeverityType,
  setMessageText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
