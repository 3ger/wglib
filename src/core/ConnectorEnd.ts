import { WgLib } from "./WgLib";
import { ConnectorStart } from "./ConnectorStart";
import { ConnectorSocket } from "./ConnectorSocket";
import { Connector } from "./Connector";
import { IPointData } from "pixi.js";

export class ConnectorEnd extends ConnectorSocket {
   protected aaaa = "ConnectorStart";

   public getOutOffset(): number {
      return this.vis?.dragOutOffset || -100;
   }

   public canConnectTo(other: ConnectorSocket): boolean {
      return other instanceof ConnectorStart;
   }

   public getOutPosition(): { x: number; y: number } {
      const elPosWorld = WgLib.getViewport().toWorld(<IPointData>this.getPosition());
      return { x: elPosWorld.x, y: elPosWorld.y + this.height * 0.5 };
   }

   public addConnectorTo(
      hitObject: ConnectorSocket,
      connectorClass = "defaultConnector",
      connector?: Connector
   ): Connector | undefined {
      if (hitObject.canConnectTo(this)) {
         const con = connector || new Connector(hitObject, this, connectorClass);
         this.connectors.push(con);
         return con;
      }
      return undefined;
   }
}
