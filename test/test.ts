import { WgLib, WgSettings } from "../src";
const assert = chai.assert;
const expect = chai.expect;


mocha.setup("bdd");

///
/// TODO: Rework to make each test independent
///
describe("Main", function () {
   let setting: WgSettings;
   let wgl: WgLib;
   let loaded = false;

   it("WgSettings ctor", () => {
      setting = <WgSettings>{ CssFile: "../src/wglib.css", CanvasElement: document.getElementById("canv"), CanvasSize: { x: 1000, y: 1000 }, WorkspaceSize: { x: 2000, y: 2000 }, BackgroundColor: 0xffffff };
      expect(setting).to.be.not.undefined;
   });

   it("WgLib ctor", () => {
      wgl = new WgLib(setting, () => { loaded = true; });
      expect(wgl).to.be.not.undefined;
   });

   it("Loaded Event", () => {
      this.timeout(2000);
      setTimeout(() => { expect(loaded).to.be.true; }, 1000);
   });

   it("OnContextMenu Test", () => {
      let ctxWorked = false;
      wgl.addEventListner("contextmenu", (ev: UIEvent) => { ctxWorked = true; });
      var element = setting.CanvasElement;
      element.dispatchEvent(new MouseEvent("contextmenu", {
         view: window,
         bubbles: true,
         cancelable: true
      }));
      expect(ctxWorked).to.be.true;
   });

});

mocha.run();
