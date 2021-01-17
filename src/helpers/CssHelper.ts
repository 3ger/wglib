import { TextStyle } from "pixi.js";
import { Loader, LoadEventArgs } from "./Loader";

export class CssCache {
   private static IsInit: boolean;
   private static cssCache?: CSSRuleList;
   private static parsedCssCache: { [id: string]: VisualProperties } = {};

   public static getVisualProperties(cssClass: string): VisualProperties | undefined {
      if (!CssCache.IsInit) throw new Error("Using CssCache while it is not initialized. Call Init first");

      if (!CssCache.parsedCssCache.hasOwnProperty(cssClass)) {
         const foundStyle = this.getCssRuleFor(cssClass);
         if (foundStyle) {
            CssCache.parsedCssCache[cssClass] = new VisualProperties(foundStyle);
         } else {
            return undefined;
         }
      }

      return CssCache.parsedCssCache[cssClass];
   }

   public static async init(cssFile = "/src/wglib.css", onCompleteCallback?: () => void): Promise<void> {
      if (CssCache.IsInit) return;

      this.IsInit = true;

      const resLoader = new Loader();

      if (onCompleteCallback) resLoader.onComplete(onCompleteCallback);

      // add needed resources for startup
      resLoader.add(cssFile);
      resLoader.onProgress((args: LoadEventArgs) => {
         if (args.StatusText === "OK")
            if (args.Name === cssFile) {
               // if needed css-file is loaded parse its content
               CssCache.cssCache = this.getCssRules(args.Data); // cache css for later use
            }
      });

      await resLoader.startLoad();
   }

   private static getCssRuleFor(name: string): CSSStyleRule | undefined {
      if (CssCache.cssCache) {
         const cssSelectorText = name.startsWith(".") ? name : "." + name;
         for (let i = 0; i < CssCache.cssCache.length; i++) {
            const rule = CssCache.cssCache[i] as CSSStyleRule;
            if (rule) {
               if (rule.selectorText === cssSelectorText) {
                  return rule;
               }
            }
         }
      }
      return undefined;
   }

   private static getCssRules(cssString: string): CSSRuleList | undefined {
      const doc = document.implementation.createHTMLDocument("");
      const styleElement = doc.createElement("style");
      styleElement.textContent = cssString;
      doc.body.appendChild(styleElement);
      return styleElement.sheet?.cssRules;
   }
}

export function hasAlpha(strRgba?: string): boolean {
   return strRgba ? strRgba.trimStart().startsWith("rgba") : false;
}

export function getAlpha(strRgba?: string): number {
   if (strRgba && hasAlpha(strRgba))
      return Number.parseFloat(
         strRgba.substr(strRgba.lastIndexOf(",") + 2, strRgba.indexOf(")") - strRgba.lastIndexOf(",") - 2)
      );

   return 1;
}

export function rgbToHex(strRgb: string): string {
   return (
      "#" +
      (hasAlpha(strRgb) ? strRgb.substr(5, strRgb.lastIndexOf(",") - 5) : strRgb.substr(4, strRgb.indexOf(")") - 4))
         .split(",")
         .map((color) => parseInt(color).toString(16).padStart(2, "0"))
         .join("")
   );
}

export class VisualProperties {
   // TODO: support more text style, rework to better update with pixi
   // text properties -- TAKEN DIRECTLY FROM PIXI TEXTSTYLE
   readonly textStyle?: TextStyle;

   // bg color
   readonly backgroundColor?: number;
   readonly backgroundColorAlpha?: number;
   readonly dragStartSide?: number;

   // border properties
   readonly borderWidth?: number;
   readonly borderRadius?: number;
   readonly borderColor?: number;
   readonly borderColorAlpha?: number;
   readonly borderStyle?: string;

   // custom properties
   readonly borderDrawAlignment?: number; // 0 | 0.5 | 1;
   readonly dragOutOffset?: number; // used for connection sockets

   // dimensions
   readonly height: number;
   readonly width: number;
   readonly top: number;
   readonly left: number;

   public readonly selectorText?: string;

   // other
   readonly verticalAlign?: string;
   readonly color: number;
   readonly colorAlpha: number;
   readonly display?: string;
   readonly opacity?: number;
   readonly cursor?: string;
   readonly animationDuration?: number;

   // this.cachedCss.style.getPropertyValue("--own-prop")
   constructor(cssstyle?: CSSStyleRule) {
      this.selectorText = cssstyle?.selectorText;

      this.textStyle = this.getTextStyle(cssstyle);

      this.backgroundColor = PIXI.utils.string2hex(rgbToHex(cssstyle?.style?.backgroundColor || "rgb(255,255,255)"));
      this.backgroundColorAlpha = getAlpha(cssstyle?.style?.backgroundColor);

      this.color = PIXI.utils.string2hex(rgbToHex(cssstyle?.style?.color || "rgb(0,0,0)"));
      this.colorAlpha = getAlpha(cssstyle?.style?.color);

      this.borderWidth = Number.parseInt(cssstyle?.style?.borderWidth || "1");
      this.borderRadius = Number.parseInt(cssstyle?.style?.borderRadius || "0");
      this.borderColor = PIXI.utils.string2hex(rgbToHex(cssstyle?.style?.borderColor || "rgb(0,0,0)"));
      this.borderColorAlpha = getAlpha(cssstyle?.style?.borderColor);
      this.borderStyle = cssstyle?.style?.borderStyle;

      this.borderDrawAlignment = Number.parseFloat(
         cssstyle?.style?.getPropertyValue("--border-draw-alignment") || "0.5"
      );
      this.dragOutOffset = Number.parseFloat(cssstyle?.style?.getPropertyValue("--drag-out-offset") || "0");
      this.dragStartSide = Number.parseFloat(cssstyle?.style?.getPropertyValue("--drag-start-side") || "0");

      this.height = Number.parseInt(cssstyle?.style?.height || "100");
      this.width = Number.parseInt(cssstyle?.style?.width || "100");
      this.top = Number.parseInt(cssstyle?.style?.top || "0");
      this.left = Number.parseInt(cssstyle?.style?.left || "0");
      this.verticalAlign = cssstyle?.style?.verticalAlign;
      this.display = cssstyle?.style.display;
      this.opacity = Number.parseFloat(cssstyle?.style.opacity || "1");
      this.cursor = cssstyle?.style.cursor;
      this.animationDuration = Number.parseFloat(cssstyle?.style.animationDuration || "0");
   }

   private getTextStyle(cssstyle?: CSSStyleRule): TextStyle {
      return <TextStyle>{
         fill: PIXI.utils.string2hex(rgbToHex(cssstyle?.style?.color || "rgb(0,0,0)")),
         fontSize: cssstyle?.style?.fontSize || "24px",
         fontStyle: cssstyle?.style?.fontStyle || "normal",
         fontWeight: cssstyle?.style?.fontWeight || "normal",
         padding: Number.parseInt(cssstyle?.style?.padding || "0"),
         align: cssstyle?.style?.textAlign || "left",
         fontFamily: cssstyle?.style?.fontFamily,
         fontVariant: cssstyle?.style.fontVariant,
      };
   }
}
