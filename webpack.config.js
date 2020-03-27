const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: slsw.lib.entries,
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, './variables.env')
    })
  ],
  optimization: {
    // We not want to minimize our code.
    minimize: false
  },
  performance: {
    // Turn  off size warning for entry points
    hints: false
  },
  externals: [nodeExternals({
    modulesDir: path.join(__dirname, 'node_modules')
  })]
}
