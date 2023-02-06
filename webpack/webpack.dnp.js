const webpack = require("webpack");
const webpackMerge = require("webpack-merge").merge;

const staticConfig = require("./webpack.static.js");

module.exports = webpackMerge(staticConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.SERVER_API_URL": `'https://member.stg.mie-vison.org'`,
      "process.env.AWS_PROJECT_REGION": `'ap-northeast-1'`,
      "process.env.AWS_COGNITO_REGION": `'ap-northeast-1'`,
      "process.env.AWS_COGNITO_USER_POOL_ID": `'ap-northeast-1_0wJQx4lOq'`,
      "process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID": `'49pkmpgmtk6rjssdehp40kqrjv'`,
      "process.env.AWS_COGNITO_CONFIRM_URL": `'https://member.stg.mie-vison.org/confirm-user'`,
    }),
  ],
});
