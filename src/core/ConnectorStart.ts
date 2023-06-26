import { IPointData } from "pixi.js";
import { Connector } from "./Connector";
import { ConnectorEnd } from "./ConnectorEnd";
import { ConnectorSocket } from "./ConnectorSocket";
import { PointerInterface } from "./InteractionInterface";

export class ConnectorStart extends ConnectorSocket {

   constructor(
      text: string,
      cssClass: string,
      private onConnected?: (other: ConnectorEnd) => void,
      private canConnect?: (other: ConnectorEnd) => boolean,
      interaction?: PointerInterface
   ) {
      super(text, cssClass, interaction);
   }

   public getOutOffset(): number {
      return this.vis?.dragOutOffset || 100;
   }

   public canConnectTo(other: ConnectorSocket): boolean {
      if (!(other instanceof ConnectorEnd))
         return false;
      return this.canConnect ? this.canConnect(other) : true;
   }

   public getOutPosition(): { x: number; y: number; } {
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
         con.setWgLibParent(this.wglibParent);
         this.connectors.push(con);
         hitObject.onHasConnected(con);
         this.onConnected?.call(this, hitObject);
         return con;
      }
      return undefined;
   }
}
