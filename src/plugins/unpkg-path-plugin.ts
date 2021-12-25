import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const unpkgPathPlugin = (userInput: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // if path is index.js(our entry point), return
      build.onResolve({ filter: /(^index\.js$)/ }, async (args: any) => {
        return { path: args.path, namespace: 'a' };
      });

      // if it is other than our index.js, fetch it from unpkg
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          path: new URL(
            args.path,
            // resolveDir here stores relative path to where the main file is located
            'https://unpkg.com' + args.resolveDir + '/'
          ).href,
          namespace: 'a',
        };
      });

      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // else if it is not a relative import, fetch the pkg specified
        return { path: `https://unpkg.com/${args.path}`, namespace: 'a' };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // our index.js
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: userInput,
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
