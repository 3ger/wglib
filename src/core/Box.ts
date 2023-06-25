import { Graphics } from "pixi.js";
import GraphElement from "./GraphElement";
import { PointerInterface } from "./InteractionInterface";

export default class Box extends GraphElement {
   constructor(
      cssClass = "defaultBox",
      interaction?: PointerInterface,
      private readonly sizeOverride?: { width?: number, height?: number; },
      noDrawCall = false
   ) {
      super(cssClass, interaction);
      if (!noDrawCall) this.draw();
   }

   protected draw(): void {
      // draw a rectangle
      const border = new Graphics();
      border.beginFill(this.vis?.backgroundColor, this.vis?.backgroundColorAlpha);

      if (!this.vis?.borderStyle || this.vis.borderStyle !== "none") {
         border.lineStyle(
            this.vis.borderWidth,
            this.vis?.borderColor,
            this.vis?.borderColorAlpha,
            this.vis?.borderDrawAlignment
         );
      }

      const w = this.sizeOverride?.width ?? this.vis.width;
      const h = this.sizeOverride?.height ?? this.vis.height;

      if (this.vis.borderRadius && this.vis.borderRadius > 0) {
         border.drawRoundedRect(0, 0, w, h, this.vis.borderRadius);
      } else {
         border.drawRect(0, 0, w, h);
      }

      this.addChild(border);
   }
}
