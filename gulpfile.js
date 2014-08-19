process.on("uncaughtException", function(err) {
	"use strict";
	console.log(err.stack);
	console.log(err.toString());
});
var program = require('commander');
var rimraf = require('rimraf');

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var micro = require('gulp-micro');
var size = require('gulp-size');
var zip = require('gulp-zip');

program.on('--help', function() {
	console.log('  Tasks:');
	console.log();
	console.log('    build       build the game');
	console.log('    clean       delete generated files');
	console.log('    dist        generate archive');
	console.log('    serve       launch development server');
	console.log('    watch       watch for file changes and rebuild automatically');
	console.log();
});

program
	.usage('<task> [options]')
	.option('-P, --prod', 'generate production assets')
	.parse(process.argv);

var prod = !!program.prod;

gulp.task('default', ['build']);
gulp.task('build', ['build_styles']);

gulp.task('build_index', function() {
	return gulp.src('source/index.html')
		.pipe(gulpif(prod, htmlmin({
			collapseWhitespace: true,
			removeAttributeQuotes: true,
			removeComments: true,
		})))
		.pipe(gulp.dest('build'));
});

gulp.task('build_styles', function() {
	return gulp.src('source/styles.less')
		.pipe(less())
		.pipe(concat('style.css'))
		.pipe(gulpif(prod, cssmin()))
		.pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
	rimraf.sync('build');
	rimraf.sync('dist');
});

gulp.task('dist', ['build'], function() {
	return gulp.src('build/*')
		.pipe(zip('archive.zip'))
		.pipe(size())
		.pipe(micro({
			limit: 13 * 1024
		}))
		.pipe(gulp.dest('dist'));
});