import { InteractionData } from "@pixi/interaction";
import GraphElement from "./GraphElement";

export interface InteractionInterface {
   onPointerDown(args: InteractionArgs): void;
   onPointerUp(args: InteractionArgs): void;
   onPointerUpOutside(args: InteractionArgs): void;
   onDragging(args: InteractionArgs): void;
   onDragStart(args: InteractionArgs): void;
   onDragEnd(args: InteractionArgs): void;
   onPointerOver(args: InteractionArgs): void;
   onPointerOut(args: InteractionArgs): void;
   onPointerTap(args: InteractionArgs): void;
   onRightClick(args: InteractionArgs): void;
   onRightDown(args: InteractionArgs): void;
   onRightUp(args: InteractionArgs): void;
   canDrag?: boolean | (() => boolean);
   preventPropagation?: boolean | (() => boolean);
}

export class InteractionArgs {
   private stop = false;

   constructor(public element: GraphElement, public eventData?: InteractionData) { }

   public stopPropagation(): void {
      this.stop = true;
   }

   public shouldStopPropagation(): boolean {
      return this.stop;
   }
}
