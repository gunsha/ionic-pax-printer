import { AfterViewInit, Component, NgZone } from '@angular/core';
import SignaturePad from 'signature_pad';
import {
  IonGrid,
  IonRow,
  IonCol,
  ModalController,
  IonButton,
  IonButtons,
  IonContent,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-drawing-pad-modal',
  templateUrl: './drawing-pad-modal.component.html',
  styleUrls: ['./drawing-pad-modal.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonContent,
    IonButtons,
    IonToolbar,
    IonHeader,
  ],
})
export class DrawingPadModalComponent implements AfterViewInit {
  private signaturePad!: SignaturePad;
  private signatureImg?: string;
  constructor(private zone: NgZone, private modalCtrl: ModalController) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      canvas.ontouchstart = this.startDrawing;
      canvas.ontouchmove = this.moved;
      this.signaturePad = new SignaturePad(canvas, {
        throttle: 0,
      });
      this.signaturePad.clear();
    });
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const iamgeData = canvas
      .getContext('2d')!
      .getImageData(0, 0, canvas.width, canvas.height);
    this.dismiss({ signature: iamgeData });
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}
