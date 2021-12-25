import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
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
    },
  };
};
