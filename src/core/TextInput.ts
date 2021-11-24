import { PointerInterface, InputInterface, InteractionArgs } from "./InteractionInterface";
import GraphElement from "./GraphElement";
import { TextBox } from "./TextBox";
import { WgLib } from "./WgLib";
import { numberToRGB } from "../helpers/CssHelper";

export class TextInput extends GraphElement {
   private boxElement: TextBox;
   private outerInputInterface?: InputInterface;
   private boxInterface: PointerInterface;
   private domElement!: HTMLInputElement;
   private cachedGlobalX: number = 0;
   private cachedGlobalY: number = 0;
   private cachedTextSize: number = 0;

   constructor(private text: string, cssClass = "defaultTextInput", interaction?: InputInterface) {
      super(cssClass);
      this.outerInputInterface = interaction;
      this.boxInterface = <PointerInterface>{
         onPointerDown: (args: InteractionArgs) => {
            this.onPointerDown(args);
         },
         canDrag: false
      };
      this.boxElement = new TextBox(this.text, this.cssClass, this.boxInterface);
      this.boxElement.showText(false);
      this.addChild(this.boxElement);
   }

   private setupElements(): void {
      const textVis = this.boxElement.getTextVis();
      const viewEl = this.getRenderer().view;

      let fontSize = 16;
      if (typeof textVis.textStyle?.fontSize === "string")
         fontSize = Number.parseInt(textVis.textStyle?.fontSize);
      else if (typeof textVis.textStyle?.fontSize === "number")
         fontSize = textVis.textStyle?.fontSize;

      this.cachedGlobalX = viewEl.clientLeft + viewEl.offsetLeft;
      this.cachedGlobalY = viewEl.clientTop + viewEl.offsetTop;
      this.cachedTextSize = fontSize;

      this.domElement = document.createElement("input");
      this.domElement.style.display = "block";
      this.domElement.style.position = "fixed";
      this.domElement.style.border = "0";
      this.domElement.style.outline = "none";
      this.domElement.style.backgroundColor = "rgba(0,0,0,0)";
      this.domElement.style.cursor = "text";

      if (typeof textVis.textStyle?.fill === "string")
         this.domElement.style.color = textVis.textStyle?.fill;
      else if (typeof textVis.textStyle?.fill === "number")
         this.domElement.style.color = numberToRGB(textVis.textStyle?.fill, textVis.colorAlpha);
      if (typeof textVis.textStyle?.fontStyle === "string")
         this.domElement.style.fontStyle = textVis.textStyle?.fontStyle;
      if (typeof textVis.textStyle?.align === "string")
         this.domElement.style.textAlign = textVis.textStyle?.align;
      if (typeof textVis.textStyle?.fontFamily === "string")
         this.domElement.style.fontFamily = textVis.textStyle?.fontFamily;
      if (typeof textVis.textStyle?.fontVariant === "string")
         this.domElement.style.fontVariant = textVis.textStyle?.fontVariant;
      if (typeof textVis.textStyle?.fontWeight === "string")
         this.domElement.style.fontWeight = textVis.textStyle?.fontWeight;

      this.domElement.value = this.text;
      this.domElement.onchange = (ev: Event) => this.onChange(ev as InputEvent);
      this.domElement.oninput = (ev: Event) => this.onInput(ev as InputEvent);
      this.domElement.onblur = (ev: Event) => this.onBlur(ev as FocusEvent);

      // pass on events from text element
      this.domElement.onwheel = (ev: WheelEvent) => this.getViewport().plugins.wheel(ev);
      this.domElement.onpointerdown = (ev: PointerEvent) => this.boxElement.emit("pointerdown", this);

      this.setupVisuals();

      // hook up change events to adjust html element
      const vP = this.getViewport();
      // vP.on("zoomed-end", () => this.setupVisuals());
      // vP.on("moved", () => this.setupVisuals());
      // vP.on("drag-end", () => this.setupVisuals());
      // vP.on("mouse-edge-end", () => this.setupVisuals());

      document.body.appendChild(this.domElement);
   }

   onInput(ev: InputEvent): any {
      this.boxElement.setText((ev.target as HTMLInputElement).value);
      if (this.outerInputInterface?.onInput)
         this.outerInputInterface.onInput(ev);
   }

   private setupVisuals() {

      // TODO: fix, currently will go "over" visible area (since isVisible counts all/half points)
      //       a possible fix could be reducing the height and width of the element (shifting to alignment)
      if (!this.isVisible()) {
         this.domElement.style.display = "none";
         return;
      }

      this.domElement.style.display = "block";
      const viewPort = this.getViewport();
      const globPos = viewPort.toGlobal(this.position);
      this.domElement.style.left = this.cachedGlobalX + globPos.x + "px";
      this.domElement.style.top = this.cachedGlobalY + globPos.y + "px";
      this.domElement.style.fontSize = this.cachedTextSize * viewPort.scale.x + "px";
      this.domElement.style.width = (this.boxElement.width * viewPort.scale.x) + "px";
      this.domElement.style.height = (this.boxElement.height * viewPort.scale.y) + "px";
   }

   private onChange(ev: InputEvent): void {
      if (this.outerInputInterface?.onChange)
         this.outerInputInterface.onChange(ev);
   }

   private onBlur(ev: FocusEvent): void {
      this.domElement.disabled = true;

      if (this.outerInputInterface?.onBlur)
         this.outerInputInterface.onBlur(ev);
   }

   private onPointerDown(args: InteractionArgs) {
      this.domElement.disabled = false;

      setTimeout(() => {
         this.domElement.focus();
      }, 100);

      if (this.outerInputInterface?.onPointerDown)
         this.outerInputInterface.onPointerDown(args);
   }

   public getText(): string {
      return this.boxElement.getText();
   }

   public setWgLibParent(wglib: WgLib) {
      super.setWgLibParent(wglib);
      this.setupElements();
      this.boxElement?.setWgLibParent(wglib);
   }

   public updateTransform(): void {
      super.updateTransform();
      this.setupVisuals();
   }
}
