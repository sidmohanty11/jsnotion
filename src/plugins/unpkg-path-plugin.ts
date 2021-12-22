import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            path: new URL(args.path, args.importer + '/').href,
            namespace: 'a',
          };
        }

        return { path: `https://unpkg.com/${args.path}`, namespace: 'a' };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('medium-test-pkg');
              console.log(message);
            `,
          };
        } else {
          const { data } = await axios.get(args.path);
          return {
            loader: 'jsx',
            contents: data,
          };
        }
      });
    },
  };
};
