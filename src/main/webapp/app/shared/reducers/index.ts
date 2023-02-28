import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";
import { combineReducers } from "redux";
import authentication, { AuthenticationState } from "./authentication";

export interface IRootState {
  readonly authentication: AuthenticationState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
