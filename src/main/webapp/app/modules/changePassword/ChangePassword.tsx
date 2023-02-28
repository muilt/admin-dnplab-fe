/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/await-thenable */
import Box from "@material-ui/core/Box";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import changePassword from "app/lang/ja/changePassword";
import commonText from "app/lang/ja/commonText";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import {
  login,
  mfaType,
  setIsAuthent,
  setLoading,
  setMessageText,
  setSeverityType
} from "app/shared/reducers/authentication";
import { Auth } from "aws-amplify";
import * as React from "react";
import { Storage } from "react-jhipster";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ButtonComponent from "../commons/Button";
import { TitleScreen } from "../commons/TitleScreen";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

type inputError = {
  currentPassword: string | null;
  newPassword: string | null;
  newPasswordConfirm: string | null;
};

const ChangePassword = (props: any) => {
  const [error, setError] = React.useState<inputError>({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  let listKeyError = [];
  const [isShowCurrentPassword, setIsShowCurrentPassword] = React.useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = React.useState(false);
  const [isShowNewPasswordConfirm, setIsShowNewPasswordConfirm] = React.useState(false);
  const [formValues, setFormValues] = React.useState(defaultValues);
  let errors = defaultValues;
  let listError = [];
  const history = useHistory();
  const userNameAdmin = Storage.local.get("username");

  // handle value change in input cell
  const handleInputChange = React.useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  // check validate password
  const checkValidatePassword = () => {
    listError = [];
    const checkData = Object.keys(props.loggingUser)?.length > 0 ? true : false;
    Object.keys(formValues).forEach((key) => {
      if (checkData) {
        if (key !== "currentPassword" && !formValues[key]) {
          listError.push(key);
          errors = { ...errors, [key]: commonText.errorRequire };
        }
      } else {
        if (!formValues[key]) {
          listError.push(key);
          errors = { ...errors, [key]: commonText.errorRequire };
        }
      }
      if (key !== "currentPassword" && formValues[key]) {
        checkNewPassword(key);
      }
    });
    setError(errors);
    listKeyError = listError;
  };

  // check new password
  const checkNewPassword = (key) => {
    const rex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\\/*+;$.',&%?#@!^()_="\-:~`|<>[\]{}\s])[A-Za-z\d\\/*+;$.',&%?#@!^()_="\-:~`|<>[\]{}\s]{8,}$/;
    if (!rex.test(formValues[key])) {
      listError.push(key);
      errors = { ...errors, [key]: changePassword.errorFormatPassword };
    } else {
      if (key === "newPassword") {
        if (formValues[key].indexOf(userNameAdmin) !== -1) {
          listError.push(key);
          errors = { ...errors, [key]: changePassword.errorPasswordMatchesUserId };
        } else if (formValues[key].length > 128) {
          listError.push(key);
          errors = { ...errors, [key]: `128${commonText.errorMaxlength}` };
        }
      }
      if (key === "newPasswordConfirm") {
        if (formValues.newPassword !== formValues.newPasswordConfirm) {
          listError.push(key);
          errors = { ...errors, [key]: changePassword.errorConfirmPassword };
        }
      }
    }
  };

  // handle when clicking the button to reset password
  const handleSubmitNewPassword = React.useCallback(
    (e) => {
      checkValidatePassword();
      if (listKeyError.length <= 0) {
        props.setLoading(true);
        if (props.loggingUser && Object.keys(props.loggingUser)?.length > 0) {
          createNewPassword();
        } else {
          handleChangePassword();
        }
        props.setLoading(false);
      }
    },
    [formValues]
  );

  // create a new password when logging in for the first time
  const createNewPassword = async () => {
    await Auth.completeNewPassword(props.loggingUser, formValues.newPassword)
      .then(async (res) => {
        props.setSeverityType("success");
        props.setMessageText(commonText.changePasswordSuccess);
        await props.login(res, formValues.newPassword);
        if (res.challengeName === mfaType) {
          setTimeout(() => {
            history.push(router.smsAuthen);
          }, 3000);
        } else {
          await props.setIsAuthent(true);
          setTimeout(() => {
            history.push(router.event);
          }, 3000);
        }
      })
      .catch((err) => {
        props.setIsAuthent(false);
        setError({
          newPassword: "",
          newPasswordConfirm: "",
          currentPassword: commonText.cognitoChangePassword[err.name] || commonText.cognito[err.name],
        });
        props.setLoading(false);
      });
  };

  // handle change password
  const handleChangePassword = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, formValues.currentPassword, formValues.newPassword);
      })
      .then(() => {
        props.setSeverityType("success");
        props.setMessageText(commonText.changePasswordSuccess);
        setTimeout(() => {
          history.push(router.event);
        }, 3000);
      })
      .catch((err) => {
        setError({
          newPassword: "",
          newPasswordConfirm: "",
          currentPassword: commonText.cognitoChangePassword[err.name] || commonText.cognito[err.name],
        });
      });
  };

  // handle click show password
  const handleClickShowPassword = React.useCallback(
    (key) => {
      if (key === "currentPassword") {
        setIsShowCurrentPassword(!isShowCurrentPassword);
      } else if (key === "newPassword") {
        setIsShowNewPassword(!isShowNewPassword);
      } else {
        setIsShowNewPasswordConfirm(!isShowNewPasswordConfirm);
      }
    },
    [isShowCurrentPassword, isShowNewPassword, isShowNewPasswordConfirm]
  );

  return (
    <div>
      <Box className="page-content form-new-password">
        <Box>
          <TitleScreen>{changePassword.title}</TitleScreen>
        </Box>
        <form onSubmit={handleSubmitNewPassword}>
          <Box sx={{ width: "100%" }}>
            <Box className="form-new-password-pass" mt={3}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {Object.keys(props.loggingUser)?.length <= 0 && (
                  <Grid item xs={12}>
                    <Box className="input-title fs-14-text" mb={0.5}>
                      {changePassword.currentPassword}
                      <span className="input-require">{commonText.textRequire}</span>
                    </Box>
                    <TextField
                      id="input-with-icon-textfield"
                      type={isShowCurrentPassword ? "text" : "password"}
                      variant="outlined"
                      size="small"
                      className="input-textfield fs-14-text"
                      name="currentPassword"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleClickShowPassword("currentPassword")}>
                              {isShowCurrentPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: 128,
                      }}
                      error={error.currentPassword ? true : false}
                      onChange={handleInputChange}
                    />
                    {error.currentPassword && <p className="error-message fs-14-text">{error.currentPassword}</p>}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text" mt={2} mb={0.5}>
                    {changePassword.newPassword}
                    <span className="input-require">{commonText.textRequire}</span>
                  </Box>
                  <TextField
                    id="input-with-icon-textfield"
                    type={isShowNewPassword ? "text" : "password"}
                    variant="outlined"
                    size="small"
                    className="input-textfield fs-14-text"
                    name="newPassword"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleClickShowPassword("newPassword")}>
                            {isShowNewPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 128,
                    }}
                    error={error.newPassword ? true : false}
                    onChange={handleInputChange}
                  />
                  {error.newPassword && <p className="error-message fs-14-text">{error.newPassword}</p>}
                </Grid>
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text" mt={2} mb={0.5}>
                    {changePassword.newPasswordConfirm}
                    <span className="input-require">{commonText.textRequire}</span>
                  </Box>
                  <TextField
                    id="input-with-icon-textfield"
                    type={isShowNewPasswordConfirm ? "text" : "password"}
                    variant="outlined"
                    size="small"
                    className="input-textfield fs-14-text"
                    name="newPasswordConfirm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}>
                            {isShowNewPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 128,
                    }}
                    error={error.newPasswordConfirm ? true : false}
                    onChange={handleInputChange}
                  />
                  {error.newPasswordConfirm && <p className="error-message fs-14-text">{error.newPasswordConfirm}</p>}
                  <p></p>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box mt={2} textAlign="center">
            <ButtonComponent name={changePassword.buttonChangePassword} handleClick={handleSubmitNewPassword} />
          </Box>
        </form>
      </Box>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  loggingUser: authentication.loggingUser,
  isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = {
  setLoading,
  setMessageText,
  setSeverityType,
  setIsAuthent,
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
