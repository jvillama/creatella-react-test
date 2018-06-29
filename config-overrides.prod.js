const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
  config.output.filename = '[name].js';

  config.plugins[4] = new ExtractTextPlugin({
    filename: '[name].css'
  })
}