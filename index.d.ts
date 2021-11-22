declare module 'wglib/core/Box' {
   import GraphElement from "wglib/core/GraphElement";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   export default class Box extends GraphElement {
      constructor(cssClass?: string, interaction?: InteractionInterface, noDrawCall?: boolean);
      protected draw(): void;
   }

}
declare module 'wglib/core/BoxContainer' {
   import GraphElement from "wglib/core/GraphElement";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   import Box from "wglib/core/Box";
   export default class BoxContainer extends GraphElement {
      private elements;
      constructor(cssClass?: string, interaction?: InteractionInterface);
      addBox(box: Box, asElement?: boolean): BoxContainer;
      private getNextBoxPosition;
   }

}
declare module 'wglib/core/BoxElement' {
   import Box from "wglib/core/Box";
   export abstract class BoxElement {
      abstract onAdded(parent: Box, position: {
         x: number;
         y: number;
      }): void;
      abstract getHeight(): number;
      abstract getLocalPosition(): {
         x: number;
         y: number;
      };
   }
   export class TextBoxElement extends BoxElement {
      private text;
      private cssClass;
      private parent;
      private pixiElement;
      constructor(text: string, cssClass: string);
      onAdded(parent: Box, position: {
         x: number;
         y: number;
      }): void;
      getHeight(): number;
      getLocalPosition(): {
         x: number;
         y: number;
      };
   }

}
declare module 'wglib/core/Connector' {
   import { ConnectorSocket } from "wglib/core/ConnectorSocket";
   import GraphElement from "wglib/core/GraphElement";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   export class Connector extends GraphElement {
      private start;
      private end;
      private line;
      constructor(start: ConnectorSocket, end: ConnectorSocket, cssClass?: string, interaction?: InteractionInterface);
      private setupListners;
      protected draw(): void;
   }

}
declare module 'wglib/core/ConnectorEnd' {
   import { ConnectorSocket } from "wglib/core/ConnectorSocket";
   import { Connector } from "wglib/core/Connector";
   export class ConnectorEnd extends ConnectorSocket {
      getOutOffset(): number;
      canConnectTo(other: ConnectorSocket): boolean;
      getOutPosition(): {
         x: number;
         y: number;
      };
      addConnectorTo(hitObject: ConnectorSocket, connectorClass?: string, connector?: Connector): Connector | undefined;
   }

}
declare module 'wglib/core/ConnectorSocket' {
   import Box from "wglib/core/Box";
   import { Connector } from "wglib/core/Connector";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   import { VisualLine } from "wglib/core/VisualLine";
   export abstract class ConnectorSocket extends Box {
      private interaction?;
      protected currentDragOut?: VisualLine | undefined;
      protected connectors: Array<Connector>;
      private elToFollow;
      constructor(cssClass: string, interaction?: InteractionInterface | undefined);
      private dragEnd;
      private removeDragOut;
      private dragStart;
      private dragging;
      protected drawConnectionLine(toPos: {
         x: number;
         y: number;
      }): void;
      getConnectors(): Array<Connector>;
      abstract canConnectTo(other: ConnectorSocket): boolean;
      abstract getOutOffset(): number;
      abstract getOutPosition(): {
         x: number;
         y: number;
      };
      abstract addConnectorTo(hitObject: ConnectorSocket, connectorClass?: string, connector?: Connector): Connector | undefined;
   }

}
declare module 'wglib/core/ConnectorStart' {
   import { Connector } from "wglib/core/Connector";
   import { ConnectorSocket } from "wglib/core/ConnectorSocket";
   export class ConnectorStart extends ConnectorSocket {
      getOutOffset(): number;
      canConnectTo(other: ConnectorSocket): boolean;
      getOutPosition(): {
         x: number;
         y: number;
      };
      addConnectorTo(hitObject: ConnectorSocket, connectorClass?: string, connector?: Connector): Connector | undefined;
   }

}
declare module 'wglib/core/DragHandler' {
   import { InteractionData } from "pixi.js";
   import GraphElement from "wglib/core/GraphElement";
   import { InteractionArgs } from "wglib/core/InteractionInterface";
   export class DragHandler {
      private graphElement;
      private onDragStartCallback?;
      private onDragEndCallback?;
      private isDragging;
      private dragData?;
      private elementPointerOffset;
      private moveListeners;
      private readonly element;
      constructor(graphElement: GraphElement, onDragStartCallback?: ((e: InteractionArgs) => void) | undefined, onDragEndCallback?: ((e: InteractionArgs) => void) | undefined);
      private onPointerMove;
      private onDragStart;
      private onDragEnd;
      onDragged(fn: (data?: InteractionData) => void): void;
   }

}
declare module 'wglib/core/GraphElement' {
   import { Container, InteractionData } from "pixi.js";
   import { InteractionManager } from "wglib/core/InteractionManager";
   import { InteractionState } from "wglib/core/InteractionState";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   import { VisualProperties } from "wglib/helpers/CssHelper";
   import { Viewport } from "pixi-viewport";
   export default abstract class GraphElement extends Container {
      protected cssClass: string;
      protected interactionManager?: InteractionManager;
      protected vis: VisualProperties;
      constructor(cssClass: string, interaction?: InteractionInterface);
      private redraw;
      protected draw(): void;
      setVisualProperties(newVis: VisualProperties): void;
      getInteractionState(): InteractionState;
      getCssClass(): string;
      getContainer(): Container;
      setPosition(x: number, y: number): void;
      getHeight(): number;
      getPosition(): {
         x: number;
         y: number;
      };
      getTopParent(): GraphElement;
      getViewport(): Viewport;
      addDraggingCallback(fn: (data?: InteractionData) => void): void;
   }

}
declare module 'wglib/core/InteractionInterface' {
   import { InteractionData } from "pixi.js";
   import GraphElement from "wglib/core/GraphElement";
   export interface InteractionInterface {
      onPointerDown(args: InteractionArgs): void;
      onPointerUp(args: InteractionArgs): void;
      onPointerUpOutside(args: InteractionArgs): void;
      onDragging(args: InteractionArgs): void;
      onDragStart(args: InteractionArgs): void;
      onDragEnd(args: InteractionArgs): void;
      onPointerOver(args: InteractionArgs): void;
      onPointerOut(args: InteractionArgs): void;
      onPointerTap(args: InteractionArgs): void;
      onRightClick(args: InteractionArgs): void;
      onRightDown(args: InteractionArgs): void;
      onRightUp(args: InteractionArgs): void;
      canDrag?: boolean | (() => boolean);
      preventPropagation?: boolean | (() => boolean);
   }
   export class InteractionArgs {
      element: GraphElement;
      eventData?: InteractionData | undefined;
      private stop;
      constructor(element: GraphElement, eventData?: InteractionData | undefined);
      stopPropagation(): void;
      shouldStopPropagation(): boolean;
   }

}
declare module 'wglib/core/InteractionManager' {
   import GraphElement from "wglib/core/GraphElement";
   import { InteractionState } from "wglib/core/InteractionState";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   import { InteractionData } from "pixi.js";
   export class InteractionManager {
      private parent;
      private interaction;
      private dragHandler?;
      private interactionState;
      private hoverFilter;
      private clickFilter?;
      canDrag: boolean;
      constructor(parent: GraphElement, interaction: InteractionInterface);
      private shouldPreventPropagation;
      private handlePointerUp;
      private handlePointerUpOutside;
      private handlePointerDown;
      private hasClickEvent;
      private applyClickFilter;
      private removeClickFilter;
      private createHoverFilterAndCursor;
      private dragStart;
      private dragStop;
      getInteractionState(): InteractionState;
      addDraggingCallback(fn: (data?: InteractionData) => void): void;
   }

}
declare module 'wglib/core/InteractionState' {
   export enum InteractionState {
      Invalid = -1,
      None = 0,
      Dragged = 1
   }

}
declare module 'wglib/core/Text' {
   import { Text as pixiText } from "pixi.js";
   export default class Text extends pixiText {
      private vis?;
      constructor(text: string, cssClass: string);
      setupText(): void;
   }

}
declare module 'wglib/core/TextBox' {
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   import Box from "wglib/core/Box";
   export class TextBox extends Box {
      private text;
      private textElement?;
      constructor(text: string, cssClass?: string, interaction?: InteractionInterface);
      private addText;
      getText(): string;
   }

}
declare module 'wglib/core/VisualLine' {
   import GraphElement from "wglib/core/GraphElement";
   export class VisualLine extends GraphElement {
      protected cssClass: string;
      private line;
      constructor(cssClass?: string);
      private setupLine;
      drawStraight(start: {
         x: number;
         y: number;
      }, end: {
         x: number;
         y: number;
      }): void;
      drawBezier2(start: {
         x: number;
         y: number;
      }, end: {
         x: number;
         y: number;
      }, offset?: number): void;
      drawBezier3(start: {
         x: number;
         y: number;
      }, end: {
         x: number;
         y: number;
      }, offsetStart?: number, offsetEnd?: number): void;
   }

}
declare module 'wglib/core/WgLib' {
   import { Viewport } from "pixi-viewport";
   import { WgSettings } from "wglib/core/WgSettings";
   import { InteractionInterface } from "wglib/core/InteractionInterface";
   import GraphElement from "wglib/core/GraphElement";
   import { AbstractRenderer } from "pixi.js";
   export class WgLib {
      private config;
      private onLoaded?;
      private pixiApp;
      private viewPort;
      private elements;
      private onContextMenuCallbacks;
      constructor(config: WgSettings, onLoaded?: (() => void) | undefined, onContextMenu?: (args: UIEvent) => void);
      private initStage;
      private TEST_METHOD_TODO_REMOVE;
      addTextBox(title: string, cssClass: string, interaction: InteractionInterface): WgLib;
      addElement(element: GraphElement, ...rest: GraphElement[]): WgLib;
      addEventListner(event: "contextmenu", func: (args: UIEvent) => void): void;
      getViewport(): Viewport;
      getRenderer(): AbstractRenderer;
   }

}
declare module 'wglib/core/WgSettings' {
   export interface WgSettings {
      CssFile?: string;
      CanvasElement?: HTMLCanvasElement;
      CanvasSize: {
         x: number;
         y: number;
      };
      WorkspaceSize: {
         x: number;
         y: number;
      };
      BackgroundColor: number;
   }

}
declare module 'wglib/helpers/CssHelper' {
   import { TextStyle } from "pixi.js";
   export class CssCache {
      private static IsInit;
      private static cssCache?;
      private static parsedCssCache;
      static getVisualProperties(cssClass: string): VisualProperties;
      static init(cssFile?: string, onCompleteCallback?: () => void): Promise<void>;
      private static getCssRuleFor;
      private static getCssRules;
   }
   export function hasAlpha(strRgba?: string): boolean;
   export function getAlpha(strRgba?: string): number;
   export function rgbToHex(strRgb: string): string;
   export class VisualProperties {
      readonly textStyle?: TextStyle;
      readonly backgroundColor?: number;
      readonly backgroundColorAlpha?: number;
      readonly dragStartSide?: number;
      readonly borderWidth: number;
      readonly borderRadius?: number;
      readonly borderColor?: number;
      readonly borderColorAlpha?: number;
      readonly borderStyle?: string;
      readonly borderDrawAlignment?: number;
      readonly dragOutOffset?: number;
      readonly height: number;
      readonly width: number;
      readonly top: number;
      readonly left: number;
      readonly selectorText?: string;
      readonly verticalAlign?: string;
      readonly color: number;
      readonly colorAlpha: number;
      readonly display?: string;
      readonly opacity?: number;
      readonly cursor?: string;
      readonly animationDuration?: number;
      constructor(cssstyle?: CSSStyleRule);
      private getTextStyle;
   }

}
declare module 'wglib/helpers/DevTool' {
   import { Graphics } from "pixi.js";
   import { WgLib } from "wglib/core/WgLib";
   export class DebugPoint {
      container: Graphics;
      constructor(x: number, y: number, color?: number);
   }
   export class DebugBox {
      container: Graphics;
      constructor(x: number, y: number, w: number, h: number, color?: number);
   }
   export class DevTool {
      static readonly IsDebug = true;
      static DrawDebugPoint(x: number, y: number, color: number | undefined, wglib: WgLib): void;
      static DrawDebugBox(x: number, y: number, w: number, h: number, color: number | undefined, wglib: WgLib): void;
   }

}
declare module 'wglib/helpers/Loader' {
   export class Loader {
      private resources;
      private onCompleteCallback?;
      private onProgressCallback?;
      private loadedCount;
      private loadActive;
      add(url: string): Loader;
      onComplete(callback: () => void): Loader;
      onProgress(callback: (args: LoadEventArgs) => void): Loader;
      startLoad(): Promise<void>;
      private loadRes;
      private reset;
   }
   export interface LoadEventArgs {
      Name: string;
      Data: string;
      Percentage: number;
      StatusText: string;
   }

}
declare module 'wglib/index' {
   export { WgLib } from "wglib/core/WgLib";
   export { Connector } from "wglib/core/Connector";
   export { ConnectorStart } from "wglib/core/ConnectorStart";
   export { ConnectorEnd } from "wglib/core/ConnectorEnd";
   export { TextBoxElement } from "wglib/core/BoxElement";
   export type { WgSettings } from "wglib/core/WgSettings";
   export type { InteractionInterface } from "wglib/core/InteractionInterface";
   export { InteractionState } from "wglib/core/InteractionState";
   export { TextBox } from "wglib/core/TextBox";

}
declare module 'wglib' {
   import main = require('wglib/index');
   export = main;
}