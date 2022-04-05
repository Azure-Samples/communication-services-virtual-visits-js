// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = {
  mode: 'production',
  name: 'server',
  entry: './bin/www.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'server.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json%/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, 'web.config'), to: path.join(__dirname, 'dist') }]
    })
  ],

  // See https://github.com/Azure/ms-rest-nodeauth/issues/83:
  // Disable minimization to workaround an issue in node-fetch
  optimization: {
    minimize: false
  }
};

export default config;
