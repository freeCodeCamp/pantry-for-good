const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const nodemon = require('gulp-nodemon')
const del = require('del')

const webpackConfigDev = require('./webpack.config.dev')
const webpackConfigProd = require('./webpack.config.prod')

gulp.task('clean-common', function() {
  return del('dist/common')
})

gulp.task('build-common', ['clean-common'], function() {
  return gulp.src('common/**/*')
    .pipe(babel({
      only: /\.js$/
    }))
    .pipe(gulp.dest('dist/common'))
})

gulp.task('clean-server', function() {
  return del('dist/server')
})

gulp.task('build-server', ['clean-server','build-common'], function() {
  return gulp.src(['server/**/*', '!server/tests/**', '!server/tests', '!server/entry.test.js', '!server/index.js'])
    .pipe(babel({
      only: /\.js$/
    }))
    .pipe(gulp.dest('dist/server'))
})


gulp.task('clean-client', function() {
  return del('dist/client')
})

gulp.task('build-client', ['clean-client'], function(done) {
  webpack(webpackConfigProd).run(function(err, stats) {
    /* eslint-disable no-console */
    if (err) console.error(err)
    else console.log(stats.toString())
    /* eslint-enable no-console */
    done()
  })
})

gulp.task('minify', ['build-client'], function() {
  return gulp.src('dist/client/*.js')
    .pipe(uglify({
      compress: {warnings: false}
    }))
    .on('error', function (err) {
      // eslint-disable-next-line no-console
      console.log('uglify error:', err.toString())
    })
    .pipe(gulp.dest('dist/client', {
      overwrite: true
    }))
})


gulp.task('watch-server', function() {
  nodemon({
    watch: ['server/**/*.js', 'common/**/*.js'],
    exec: "node ./server/index.js"
  })
})

gulp.task('watch-client', ['watch-server'], function() {
  var compiler = webpack(webpackConfigDev)
  new webpackDevServer(compiler, webpackConfigDev.devServer)
    .listen(webpackConfigDev.devServer.port)
})

gulp.task('build', ['build-server', 'build-client', 'minify'])

gulp.task('watch', ['watch-server', 'watch-client'])
