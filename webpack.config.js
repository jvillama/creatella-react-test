const path = require('path')
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Note: defined here because it will be used more than once.
const cssFilename = 'main.css';

// const extractTextPluginOptions = shouldUseRelativeAssetPaths
//   ? // Making sure that the publicPath goes back to to build folder.
//     { publicPath: Array(cssFilename.split('/').length).join('../') }
//   : {};
// const extractTextPluginOptions = {};

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html'
});
const extractTextPlugin = new ExtractTextPlugin({
  filename: cssFilename
});
const uglifyJsPlugin = new UglifyJsPlugin({
  uglifyOptions: {
    compress: {
      warnings: false,
      // Disabled because of an issue with Uglify breaking seemingly valid code:
      // https://github.com/facebookincubator/create-react-app/issues/2376
      // Pending further investigation:
      // https://github.com/mishoo/UglifyJS2/issues/2011
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      comments: false,
      // Turned on because emoji and regex is not minified properly using default
      // https://github.com/facebookincubator/create-react-app/issues/2488
      ascii_only: true,
    },
    sourceMap: true
  }
});

module.exports = {
  output: {
    path: path.resolve('public')
  },
  optimization: {
    minimizer: [uglifyJsPlugin]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false,
                },
              },
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true,
                  },
                },
              ],
            },
            // extractTextPluginOptions
          )
        ),
      }
    ]
  },
  plugins: [htmlWebpackPlugin, extractTextPlugin]
};
