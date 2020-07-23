// import 'dotenv/config'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const nodeEnv = process.env.NODE_ENV
const isProduction = nodeEnv === 'production'
const distDir = path.resolve(__dirname, 'dist')

// Remove mini-css-extract-plugin log spam
// See: https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/97
class CleanUpStatsPlugin {
  // eslint-disable-next-line class-methods-use-this
  shouldPickStatChild(child) {
    return child.name.indexOf('mini-css-extract-plugin') !== 0
  }

  apply(compiler) {
    compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
      const { children } = stats.compilation
      if (Array.isArray(children)) {
        // eslint-disable-next-line no-param-reassign
        stats.compilation.children = children.filter((child) => this.shouldPickStatChild(child))
      }
    })
  }
}

// ==== init plugins
const plugins = [
  new MiniCssExtractPlugin({
    filename: 'styles-[hash].css',
  }),
  new HtmlWebpackPlugin({
    template: './public/index.html',
  }),
  new webpack.DefinePlugin({
    process: {
      env: {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    },
  }),
  new CleanUpStatsPlugin(),
  new CleanWebpackPlugin(),
]

// ====== webpack config
const webPackConfig = {
  entry: ['./webapp/Main.jsx'],
  mode: nodeEnv,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    alias: {
      '@common': path.resolve(__dirname, 'common/'),
      '@webapp': path.resolve(__dirname, 'webapp/'),
    },
  },
  output: {
    filename: 'bundle-[hash].js',
    path: distDir,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportGlobals: true,
                localIdentName: `${isProduction ? '' : '[path][name]__[local]-'}[hash:base64:5]`,
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins,
}

webpack.optimization = {
  minimizer: [
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        compress: true,
        output: { comments: false },
      },
      sourceMap: true,
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
}

module.exports = webPackConfig
