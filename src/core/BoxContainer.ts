import GraphElement from "./GraphElement";
import { PointerInterface } from "./InteractionInterface";
import Box from "./Box";

export class BoxContainer extends GraphElement {
   private elements = new Array<Box>();

   constructor(cssClass = "defaultBoxContainer", interaction?: PointerInterface) {
      super(cssClass, interaction);
   }

   /**
    * Addes a box element to the container.
    * @param box Element to add to this container
    * @param {boolean} [asElement=true] Determins whether the element plays a role in
    *                   position calculation (grows with each element added).
    *                   If false element is not added towards next position offset.
    */
   public addBox(box: Box, asElement = true): BoxContainer {
      if (asElement) {
         const nextBoxPosition = this.getNextBoxPosition();
         this.elements.push(box);
         box.setPosition(nextBoxPosition.x, nextBoxPosition.y);
      }
      this.addChild(box);
      return this;
   }

   private getNextBoxPosition(): { x: number; y: number } {
      let posY = 0;
      if (this.elements.length > 0) {
         const lastElement = this.elements[this.elements.length - 1];
         posY = lastElement.getHeight() + lastElement.getPosition().y;
      }
      return { x: 0, y: posY };
   }
}
