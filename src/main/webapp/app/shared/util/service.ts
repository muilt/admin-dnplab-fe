/* eslint-disable @typescript-eslint/no-empty-interface */
import { Auth } from "aws-amplify";
import axios from "axios";

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
  } catch (err) {
    authToken = "";
    refreshAuthToken = "";
  }
};

function objToString(obj) {
  const tabjson = [];
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      tabjson.push(p + "=" + obj[p]);
    }
  }
  tabjson.push();
  return "?" + tabjson.join("&");
}

export const get = async (key: string, param?) => {
  await getAccessToken();
  return axios.get("api/" + key + (param ? objToString(param) : ""), {
    headers: authToken
      ? {
          "Content-Type": "application/merge-patch+json",
          Authorization: "Bearer " + authToken || refreshAuthToken,
        }
      : "",
  });
};

export const post = async (key: string, data?, config?) => {
  return axios.post("api/" + key, data ?? null, config ?? null);
};

export const put = async (key: string, data) => {
  return axios.put("api/" + key, data);
};

export const patch = async (key: string, data) => {
  return axios.patch("api/" + key, data);
};

export const getTerm = (key: string, param?) => {
  return axios.get("api/" + key + (param ? objToString(param) : ""));
};
