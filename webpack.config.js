const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    //entry: './src/Scripts/src/main.js',
    mode: 'development',
    entry: {
        "bundle": "./src/Scripts/src/main.js",
        "bundle.min": "./src/Scripts/src/main.js"
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[id].[hash:8].js'
    },
     optimization: { 
         minimize: true,
         minimizer: [new UglifyJsPlugin({
           include: /\.min\.js$/
         })]
     },
    
    
    // Support for Individual Bootstrap Component Loading
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                include: [__dirname + '/assets/js/', __dirname + '/node_modules/bootstrap/js/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-2'],
                        plugins: ['transform-runtime']
                    }
                }
            }
        ]
    }
};