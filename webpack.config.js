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
    dropdown: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/dropdown.js'],
    fullSizeBg: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/fullSizeBg.js'],
    imageLoader: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/imageLoader.js'],
    modal: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/modal.js'],
    modalHasOverlay: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/modalHasOverlay.js'],
    navi: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/navi.js'],
    naviHasTimer: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/naviHasTimer.js'],
    overlay: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/src/overlay.js']
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