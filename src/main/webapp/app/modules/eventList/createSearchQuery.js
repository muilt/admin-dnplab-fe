const encodiedAmpersand = "&";

export const makeSearchQuery = (key, values) => {
  if (typeof values === "object") return "";
  if ((values === "" || !values) && values !== 0) return "";
  return `${key}=${values}${encodiedAmpersand}`;
};

// sort
export const makeMultiSearchQuery = (key, values) => {
  if (!values || values.length === 0) return "";
  if (typeof values === "string") {
    return `${key}=${values}${encodiedAmpersand}`;
  }
  const multiQuery = values.reduce((accumulator, value) => {
    const q = `${key}=${value.column},${value.type}${encodiedAmpersand}`;
    return accumulator + q;
  }, "");
  return multiQuery;
};

// queryを生成する方法を修正する必要がある。
// 新しく追加されている項目に対応できていない。
export const createSearchQuery = (params) => {
  let searchParams = "";
  if (params && params.endsWith(encodiedAmpersand)) {
    searchParams = params.slice(0, searchParams.length - encodiedAmpersand.length);
  }
  return searchParams;
};
