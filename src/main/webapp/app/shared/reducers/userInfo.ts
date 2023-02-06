import api from "app/routes/api";
import { FAILURE, REQUEST, SUCCESS } from "app/shared/reducers/action-type.util";
import { get } from "../util/service";

export const ACTION_TYPES = {
  GET_PROFILE: "user/GET_PROFILE",
  IS_UPDATE_PROFILE: "user/IS_UPDATE_PROFILE",
  GET_LIST_PREFECTURE: "user/GET_LIST_PREFECTURE",
  SET_USER_INFO: "user/SET_USER_INFO"
};

const initialState = {
  userInfo: {} as any,
  isUpdateProfile: false,
  loadingStatus: false,
  listPrefecture: [] as any,
};

export type UserInfoState = Readonly<typeof initialState>;

export default (state: UserInfoState = initialState, action): UserInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PROFILE):
      return {
        ...state,
        loadingStatus: true,
      };
    case SUCCESS(ACTION_TYPES.GET_PROFILE): {
      if (action?.payload?.status === 200) {
        return {
          ...state,
          loadingStatus: false,
          userInfo: action.payload.data?.data,
        };
      } else {
        return {
          ...initialState,
          loadingStatus: false,
        };
      }
    }
    case ACTION_TYPES.IS_UPDATE_PROFILE: {
      return {
        ...state,
        isUpdateProfile: action.payload.status,
      };
    }
    case SUCCESS(ACTION_TYPES.GET_LIST_PREFECTURE): {
      return {
        ...state,
        listPrefecture: action.payload.data?.data,
      };
    }
    case FAILURE(ACTION_TYPES.GET_LIST_PREFECTURE): {
      return {
        ...state,
        listPrefecture: [],
      };
    }
    case ACTION_TYPES.SET_USER_INFO: {
      return {
        ...state,
        userInfo: {},
      };
    }
    default:
      return state;
  }
};

export const getSession: () => void = () => (dispatch, getState) => {};

export const getUserInfo: () => void = () => async (dispatch) => {
  const result = await dispatch({
    type: ACTION_TYPES.GET_PROFILE,
    payload: get(api.user.getProfile).catch((err) => {}),
  });
  if (result.value == null) {
    return;
  }
  await dispatch(getSession());
};

export const setIsUpdateProfile = (status) => ({
  type: ACTION_TYPES.IS_UPDATE_PROFILE,
  payload: {
    status,
  },
});

export const getListPrefecture: () => void = () => async (dispatch) => {
  const result = await dispatch({
    type: ACTION_TYPES.GET_LIST_PREFECTURE,
    payload: get(api.getPrefecture).catch((err) => {}),
  });
  if (result.value == null) {
    return;
  }
  await dispatch(getSession());
};

export const setUserInfo = () => ({
  type: ACTION_TYPES.SET_USER_INFO
});
