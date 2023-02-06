import axios from "axios";

import { SERVER_API_URL } from "app/config/constants";
import router from "app/routes/router";
import { Auth } from "aws-amplify";

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

let authToken = "";
let refreshAuthToken = "";

const getAccessToken = async () => {
  try {
    await Auth.currentSession().then((data) => {
      if (data.getAccessToken().getJwtToken()) {
        authToken = data.getAccessToken().getJwtToken() || "";
        refreshAuthToken = data.getRefreshToken().getToken() || "";
      }
    });
  } catch (error) {
    authToken = "";
    refreshAuthToken = "";
  }
};

const setupAxiosInterceptors = (onUnauthenticated) => {
  getAccessToken();
  const onRequestSuccess = (config) => {
    const token = authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  const onResponseSuccess = (response) => response;
  const onResponseError = (err) => {
    const status = err.status || (err.response ? err.response.status : 0);
    const { config: response } = err;

    if (status !== 401) {
      return response;
    } else {
      setTimeout(() => {
        window.location.href = router.login;
      }, 3000);
    }
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
