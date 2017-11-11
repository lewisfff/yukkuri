
var webpack = require('webpack');

module.exports = {
  entry: './js/client/client.js',
  output: {
    path: __dirname,
    filename: './public/app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'webpack-strip?strip[]=console.log',
    }, 
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};
