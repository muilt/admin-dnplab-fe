import commonText from "app/lang/ja/commonText";
import { IS_SHOW_MENU, LOGIN } from "app/shared/util/pagination.constants";
import router from "./router";

export const paths = {
  topPage: {
    path: router.topPage,
    title: commonText.titlePage.eventList,
    role: [LOGIN],
  },
  event: {
    path: router.event,
    title: commonText.titlePage.eventList,
    role: [LOGIN, IS_SHOW_MENU],
  },
  eventDetail: {
    path: router.eventDetail,
    title: commonText.titlePage.eventList,
    role: [LOGIN],
  },
  login: {
    path: router.login,
    title: commonText.titlePage.login,
    role: [],
  },
  changePassword: {
    path: router.changePassword,
    title: commonText.titlePage.changePassword,
    role: [LOGIN, IS_SHOW_MENU],
  },
  memberList: {
    path: router.memberList,
    title: commonText.titlePage.memberList,
    role: [LOGIN, IS_SHOW_MENU],
  },
  memberDetail: {
    path: router.memberDetail,
    title: commonText.titlePage.memberDetail,
    role: [LOGIN],
  },
  smsAuthen: {
    path: router.smsAuthen,
    title: commonText.titlePage.smsAuthen,
    role: [],
  },
};
