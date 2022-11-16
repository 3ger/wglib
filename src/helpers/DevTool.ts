import { Text, Graphics } from "pixi.js";
import { WgLib } from "../core/WgLib";

export class DebugPoint {
   container: Graphics;

   constructor(x: number, y: number, color = 0xff0000) {
      this.container = new Graphics();
      this.container.lineStyle(1, color, 1, 0);
      this.container.drawRect(x - 2.5, y - 2.5, 5, 5);
      const text = new Text(`(${Math.floor(x)} : ${Math.floor(y)})`, { fontSize: 12, fill: color });
      text.position.x = x + 2;
      text.position.y = y + 2;
      this.container.addChild(text);
      this.container.zIndex = -9999;
   }
}

export class DebugBox {
   container: Graphics;

   constructor(x: number, y: number, w: number, h: number, color = 0xff0000) {
      this.container = new Graphics();
      this.container.lineStyle(1, color, 1, 0);
      this.container.drawRect(x, y, w, h);
      this.container.zIndex = -9999;
   }
}

export class DevTool {
   static readonly IsDebug = true;

   static DrawDebugPoint(x: number, y: number, color = 0xff0000, wglib: WgLib): void {
      if (this.IsDebug) wglib.getViewport()?.addChild(new DebugPoint(x, y, color).container);
   }

   static DrawDebugBox(x: number, y: number, w: number, h: number, color = 0xff0000, wglib: WgLib): void {
      if (this.IsDebug) wglib.getViewport()?.addChild(new DebugBox(x, y, w, h, color).container);
   }
}
