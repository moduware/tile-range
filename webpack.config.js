const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { 
              minimize: true,
              presets: [
                ['@babel/preset-env']
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }  
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      'images/**',
      'node_modules/@webcomponents/webcomponentsjs/**',
      'manifest.json',
			'icon.svg',
    ]),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ]
}