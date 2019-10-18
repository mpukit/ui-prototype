var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include');
var gulp = require("gulp");
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps'); 
var svgmin = require('gulp-svgmin');
var uglify = require("gulp-uglify");
var util = require("gulp-util");
var vinylNamed = require('vinyl-named'); // allows use of [name] in gulp-webpack output
var webpack = require("webpack");
var webpackConfig = require("./webpack.config");
var webpackStream = require('webpack-stream'); // Webpack enabled for use mid-stream


/* INJECT ================================================= */
// Inject Component Partials to Page Layouts, Inject CSS/JS Bundles
gulp.task('inject', function() {
  return gulp.src('./src/Pages/src/**/*.html')
    // Components
    .pipe(fileinclude({
      prefix: '@@',
      indent: true,
      basepath: './src/Components/**'
    }))
    .pipe(replace(/[\u200B-\u200D\uFEFF]/g, "")) // Strip BOM being added (gulp-file-replace issue)
    .pipe(gulp.dest('./src/Pages/dist'))
    // CSS + JS Inject
    .pipe(inject(
      gulp.src(['./src/Styles/dist/main.css', './src/Scripts/dist/main.bundle.js'], { read: false }), { relative: true }))
    .pipe(gulp.dest('./src/Pages/dist'))
    .pipe(browserSync.stream());
});


/* CSS ================================================= */
// Compile Sass, Add Prefixes, Add Sourcemaps
gulp.task('css', function () {
  return gulp.src('./src/Styles/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/Styles/dist'))
    .pipe(browserSync.stream());
});


/* MINIFY CSS ================================================= */
// Optimize/minify Stylesheets
gulp.task('minify-css', () => {
  return gulp.src('./src/Styles/dist/main.css')
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./src/Styles/dist'));
});


/* JS ================================================================ */
// Bundle Javascript
gulp.task("js", function () {
  return gulp.src('./src/Scripts/src/main.js')
      .pipe(vinylNamed())
      .pipe(webpackStream(webpackConfig))
      .pipe(gulp.dest('./src/Scripts/dist'))
});

// gulp.task("min:js", function () {
//     webpackConfig.plugins = [
//         new webpack.optimize.UglifyJsPlugin({
//             compress: { warnings: false },
//             minimize: true
//         })
//     ];
//     webpackConfig.devtool = "#source-map";
//     return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
//         .pipe(vinylNamed())
//         .pipe(webpackStream(webpackConfig))
//         .pipe(gulp.dest("."));
// });


/* IMAGES ================================================================ */
// Optimize Images (GIF, PNG, JPEG)
gulp.task('images', function() {
  return gulp.src('./src/Images/src/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./src/Images/dist'))
});


/* SVGO ================================================================ */
// Optimize/minify SVG
gulp.task('svgo', function () {
  return gulp.src('./src/Images/src/**/*.svg')
      .pipe(svgmin({
          js2svg: {
              pretty: true
          },
          plugins: [
              {
                  removeTitle: true
              }
          ]
      }))
      .pipe(gulp.dest('./src/Images/dist'))
});


/* BROWSER-SYNC ================================================= */
// Serve up files locally
gulp.task('browser-sync', function () {
  browserSync.init({
      server: {
          baseDir: "./src/",
          index: "prototype.html"
      }
  });
});


/* WATCH ================================================= */
// Watch files for changes
gulp.task('watch', function() {
  // HTML
  gulp.watch('./src/**/*.html', ['inject']);
  // CSS
  gulp.watch('./src/Styles/**/*.scss', ['css']);
  // JS
  gulp.watch(['./src/Scripts/*.js', './src/Scripts/src/*.js'], ['js']);
});


/* BUILD ================================================= */
// Compile and Bundle
gulp.task('build', function () {
    gulp.start('svgo', 'images', 'css', 'minify-css', 'inject', 'css', 'js');
});


/* SERVE ================================================= */
// Compile, Bundle, Serve in local browser, watch
gulp.task('serve', function () {
    gulp.start('svgo', 'images', 'css', 'minify-css', 'inject', 'css', 'js', 'browser-sync', 'watch');
});