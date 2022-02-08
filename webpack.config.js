const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.ts',
  // plugins: [new BundleAnalyzerPlugin()],
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    '@clean-js/presenter': '@clean-js/presenter',
  },

  output: {
    clean: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: '@routine-js/table',
      type: 'umd',
    },
  },
};
