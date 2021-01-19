import Box from "./Box";
import Text from "./Text";

export abstract class BoxElement {
   abstract onAdded(parent: Box, position: { x: number; y: number }): void;
   abstract getHeight(): number;
   abstract getLocalPosition(): { x: number; y: number };
}

export class TextBoxElement extends BoxElement {
   private parent!: Box;
   private pixiElement!: Text;

   constructor(private text: string, private cssClass: string) {
      super();
   }

   onAdded(parent: Box, position: { x: number; y: number }): void {
      this.parent = parent;
      this.pixiElement = new Text(this.text, this.parent.getCssClass() + " " + this.cssClass);
      this.parent.getContainer().addChild(this.pixiElement);
      this.pixiElement.position.x = position.x;
      this.pixiElement.position.y = position.y;
   }

   getHeight(): number {
      return this.pixiElement?.height || 0;
   }

   getLocalPosition(): { x: number; y: number } {
      return this.pixiElement.position;
   }
}
