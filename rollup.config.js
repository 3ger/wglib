import { main } from "@pixi-build-tools/rollup-configurator/main";

var obj = main({
   // excludedExternals: ["pixi-viewport"],
   production: true
});

for (let i = 1; i < 3; i++) {
   obj[i].output.footer = "";
   obj[i].output.banner = "";
   obj[i].output.globals["pixi-viewport"] = "pixi_viewport";
}

export default obj;
