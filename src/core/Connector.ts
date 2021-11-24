import { ConnectorSocket } from "./ConnectorSocket";
import GraphElement from "./GraphElement";
import { PointerInterface } from "./InteractionInterface";
import { VisualLine } from "./VisualLine";

export class Connector extends GraphElement {
   private line: VisualLine;

   constructor(
      private start: ConnectorSocket,
      private end: ConnectorSocket,
      cssClass = "defaultConnector",
      interaction?: PointerInterface
   ) {
      super(cssClass, interaction);
      this.line = new VisualLine(cssClass);
      this.addChild(this.line);
      start.getViewport().addChild(this);
      this.draw();
      this.setupListners();
   }

   private setupListners(): void {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.start.getTopParent().addDraggingCallback((ev) => {
         this.draw();
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.end.getTopParent().addDraggingCallback((ev) => {
         this.draw();
      });
   }

   protected draw(): void {
      this.line.drawBezier3(
         this.start.getOutPosition(),
         this.end.getOutPosition(),
         this.start.getOutOffset(),
         this.end.getOutOffset()
      );
   }
}
