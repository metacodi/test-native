import { Component, OnInit } from '@angular/core';
import { AppPlugin, DevicePlugin } from 'src/core-native';
import { IonicSafeString, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-app',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss'],
})
export class AppPage {

  
  constructor(
    public device: DevicePlugin,
    public app: AppPlugin,
    private toastController: ToastController
  ) { }

  results: any = {}

  

  methods = [
    { fn: 'getInfo', args: []},
    { fn: 'getState', args: []},
    { fn: 'exitApp', args: []}, 

  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.app as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }
 
  label(method: any): string { return method?.label ? method.label : method.fn; }

  async presentToast() {
    const toast = await this.toastController.create({
        message: new IonicSafeString('<ion-button>Hello!</ion-button> <br> Hola <b>Tu</b>'),
        duration: 2000
    });
    toast.present();
  }

}
