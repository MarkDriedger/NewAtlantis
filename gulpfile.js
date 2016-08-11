var gulp = require('gulp');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');

gulp.task('browserify',function(){
  return browserify('./src/js/app.js')
    .bundle()
    .pipe(vinylSourceStream('app.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch',function(){
  gulp.watch('./src/js/*.js', ['browserify'])
})

gulp.task('default',['browserify','watch']);
