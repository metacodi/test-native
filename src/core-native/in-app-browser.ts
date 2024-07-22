import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { BrowserWindow } from 'electron';
// import { BrowserWindowConstructorOptions } from 'electron/main';

// import { ElectronService } from 'ngx-electron';
// import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
// import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser, OpenOptions } from '@capacitor/browser';

import { DevicePlugin } from './device';
import { BrowserWindowConstructorOptions } from 'electron';
import { CapacitorElectronMetacodi } from '@metacodi/capacitor-electron';
import { NativeConfig } from './native-config';


export interface StatusUpdateResults { status: 'navigate' | 'close'; url?: string }

/**
 * Wrapper para el plugin `InAppBrowserPlugin`.
 *
 * **Cordova**
 *
 * ```sell
 * ionic cordova plugin add cordova-plugin-inappbrowser
 * npm install @ionic-native/in-app-browser
 * ```
 * Usage
 * ```typescript
 * import { InAppBrowserPlugin } from 'src/core-native';
 *
 * constructor(public iab: InAppBrowserPlugin){}
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class InAppBrowserPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('InAppBrowserPlugin');

  browserIAP: any;
  isOpened: boolean;

  constructor(
    public device: DevicePlugin,
    // public iab: InAppBrowser,
    // public electronService: ElectronService,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }


  /**
   * Open a new Window
   *
   * parameters:
   *
   * @param options.url : Url to navigate
   * @param options.optionsWindow
   *
   *  Browser (mobile) {@link https://capacitorjs.com/docs/apis/browser }
   *  
   *  npm install @capacitor/browser
   *  
   *  BrowserWindowConstructorOptions (electron) {@link https://www.electronjs.org/docs/api/browser-window#clase-browserwindow }
   * 
   * this.iab.openWindow({ url: 'https://domain.ext/', optionsWindow: { width: 1000, height: 800 } }).then(window => {
   *   this.iab.onStatusUpdate().subscribe(result => {
   *     // When url is change return string
   *     if (result.status === 'navigate') {
   *       console.log('onStatusUpdate => Navigate', result.url);
   *     }
   *     // If window is closed
   *     if (result.status === 'close') {
   *       console.log('onStatusUpdate => Closed');
   *     }
   *   });
   * });
   * 
   */

  async openWindow(options: { url: string; optionsWindow: OpenOptions | BrowserWindowConstructorOptions}): Promise<any> {
    return this.device.ready().then(async () => {
      if (this.isOpened) { this.close(); }
      const isElectron = this.device.isElectron;
      const isRealPhone = await this.device.isRealPhone;
      const isMobileWeb = await this.device.is('mobileweb');
      const platform = await this.device.platform;
      if (isElectron) {
        CapacitorElectronMetacodi.openWindow({ url: options.url, optionsWindow: options.optionsWindow});
        return;
      } else if (isRealPhone || isMobileWeb || platform === 'web') {
        return Browser.open({ url: options.url }).then(() => {}, (reason: any) => { console.log('Browser.open => reason ', JSON.stringify(reason)); });
      } else {
        return;
      }
    });
  }

  onStatusUpdate(): Observable<StatusUpdateResults> {
    return new Observable<StatusUpdateResults>(observer => {
      const isElectron = this.device.isElectron;
      this.device.isRealPhone.then(isRealPhone => {
        if (isRealPhone) {
          Browser.addListener('browserFinished', () => {
              this.isOpened = true;
              observer.next({ status: 'navigate', url: '' });
              Browser.removeAllListeners();
              observer.complete();
          });
          Browser.addListener('browserPageLoaded', () => {
              this.isOpened = true;
              observer.next({ status: 'navigate', url: '' });
          });
        } else if (isElectron) {
          let currentUrl = '';
          const timerId = setInterval(() => {
            CapacitorElectronMetacodi.getUrl().then(value => {
              if (value.isClosed) {
                this.isOpened = false;
                clearInterval(timerId);
                observer.next({ status: 'close' });
                observer.complete();
              } else if (currentUrl !== value.url) {
                currentUrl = value.url;
                this.isOpened = true;
                observer.next({ status: 'navigate', url: currentUrl });
              }
            });
          }, 250);
        }
      });
    });
  }

  close(): Promise<any> {
    return new Promise<any>(async (resolve: any, reject: any) => {
      if (this.isOpened) {
        const isElectron = this.device.isElectron;
        const isRealPhone = await this.device.isRealPhone;
        if (isRealPhone) {
          Browser.removeAllListeners();
          Browser.close();
        } else if (isElectron) {
          CapacitorElectronMetacodi?.closeWindow();
        }
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

}
