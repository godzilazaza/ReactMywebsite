declare module "@zxing/browser" {
  export function listVideoInputDevices(): Promise<MediaDeviceInfo[]>;

  export interface IScannerControls {
    stop: () => void;
    pause: () => void;
    resume: () => void;
  }

  export class BrowserMultiFormatReader {
    constructor(hints?: any, timeBetweenScansMillis?: number);
    decodeFromVideoDevice(
      deviceId: string | null,
      videoElement: HTMLVideoElement,
      callback: (result: any, error: any, controls: IScannerControls) => void
    ): Promise<IScannerControls>;
    reset(): void;
  }
}
