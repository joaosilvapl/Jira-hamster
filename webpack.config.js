const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        contentscript: './src/js/contentscript.js',
        background: './src/js/background.js',
        popup: './src/js/popup.js',
        pagescript: './src/js/pagescript.js',
    },
    mode: 'production',
    optimization: { //TODO: For now we want to be able to easily debug, thus we avoid minifying
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
            { from: 'static/css/pagestyle.css', to: 'css/pagestyle.css' },
            { from: 'static/css/popup.css', to: 'css/popup.css' },
            { from: 'static/popup.html', to: 'popup.html' },
            { from: 'static/popup.html', to: 'popup.html' },
            { from: 'manifest.json', to: 'manifest.json' }
        ])
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
                plugins: ['transform-class-properties']
            }
        }, ]
    }
};