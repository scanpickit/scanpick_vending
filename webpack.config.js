// webpack.config.js
module.exports = {
    // Other configuration options...
    ignoreWarnings: [
      {
        module: /html5-qrcode\/esm\/zxing-html5-qrcode-decoder\.js/,
        message: /Failed to parse source map/,
      },
    ],
    // Other configuration options...
  };
  