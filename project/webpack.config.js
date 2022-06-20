const path = require('path');

module.exports = {
	entry: {
		game: './src/main.js',
	},

	resolve: {
		extensions: ['.es6', '.js'],
		modules: ['node_modules']
	},

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'js')
	}
};
