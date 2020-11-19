const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
    //entry: './src/Scripts/src/main.js',
    entry: {
        "bundle": "./src/Scripts/src/main.js",
        //"bundle.min": "./src/Scripts/src/main.js"
    },
    //Turns off the 244k asset limit warning
    performance: {hints: false},
    
    devtool: 'source-map',
    output: {
        filename: 'main.[name].min.js',
        path: path.resolve(__dirname, 'dist')
    },
     optimization: { 
         minimize: true,
         minimizer: [new TerserPlugin({
             sourceMap: true,
            include: /\.min\.js$/
         })]
     },
     plugins: [
        new UnminifiedWebpackPlugin()
    ],
    

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