import { InteractionEvent, InteractionData, DisplayObject } from "pixi.js";
import GraphElement from "./GraphElement";
import { InteractionArgs } from "./InteractionInterface";
import { WgLib } from "./WgLib";

export class DragHandler {
   private isDragging = false;
   private dragData?: InteractionEvent;
   private elementPointerOffset: { x: number; y: number } = { x: 0, y: 0 };
   private moveListeners: Array<(data?: InteractionData) => void> = [];
   private readonly element: DisplayObject;

   constructor(
      private graphElement: GraphElement,
      private onDragStartCallback?: (e: InteractionArgs) => void,
      private onDragEndCallback?: (e: InteractionArgs) => void
   ) {
      this.element = graphElement.getContainer();
      this.element.interactive = true;
      // element.on("mousedown", this.onDragStart, this);
      // element.on("touchstart", this.onDragStart, this);
      this.element.on("pointerdown", this.onDragStart, this);
      // element.on("mouseup", this.onDragEnd, this);
      // element.on("mouseupoutside", this.onDragEnd, this);
      // element.on("touchend", this.onDragEnd, this);
      // element.on("touchendoutside", this.onDragEnd, this);
      this.element.on("pointerup", this.onDragEnd, this);
      this.element.on("pointerupoutside", this.onDragEnd, this);
      // element.on("mousemove", this.onPointerMove, this);
      this.element.on("pointermove", this.onPointerMove, this);
   }

   private onPointerMove(e: InteractionEvent) {
      if (this.isDragging && this.dragData) {
         const newPosition = this.dragData.data.getLocalPosition(this.element.parent);
         this.element.x = newPosition.x - this.elementPointerOffset.x;
         this.element.y = newPosition.y - this.elementPointerOffset.y;

         e.stopPropagation();
         this.moveListeners.forEach((f) => f(this?.dragData?.data));
      }
   }

   private onDragStart(event: InteractionEvent) {
      const ev = new InteractionArgs(this.graphElement, event?.data);
      if (this.onDragStartCallback) this.onDragStartCallback(ev);

      if (ev.shouldStopPropagation()) {
         event.stopPropagation();
         return;
      }

      this.isDragging = true;
      this.dragData = event;
      const tmpPos = event.data.getLocalPosition(this.element.parent);
      this.elementPointerOffset = { x: tmpPos.x - this.element.x, y: tmpPos.y - this.element.y };
      const radi = 0.33 * Math.min(WgLib.getViewport().screenHeight, WgLib.getViewport().screenWidth);
      WgLib.getViewport().follow(this.element, {
         acceleration: 2,
         radius: radi,
         speed: 20,
      });
   }

   private onDragEnd() {
      const ev = new InteractionArgs(this.graphElement);
      if (this.onDragEndCallback) this.onDragEndCallback(ev);

      if (ev.shouldStopPropagation()) return;

      WgLib.getViewport().plugins.remove("follow");

      this.isDragging = false;
      this.dragData = undefined;
   }

   public onDragged(fn: (data?: InteractionData) => void): void {
      this.moveListeners.push(fn);
   }
}
