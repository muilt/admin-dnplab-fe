import _ from "lodash";

export const isSuccessApi = (status) => {
  if (status === 200 || status === 201) return true;
};

