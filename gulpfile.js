var gulp = require('gulp');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var connect = require('gulp-connect');

gulp.task('browserify',function(){
  return browserify('./src/js/app.js')
    .bundle()
    .pipe(vinylSourceStream('app.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch',function(){
  gulp.watch('./src/js/*.js', ['browserify']);
  gulp.watch('./src/html/*.html', ['html']);
  gulp.watch('./src/css/*.css', ['css']);
});

gulp.task('html',function(){
  return gulp.src('./src/html/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('css',function(){
  return gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./build'));
});

gulp.task('serve',function(){
  connect.server({root:['build']});
})



gulp.task('default',['browserify','watch','html','css','serve']);
