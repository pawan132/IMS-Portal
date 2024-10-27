const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/ipinfo',
    createProxyMiddleware({
      target: 'https://ipinfo.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api/ipinfo': '/',
      },
    })
  );
};
