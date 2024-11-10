const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Entry configuration for multiple files
    entry: {
        content: './src/content.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',  // Will preserve subfolders if needed
        // filename: (pathData) => {
        //     // Preserve folder structure relative to src/
        //     return pathData.chunk.name.replace('src/', '') + '.js';
        // },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    // devtool: 'eval-source-map',
    // devtool: 'inline-source-map',
    devtool: 'source-map',
    // watch: true, // automatically rebuilds on file changes
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './src/index.html'
    //     })
    // ]
    // optimization: {
    //     minimize: false, // Disable minification in development
    // },
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': JSON.stringify('development'),
    //     }),
    // ],
};
