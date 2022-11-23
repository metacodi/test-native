import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { BrowserWindow } from 'electron';
// import { BrowserWindowConstructorOptions } from 'electron/main';

// import { ElectronService } from 'ngx-electron';
// import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

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
 * import { InAppBrowserPlugin } from 'src/core/native';
 *
 * constructor(public iab: InAppBrowserPlugin){}
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class InAppBrowserPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  browserIAP: any;
  isOpened: boolean;

  constructor(
    public device: DevicePlugin,
    public iab: InAppBrowser,
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
   *  InAppBrowserOptions (mobile) {@link https://github.com/apache/cordova-plugin-inappbrowser#cordovainappbrowseropen }
   *
   *  OR
   *
   *  BrowserWindowConstructorOptions (electron) {@link https://www.electronjs.org/docs/api/browser-window#clase-browserwindow }
   *
   * Sample Mobile
   * ```typescript
   * this.iab.openWindow({ url: 'https://domain.ext/', '_blank', optionsWindow: {
   *        location: 'no',
   *        clearcache: 'yes',
   *        toolbar: 'yes',
   *        hidenavigationbuttons: 'yes',
   *        closebuttoncolor: '#3880ff',
   *        toolbarcolor: '#ffffff',
   *        hideurlbar: 'no',
   *        closebuttoncaption: '< ' + this.translate.instant('buttons.back')
   *      } }).then(window => {
   *    this.iab.onStatusUpdate().subscribe(result => {
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
   * ```
   * Sample Electron
   * ```typescript
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
   * ```
   */

  async openWindow(options: { url: string; optionsWindow: InAppBrowserOptions | BrowserWindowConstructorOptions}): Promise<any |InAppBrowserObject> {
    return this.device.ready().then(() => {
      if (this.isOpened) { this.close(); }
      if (this.device.isElectron) {
        CapacitorElectronMetacodi.openWindow({ url: options.url, optionsWindow: options.optionsWindow});
        return;
      } else if (this.device.isRealPhone || this.device.is('mobileweb')  || this.device.info.platform === 'web') {
        return this.browserIAP = this.iab.create(options.url, '_blank', (options.optionsWindow as InAppBrowserOptions));
      } else {
        return;
      }
    });
  }

  onStatusUpdate(): Observable<StatusUpdateResults> {

    return new Observable<StatusUpdateResults>(observer => {
      if (this.device.isRealPhone) {
        this.browserIAP.on('loadstop').subscribe((event: any) => {
          this.isOpened = true;
          observer.next({ status: 'navigate', url: event.url });
        });
        this.browserIAP.on('exit').subscribe((event: any) => {
          this.isOpened = false;
          observer.next({ status: 'close' });
          observer.complete();
        });
      } else if (this.device.isElectron) {
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
  }

  close(): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      if (this.isOpened) {
        if (this.device.isRealPhone) {
          this.browserIAP?.hide();
        } else if (this.device.isElectron) {
          CapacitorElectronMetacodi?.closeWindow();
        }
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

}
