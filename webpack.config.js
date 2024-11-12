const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // To copy non-JS files like images, icons, etc.
const ZipPlugin = require('zip-webpack-plugin'); // To automatically zip the final build (optional)


module.exports = {
    // Entry configuration for multiple files
    entry: {
        content: './src/content.tsx',
        background: './src/background.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true, // Clean dist folder before building
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg|ico)$/, // To handle your icons and images
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'icons', to: 'icons' }, // Copy any static assets (e.g., icons, manifest)
                { from: "./manifest.json", to: "manifest.json" },
            ],
        }),
        new ZipPlugin({
            filename: 'extension.zip', // Name of the zip file
            path: path.resolve(__dirname, 'dist'),
        }),
    ],
    devtool: 'source-map',
};
