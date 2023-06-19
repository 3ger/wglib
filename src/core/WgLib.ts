import { Viewport } from "pixi-viewport";
import { WgSettings } from "./WgSettings";
import { TextBox } from "./TextBox";
import { InteractionArgs, PointerInterface } from "./InteractionInterface";
import GraphElement from "./GraphElement";
import { CssCache } from "../helpers/CssHelper";
import { AbstractRenderer, Application, InteractionEvent, utils } from "pixi.js";

export class WgLib {
   private pixiApp: Application;
   private viewPort?: Viewport;
   private elements: Array<GraphElement> = [];
   private onContextMenuCallbacks: Array<(args: InteractionArgs) => void> = [];
   private isDestroyed = false;

   constructor(
      private config: WgSettings,
      private onLoaded?: () => void,
      onContextMenu?: (args: InteractionArgs) => void
   ) {
      config = config || <WgSettings>{};

      utils.skipHello();

      this.pixiApp = new Application({
         width: config.CanvasSize.x,
         height: config.CanvasSize.y,
         backgroundColor: config.BackgroundColor,
         antialias: true,
         view: config.CanvasElement,
      });

      if (config.CanvasElement && config.ResizeToCanvas === true)
         this.pixiApp.resizeTo = config.CanvasElement;

      if (config.CanvasElement === undefined) document.body.appendChild(this.pixiApp.view);

      if (onContextMenu) this.onContextMenuCallbacks.push(onContextMenu);

      // // make sure no events from browser are done by the browser on this element
      this.pixiApp.view.oncontextmenu = (e: MouseEvent) => {
         e.preventDefault();
      };

      // TODO: context is done by right click for now
      // this needs chaning once moved to another version
      this.pixiApp.stage.on("rightclick", (e: InteractionEvent) => {
         this.onContextMenuCallbacks.forEach(fncCall => {
            fncCall(new InteractionArgs(e.currentTarget, e.data));
         });
      });
      this.pixiApp.view.onwheel = (a) => {
         a.preventDefault();
      };

      CssCache.init(config.CssFile, () => {
         if (this.isDestroyed)
            return;

         this.initStage(config);
      });
   }

   private initStage(config: WgSettings) {
      this.viewPort = new Viewport({
         screenWidth: config.CanvasSize.x,
         screenHeight: config.CanvasSize.y,
         worldWidth: config.WorkspaceSize.x,
         worldHeight: config.WorkspaceSize.y,
         interaction: this.pixiApp.renderer.plugins.interaction,
      });

      // add the viewport to the stage
      this.pixiApp.stage.addChild(this.viewPort);
      this.pixiApp.stage.interactive = true;

      // activate plugins
      this.viewPort
         .drag({ clampWheel: true, underflow: "center", mouseButtons: "left" })
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
   }

   public addTextBox(title: string, cssClass: string, interaction: PointerInterface): WgLib {
      return this.addElement(new TextBox(title, cssClass, interaction));
   }

   public addElement(element: GraphElement, ...rest: GraphElement[]): WgLib {

      const vP = this.getViewport();
      if (vP === undefined) {
         throw ("Viewport is not set.");
      }

      this.elements.push(element);
      vP.addChild(element.getContainer());
      element.setWgLibParent(this);

      if (rest) {
         rest.forEach((el) => {
            this.elements.push(el);
            vP.addChild(el.getContainer());
            el.setWgLibParent(this);
         });
      }
      return this;
   }

   public removeElement(element: GraphElement): WgLib {
      const vP = this.getViewport();
      if (vP === undefined) {
         throw ("Viewport is not set.");
      }

      this.elements = this.elements.filter(x => x !== element);
      vP.removeChild(element.getContainer());

      return this;
   }

   public addEventListner(event: "contextmenu", func: (args: InteractionArgs) => void): void {
      switch (event) {
         case "contextmenu":
            this.onContextMenuCallbacks.push(func);
            break;
         default:
            throw new Error(`${event} is not supported by WgLib.`);
      }
   }

   public getViewport(): Viewport | undefined {
      return this.viewPort;
   }

   public getRenderer(): AbstractRenderer {
      return this.pixiApp.renderer;
   }

   public destroy(): void {
      this.isDestroyed = true;
      this.viewPort?.destroy();
      this.pixiApp?.destroy();
      CssCache.reset();
   }

   public getIsDestroyed(): boolean {
      return this.isDestroyed;
   }
}
