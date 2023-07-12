import { DisplayObject, InteractionData } from "pixi.js";

export interface PointerInterface {
   onPointerDown?: (args: InteractionArgs) => void;
   onPointerUp?: (args: InteractionArgs) => void;
   onPointerUpOutside?: (args: InteractionArgs) => void;
   onDragging?: (args: InteractionArgs) => void;
   onDragStart?: (args: InteractionArgs) => void;
   onDragEnd?: (args: InteractionArgs) => void;
   onPointerOver?: (args: InteractionArgs) => void;
   onPointerOut?: (args: InteractionArgs) => void;
   onPointerTap?: (args: InteractionArgs) => void;
   onRightClick?: (args: InteractionArgs) => void;
   onRightDown?: (args: InteractionArgs) => void;
   onRightUp?: (args: InteractionArgs) => void;
   canDrag?: boolean | (() => boolean);
   preventPropagation?: boolean | (() => boolean);
}

export interface InputInterface extends PointerInterface {
   onChange?: (ev: InputEvent) => void;
   onInput?: (ev: InputEvent) => void;
   onBlur?: (ev: FocusEvent) => void;
}

export class InteractionArgs {
   private stop = false;

   constructor(
      public element: DisplayObject,
      public eventData?: InteractionData,
      public originElement?: DisplayObject
   ) { }

   public stopPropagation(): void {
      this.stop = true;
   }

   public shouldStopPropagation(): boolean {
      return this.stop;
   }
}
