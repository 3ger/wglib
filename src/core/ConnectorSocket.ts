import { Container, InteractionEvent, InteractionManager } from "pixi.js";
import { Connector } from "./Connector";
import { InteractionArgs, PointerInterface } from "./InteractionInterface";
import { VisualLine } from "./VisualLine";
import { TextBox } from "./TextBox";

export abstract class ConnectorSocket extends TextBox {

   protected currentDragOut?: VisualLine | undefined;
   private connectors: Connector[] = [];
   private elToFollow = new Container();

   constructor(text: string, cssClass: string, private interaction?: PointerInterface) {
      super(text, cssClass, <PointerInterface>{
         canDrag: false,
         preventPropagation: false,
         onPointerDown: (e) => { e.stopPropagation(); this.dragStart(e); },
         onPointerUp: (e) => this.removeDragOut(),
         onPointerUpOutside: (e) => { e.stopPropagation(); this.dragEnd(e); },
         onPointerOut: interaction?.onPointerOut,
         onPointerOver: interaction?.onPointerOver,
         onPointerTap: interaction?.onPointerTap,
         onRightClick: interaction?.onRightClick,
         onRightDown: interaction?.onRightDown,
         onRightUp: interaction?.onRightUp,
      });
   }

   private dragEnd(el: InteractionArgs): void {
      if (this.currentDragOut) {
         const interaction = this.getViewport().options.interaction as InteractionManager;
         if (interaction) {
            const hitObject = interaction.hitTest(interaction.mouse.global);
            if (hitObject && hitObject instanceof ConnectorSocket) {
               this.addConnectorTo(hitObject);
            }
         }
         this.removeDragOut();
      }

      if (this.interaction && this.interaction.canDrag && this.interaction.onDragEnd) {
         this.interaction.onDragEnd(el);
      }
   }

   private removeDragOut() {
      if (this.currentDragOut) {
         const viewPort = this.getViewport();
         viewPort.removeChild(this.currentDragOut);
         this.currentDragOut = undefined;
         viewPort.removeListener("pointermove", this.dragging, this);
         viewPort.plugins.remove("follow");
      }
   }

   private dragStart(e: InteractionArgs): void {
      if (this.interaction && this.interaction.canDrag && this.interaction.onDragStart) {
         this.interaction.onDragStart(e);
         // if (e.shouldStopPropagation()) return;
      }
      const viewPort = this.getViewport();
      this.currentDragOut = new VisualLine();
      this.drawConnectionLine(e.eventData?.global || this.getPosition());
      viewPort.addListener("pointermove", this.dragging, this);
      const radi = 0.45 * Math.min(viewPort.screenHeight, viewPort.screenWidth);
      viewPort.follow(this.elToFollow, { acceleration: 2, radius: radi, speed: 20 });
      viewPort.addChild(this.currentDragOut);
      e.stopPropagation();
   }

   private dragging(arg: InteractionEvent) {
      if (this.interaction && this.interaction.canDrag && this.interaction.onDragging) {
         const ev = new InteractionArgs(this, arg.data);
         if (this.interaction.onDragEnd) this.interaction.onDragEnd(ev);
         // if (ev.shouldStopPropagation()) return;
      }
      this.drawConnectionLine(arg.data.global);
      const toFollowPos = this.getViewport().toWorld(arg.data.global);
      this.elToFollow.x = toFollowPos?.x || arg.data.global.x;
      this.elToFollow.y = toFollowPos?.y || arg.data.global.y;
   }

   protected drawConnectionLine(toPos: { x: number; y: number; }): void {
      if (this.currentDragOut) {
         const start = this.getOutPosition();
         const mousePos = this.getViewport().toWorld(toPos.x, toPos.y);
         this.currentDragOut.drawBezier3(start, mousePos, this.getOutOffset(), start.x > mousePos.x ? 100 : -100);
      }
   }

   public getConnectors(): Connector[] {
      return this.connectors;
   }

   public addConnector(con: Connector) {
      this.connectors.push(con);
   }

   public removeConnector(con: Connector) {
      this.connectors = this.connectors.filter(c => c !== con);
   }

   public abstract canConnectTo(other: ConnectorSocket): boolean;

   public abstract getOutOffset(): number;

   public abstract getOutPosition(): { x: number; y: number; };

   public abstract addConnectorTo(
      hitObject: ConnectorSocket,
      connectorClass?: string,
      connector?: Connector
   ): Connector | undefined;
}
