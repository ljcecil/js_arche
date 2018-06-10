"use strict";

var gulp = require('gulp'),
  useref = require('gulp-useref'),
  strip = require('gulp-strip-comments'),
  removeEmptyLines = require('gulp-remove-empty-lines');

var options = {
    src: 'src',
    dist: 'dist',
    orig: 'orig'
};

gulp.task('html', function() {
    return gulp.src(options.src + '/index.html')
        .pipe(useref())
        .pipe(strip())
        .pipe(removeEmptyLines())
        .pipe(gulp.dest(options.dist));
});

gulp.task('orig', function() {
    return gulp.src(options.src + '/orig.html')
        .pipe(useref())
        .pipe(strip())
        .pipe(removeEmptyLines())
        .pipe(gulp.dest(options.orig));
});

gulp.task("build", function() {
  return gulp.src(['index.html'], { base: './'})
            .pipe(gulp.dest('dist'));
});

gulp.task("build2", function() {
  return gulp.src(['orig.html'], { base: './'})
            .pipe(gulp.dest('orig'));
});

gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function() {
  gulp.start('build');
});
