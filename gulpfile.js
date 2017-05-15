const gulp = require('gulp')
const babel = require('gulp-babel')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const nodemon = require('gulp-nodemon')
const del = require('del')

const webpackConfigDev = require('./webpack.config.dev')
const webpackConfigProd = require('./webpack.config.prod')

gulp.task('clean-server', function() {
  return del('dist')
})

gulp.task('build-common', ['clean-server'], function() {
  return gulp.src('common/**/*')
    .pipe(babel({
      only: /\.js$/
    }))
    .pipe(gulp.dest('dist/common'))
})

gulp.task('build-server', ['build-common'], function() {
  return gulp.src('server/**/*')
    .pipe(babel({
      only: /\.js$/
    }))
    .pipe(gulp.dest('dist/server'))
})


gulp.task('clean-client', function() {
  return del('public/dist')
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

gulp.task('build', ['build-server', 'build-client'])

gulp.task('watch', ['watch-server', 'watch-client'])
