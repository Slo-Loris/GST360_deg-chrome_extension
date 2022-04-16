const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const path = require("path");

module.exports = merge(config, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
});
