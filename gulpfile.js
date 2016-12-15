var pkg = require('./package.json'),
  extend = require('extend'),
  dateFormat = require('dateFormat'),
  gulp = require('gulp'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackStream = require('webpack-stream'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  rename = require('gulp-rename'),
  header = require('gulp-header'),
  sequence = require('gulp-sequence');

//var banner = ['/**',
//  ' * @name : <%= pkg.name %>',
//  ' * @version : v<%= pkg.version %>',
//  ' * @author : <%= pkg.author %>',
//  ' */',
//  ''].join('\n');

function banner(distName) {
  var date = new Date();
  return [
    '/**',
    ' * @update : ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
    ' */',
    ''].join('\n');
}

function buildMergeJS(name, options) {
  var entry = {};

  if (options) {
    if (options.hasNoBabelPolyfill) {
      entry[name] = ['./app/src/' + name + '.js'];
    }
  } else {
    entry[name] = ['babel-polyfill', './app/src/' + name + '.js'];
  }

  var config = extend({}, require('./webpack.config.js'), {
    devtool: 'eval-source-map',
    entry: entry,
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: false,
          warnings: false
        },
        sourceMap: true,
        mangle: false
      })
    ]
  });

  var dist = (options && options.distPath) ? options.distPath : 'js';
  return gulp.src('')
    .pipe(webpackStream(config))
    .pipe(concat(name + '.merge.js'))
    .pipe(header(banner('dev')))
    .pipe(gulp.dest(dist));
};

gulp.task('lint', function () {
  return gulp.src('app/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/*
 * run server - connect http://localhost:9001/webpack-dev-server/main.html
 */
gulp.task('webpack-dev-server', function () {
  var config = require('./webpack.config.js'),
    compiler = webpack(config);

  var server = new WebpackDevServer(compiler, config.devServer);
  server.listen(config.devServer.port, 'localhost', function (err) {
    if (err) console.error('[webpack-dev-server failed to start :', err);
  });
});

gulp.task('devMain', () => { buildMergeJS('main', {hasNoBabelPolyfill: true, distPath: './app/js/'}) });