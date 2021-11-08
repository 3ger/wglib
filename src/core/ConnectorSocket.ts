import { Container, InteractionEvent, InteractionManager } from "pixi.js";
import Box from "./Box";
import { Connector } from "./Connector";
import { InteractionArgs, InteractionInterface } from "./InteractionInterface";
import { VisualLine } from "./VisualLine";
import { WgLib } from "./WgLib";

export abstract class ConnectorSocket extends Box {
   protected aaaa = "ConnectorStart";

   protected currentDragOut?: VisualLine | undefined;
   protected connectors: Array<Connector> = [];
   private elToFollow = new Container();

   constructor(cssClass: string, private interaction?: InteractionInterface) {
      super(cssClass, <InteractionInterface>{
         canDrag: false,
         preventPropagation: false,
         onPointerDown: (e) => this.dragStart(e),
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         onPointerUp: (e) => this.removeDragOut(),
         onPointerUpOutside: (e) => this.dragEnd(e),
         onPointerOut: interaction?.onPointerOut,
         onPointerOver: interaction?.onPointerOver,
         onPointerTap: interaction?.onPointerTap,
         onRightClick: interaction?.onRightClick,
         onRightDown: interaction?.onRightDown,
         onRightUp: interaction?.onRightUp,
      });
   }

   private dragEnd(el: InteractionArgs): void {
      if (this.interaction && this.interaction.canDrag && this.interaction.onDragEnd) {
         this.interaction.onDragEnd(el);
         if (el.shouldStopPropagation()) return;
      }

      if (this.currentDragOut) {
         const interaction = WgLib.getRenderer().plugins.interaction as InteractionManager;
         if (interaction) {
            const hitObject = interaction.hitTest(interaction.mouse.global);
            if (hitObject && hitObject instanceof ConnectorSocket) {
               this.addConnectorTo(hitObject);
            }
         }
         this.removeDragOut();
      }
   }

   private removeDragOut() {
      if (this.currentDragOut) {
         WgLib.getViewport().removeChild(this.currentDragOut);
         this.currentDragOut = undefined;
         WgLib.getViewport().removeListener("pointermove", this.dragging, this);
         WgLib.getViewport().plugins.remove("follow");
      }
   }

   private dragStart(e: InteractionArgs): void {
      if (this.interaction && this.interaction.canDrag && this.interaction.onDragStart) {
         this.interaction.onDragStart(e);
         if (e.shouldStopPropagation()) return;
      }
      this.currentDragOut = new VisualLine();
      this.drawConnectionLine(e.eventData?.global || this.getPosition());
      WgLib.getViewport().addListener("pointermove", this.dragging, this);
      const radi = 0.45 * Math.min(WgLib.getViewport().screenHeight, WgLib.getViewport().screenWidth);
      WgLib.getViewport().follow(this.elToFollow, { acceleration: 2, radius: radi, speed: 20 });
      WgLib.getViewport().addChild(this.currentDragOut);
      e.stopPropagation();
   }

   private dragging(arg: InteractionEvent) {
      if (this.interaction && this.interaction.canDrag && this.interaction.onDragging) {
         const ev = new InteractionArgs(this, arg.data);
         this.interaction.onDragEnd(ev);
         if (ev.shouldStopPropagation()) return;
      }
      this.drawConnectionLine(arg.data.global);
      const toFollowPos = WgLib.getViewport().toWorld(arg.data.global);
      this.elToFollow.x = toFollowPos.x;
      this.elToFollow.y = toFollowPos.y;
   }

   protected drawConnectionLine(toPos: { x: number; y: number }): void {
      if (this.currentDragOut) {
         const start = this.getOutPosition();
         const mousePos = WgLib.getViewport().toWorld(toPos.x, toPos.y);
         this.currentDragOut.drawBezier3(start, mousePos, this.getOutOffset(), start.x > mousePos.x ? 100 : -100);
      }
   }

   public getConnectors(): Array<Connector> {
      return this.connectors;
   }

   public abstract canConnectTo(other: ConnectorSocket): boolean;

   public abstract getOutOffset(): number;

   public abstract getOutPosition(): { x: number; y: number };

   public abstract addConnectorTo(
      hitObject: ConnectorSocket,
      connectorClass?: string,
      connector?: Connector
   ): Connector | undefined;
}
