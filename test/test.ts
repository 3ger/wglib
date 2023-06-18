import { BoxContainer, ConnectorEnd, ConnectorStart, InputInterface, PointerInterface, TextBox, TextInput, WgLib, WgSettings } from "../src";
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
      expect(setting.CssFile).to.be.not.undefined;
   });

   it("WgLib ctor", () => {
      wgl = new WgLib(setting, () => { loaded = true; });
      expect(wgl).to.be.not.undefined;
   });

   it("Loaded Event", () => {
      this.timeout(2000);
      setTimeout(() => { expect(loaded).to.be.true; visual_test(wgl); }, 1000);
   });

   // it("OnContextMenu Test", () => {
   //    let ctxWorked = false;
   //    wgl.addEventListner("contextmenu", (ev: MouseEvent) => {
   //       ctxWorked = true;
   //    });
   //    var element = setting.CanvasElement;

   //    element?.dispatchEvent(new MouseEvent("rightclick", {
   //       view: window,
   //       bubbles: true,
   //       cancelable: true,
   //       screenX: 500,
   //       screenY: 500,
   //    }));
   //    expect(ctxWorked).to.be.true;
   // });

});

function visual_test(wgl: WgLib) {
   const testComponent = new TextBox("WgLib (testBox)", "testBox");
   const testComponent2 = new TextBox("defaultBox", undefined, <PointerInterface>{
      onPointerDown: (el) => {
         // el.stopPropagation();
         console.log(el);
      },
      onPointerUp: (el) => {
         // el.stopPropagation();
         console.log(el);
      },
      // onDragging: (el) => {
      //    console.log("dragging el: " + (el as Box).getTitle());
      // },
      onPointerTap: (el) => {
         console.log("clicked on element: " + (el.element as TextBox).getText());
      },
      onRightClick: (el) => {
         // el.stopPropagation();
         console.log("right clicked on element: " + (el.element as TextBox).getText());
      },
      onRightDown: (el) => {
         el.stopPropagation();
      },
      onRightUp: (el) => {
         el.stopPropagation();
      },
      onPointerOver: (el) => {
         console.log("Over element: " + (el.element as TextBox).getText());
      },
      onPointerOut: (el) => {
         console.log("Out element: " + (el.element as TextBox).getText());
      },
   });
   const testComponent3 = new TextBox("testBox2", "testBox2", <PointerInterface>{
      onPointerDown: (el) => {
         console.log(el);
      },
      // onPointerUp: (el) => {
      //    console.log(el);
      // },
      // onDragging: (el) => {
      //    console.log("dragging el: " + (el as Box).getTitle());
      // },
      // onPointerTap: (el) => {
      //    console.log("clicked on element: " + (el as Box).getTitle());
      // },
      // onRightClick: (el) => {
      //    console.log("right clicked on element: " + (el as Box).getTitle());
      // },
      // onPointerOver: (el) => {
      //    console.log("Over element: " + (el as Box).getTitle());
      // },
      // onPointerOut: (el) => {
      //    console.log("Out element: " + (el as Box).getTitle());
      // },
      canDrag: false,
      preventPropagation: true,
   });
   wgl.addElement(testComponent, testComponent2, testComponent3);

   const bxContainer = new BoxContainer("defaultBoxContainer", <PointerInterface>{
      // onPointerDown: (el) => {
      //    console.log(el);
      // },
      // onPointerUp: (el) => {
      //    console.log(el);
      // },
      // onDragging: (el) => {
      //    console.log("dragging");
      // },
      // onPointerTap: (el) => {
      //    console.log("clicked on element: " + (el as BoxContainer));
      // },
      // onRightClick: (el) => {
      //    console.log("right clicked on element: " + (el as BoxContainer));
      // },
      // onPointerOver: (el) => {
      //    console.log("Over element: " + (el as BoxContainer));
      // },
      // onPointerOut: (el) => {
      //    console.log("Out element: " + (el as BoxContainer));
      // },
   });
   wgl.addElement(bxContainer);
   bxContainer
      .addBox(new TextBox("containerBox", "containerBox"), false)
      .addBox(new TextBox("defaultBox1", "defaultBox"))
      .addBox(new TextBox("defaultBox2", "defaultBox"))
      .addBox(new TextBox("defaultBox3", "defaultBox"))
      .addBox(
         new TextBox("btnTest", "testBox2", <PointerInterface>{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onPointerTap: (el) => {
               //console.log("clicked on element: " + (el.element as TextBox).getText());
            },
            canDrag: false,
            preventPropagation: true,
         })
      );
   bxContainer.setPosition(450, 450);

   const conStart = new ConnectorStart("defaultConnectionStartBox");
   bxContainer.getContainer().addChild(conStart.getContainer());

   const conEnd = new ConnectorEnd("defaultConnectionEndBox");
   testComponent2.getContainer().addChild(conEnd.getContainer());

   // wgl.addElement(bxContainer);

   let ti = new TextInput("TextInput", "defaultTextInput", <InputInterface>{
      onChange: (ev: InputEvent) => {
         console.log(ev);
      }
   });
   ti.setPosition(500, 200);
   wgl.addElement(ti);
}


mocha.run();
