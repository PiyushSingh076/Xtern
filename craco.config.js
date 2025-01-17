module.exports = {
  // ...
  webpack: {
    alias: {
      /* ... */
    },
    plugins: {
      add: [
        /* ... */
      ],
      remove: [
        /* ... */
      ],
    },
    configure: {
      /* ... */
      resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
        }
      }
    },
    configure: (webpackConfig, { env, paths }) => {
        webpackConfig.resolve.fallback = {}
      webpackConfig.resolve.fallback.crypto = require.resolve("crypto-browserify");
      webpackConfig.resolve.fallback.stream = require.resolve("stream-browserify");
      webpackConfig.resolve.fallback.vm = require.resolve("vm-browserify");
      return webpackConfig;
    },
  },
};
