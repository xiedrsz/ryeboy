var gulp = require("gulp");
var shell = require("gulp-shell");
var replace = require("gulp-replace");

gulp.task("build-js", shell.task("npm run build"));

gulp.task("build-index", function() {
  gulp.src("src/index.html")
    .pipe(replace("href=\"/", "href=\""))
    .pipe(replace("src=\"/", "src=\""))
    .pipe(replace("<!-- cordova.js -->", "<script src=\"cordova.js\"></script>"))
    .pipe(gulp.dest("www"));
});

gulp.task("build-cordova-www", ["build-index", "build-js"], function() {
  gulp.src([
    "src/js/**",
    "src/css/**",
    "src/vendor/**",
    "!src/vendor/material-design-lite/material.css",
    "src/bundle.js",
  ], {
    base: "src"
  }).pipe(gulp.dest("www"));
});

gulp.task("cordova-build", ["build-cordova-www"]);