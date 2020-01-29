const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: slsw.lib.entries,
  plugins: [
    new Dotenv({
      path:  '../../variables.env.{ENV}'
    })
  ],
  externals: [nodeExternals({
    modulesDir: path.join(__dirname, '../../node_modules'),
  })]
};