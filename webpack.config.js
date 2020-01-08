const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/dist',
		filename: './TimeTable.js',
		chunkFilename: './TimeTable.[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						preprocess: require('svelte-preprocess')({ scss: true }),
						hotReload: true
					}
				}
			},
			// To use Sass
			{
				test: /\.scss/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							url: false
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						}
					}
				]
			}
		]
	},
	mode,
	devtool: prod ? false: 'source-map'
};
