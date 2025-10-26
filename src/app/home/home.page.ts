import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  ModalController,
  IonFooter,
  IonIcon,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular/standalone';
import { PrinterProvider } from '../providers/printer';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { DrawingPadModalComponent } from '../modals/drawing-pad-modal/drawing-pad-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PrinterProvider, BluetoothSerial],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class HomePage {
  public printerFound: boolean = false;
  loading?: any;
  constructor(
    private printerProvider: PrinterProvider,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) {
    this.searchPrinter();
  }

  searchPrinter() {
    this.printerProvider.find().then(() => {
      this.printerFound = this.printerProvider.printerFound;
      if (this.printerProvider.printerFound) {
        console.log('Pax printer found');
      } else {
        console.log('Pax printer not found');
      }
    });
  }

  async showLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
    this.loading = await this.loadingCtrl.create({
      duration: 10000,
    });
    this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  loadingWrapper = async (action: () => Promise<void>) => {
    await this.showLoading();
    await action();
    await this.hideLoading();
  };

  async printLogo() {
    if (this.printerProvider.printerFound) {
      this.loadingWrapper(async () => {
        await this.printerProvider.printImagePath(
          '../../assets/icon/favicon.png',
          192,
          192,
          'atkinson'
        );
      });
    }
  }
  async printDrawing() {
    const modal = await this.modalCtrl.create({
      component: DrawingPadModalComponent,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.signature) {
      this.loadingWrapper(async () => {
        await this.printerProvider.printImageData(data.signature);
      });
    }
  }
  clickFile() {
    document.getElementById('fileInput')?.click();
  }
  handleFileSelect(event: any) {
    const files = event.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      const mimeType = file.type;
      const filename = file.name;
      const isImage = !!file.type.match(/[\/.](gif|jpg|jpeg|tiff|png)$/i);
      if (isImage) {
        reader.readAsDataURL(file);
        reader.onload = this._handleReaderLoaded.bind(this);
      }
    }
  }
  async _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Dithering type',
      buttons: [
        {
          text: 'Threshold',
          data: 'threshold',
        },
        {
          text: 'Bayer',
          data: 'bayer',
        },
        {
          text: 'Floyd-Steinberg',
          data: 'floydsteinberg',
        },
        {
          text: 'Atkinson',
          data: 'atkinson',
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: 'cancel',
        },
      ],
    });
    await actionSheet.present();
    const { data } = await actionSheet.onDidDismiss();
    (document.getElementById('fileInput') as HTMLInputElement)!.value =
      null as any;
    console.log('Dithering selected:', data);
    if (data !== 'cancel') {
      this.loadingWrapper(async () => {
        await this.printerProvider.printImageFile(binaryString!, data);
      });
    }
  }
}
