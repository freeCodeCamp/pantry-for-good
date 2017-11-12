const webpack = require('webpack')
const merge = require('webpack-merge')
const {resolve} = require('path')
const autoprefixer = require('autoprefixer')

const common = require('./webpack.config')

module.exports = merge(common, {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      'whatwg-fetch',
      resolve(__dirname, 'client', 'app.js')
    ]
  },
  output: {
    path: resolve(__dirname, 'dist', 'client'),
    filename: '[name].js',
    // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
    publicPath: 'http://localhost:8080/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          {loader: 'postcss-loader', options: {plugins: () => [autoprefixer]}}
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
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
    contentBase: resolve(__dirname, 'assets'),
    port: 8080,
    historyApiFallback: {
      index: 'http://localhost:8080/'
    }
  },
  devtool: 'eval'
})
