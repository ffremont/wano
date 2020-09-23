module.exports = {
    globDirectory: './build/',
    globPatterns: [
      '\*\*/\*.{html,js,css,svg}'
    ],
    swDest: './build/my-sw.js',
    clientsClaim: true,
    skipWaiting: true
  };