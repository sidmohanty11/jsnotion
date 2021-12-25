import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (userInput: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
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
