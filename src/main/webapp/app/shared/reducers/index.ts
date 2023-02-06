import { combineReducers } from "redux";
import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";
import userInfoState, { UserInfoState } from "./userInfo";
import authentication, { AuthenticationState } from "./authentication";

export interface IRootState {
  readonly userInfoState: UserInfoState;
  readonly authentication: AuthenticationState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  userInfoState,
  authentication,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
