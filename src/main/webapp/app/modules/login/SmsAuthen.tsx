/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable no-irregular-whitespace */
import Box from "@material-ui/core/Box";
import { Grid, TextField, Typography } from "@mui/material";
import commonText from "app/lang/ja/commonText";
import smsAuthen from "app/lang/ja/smsAuthen";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import {
  login,
  mfaType,
  setIsAuthent,
  setLoading,
  setMessageText,
  setSeverityType,
} from "app/shared/reducers/authentication";
import { Auth } from "aws-amplify";
import * as React from "react";
import { Storage } from "react-jhipster";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ButtonComponent from "../commons/Button";
import { TitleScreen } from "../commons/TitleScreen";

const SmsAuthen = (props) => {
  const [smsCode, setSmsCode] = React.useState("");
  const [error, setError] = React.useState("");
  const history = useHistory();
  const userNameAdmin = Storage.local.get("username");

  React.useEffect(() => {
    if (!props.loggingUser || Object.keys(props.loggingUser).length <= 0) {
      history.push(router.login);
    }
  }, [props.loggingUser]);

  // assign values ​​to input cells
  const handleInputChange = React.useCallback(
    (e) => {
      const { value } = e.target;
      const input = value.replace(/\D/g, "");
      setSmsCode(input);
    },
    [smsCode]
  );

  // call api cognito send back sms
  const handleSubmitSmsAuthen = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (!smsCode || !smsCode?.trim()) {
        setError(commonText.errorRequire);
      } else if (smsCode.length > 6) {
        setError(`6${commonText.errorMaxlength}`);
        return;
      } else {
        props.setLoading(true);
        let user = null;
        try {
          user = await Auth.confirmSignIn(props.loggingUser, smsCode, mfaType);
        } catch (err) {
          setError(smsAuthen.errorSMSAuthent);
          props.setIsAuthent(false);
        }
        props.setLoading(false);
        if (user) {
          await props.setIsAuthent(true);
          await props.login(user, props.password);
          history.push(router.event);
        }
      }
    },
    [smsCode]
  );

  // handle sms resend button
  const handleResendSms = async () => {
    let user = null;
    props.setLoading(true);
    try {
      user = await Auth.signIn(userNameAdmin, props.password);
    } catch (err) {
      props.setSeverityType("error");
      props.setMessageText(smsAuthen.resendSMSError);
    }
    if (user != null) {
      await props.login(user, props.password);
      props.setSeverityType("success");
      props.setMessageText(smsAuthen.resendSMSSuccess);
    } else {
      props.setSeverityType("error");
      props.setMessageText(smsAuthen.resendSMSError);
    }
    props.setLoading(false);
  };

  return (
    <div style={{ padding: 16, margin: "auto" }} className="page-content form-smsAuthen">
      <Box>
        <TitleScreen>{smsAuthen.title}</TitleScreen>
        <Typography paragraph className="fs-18-text">
          {smsAuthen.description}
        </Typography>
      </Box>
      <form onSubmit={handleSubmitSmsAuthen}>
        <Box sx={{ width: "100%" }}>
          <Box className="form-smsAuthen-sms" mt={3}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12}>
                <Box className="input-title fs-14-text">
                  {smsAuthen.smsCode}
                  <span className="input-require">{commonText.textRequire}</span>
                </Box>
                <TextField
                  inputProps={{
                    maxLength: 6,
                  }}
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  className="input-textfield fs-14-text"
                  name="smsCode"
                  value={smsCode}
                  onChange={handleInputChange}
                  error={error ? true : false}
                />
                {error && <p className="error-message fs-14-text">{error}</p>}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box mt={2} mb={6} textAlign="center">
          <ButtonComponent name={smsAuthen.buttonSubmitSmsAuthen} handleClick={handleSubmitSmsAuthen} />
        </Box>
        <Box>
          <p style={{ textAlign: "center" }} className="fs-14-text">
            {smsAuthen.resendSMS}
          </p>
          <p className="input-link pointer fs-14-text" onClick={handleResendSms}>
            {smsAuthen.buttonResendSMS}
          </p>
          <p style={{ textAlign: "center" }} className="fs-14-text">
            {smsAuthen.smsConfirm}
          </p>
        </Box>
      </form>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  loggingUser: authentication.loggingUser,
  password: authentication.password,
});
const mapDispatchToProps = {
  setLoading,
  setIsAuthent,
  login,
  setMessageText,
  setSeverityType,
};

export default connect(mapStateToProps, mapDispatchToProps)(SmsAuthen);
