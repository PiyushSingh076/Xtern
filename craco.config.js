// require('react-scripts/config/env');


// module.exports = {
//   // ...
//   webpack: {
//     alias: {
//       /* ... */
//     },
//     plugins: {
//       add: [/* ... */ ],
//       remove: [
//         /* ... */
//       ],
//     },
//     configure: {
//       /* ... */
//       resolve: {
//         fallback: {
//           crypto: require.resolve("crypto-browserify"),
//         },
//       },
//     },
//     configure: (webpackConfig, { env, paths }) => {
//       webpackConfig.resolve.fallback = {};
//       webpackConfig.resolve.fallback.crypto =
//         require.resolve("crypto-browserify");
//       webpackConfig.resolve.fallback.stream =
//         require.resolve("stream-browserify");
//       webpackConfig.resolve.fallback.vm = require.resolve("vm-browserify");
//       return webpackConfig;
//     },
//   },
// };


/////////////////


require('react-scripts/config/env');

module.exports = {
  webpack: {
    alias: {
      // Define your custom aliases here
      // e.g., '@components': path.resolve(__dirname, 'src/components')
    },
    plugins: {
      add: [
        // Add any additional webpack plugins if needed
      ],
      remove: [
        // List plugins you want to remove if necessary
      ],
    },
    // Use a single configure function to modify the webpack config
    configure: (webpackConfig, { env, paths }) => {
      // Ensure that the resolve and fallback objects exist
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        // Preserve any existing fallback settings
        ...(webpackConfig.resolve.fallback || {}),

        // Define fallbacks for Node modules
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        vm: require.resolve("vm-browserify"),
      };

      return webpackConfig;
    },
  },
};
