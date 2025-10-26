import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

interface IBTDevice {
  address: string;
  id: string;
  name: string;
  class: number;
}
type DitheringOptions = 'threshold' | 'bayer' | 'floydsteinberg' | 'atkinson';
@Injectable()
export class PrinterProvider {
  private PaxPrinterAddress = '1F:1F:1F:1F:1F:1F';
  private paxPrinter?: IBTDevice;
  public printerFound: boolean = false;
  public printerConnected: boolean = false;
  constructor(private btSerial: BluetoothSerial) {}

  async find() {
    const btDevicesList: IBTDevice[] = await this.btSerial.list();
    if (!!btDevicesList.length) {
      this.paxPrinter = btDevicesList.find(
        (device) => device.address === this.PaxPrinterAddress
      );
      this.printerFound = !!this.paxPrinter;
    }
  }

  connect(onConnect?: () => Promise<void>) {
    return new Promise<void>((resolve, reject) => {
      if (!this.paxPrinter) {
        return reject('Pax printer not found');
      }
      const subs = this.btSerial
        .connect(this.paxPrinter.address)
        .subscribe(async () => {
          console.log('Connected to Pax printer');
          if (onConnect) {
            await onConnect();
          }
          subs.unsubscribe();
          resolve();
        });
    });
  }

  private getEncoder() {
    return new ReceiptPrinterEncoder({
      printerModel: 'pos-5890',
    });
  }

  printImagePath(
    path: string,
    w: number = 384,
    h: number = 384,
    dithering: DitheringOptions = 'threshold'
  ) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = path;

      img.onload = async () => {
        let result = this.getEncoder()
          .initialize()
          .image(img, w, h, dithering)
          .encode();
        await this.connect(async () => {
          await this.btSerial.write(result);
          resolve();
        });
      };
    });
  }

  async printImageFile(
    base64Data: string,
    dithering: DitheringOptions = 'atkinson'
  ) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = base64Data;

      img.onload = async () => {
        // the max width for pos-5890 is 384px, make width of image 384px and scale height accordingly, must be a multiple of 8
        const aspectRatio = img.width / img.height;
        const w = 384;
        const h = Math.round(w / aspectRatio / 8) * 8;

        let result = this.getEncoder()
          .initialize()
          .image(img, w, h, dithering)
          .encode();
        await this.connect(async () => {
          await this.btSerial.write(result);
          resolve();
        });
      };
    });
  }

  async printImageData(
    imageData: ImageData,
    w: number = 384,
    h: number = 384,
    dithering: DitheringOptions = 'threshold'
  ) {
    const result = this.getEncoder()
      .initialize()
      .image(imageData, w, h, dithering)
      .encode();
    await this.connect(async () => {
      await this.btSerial.write(result);
    });
  }
}
