import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (userInput: string | undefined) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, async (args: any) => {
        return {
          loader: 'jsx',
          contents: userInput,
        };
      });

      // check to see if we have already fetched the file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedRes = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // return immediately
        if (cachedRes) {
          return cachedRes;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const res: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, res);
        return res;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // else fetch and store response in cache
        const { data, request } = await axios.get(args.path);
        const res: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, res);
        return res;
      });
    },
  };
};
