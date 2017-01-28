var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      path.resolve(__dirname, 'public', 'application.js')
    ],
    vendor: ['webpack-dev-server/client?http://localhost:8080', 'jquery', 'lodash', 'angular',
            'angular-resource', 'angular-file-upload', 'angular-simple-logger', 'angular-google-maps',
            'angular-moment', 'angular-smart-table', 'angular-ui-bootstrap', 'angular-ui-router',
            'angular-datatables', 'datatables.net', 'datatables.net-bs', 'datatables.net-buttons',
            'datatables.net-buttons-bs', 'admin-lte', 'bootstrap', 'moment', 'moment-recur']
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
        exclude: /(node_modules|public\/lib)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-object-rest-spread']
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
      }, {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body'
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'public', 'media'),
      to: path.resolve(__dirname, 'public', 'dist', 'media')
    }, {
      from: path.resolve(__dirname, 'public', 'modules', 'core', 'img'),
      to: path.resolve(__dirname, 'public', 'dist', 'media')
    }]),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
  ],
  devServer: {
		hot: true,
		stats: {
			colors: true,
			chunks: false
		},
		proxy: {
			'/api/*': 'http://localhost:3000',
			'/users/*': 'http://localhost:3000',
			'/admin/*': 'http://localhost:3000',
      '/customer/*': 'http://localhost:3000',
      '/auth/*': 'http://localhost:3000'
		},
		contentBase: '/dist',
    port: 8080
	},
  devtool: 'source-map'
};