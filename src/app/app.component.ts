import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { refresh, createSharp, logoIonic, imageSharp } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({ refresh, createSharp, logoIonic, imageSharp });
  }
}
