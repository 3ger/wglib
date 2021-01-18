/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const NpmDtsPlugin = require("npm-dts-webpack-plugin");

module.exports = {
   entry: path.resolve(__dirname, "src") + "/core/WgLib.ts",
   mode: "production",
   output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "wglib.js",
      library: "wglib",
      libraryTarget: "umd",
      libraryExport: "WgLib",
      umdNamedDefine: true,
   },
   watchOptions: {
      ignored: /node_modules/,
   },
   devtool: "source-map",
   devServer: {
      watchContentBase: true,
   },
   resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
         },
         {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
         },
      ],
   },
   externals: { "pixi.js": "PIXI", "pixi-viewport": "Viewport" },
   plugins: [
      new webpack.ProvidePlugin({
         PIXI: "pixi.js",
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
         patterns: [path.resolve(__dirname, "./src", "wglib.css")],
      }),
      new NpmDtsPlugin({
         entry: path.resolve(__dirname, "src") + "/core/wglib.ts",
         output: path.resolve(__dirname, "dist") + "/wglib.d.ts",
      }),
   ],
};
