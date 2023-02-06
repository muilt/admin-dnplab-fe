import commonText from "app/lang/ja/commonText";
import { routeModel } from "app/shared/util/pagination.constants";
import router from "./router";

export const ROUTES: { [key: string]: routeModel } = {};

export const paths = {
  topPage: {
    path: router.topPage,
    title: commonText.titlePage.login,
    role: ""
  },
  login: {
    path: router.login,
    title: commonText.titlePage.login,
    role: ""
  },
  changePassword: {
    path: router.changePassword,
    title: commonText.titlePage.changePassword,
    role: ""
  }
};
