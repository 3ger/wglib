import { AbstractRenderer, Container, DisplayObject, InteractionData } from "pixi.js";
import { InteractionManager } from "./InteractionManager";
import { InteractionState } from "./InteractionState";
import { PointerInterface } from "./InteractionInterface";
import { CssCache, VisualProperties } from "../helpers/CssHelper";
import { Viewport } from "pixi-viewport";
import { WgLib } from "./WgLib";

export default abstract class GraphElement extends Container {
   protected interactionManager?: InteractionManager;
   protected vis: VisualProperties;
   protected wglibParent!: WgLib;

   constructor(protected cssClass: string, interaction?: PointerInterface) {
      super();
      this.filters = [];
      this.vis = CssCache.getVisualProperties(cssClass);
      if (interaction) {
         this.interactionManager = new InteractionManager(this, interaction);
      }
      this.setPosition(this.vis?.left || 0, this.vis?.top || 0);
      this.on("childAdded", (child: DisplayObject) => {
         if (child instanceof GraphElement)
            (child as GraphElement).setWgLibParent(this.wglibParent);
      });
   }

   private redraw(): void {
      this.removeChildren();
      this.draw();
   }

   /**
    * Needs an override in the derived class to draw the element.
    */
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected draw(): void {
      throw new Error("draw() for GraphElement is not implemented");
   }

   public setVisualProperties(newVis: VisualProperties): void {
      this.vis = newVis;
      this.cssClass = this.vis.selectorText?.slice(1) || "defaultBox";
      this.redraw();
   }

   public getInteractionState(): InteractionState {
      return this.interactionManager?.getInteractionState() || InteractionState.None;
   }

   public getCssClass(): string {
      return this.cssClass;
   }

   public getContainer(): Container {
      return this;
   }

   public setPosition(x: number, y: number): void {
      this.position.x = x;
      this.position.y = y;
   }

   public getHeight(): number {
      return this.height;
   }

   public getPosition(): { x: number; y: number; } {
      return this.position;
   }

   public getTopParent(): GraphElement {
      if (this.parent instanceof Viewport)
         return this;

      let curParent = this.parent;
      while (curParent?.parent && !(curParent.parent instanceof Viewport)) {
         curParent = curParent.parent;
      }
      return curParent as GraphElement;
   }

   public getViewport(): Viewport {
      const vP = this.wglibParent.getViewport();

      if (vP === undefined)
         throw ("Viewport is not set.");

      return vP;
   }

   public getRenderer(): AbstractRenderer {
      return this.wglibParent.getRenderer();
   }

   public addDraggingCallback(fn: (data?: InteractionData) => void): void {
      if (this.interactionManager) this.interactionManager.addDraggingCallback(fn);
   }

   public setWgLibParent(wglib: WgLib) {
      this.wglibParent = wglib;
   }

   public getVis(): VisualProperties {
      return this.vis;
   };

   public isVisible(): boolean {
      const vP = this.getViewport();
      let tmp = this.getBounds(true);

      // half point here: -> assume "visible" if still half to see
      const p1 = vP.toWorld({ x: tmp.left + (tmp.right - tmp.left) * 0.5, y: tmp.top + (tmp.bottom - tmp.top) * 0.5 });
      const p2 = vP.toWorld({ x: tmp.right - (tmp.right - tmp.left) * 0.5, y: tmp.bottom - (tmp.bottom - tmp.top) * 0.5 });

      const a = { left: p1.x, top: p1.y, right: p2.x, bottom: p2.y };
      const b = this.getViewport().getVisibleBounds();

      return (a.left <= b.right &&
         b.left <= a.right &&
         a.top <= b.bottom &&
         b.top <= a.bottom);
   }
}
