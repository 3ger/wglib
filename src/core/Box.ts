import { GraphElement } from "./GraphElement";
import { InteractionInterface } from "./InteractionInterface";

export class Box extends GraphElement {
   constructor(cssClass = "defaultBox", interaction?: InteractionInterface, noDrawCall = false) {
      super(cssClass, interaction);

      if (!noDrawCall) this.draw();
   }

   protected draw(): void {
      // draw a rectangle
      const border = new PIXI.Graphics();
      border.beginFill(this.vis?.backgroundColor, this.vis?.backgroundColorAlpha);

      if (!this.vis?.borderStyle || this.vis.borderStyle !== "none") {
         border.lineStyle(
            this.vis?.borderWidth,
            this.vis?.borderColor,
            this.vis?.borderColorAlpha,
            this.vis?.borderDrawAlignment
         );
      }

      if (this.vis?.borderRadius && this.vis?.borderRadius > 0) {
         border.drawRoundedRect(0, 0, this.vis.width, this.vis.height, this.vis.borderRadius);
      } else {
         border.drawRect(0, 0, this.vis?.width || 100, this.vis?.height || 100);
      }

      this.addChild(border);
   }
}
