var path = require("path");
var webpack = require("webpack");
var build = (require("./src/js/app.json")).build;

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ["babel-polyfill", "./main.js"],
  output: {
    path: path.resolve(__dirname, "src/dist"),
    publicPath: "dist/",
    filename: `bundle.${build}.js`
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: "vue-loader",
      options: {
        loaders: {
          "scss": "vue-style-loader!css-loader!sass-loader",
          "sass": "vue-style-loader!css-loader!sass-loader?indentedSyntax"
        }
      }
    },
    {
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loaders: ["style-loader", "css-loader", "sass-loader"]
    },
    {
      test: /\.json$/,
      use: "json-loader"
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: "file-loader",
      options: {
        name: "[name].[ext]?[hash]"
      }
    }
    ]
  },
  resolve: {
    alias: {
      "vue$": "vue/dist/vue.common.js",
      "js": path.resolve(__dirname, "src/js/"),
      "api": path.resolve(__dirname, "src/api/"),
      "store": path.resolve(__dirname, "src/store/"),
      "scss": path.resolve(__dirname, "src/scss/"),
      "css": path.resolve(__dirname, "src/css/"),
      "img": path.resolve(__dirname, "src/img/"),
      "components": path.resolve(__dirname, "src/components/"),
      "lib": path.resolve(__dirname, "src/lib/"),
      "ui": path.resolve(__dirname, "src/components/ui")
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "#source-map";
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "\"production\""
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}