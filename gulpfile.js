var gulp = require("gulp");
var shell = require("gulp-shell");
var replace = require("gulp-replace");
var del = require("del");
var insert = require("gulp-insert");

function outputAppJsonp() {
  gulp.src("src/js/app.json")
    .pipe(insert.prepend("jsonpCallback("))
    .pipe(insert.append(");"))
    .pipe(gulp.dest("server"));
}

function copyFiles() {
  gulp.src([
    "src/img/logo.png",
    "src/js/app.json",
    "src/js/startup.js",
    "src/dist/**",
    "src/css/**",
    "src/lib/**",
    "!src/lib/material-design-lite/material.css",
    "!src/dist/bundle*.map"
  ], {
    base: "src"
  }).pipe(gulp.dest("www"));

  outputAppJsonp();
}

gulp.task("clean", function() {
  del([
    "src/dist/bundle*.js",
    "src/dist/bundle*.map",
    "www/dist/bundle*.js",
    "www/dist/bundle*.map",
  ]);
});

gulp.task("webpack-build", ["clean"], shell.task("npm run build"));

gulp.task("handle-index", function() {
  gulp.src("src/index.html")
    .pipe(replace("<!-- cordova.js -->", "<script src=\"cordova.js\"></script>"))
    .pipe(gulp.dest("www"));
});

gulp.task("build", ["handle-index", "webpack-build"], function() {
  copyFiles();
});

gulp.task("copy", ["handle-index"], function() {
  copyFiles();
});