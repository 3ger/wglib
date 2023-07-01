import { ConnectorStart } from "./ConnectorStart";
import { ConnectorSocket } from "./ConnectorSocket";
import { Connector } from "./Connector";
import { IPointData } from "pixi.js";
import { PointerInterface } from "./InteractionInterface";

export class ConnectorEnd extends ConnectorSocket {

   constructor(
      text: string,
      cssClass: string,
      private onConnected?: (from: ConnectorStart, to: ConnectorEnd) => void,
      private canConnect?: (other: ConnectorStart) => boolean,
      interaction?: PointerInterface
   ) {
      super(text, cssClass, interaction);
   }

   public getOutOffset(): number {
      return this.vis?.dragOutOffset || -100;
   }

   public canConnectTo(other: ConnectorSocket): boolean {
      if (!(other instanceof ConnectorStart))
         return false;
      return this.canConnect ? this.canConnect(other) : true;
   }

   public getOutPosition(): { x: number; y: number; } {
      const elPosWorld = this.getViewport().toWorld(<IPointData>this.getGlobalPosition());
      return { x: elPosWorld.x, y: elPosWorld.y + this.height * 0.5 };
   }

   public addConnectorTo(
      hitObject: ConnectorSocket,
      connectorClass = "defaultConnector",
      connector?: Connector
   ): Connector | undefined {
      if (hitObject.canConnectTo(this)) {
         const con = connector || new Connector(hitObject, this, connectorClass);
         con.setWgLibParent(this.wglibParent);
         this.onConnected?.call(this, hitObject, this);
         this.addConnector(con);
         hitObject.addConnector(con);
         return con;
      }
      return undefined;
   }
}
