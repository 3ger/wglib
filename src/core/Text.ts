import { CssCache, VisualProperties } from "../helpers/CssHelper";
import { Text as pixiText } from "@pixi/text";

export default class Text extends pixiText {
   private vis?: VisualProperties;

   constructor(text: string, cssClass: string) {
      const textVis = CssCache.getVisualProperties(cssClass);

      if (textVis?.display && textVis.display === "none") {
         super("");
         return;
      }

      super(text, textVis?.textStyle);
      this.vis = textVis;

      this.on("added", () => this.setupText(), this);
   }

   setupText(): void {
      this.position.set(this.vis?.left, this.vis?.top);

      if (this.vis?.textStyle?.align) {
         if (this.vis.textStyle.align === "center") {
            this.position.x = this.position.x + this.parent.width * 0.5 - this.width * 0.5;
         } else if (this.vis.textStyle.align === "right") {
            this.position.x = this.position.x + this.parent.width - this.width;
         }
      }

      if (this.vis?.verticalAlign) {
         if (this.vis.verticalAlign === "middle") {
            this.position.y = this.position.y + this.parent.height * 0.5 - this.height * 0.5;
         } else if (this.vis.verticalAlign === "bottom") {
            this.position.y = this.position.y + this.parent.height - this.height;
         }
      }

      if (this.vis?.colorAlpha && this.vis.colorAlpha < 1) {
         this.alpha = this.vis.colorAlpha;
      }
   }
}
