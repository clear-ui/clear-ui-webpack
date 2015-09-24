var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var DEBUG = process.env.NODE_ENV !== 'production'

var DIST = path.join(__dirname, 'dist')

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

var loaders = [ 
	{
		test: /\.js$/,
		exclude: /node_modules/,
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
				'css-loader': {
					modules: true,
					sourceMap: true
				},
				'autoprefixer-loader': {
					browsers: 'last 2 versions'
				}
			})
		)
	},

	{
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract(
			'style-loader',
			loadersToString({
				'css-loader': {
					modules: true,
					sourceMap: true,
					localIdentName: DEBUG && '[local]__[hash:base64:5]'
				},
				'autoprefixer-loader': {
					browsers: ['last 2 versions', 'ios >= 7']
				},
				'sass-loader': {}
			})
		)
	},

	{
		test: /\.(png|jpg)$/,
		loader: 'url-loader?limit=8192'
	}
]


module.exports = {
    entry: entry,

    output: {
        path: DIST,
        filename: 'bundle.js'
    },

	plugins: plugins,

	module: {
		loaders: loaders
	},

	devtool: DEBUG ? 'source-map' : undefined,
	devServer: {
        contentBase: DIST
    },
	
	resolveLoaders: {
		modulesDirectories: [
			'web_loaders', 'web_modules', 'node_loaders', 'node_modules', // default
			'node_modules/clear-ui-webpack/node_modules'
		]
	}
}
