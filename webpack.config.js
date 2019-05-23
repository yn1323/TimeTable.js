const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    js: './src/js/main.js'
  },
  output: {
    // Path to bundle
    path: path.resolve(__dirname, 'src/dist'),
    filename: './TimeTable.js'
  },
  module: {
    rules: [
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
    ],
  }
}

// Change Path in production mode
if (process.env.NODE_ENV === 'production'){
  module.exports.output.path = path.resolve(__dirname, 'dist')
}