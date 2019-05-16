var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/Scripts/src/main.js',
    devtool: 'inline-source-map',
    // externals: {
    //     jquery: 'jQuery'
    // },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         $: "jquery",
    //         jQuery: "jquery"
    //    })
    // ],
    // // Add the JSHint loader
    // module: {
    //     rules: [{
    //         test: /\.js$/, // Run the loader on all .js files
    //         exclude: /node_modules/, // ignore all files in the node_modules folder
    //         use: 'jshint-loader'
    //     }]
    // },
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