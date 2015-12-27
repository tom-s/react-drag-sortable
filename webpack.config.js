// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.js');

var config = {
    entry: {
        demo: [ path.resolve(__dirname, 'demo/demo.jsx') ],
    },
    output: {
        path: path.resolve(__dirname, 'demo/build'),
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {}
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?stage=1&optional=runtime'
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass?outputStyle=expanded=includePaths[]=" + node_modules + "/bootstrap-sass/assets/stylesheets/"
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                include: /\.json$/, loaders: ["json-loader"],
                extensions: ['', '.json', '.jsx', '.js']
            }
        ],
    }
};

module.exports = config;