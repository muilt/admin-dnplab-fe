import _ from "lodash";

export interface ILoadList {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  offset?: number;
  status?: string;
}

export const isSuccessApi = (status) => {
  if (status === 200 || status === 201) return true;
};

export const formatNumber = (val: number) => {
  if (!val) return 0;
  const value = _.floor(val);
  return value.toString().replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ".");
};
export const formatNumberInput = (val: number) => {
  const value = _.cloneDeep(val);
  if (_.isNaN(value) || !_.isNumber(value)) {
    return "";
  }
  return value.toString().replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ".");
};
