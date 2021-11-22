import { IPointData } from "pixi.js";
import { Connector } from "./Connector";
import { ConnectorEnd } from "./ConnectorEnd";
import { ConnectorSocket } from "./ConnectorSocket";

export class ConnectorStart extends ConnectorSocket {

   public getOutOffset(): number {
      return this.vis?.dragOutOffset || 100;
   }

   public canConnectTo(other: ConnectorSocket): boolean {
      return other instanceof ConnectorEnd;
   }

   public getOutPosition(): { x: number; y: number } {
      const elPosWorld = this.getViewport().toWorld(<IPointData>this.getGlobalPosition());
      return { x: elPosWorld.x + this.width, y: elPosWorld.y + this.height * 0.5 };
   }

   public addConnectorTo(
      hitObject: ConnectorSocket,
      connectorClass = "defaultConnector",
      connector?: Connector
   ): Connector | undefined {
      if (hitObject.canConnectTo(this)) {
         const con = connector || new Connector(this, hitObject, connectorClass);
         this.connectors.push(con);
         return con;
      }
      return undefined;
   }
}
