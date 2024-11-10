const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/popup.tsx',  // The entry point of your extension (change if needed)
    output: {
        filename: 'popup.js',    // The name of the compiled file for the popup
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,   // Match TypeScript files
                use: 'ts-loader',   // Use ts-loader to compile TypeScript files
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/popup.html',  // Path to your template HTML file
            filename: 'popup.html',        // Output name for the HTML file in dist/
        }),
    ],
    devtool: 'source-map',  // Optional: Enables source maps for easier debugging
    mode: 'development',    // Use 'production' for production builds
};
