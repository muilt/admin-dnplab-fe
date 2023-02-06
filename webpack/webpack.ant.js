const webpack = require("webpack");
const webpackMerge = require("webpack-merge").merge;

const staticConfig = require("./webpack.static.js");

module.exports = webpackMerge(staticConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.SERVER_API_URL": `'http://192.168.1.165:8080'`,
      "process.env.AWS_PROJECT_REGION": `'ap-northeast-3'`,
      "process.env.AWS_COGNITO_REGION": `'ap-northeast-1'`,
      "process.env.AWS_COGNITO_USER_POOL_ID": `'ap-northeast-1_spcDFWwhU'`,
      "process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID": `'76ok1jcr768ipnqhcau95a2kpf'`,
      "process.env.AWS_COGNITO_CONFIRM_URL": `'https://dnplabo-auth-new.demoz4you.com/confirm-user'`,
    }),
  ],
});
