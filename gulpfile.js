var pkg = require('./package.json'),
    dateFormat = require('dateFormat'),
    gulp = require('gulp'),
	webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
    webpackStream = require('webpack-stream'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
    header = require('gulp-header'),
    sequence = require('gulp-sequence');

var banner = ['/**',
	' * @name : <%= pkg.name %>',
	' * @version : v<%= pkg.version %>',
	' * @author : <%= pkg.author %>',
	' */',
	''].join('\n');

gulp.task('lint', function() {
	return gulp.src('app/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

/*
 * run server - connect http://localhost:9001/webpack-dev-server/main.html
 */
gulp.task('server', ['_webpack-dev-server']);

gulp.task('_webpack-dev-server', function() {
	var config = require('./webpack.config.js'),
		compiler  = webpack(config);

	var server = new WebpackDevServer( compiler , config.devServer );
	server.listen(config.devServer.port, 'localhost', function(err) {
		if(err) console.error('[webpack-dev-server failed to start :', err);
	});
});