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
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps'); 
const svgmin = require('gulp-svgmin');
const vinylNamed = require('vinyl-named'); // allows use of [name] in gulp-webpack output
const webpackConfig = require("./webpack.config");
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
    gulp.src(['./src/Styles/dist/main.css', './src/Scripts/dist/main.bundle.js'], { read: false }), { relative: true }))
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
  //.pipe(cleanCSS({compatibility: 'ie10'})) // TESTING ....
  .pipe(sourcemaps.write('.'))
  // Save
  .pipe(gulp.dest('./src/styles/dist'))
  // Stream update to browsers
  .pipe(browserSync.stream());
}

/* JS Task ================================================================ */
// Bundle Javascript
function scripts() {
  // Source
  return gulp.src(['src/Scripts/src/main.js'], {base: "./src/Scripts/src"})
  .pipe(vinylNamed())
  .pipe(webpackStream(webpackConfig))
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
  //gulp.watch('./src/**/*.html').on('change', browserSync.reload);
  // JS
  gulp.watch('./src/Scripts/src/**/*.js', scripts);
  // IMAGES
  //gulp.watch('./src/Images/src/**/*.*', images); // *Optional
  // SVG
  // gulp.watch('./src/Images/src/**/*.svg', svgo); // *Optional
}

/* More Complex Tasks ================================================= */
const build = gulp.parallel(styles, scripts, include, images, svgo);
const serve = gulp.series(styles, scripts, include, images, svgo, gulp.parallel(watch));

// Export All Tasks
exports.styles = styles;
exports.scripts = scripts;
exports.include = include;
exports.images = images;
exports.svgo = svgo;
exports.watch = watch;
exports.build = build;
exports.serve = serve;