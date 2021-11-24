import { PointerInterface } from "./InteractionInterface";
import Text from "./Text";
import Box from "./Box";
import { VisualProperties } from "../helpers/CssHelper";

export class TextBox extends Box {

   private textElement!: Text;

   constructor(private text: string, cssClass = "defaultBox", interaction?: PointerInterface) {
      super(cssClass, interaction);
      this.addText();
   }

   private addText(): void {
      this.textElement = new Text(this.text, this.cssClass + " title");
      this.addChild(this.textElement);
   }

   public getText(): string {
      return this.text;
   }

   public getTextVis(): VisualProperties {
      return this.textElement.getTextVis();
   }

   public showText(bShow: boolean) {
      this.textElement.visible = bShow;
   }

   setText(value: string): void {
      this.text = value;
      this.textElement.setText(this.text);
   }
}
