import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        // if path is index.js, return
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // if it is other than our index.js, fetch it from unpkg
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            path: new URL(
              args.path,
              // resolveDir here stores relative path to where the main file is located
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
            namespace: 'a',
          };
        }

        // else if it is not a relative import, fetch the pkg specified
        return { path: `https://unpkg.com/${args.path}`, namespace: 'a' };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        // our index.js
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('nested-test-pkg');
              console.log(message);
            `,
          };
        } else {
          // fetch data from unkpg

          // check to see if we have already fetched the file
          const cachedRes = await fileCache.getItem<esbuild.OnLoadResult>(
            args.path
          );
          // return immediately
          if (cachedRes) {
            return cachedRes;
          }
          // else fetch and store response in cache
          const { data, request } = await axios.get(args.path);

          const res: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: data,
            resolveDir: new URL('./', request.responseURL).pathname,
          };

          await fileCache.setItem(args.path, res);
          return res;
        }
      });
    },
  };
};
