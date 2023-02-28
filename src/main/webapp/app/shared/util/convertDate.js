/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 *
 * @param {*} date string need convert
 */
export const convertDate = (date) => {
  return format(new Date(date), "yyyy年MM月dd日　(E)　HH:mm", { locale: ja }) || "";
};

export const convertNumber = (value) => {
  if (value) {
    return Intl.NumberFormat("en-US").format(value);
  } else return "";
};

export const convertDateTime = (date) => {
  return format(new Date(date), "yyyy/MM/dd HH:mm", { locale: ja }) || "";
};

export const convertDataDate = (date) => {
  return format(new Date(date), "yyyy-MM-dd") || "";
};

export const convertDateMember = (date) => {
  return format(new Date(date), "yyyy年MM月dd日", { locale: ja }) || "";
};
