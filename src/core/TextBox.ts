import { InteractionInterface } from "./InteractionInterface";
import { Text } from "./Text";
import { Box } from "./Box";

export class TextBox extends Box {
   private textElement?: Text;

   constructor(private text: string, cssClass = "defaultBox", interaction?: InteractionInterface) {
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
}
