import { WgLib } from "../dist/esm/wglib.es.js";
const assert = chai.assert;

mocha.setup("bdd");

describe("#test1", function () {

   it("test01", function () {
      //const setting = { CssFile: "../src/wglib.css", CanvasElement: document.getElementById("canv"), CanvasSize: { x: 1000, y: 1000 }, WorkspaceSize: { x: 2000, y: 2000 }, BackgroundColor: 0xffffff };
      //let wgl = new WgLib(setting);
      assert.equal("test", "test");
   }); 
});

mocha.run();