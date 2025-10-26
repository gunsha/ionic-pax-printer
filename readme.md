## Ionic Pax Printer Example App

Example for interacting with Pax A910 POS printer, using [Ionic 8](https://ionicframework.com/).

Uses [awesome-cordova-plugins/bluetooth-serial](https://github.com/danielsogl/awesome-cordova-plugins/blob/master/docs/plugins/bluetooth-serial.md) for printer connection and [ReceiptPrinterEncoder](https://github.com/NielsLeenheer/ReceiptPrinterEncoder) to generate the ESC/POS commands to print.

```
npm i
ionic build --prod
npx cap sync android
npx cap open android
```
