var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var DEBUG = process.env.NODE_ENV !== 'production'

var entry = []
if (DEBUG) entry.push('webpack/hot/dev-server')


var plugins = [
	new ExtractTextPlugin('styles.css'),
	new webpack.DefinePlugin({DEBUG: DEBUG})
]

if (DEBUG) {
	plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
	plugins.push(new webpack.optimize.UglifyJsPlugin())
}


function loadersToString(loaders) {
	var res = []
	for (var name in loaders) {
		var params = loaders[name]
		res.push(name + '?' + JSON.stringify(params))
	}
	return res.join('!')
}

var cssLoaderOptions = {
	modules: true,
	sourceMap: true,
	localIdentName: DEBUG && '[local]__[hash:base64:5]'
}

var autoprefixerLoaderOptions = {
	browsers: ['last 2 versions', 'ios >= 7']
}

var loaders = [
	{
		test: /\.js$/,
		loader: loadersToString({
			'babel': {
				optional: ['runtime'],
				stage: 0,
				cacheDirectory: true
			}
		})
	},

	{
		test: /\.css$/,
		loader: ExtractTextPlugin.extract(
			'style-loader',
			loadersToString({
				'css-loader': cssLoaderOptions,
				'autoprefixer-loader': autoprefixerLoaderOptions
			})
		)
	},

	{
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract(
			'style-loader',
			loadersToString({
				'css-loader': cssLoaderOptions,
				'autoprefixer-loader': autoprefixerLoaderOptions,
				'sass-loader': {}
			})
		)
	},

	{
		test: /\.svg$/,
		loader: loadersToString({
			'svg-sprite': {
				name: '[name]_[hash]',
				prefixize: true
			},
			'image': {}
		})
	},

	{
		test: /\.(png|jpg)$/,
		loader: 'url-loader?limit=8192'
	}
]


module.exports = {
    entry: entry,

	plugins: plugins,

	module: {
		loaders: loaders
	},

	devtool: DEBUG ? 'source-map' : undefined,

	resolve: {
		alias: {
			'babel-runtime': path.join(__dirname, 'node_modules/babel-runtime')
		}
	},

	resolveLoader: {
		modulesDirectories: [
			'web_loaders', 'web_modules', 'node_loaders', 'node_modules', // default
			'node_modules/clear-ui-webpack/node_modules'
		]
	}
}
