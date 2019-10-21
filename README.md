# UI Prototype (Starter)
### HTML/CSS/JS Prototype using **[Bootstrap 4](http://getbootstrap.com/)**, **[Webpack](https://webpack.js.org)** and **[Gulp 4](https://gulpjs.org/)** as a task-runner.
*Requires **[Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)**, **[Webpack](https://github.com/webpack)** and **[Node](https://nodejs.org/en/download/)**.

---

Navigate to the root directory:
```js
cd ui-prototype
```

Run 'npm install' to install the required dependencies:
```js
npm install
```

Run 'gulp serve' to build, serve the site up locally and start watching files:
```js
gulp serve
```

Update browser support as needed in "browserslist" config in package.json, or create a separated '.browserlistrc' file:
[https://github.com/browserslist/browserslist#readme]

### Task List

#### Build
Compile and Bundle
```js
gulp build
```

#### Serve
Compile, Bundle, Serve in local browser, watch
```js
gulp serve
```

### Individual Tasks 

#### Inject
Inject Component Partials to Page Layouts, Inject CSS/JS Bundles
```js
gulp include
```

#### CSS
Compile Sass, Add Prefixes, Add Sourcemaps
```js
gulp styles
```

#### Minify CSS
Optimize/minify Stylesheets
```js
gulp minstyles
```

#### JS
Bundle Javascript
```js
gulp scripts
```

#### Images
Optimize Images (GIF, PNG, JPEG only)
```js
gulp images
```

#### SVG
Optimize/minify SVG
```js
gulp svgo
```

#### Watch
Watch files for changes, Run BrowserSync
```js
gulp watch
```

---

