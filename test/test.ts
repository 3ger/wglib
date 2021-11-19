import { WgLib, WgSettings } from "../src";
const assert = chai.assert;
const expect = chai.expect;


mocha.setup("bdd");

describe("Main", function () {
   let setting: WgSettings;

   it("WgSettings", () => {
      setting = <WgSettings>{ CssFile: "../src/wglib.css", CanvasElement: document.getElementById("canv"), CanvasSize: { x: 1000, y: 1000 }, WorkspaceSize: { x: 2000, y: 2000 }, BackgroundColor: 0xffffff };
      expect(setting).to.be.not.undefined;
   });
   it("create test", () => {
      let wgl = new WgLib(setting);
      expect(wgl).to.be.not.undefined;
   });
});

mocha.run();