module.exports = {
    // parser: 'sugarss',
    // map: false,
    plugins: {
        'postcss-flexbugs-fixes': {},
        'postcss-preset-env': {
            autoprefixer: {
                flexbox: 'no-2009',
                // to edit target browsers: use "browserslist" field in package.json
                // browsers: 'last 5 version'
            },
            stage: 3,
            features: {
                'custom-properties': false,
            },
        },
        "postcss-import": {},
        "postcss-url": {},
        "postcss-cssnext": {},
        "postcss-nested": {},
        // "cssnano": {}, // cssnano基于 PostCSS 生态系统的 CSS 压缩工具。
    }
}