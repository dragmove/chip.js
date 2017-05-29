var webpack = require('webpack'),
  path = require('path');

module.exports = {
  devServer: {
    contentBase: './app',
    noInfo: true, //  --no-info option
    // host: '',
    port: 9001,
    hot: true,
    inline: true
  },

  context: __dirname,

  entry: {
    main: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/main.js'],
    imageLoader: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/imageLoader.js']
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'app/build')
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]

    /*
     loaders: [
     {test: /\.css$/, loader: "style!css"},
     {test: /\.jsx?$/, loaders: ['babel'], exclude: /(node_modules|bower_components)/}
     ]
     */
  },

  // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: false,
        warnings: false
      },
      sourceMap: true
    }),

    new webpack.BannerPlugin({
      banner: '',
      raw: true
    })
  ]
};