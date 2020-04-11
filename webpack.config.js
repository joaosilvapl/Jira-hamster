const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/contentscript.js',
    mode: 'production',
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/contentscript_bundle.js'
    },
    plugins: [
        new CopyPlugin([
            { from: 'static/images', to: 'images' },
            { from: 'static/js', to: 'js' },
            { from: 'static/css', to: 'css' },
            { from: 'static/popup.html', to: 'popup.html' },
            { from: 'manifest.json', to: 'manifest.json' }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-class-properties']
                }
            },
        ]
    }
};