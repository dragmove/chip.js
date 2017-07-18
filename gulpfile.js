var pkg = require('./package.json'),
  extend = require('extend'),
  gulp = require('gulp'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackStream = require('webpack-stream'),
  eslint = require('gulp-eslint');

function banner() {
  return `/*
 * ${pkg.name} ${pkg.version}
 * ${pkg.homepage}
 *
 * The MIT License (MIT)
 * Copyright (c) 2016-2017 Hyun-Seok.Kim, dragmove@gmail.com
 */
`;
}

function buildMinJS(name, options) {
  var entry = {};
  entry[name] = ['./app/src/' + name + '.js'];

  var dist = 'build';

  if (options) {
    if (options.requireBabelPolyfill === true) entry[name].unshift('babel-polyfill');
    if (options.distPath) dist = options.distPath;
  }

  var config = extend({}, require('./webpack.config.js'), {
    entry: entry,

    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: true,
          warnings: false
        },
        sourceMap: true
      }),

      new webpack.BannerPlugin({
        banner: banner(),
        raw: true
      })
    ]
  });

  return gulp.src('')
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(dist));
};

gulp.task('lint', function () {
  return gulp.src('app/src/component/*')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/*
 * run server - connect http://localhost:9001/webpack-dev-server
 */
gulp.task('webpack-dev-server', function () {
  var config = require('./webpack.config.js'),
    compiler = webpack(config);

  var server = new WebpackDevServer(compiler, config.devServer);
  server.listen(config.devServer.port, 'localhost', function (err) {
    if (err) console.error('[webpack-dev-server failed to start :', err);
  });
});

// build js
/*
 gulp.task('buildMain', () => {
 buildMinJS('main', {requireBabelPolyfill: true, distPath: './app/js/'})
 });
 */