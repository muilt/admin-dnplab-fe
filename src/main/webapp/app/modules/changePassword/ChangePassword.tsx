/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/await-thenable */
import Box from "@material-ui/core/Box";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import changePassword from "app/lang/ja/changePassword";
import commonText from "app/lang/ja/commonText";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import { setLoading, setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import { Auth } from "aws-amplify";
import * as React from "react";
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

const NewPassword = (props: any) => {
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

  React.useEffect(() => {
    console.log("props.loggingUser", props.loggingUser?.challengeParam);

    if (!props.loggingUser || Object.keys(props.loggingUser).length <= 0) {
      history.push(router.login);
    }
  }, [props.loggingUser]);

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
    const rex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\\/*+;$.',&%?#@!^()_="\-:~`|<>[\]{}\s])[A-Za-z\d\\/*+;$.',&%?#@!^()_="\-:~`|<>[\]{}\s]{8,}$/;
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key] || !formValues[key].trim()) {
        listError.push(key);
        errors = { ...errors, [key]: commonText.errorRequire };
      } else if (!rex.test(formValues[key].trim())) {
        listError.push(key);
        errors = { ...errors, [key]: changePassword.errorFormatPassword };
      } else {
        checkNewPassword(key);
      }
    });
    setError(errors);
    listKeyError = listError;
  };

  // check new password
  const checkNewPassword = (key) => {
    if (key === "newPassword") {
      if (formValues[key].indexOf(props.userInfo?.email) !== -1) {
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
  };

  // handle when clicking the button to reset password
  const handleSubmitNewPassword = React.useCallback(
    async (e) => {
      checkValidatePassword();
      if (listKeyError.length <= 0) {
        props.setLoading(true);
        await Auth.completeNewPassword(props.loggingUser, formValues.newPassword)
          .then(() => {
            props.setSeverityType("success");
            props.setMessageText(commonText.changePasswordSuccess);
          })
          .catch((err) => {
            setError({
              newPassword: "",
              newPasswordConfirm: "",
              currentPassword: commonText.cognitoChangePassword[err.name] || commonText.cognito[err.name],
            });
            props.setLoading(false);
          });
        props.setLoading(false);
      }
    },
    [formValues]
  );

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

  // set value when onblur
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

  return (
    <div>
      <Box className="page-content form-new-password">
        <Box className="d-flex justify-content-end text-decoration-underline" mb={2}>
          <Typography>{changePassword.userName}</Typography>
        </Box>
        <Box>
          <TitleScreen>{changePassword.title}</TitleScreen>
        </Box>
        <form onSubmit={handleSubmitNewPassword}>
          <Box sx={{ width: "100%" }}>
            <Box className="form-new-password-pass" mt={3}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text">
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
                    onBlur={handleSetValue}
                  />
                  {error.currentPassword && <p className="error-message fs-14-text">{error.currentPassword}</p>}
                </Grid>
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text" mt={2}>
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
                    onBlur={handleSetValue}
                  />
                  {error.newPassword && <p className="error-message fs-14-text">{error.newPassword}</p>}
                </Grid>
                <Grid item xs={12}>
                  <Box className="input-title fs-14-text" mt={2}>
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
                    onBlur={handleSetValue}
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

const mapStateToProps = ({ authentication, userInfoState }: IRootState) => ({
  userInfo: userInfoState.userInfo,
  loggingUser: authentication.loggingUser,
});

const mapDispatchToProps = {
  setLoading,
  setMessageText,
  setSeverityType,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);
