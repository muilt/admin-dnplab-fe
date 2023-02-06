/* eslint no-console: off */
export default () => (next) => (action) => {
  if (process.env.NODE_ENV !== "production") {
    const { type, payload, meta } = action;
  }

  return next(action);
};
