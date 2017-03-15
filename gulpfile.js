var gulp = require('gulp');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var nodemon = require('gulp-nodemon');

var webpackConfig = require('./webpack.config');

var webpackDevServer;
if (process.env.NODE_ENV !== 'production') {
  webpackDevServer = require('webpack-dev-server');
}

gulp.task('build-client', function(done) {
  webpack(webpackConfig).run(function(err, stats) {
    if (err) console.error(err);
    else console.log(stats.toString());
    done();
  });
});

gulp.task('build-server', function(done) {
  // build server with babel
  done();
});

gulp.task('watch-server', function() {
  nodemon({
    watch: ['server.js', 'app/**/*.js', 'config/**/*.js'],
    exec: "node ./index.js"
  });
});

gulp.task('watch-client', ['watch-server'], function() {
  var compiler = webpack(webpackConfig);
  new webpackDevServer(compiler, webpackConfig.devServer)
    .listen(webpackConfig.devServer.port);
});

gulp.task('compress', ['build-client'], function() {
  return gulp.src('public/dist/*.js')
    .pipe(uglify({
      compress: {warnings: false}
    }))
    .pipe(gulp.dest('public/dist', {
      overwrite: true
    }));
});

gulp.task('build', ['build-client', 'compress']);

gulp.task('watch', ['watch-server', 'watch-client']);
