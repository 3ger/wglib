import { IPointData } from "@pixi/math";
import { Connector } from "./Connector";
import { ConnectorEnd } from "./ConnectorEnd";
import { ConnectorSocket } from "./ConnectorSocket";
import { WgLib } from "./WgLib";

export class ConnectorStart extends ConnectorSocket {
   protected aaaa = "ConnectorStart";

   public getOutOffset(): number {
      return this.vis?.dragOutOffset || 100;
   }

   public canConnectTo(other: ConnectorSocket): boolean {
      return other instanceof ConnectorEnd;
   }

   public getOutPosition(): { x: number; y: number } {
      const elPosWorld = WgLib.getViewport().toWorld(<IPointData>this.getPosition());
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
