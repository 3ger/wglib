import { Graphics } from "pixi.js";

import { GraphElement } from "./GraphElement";

export class VisualLine extends GraphElement {
   private line: Graphics = new Graphics();

   constructor(protected cssClass: string = "defaultLine") {
      super(cssClass);
      this.addChild(this.line);
   }

   private setupLine(): void {
      this.line.clear();
      if (this.vis) {
         this.line.lineStyle(
            this.vis?.borderWidth,
            this.vis?.borderColor,
            this.vis?.borderColorAlpha,
            this.vis?.borderDrawAlignment
         );
      }
   }

   public drawStraight(start: { x: number; y: number }, end: { x: number; y: number }): void {
      this.setupLine();
      this.line.moveTo(start.x, start.y - (this.vis?.borderWidth ?? 0) * 0.5);
      this.line.lineTo(end.x, end.y);
   }

   public drawBezier2(start: { x: number; y: number }, end: { x: number; y: number }, offset = 50): void {
      this.setupLine();
      const dir = offset > 0 ? 1 : offset < 0 ? 2 : 0;
      const offsetY = (this.vis?.borderWidth ?? 0) * 0.5;
      this.line.moveTo(start.x, start.y - (dir === 1 || dir === 0 ? offsetY : -offsetY));
      const p1_x = start.x + offset;
      const p1_y = start.y - (this.vis?.borderWidth ?? 0) * 0.5;
      this.line.quadraticCurveTo(p1_x, p1_y, end.x, end.y);
   }

   public drawBezier3(
      start: { x: number; y: number },
      end: { x: number; y: number },
      offsetStart = 50,
      offsetEnd = -50
   ): void {
      this.setupLine();
      const dir1 = offsetStart > 0 ? 1 : offsetStart < 0 ? 2 : 0;
      const offsetY = (this.vis?.borderWidth ?? 0) * 0.5;
      this.line.moveTo(start.x, start.y - (dir1 === 1 || dir1 === 0 ? offsetY : -offsetY));

      const p1_x = start.x + offsetStart;
      const p1_y = start.y - (this.vis?.borderWidth ?? 0) * 0.5;

      const p2_x = end.x + offsetEnd;
      const p2_y = end.y - (this.vis?.borderWidth ?? 0) * 0.5;

      this.line.bezierCurveTo(p1_x, p1_y, p2_x, p2_y, end.x, end.y - offsetY);
   }
}
