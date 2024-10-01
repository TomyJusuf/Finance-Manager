const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development', // or 'production' for optimized builds
  entry: './js/app.js', // your main app file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i, // For CSS, if needed
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/, // For JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]', // Specify the fonts folder
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Budget App', template: './index.html' }),
  ],
}
