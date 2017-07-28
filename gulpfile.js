var gulp = require("gulp");
var shell = require("gulp-shell");
var replace = require("gulp-replace");

function copyFiles() {
  gulp.src([
    "src/logo.png",
    "src/dist/**",
    "src/css/**",
    "src/vendor/**",
    "!src/vendor/material-design-lite/material.css"
  ], {
    base: "src"
  }).pipe(gulp.dest("www"));
}

gulp.task("webpack-build", shell.task("npm run build"));

gulp.task("handle-index", function() {
  gulp.src("src/index.html")
    .pipe(replace("href=\"/", "href=\""))
    .pipe(replace("src=\"/", "src=\""))
    .pipe(replace("<!-- cordova.js -->", "<script src=\"cordova.js\"></script>"))
    .pipe(gulp.dest("www"));
});

gulp.task("build", ["handle-index", "webpack-build"], function() {
  copyFiles();
});

gulp.task("copy", ["handle-index"], function() {
  copyFiles();
});