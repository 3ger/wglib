import { Container } from "@pixi/display";
import { InteractionData } from "@pixi/interaction";
import { InteractionManager } from "./InteractionManager";
import { InteractionState } from "./InteractionState";
import { InteractionInterface } from "./InteractionInterface";
import { CssCache, VisualProperties } from "../helpers/CssHelper";
import { Viewport } from "pixi-viewport";

export default abstract class GraphElement extends Container {
   protected interactionManager?: InteractionManager;
   protected vis: VisualProperties;

   constructor(protected cssClass: string, interaction?: InteractionInterface) {
      super();
      this.filters = [];
      this.vis = CssCache.getVisualProperties(cssClass);
      if (interaction) {
         this.interactionManager = new InteractionManager(this, interaction);
      }
      this.setPosition(this.vis?.left || 0, this.vis?.top || 0);
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

   public getPosition(): { x: number; y: number } {
      return this.position;
   }

   public getTopParent(): GraphElement {
      let curParent = this.parent;
      while (!(curParent.parent instanceof Viewport)) {
         curParent = curParent.parent;
      }
      return curParent as GraphElement;
   }

   public addDraggingCallback(fn: (data?: InteractionData) => void): void {
      if (this.interactionManager) this.interactionManager.addDraggingCallback(fn);
   }
}
