const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        contentscript: './src/js/contentscript.js',
        background: './src/js/background.js',
        popup: './src/js/popup.js',
    },
    mode: 'production',
    optimization: { //TODO: make this with conditional
        minimize: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]_bundle.js'
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