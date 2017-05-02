var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      'whatwg-fetch',
      path.resolve(__dirname, 'client', 'app.js')
    ],
    vendor: ['react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'admin-lte', 'bootstrap', 'history', 'lodash', 'moment', 'moment-recur',
      'redux', 'redux-thunk', 'normalizr', 'whatwg-fetch', 'react',
      'react-dom', 'react-redux', 'react-router-dom', 'react-router-redux',
      'react-hot-loader', 'react-bootstrap', 'react-bootstrap-autosuggest',
      'react-bootstrap-table', 'jquery', 'redux-form', 'reselect', 'recompose',
      'react-dnd', 'react-dnd-html5-backend']
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'bundle.js',
    // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
    publicPath: 'http://localhost:8080/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css?sourceMap'
      }, {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&name=fonts/[name]-[hash].[ext]'
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file?hash=sha512&digest=hex&name=media/[name]-[hash].[ext]',
      }
    ]
  },
  resolve: {
    alias: {
      store: path.resolve(__dirname, 'client', 'store')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'index.html'),
      inject: 'body'
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'public', 'media'),
      to: path.resolve(__dirname, 'public', 'dist', 'media')
    }, {
      from: path.resolve(__dirname, 'client', 'modules', 'core', 'img'),
      to: path.resolve(__dirname, 'public', 'dist', 'media')
    }]),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: !process.env.NODE_ENV ||
                        process.env.NODE_ENV === 'development',
      __TEST__: process.env.NODE_ENV === 'test'
    })
  ],
  devServer: {
    hot: true,
    stats: {
      colors: true,
      chunks: false
    },
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
        proxyTimeout: 3000
      }
    },
    contentBase: '/dist',
    port: 8080,
    historyApiFallback: {
      index: 'http://localhost:8080/'
    }
  },
  devtool: 'eval'
};
