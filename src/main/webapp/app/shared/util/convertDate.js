/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { ja } from "date-fns/locale";
import { format } from "date-fns";

/**
 *
 * @param {*} date string need convert
 */
/* eslint-disable no-irregular-whitespace */
export const convertDate = (date) => {
  return format(new Date(date), "yyyy年MM月dd日　(E)　HH:mm", { locale: ja }) || ""
};

export const convertNumber = (value) => {
  if (value) {
    return Intl.NumberFormat("en-US").format(value);
  } else return "";
};
