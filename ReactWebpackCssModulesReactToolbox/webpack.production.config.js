var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.s?css$/,
	loader: ExtractTextPlugin.extract(
		'style',
		'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass'
	)
});
// global css files
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.s?css$/,
	loader: ExtractTextPlugin.extract(
		'style',
		'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap'
	)
});

module.exports = {
	entry: [
		'./src/App.js'
	],
	output: {
		path: path.join(__dirname, 'public'),
		filename: '[chunkhash].js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders
	},
	sassLoader: {
		data: '@import "styles/Theme.scss";',
		includePaths: [path.resolve(__dirname, './src/')]
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('[contenthash].css', {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: './src/template.html',
			title: 'React + Webpack + React-toolbox'
		})
	]
};
