import { main } from "@pixi-build-tools/rollup-configurator/main";

var obj = main({
   excludeExternals: ['pixi-viewport'],
   production: true,
   input: "./test/test.ts",
   bundle: "./test/out/test.cjs.js",
   main: "./test/out/test.js",
   module: "./test/out/test.es.js"
});

obj.splice(1, 2);
obj[0].output.splice(0, 1);
obj[0].watch = true;

export default obj;