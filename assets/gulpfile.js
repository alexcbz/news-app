// load gulp and necessary plugins
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// check for js errors and warnings in app.js
gulp.task('jshint', function() {
	gulp.src('./src/scripts/app.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
	var imgDest = './build/images';
	gulp.src('./src/images/**/*')
		.pipe(changed(imgDest))
		.pipe(imagemin())
		.pipe(gulp.dest(imgDest));
});

// add angularjs dependency injection annotations
gulp.task('annotate', function() {
	return gulp.src('./src/scripts/app.js')
		.pipe(ngAnnotate())
		.pipe(gulp.dest('./build/scripts'));
});

// js concat, strip debugging and minify
gulp.task('scripts', ['annotate'], function() {
	gulp.src(['./src/scripts/lib/angular.js', './src/scripts/lib/angular-resource.min.js', './src/scripts/lib/jquery-1.11.0.min.js', './src/scripts/ie10-viewport-bug-workaround.js', './src/scripts/bootstrap/modal.js', './build/scripts/app.js'])
		.pipe(concat('scripts.min.js'))
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(gulp.dest('./build/scripts'));
});

// css concat, auto-prefix and minify
gulp.task('styles', function() {
	gulp.src(['./src/styles/*.css'])
		.pipe(concat('styles.min.css'))
		.pipe(autoprefix('last 2 versions'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/styles'));

	// copy fonts to build folder
	gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./build/fonts'));
});

// default gulp task
gulp.task("default", ['jshint', 'imagemin', 'scripts', 'styles']);

// watch for css and js changes
gulp.task('watch', function() {
	gulp.watch('./src/scripts/**/*.js', ['jshint', 'scripts']);
	gulp.watch('./src/styles/*.css', ['styles']);
});