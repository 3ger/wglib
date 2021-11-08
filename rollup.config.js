import { main } from "@pixi-build-tools/rollup-configurator/main";

var obj = main({
   excludeExternals: ['pixi-viewport'],
   production: true 
}); 

export default Object.assign(obj, { watch: true });

// import typescript from '@rollup/plugin-typescript';
// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import alias from '@rollup/plugin-alias';

// export default {
//    external: ["pixi.js", "pixi-viewport"],
//    input: 'src/index.ts',
//    output: {
//       file: 'dist/wglib.js',
//       format: 'esm',
//       sourcemap: true,
//       name: "WG"
//    },

//    plugins: [
//       /**
//        * Recommended (but not required):
//        *
//        * alias allow us to use release builds in production
//        * minified builds in PixiJS exclude verbose logs
//        * and other non-critical debugging information.
//        */
//       ...process.env.BUILD === 'production' ? [alias({
//          entries: [{
//             find: /^(@pixi\/([^\/]+))$/,
//             replacement: '$1/dist/esm/$2.min.js',
//          }, {
//             find: 'pixi.js',
//             replacement: 'pixi.js/dist/esm/pixi.min.js',
//          }]
//       })] : [],
//       /**
//        * Required!
//        * 
//        * `preferBuiltins` is required to not confuse Rollup with
//        * the 'url' dependence that is used by PixiJS utils
//        */
//       resolve({
//          preferBuiltins: false,
//          browser: true
//       }),
//       typescript(),
//       /**
//        * Required!
//        *
//        * PixiJS third-party dependencies use CommonJS exports
//        * and do not have modules bundles available 
//        */
//       commonjs(),
//    ]
// };