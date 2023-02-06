const webpack = require("webpack");
const webpackMerge = require("webpack-merge").merge;

const staticConfig = require("./webpack.static.js");

module.exports = webpackMerge(staticConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.SERVER_API_URL": `''`,
      "process.env.AWS_PROJECT_REGION": `''`,
      "process.env.AWS_COGNITO_REGION": `''`,
      "process.env.AWS_COGNITO_USER_POOL_ID": `''`,
      "process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID": `''`,
    }),
  ],
});
