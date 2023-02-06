const webpack = require("webpack");
const webpackMerge = require("webpack-merge").merge;
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const SimpleProgressWebpackPlugin = require("simple-progress-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const path = require("path");
const sass = require("sass");

const utils = require("./utils.js");
const commonConfig = require("./webpack.common.js");

const ENV = "development";

module.exports = (options) =>
  webpackMerge(commonConfig({ env: ENV }), {
    devtool: "cheap-module-source-map", // https://reactjs.org/docs/cross-origin-errors.html
    mode: ENV,
    entry: ["./src/main/webapp/app/index"],
    output: {
      path: utils.root("target/classes/static/"),
      filename: "app/[name].bundle.js",
      chunkFilename: "app/[id].chunk.js",
    },
    optimization: {
      moduleIds: "named",
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: { implementation: sass },
            },
          ],
        },
      ],
    },
    devServer: {
      stats: options.stats,
      hot: true,
      contentBase: "./target/classes/static/",
      proxy: [
        {
          context: [
            "/api",
            "/services",
            "/management",
            "/swagger-resources",
            "/v2/api-docs",
            "/v3/api-docs",
            "/h2-console",
          ],
          target: `http${options.tls ? "s" : ""}://192.168.1.165:8080`,
          secure: false,
          changeOrigin: options.tls,
        },
      ],
      watchOptions: {
        ignore: [/node_modules/, utils.root("src/test")],
      },
      https: options.tls,
      historyApiFallback: true,
    },
    stats: process.env.JHI_DISABLE_WEBPACK_LOGS ? "none" : options.stats,
    plugins: [
      process.env.JHI_DISABLE_WEBPACK_LOGS
        ? null
        : new SimpleProgressWebpackPlugin({
            format: options.stats === "minimal" ? "compact" : "expanded",
          }),
      new webpack.DefinePlugin({
        "process.env.SERVER_API_URL": `''`,
        "process.env.AWS_PROJECT_REGION": `'ap-northeast-3'`,
        "process.env.AWS_COGNITO_REGION": `'ap-northeast-1'`,
        "process.env.AWS_COGNITO_USER_POOL_ID": `'ap-northeast-1_spcDFWwhU'`,
        "process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID": `'76ok1jcr768ipnqhcau95a2kpf'`,
        "process.env.AWS_COGNITO_CONFIRM_URL": `'https://dnplabo-auth-new.demoz4you.com/confirm-user'`,
      }),
      new FriendlyErrorsWebpackPlugin(),
      new BrowserSyncPlugin(
        {
          https: options.tls,
          host: "localhost",
          port: 8080,
          proxy: {
            target: `http${options.tls ? "s" : ""}://localhost:9060`,
            proxyOptions: {
              changeOrigin: false, //pass the Host header to the backend unchanged  https://github.com/Browsersync/browser-sync/issues/430
            },
          },
          socket: {
            clients: {
              heartbeatTimeout: 60000,
            },
          },
        },
        {
          reload: false,
        }
      ),
      new webpack.HotModuleReplacementPlugin(),
      new WebpackNotifierPlugin({
        title: "Mie FE",
      }),
    ].filter(Boolean),
  });
