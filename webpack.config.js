const webpack = require('webpack'),
  path = require('path');

module.exports = {
  context: __dirname,

  entry: {
    dropdown: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/dropdown.js'],
    fullSizeBg: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/fullSizeBg.js'],
    fullSizeCanvasVideo: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/fullSizeCanvasVideo.js'], // TODO
    fullSizeVideo: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/fullSizeVideo.js'],
    horizontalSlideNavi: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/horizontalSlideNavi.js'],
    imageLoader: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/imageLoader.js'],
    modal: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/modal.js'],
    modalHasOverlay: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/modalHasOverlay.js'],
    navi: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/navi.js'],
    naviHasTimer: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/naviHasTimer.js'],
    overlay: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/overlay.js'],
    slideTab: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/slideTab.js'],
    youtubeModal: [/*'webpack/hot/dev-server', 'babel-polyfill',*/ './app/src/youtubeModal.js']
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'app/build')
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: [
            ["env", {
              "modules": false
            }]
          ]
        }
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
      sourceMap: true,
      mangle: false,
      output: {
        beautify: true,
        comments: true
      },
      compress: {
        unused: true,
        drop_console: false,
        warnings: true
      }
    }),

    new webpack.BannerPlugin({
      banner: '',
      raw: true
    })
  ],

  devServer: {
    contentBase: './app',
    noInfo: true, //  --no-info option
    // host: '',
    port: 9000,
    hot: true,
    inline: true
  }
};