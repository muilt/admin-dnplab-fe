/* eslint-disable object-shorthand */

import { Storage } from "react-jhipster";

export const ACTION_TYPES = {
  LOGIN: "authentication/LOGIN",
  ERROR_MESSAGE: "authentication/ERROR_MESSAGE",
  SET_LOADING: "authentication/SET_LOADING",
  SET_IS_AUTHENT: "authentication/SET_IS_AUTHENT",
  LOGOUT: "authentication/LOGOUT",
  SET_MESSAGE_TEXT: "authentication/SET_MESSAGE_TEXT",
  SET_SERVERITY_TYPE: "authentication/SET_SERVERITY_TYPE",
};

export const isMobile = window.innerWidth < 992;
export const mfaType = "SMS_MFA";

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showLoginScreen: true,
  errorMessage: (null as unknown) as string, // Errors returned from server side
  redirectMessage: (null as unknown) as string,
  isMobile: isMobile,
  loggingUser: {} as any,
  messageText: (null as unknown) as string,
  serverityType: "success",
  password: (null as unknown) as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer

export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN: {
      return {
        ...state,
        loading: false,
        loginError: false,
        showLoginScreen: false,
        loginSuccess: true,
        loggingUser: action.payload.user,
        password: action.payload.password,
      };
    }
    case ACTION_TYPES.ERROR_MESSAGE:
      return {
        ...initialState,
        showLoginScreen: true,
        redirectMessage: action.message,
      };
    case ACTION_TYPES.SET_LOADING: {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    case ACTION_TYPES.SET_IS_AUTHENT: {
      return {
        ...state,
        loading: false,
        loginError: action.payload.status,
        showLoginScreen: false,
        loginSuccess: action.payload.status,
        isAuthenticated: action.payload.status,
      };
    }
    case ACTION_TYPES.LOGOUT: {
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        loggingUser: {},
      };
    }
    case ACTION_TYPES.SET_MESSAGE_TEXT: {
      return {
        ...state,
        messageText: action.payload.value,
      };
    }
    case ACTION_TYPES.SET_SERVERITY_TYPE: {
      return {
        ...state,
        serverityType: action.payload.value,
      };
    }
    default:
      return state;
  }
};

export const displayAuthError = (message) => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const getSession: () => void = () => (_dispatch, _getState) => {};

export const login: (user: any, password: string) => void = (user, password) => async (dispatch, _getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: {
      user,
      password
    },
  });
  if (!result) {
    return;
  }
  Storage.local.set("username", user?.username);
  await dispatch(getSession());
};

export const setLoading = (loading) => ({
  type: ACTION_TYPES.SET_LOADING,
  payload: {
    loading,
  },
});

export const logout: () => void = () => async (dispatch, _getState) => {
  await dispatch({
    type: ACTION_TYPES.LOGOUT,
  });
  await dispatch(getSession());
};

export const setIsAuthent = (status) => ({
  type: ACTION_TYPES.SET_IS_AUTHENT,
  payload: {
    status,
  },
});

export const setMessageText = (value) => ({
  type: ACTION_TYPES.SET_MESSAGE_TEXT,
  payload: {
    value,
  },
});

export const setSeverityType = (value) => ({
  type: ACTION_TYPES.SET_SERVERITY_TYPE,
  payload: {
    value,
  },
});
