const webpack = require('webpack')
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    vendor: ['react-hot-loader/patch',
      'admin-lte', 'bootstrap', 'history', 'lodash', 'moment', 'moment-recur',
      'redux', 'redux-thunk', 'normalizr', 'whatwg-fetch', 'react', 'prop-types',
      'react-dom', 'react-redux', 'react-router-dom', 'react-router-redux',
      'react-hot-loader', 'react-bootstrap', 'react-bootstrap-autosuggest',
      'react-bootstrap-table', 'jquery', 'redux-form', 'reselect', 'recompose',
      'react-dnd', 'react-dnd-html5-backend', 'react-quill', 'react-google-maps',
      'quill-image-drop-module', 'quill-image-resize-module', '@mapbox/polyline',
      'mapbox-gl', 'react-mapbox-gl']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          resolve(__dirname, 'client'),
          resolve(__dirname, 'common'),
          resolve(__dirname, 'node_modules', 'quill-image-drop-module'),
          resolve(__dirname, 'node_modules', 'quill-image-resize-module')
        ],
        loader: 'babel-loader',
        query: {
          presets: [['es2015', {modules: false}], 'stage-0', 'react'],
          plugins: ['react-hot-loader/babel']
        }
      }, {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['url-loader?limit=10000&name=fonts/[name]-[hash].[ext]']
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        use: ['file-loader?hash=sha512&digest=hex&name=media/[name]-[hash].[ext]']
      }
    ]
  },
  resolve: {
    alias: {
      store: resolve(__dirname, 'client', 'store'),
    }
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.Quill': 'quill'
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'client', 'index.html'),
      inject: 'body'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    })
  ]
}
