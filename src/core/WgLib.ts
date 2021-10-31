import { Viewport } from "pixi-viewport";
import { WgSettings } from "./InitParams";
import { TextBox } from "./TextBox";
import BoxContainer from "./BoxContainer";
import { InteractionInterface } from "./InteractionInterface";
import GraphElement from "./GraphElement";
import { CssCache } from "../helpers/CssHelper";
import { ConnectorStart } from "./ConnectorStart";
import { ConnectorEnd } from "./ConnectorEnd";
import { AbstractRenderer } from "@pixi/core";
import { Application } from "@pixi/app";
import { skipHello } from "@pixi/utils";

export class WgLib {
   private static pixiApp: Application;
   private static viewPort: Viewport;
   private elements: Array<GraphElement> = [];

   constructor(private config: WgSettings, private onLoaded?: () => void) {
      config = config || <WgSettings>{};

      skipHello();

      WgLib.pixiApp = new Application({
         width: config.CanvasSize.x,
         height: config.CanvasSize.y,
         backgroundColor: config.BackgroundColor,
         antialias: true,
         view: config.CanvasElement,
      });

      if (config.CanvasElement === undefined) document.body.appendChild(WgLib.pixiApp.view);

      // make sure no events from browser are done by the browser on this element
      WgLib.pixiApp.view.oncontextmenu = (e: MouseEvent) => {
         e.preventDefault();
         if (this.config.OnContextMenu) this.config.OnContextMenu(e);
      };

      WgLib.pixiApp.view.onwheel = (a) => {
         a.preventDefault();
      };

      CssCache.init(config.CssFile, () => {
         this.initStage(config);
      });
   }

   private initStage(config: WgSettings) {
      WgLib.viewPort = new Viewport({
         screenWidth: config.CanvasSize.x,
         screenHeight: config.CanvasSize.y,
         worldWidth: config.WorkspaceSize.x,
         worldHeight: config.WorkspaceSize.y,
         interaction: WgLib.pixiApp.renderer.plugins.interaction,
      });

      // add the viewport to the stage
      WgLib.pixiApp.stage.addChild(WgLib.viewPort);
      WgLib.pixiApp.stage.interactive = true;

      // activate plugins
      WgLib.viewPort
         .drag({ clampWheel: true, underflow: "center" })
         .pinch()
         .wheel()
         .clampZoom({
            minWidth: 200,
            minHeight: 200,
            maxWidth: config.WorkspaceSize.x,
            maxHeight: config.WorkspaceSize.y,
         })
         .clamp({ direction: "all", underflow: "center" })
         .decelerate();

      if (typeof this.onLoaded === "function") this.onLoaded();

      // TODO: remove
      this.TEST_METHOD_TODO_REMOVE();
   }

   // TODO: remove
   private TEST_METHOD_TODO_REMOVE() {
      const testComponent = new TextBox("WgLib (testBox)", "testBox");
      const testComponent2 = new TextBox("defaultBox", undefined, <InteractionInterface>{
         onPointerDown: (el) => {
            console.log(el);
         },
         onPointerUp: (el) => {
            console.log(el);
         },
         // onDragging: (el) => {
         //    console.log("dragging el: " + (el as Box).getTitle());
         // },
         onPointerTap: (el) => {
            console.log("clicked on element: " + (el.element as TextBox).getText());
         },
         onRightClick: (el) => {
            console.log("right clicked on element: " + (el.element as TextBox).getText());
         },
         onPointerOver: (el) => {
            console.log("Over element: " + (el.element as TextBox).getText());
         },
         onPointerOut: (el) => {
            console.log("Out element: " + (el.element as TextBox).getText());
         },
      });
      const testComponent3 = new TextBox("testBox2", "testBox2", <InteractionInterface>{
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
      this.addElement(testComponent, testComponent2, testComponent3);

      const bxContainer = new BoxContainer("defaultBoxContainer", <InteractionInterface>{
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
      bxContainer
         .addBox(new TextBox("containerBox", "containerBox"), false)
         .addBox(new TextBox("defaultBox1", "defaultBox"))
         .addBox(new TextBox("defaultBox2", "defaultBox"))
         .addBox(new TextBox("defaultBox3", "defaultBox"))
         .addBox(
            new TextBox("btnTest", "testBox2", <InteractionInterface>{
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

      this.addElement(bxContainer);
   }

   public addTextBox(title: string, cssClass: string, interaction: InteractionInterface): WgLib {
      return this.addElement(new TextBox(title, cssClass, interaction));
   }

   public addElement(element: GraphElement, ...rest: GraphElement[]): WgLib {
      this.elements.push(element);
      WgLib.getViewport().addChild(element.getContainer());

      if (rest) {
         rest.forEach((el) => {
            this.elements.push(el);
            WgLib.getViewport().addChild(el.getContainer());
         });
      }
      return this;
   }

   public static getViewport(): Viewport {
      return WgLib.viewPort;
   }
   public static getRenderer(): AbstractRenderer {
      return WgLib.pixiApp.renderer;
   }
}
