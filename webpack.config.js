const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
		main: ['./src/index.js'],
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {minimize: true},
                    }
                ]
            },
            {
				test: /\.css$/,
				use: [{
					loader: MiniCssExtractPlugin.loader,
					options: {}
				}, 'css-loader']
			},

            {
                test: /\.s[sc]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.(ttf|png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/i,
                type: 'asset/resource',
              },
            {
				test: /\.js$/,
				exclude: /node-modules/,
                use: [
                    {
                        loader: 'babel-loader',
	                }
                ]
			},

        ],
    },
    plugins: [
        new HtmlWebPackPlugin ({
            template: './src/index.html',
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css"
		}),
    ],
    devServer: {
        compress: true,
        port: 3000,
    },
}


