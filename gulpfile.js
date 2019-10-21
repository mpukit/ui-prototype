const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const fileinclude = require('gulp-file-include');
const gulp = require("gulp");
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps'); 
const svgmin = require('gulp-svgmin');
const vinylNamed = require('vinyl-named'); // allows use of [name] in gulp-webpack output
const webpack = require('webpack');
const webpackStream = require('webpack-stream'); // Webpack enabled for use mid-stream



/* INCLUDE & INJECT Task ================================================= */
// Inject Component Partials to Page Layouts, Inject CSS/JS Bundles
function include() {
  return gulp.src('./src/Pages/src/**/*.html')
  // Components
  .pipe(fileinclude({
    prefix: '@@',
    indent: true,
    basepath: './src/Components/**'
  }))
  // CSS + JS Inject
  .pipe(inject(
    gulp.src(['./src/Styles/dist/main.css', './src/Scripts/dist/main.bundle.js'], { read: false }), { relative: true })) // *DEV
    // gulp.src(['./src/Styles/dist/main.min.css', './src/Scripts/dist/main.bundle.min.js'], { read: false }), { relative: true })) // *PROD
  .pipe(gulp.dest('./src/Pages/dist'))
  .pipe(browserSync.stream());
}


/* CSS Task ================================================= */
// Compile SCSS to CSS
function styles() {
  // Source
  return gulp.src(['src/Styles/**/*.scss'], {base: "./src/Styles/src"})
    // Compile, write sourcemaps, postcss tasks
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    // Save
    .pipe(gulp.dest('./src/Styles/dist'))
    // Stream update to browsers
    .pipe(browserSync.stream());
}

/* MINIFY CSS Task ================================================================ */
// Minify compiled CSS file
function minstyles() {
  // Source
  return gulp.src('./src/Styles/dist/main.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({compatibility: 'ie10'}))
    .pipe(sourcemaps.write()) // *Optional
    // Save
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/Styles/dist'))
    .pipe(browserSync.stream());
}

/* JS Task ================================================================ */
// Bundle Javascript
function scripts() {
  // Source
  return gulp.src(['src/Scripts/src/main.js'], {base: "./src/Scripts/src"})
    .pipe(vinylNamed())
    .pipe(webpackStream(require('./webpack.config'), webpack))
    .pipe(gulp.dest('./src/Scripts/dist'))
    // Stream update to browsers
    .pipe(browserSync.stream());
}


/* IMAGES Task ================================================================ */
// Optimize Images (GIF, PNG, JPEG)
function images() {
  // Source
  return gulp.src('./src/Images/src/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./src/Images/dist'))
    .pipe(browserSync.stream());
}


/* SVGO Task ================================================================ */
// Optimize/minify SVG
function svgo() {
  // Source
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
    .pipe(browserSync.stream());
}


/* WATCH Task ================================================= */
// Watch files for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: "./src/",
      index: "prototype.html"
    }
  });
  // CSS
  gulp.watch('./src/Styles/**/*.scss', styles);
  // HTML
  gulp.watch('./src/Components/**/*.html', include);
  gulp.watch('./src/**/*.html').on('change', browserSync.reload);
  // JS
  gulp.watch('./src/Scripts/src/**/*.js', scripts);
  // IMAGES
  //gulp.watch('./src/Images/src/**/*.*', images); // *Optional
  // SVG
  // gulp.watch('./src/Images/src/**/*.svg', svgo); // *Optional
}

/* More Complex Tasks ================================================= */
//const build = gulp.parallel(styles, minstyles, scripts, include, images, svgo);
const build = gulp.series(styles, gulp.parallel(minstyles, scripts, include, images, svgo));
const serve = gulp.series(styles, minstyles, scripts, include, images, svgo, gulp.parallel(watch));

// Export All Tasks
exports.styles = styles;
exports.minstyles = minstyles;
exports.scripts = scripts;
exports.include = include;
exports.images = images;
exports.svgo = svgo;
exports.watch = watch;
exports.build = build;
exports.serve = serve;