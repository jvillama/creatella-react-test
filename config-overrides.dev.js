const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(config) {
  // config.entry[2] = "./src/index.js"

  // config.plugins.splice(1, 0, new HtmlWebpackPlugin({
  //   inject: true,
  //   template: "./src/index.html",
  // }));
  
  config.plugins[1] = new HtmlWebpackPlugin({
    inject: true,
    template: "./src/index.html",
  })
}