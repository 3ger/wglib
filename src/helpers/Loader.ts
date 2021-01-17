export class Loader {
   private resources: Array<string> = [];
   private onCompleteCallback?: () => void;
   private onProgressCallback?: (args: LoadEventArgs) => void;
   private loadedCount = 0;
   private loadActive = false;

   public add(url: string): Loader {
      this.resources.push(url);
      return this;
   }

   public onComplete(callback: () => void): Loader {
      this.onCompleteCallback = callback;
      return this;
   }

   public onProgress(callback: (args: LoadEventArgs) => void): Loader {
      this.onProgressCallback = callback;
      return this;
   }

   public async startLoad(): Promise<void> {
      if (this.loadActive) throw Error("Started resource loading while already active.");
      this.loadActive = true;
      this.resources.forEach(async (str) => await this.loadRes(str));
   }

   private async loadRes(resourceUrl: string): Promise<void> {
      try {
         const loadedResponse = await fetch(resourceUrl);
         const loadedData = await loadedResponse.text();
         this.loadedCount++;
         if (this.onProgressCallback) {
            this.onProgressCallback({
               Name: resourceUrl,
               Data: loadedData,
               Percentage: this.loadedCount / this.resources.length,
               StatusText: loadedResponse.statusText,
            });
         }

         if (this.loadedCount === this.resources.length) {
            this.reset();
            if (this.onCompleteCallback) this.onCompleteCallback();
         }
      } catch (err) {
         console.warn("Ressource could not be loaded: " + resourceUrl);
         console.warn(err);
      }
   }

   private reset(): void {
      this.resources = [];
      this.loadedCount = 0;
      this.loadActive = false;
   }
}

export interface LoadEventArgs {
   Name: string;
   Data: string;
   Percentage: number;
   StatusText: string;
}
