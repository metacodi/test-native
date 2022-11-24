import { Injectable } from '@angular/core';
import { DevicePlugin } from './device';


import { AnimationOptions, BackgroundColorOptions, SetOverlaysWebViewOptions, StatusBar, StatusBarInfo, Style, StyleOptions } from '@capacitor/status-bar';
import { PluginListenerHandle } from '@capacitor/core';
import { of } from 'rxjs';
import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `StatusBar`.
 *
 * **Cordova**
 *
 * ```typescript
 * import { StatusBar } from '@ionic-native/status-bar/ngx';
 * ```
 *
 * **Capacitor**
 *
 * - Api: https://capacitor.ionicframework.com/docs/apis/status-bar
 *
 * ```typescript
 * import { Plugins } from '@capacitor/core';
 * const { StatusBar } = Plugins;
 *
 * StatusBar.show();
 * StatusBar.hide();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class StatusBarPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  /** iOS only. */
  async addListenerStatusTap(callback: () => void): Promise<PluginListenerHandle | void> {
    return this.device.getInfo().then(() => {
      if (!this.device.isRealPhone && this.device.isIos) { return Promise.resolve(); } else { return window.addEventListener('statusTap', callback); }
    });
  }

  /** Show the status bar. */
  async show(options?: AnimationOptions | undefined): Promise<void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return Promise.resolve(undefined); } else { return StatusBar.show(options); }
    });
  }

  /** Hide the status bar. */
  async hide(options?: AnimationOptions | undefined): Promise<void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return Promise.resolve(undefined); } else { return StatusBar.hide(options); }
    });
  }

  /** Set the background color of the status bar. */
  setBackgroundColor(options: BackgroundColorOptions): Promise<StatusBarInfo | void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return Promise.resolve(); } else { return StatusBar.setBackgroundColor(options); }
    });
  }

  /** Get info about the current state of the status bar. */
  getInfo(): Promise<StatusBarInfo | void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return Promise.resolve(undefined); } else { return StatusBar.getInfo(); }
    });
  }

  /** Set whether or not the status bar should overlay the webview to allow usage of the space around a device "notch". */
  setOverlaysWebView(options: SetOverlaysWebViewOptions): Promise<void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return Promise.resolve(undefined); } else { return StatusBar.setOverlaysWebView(options); }
    });
  }

  /** Set the current style of the status bar. */
  setStyle(options: StyleOptions): Promise<void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return Promise.resolve(undefined); } else { return StatusBar.setStyle(options); }
    });
  }

  setStatusBar(mode: 'light' | 'dark') {
    if (this.debug) { console.log(this.constructor.name + '.setStatusBar()'); }
    this.device.ready().then(() => {
      if (this.debug) { console.log(this.constructor.name + '.setStatusBar() => this.device.platform', this.device.platform); }
      if (this.device.isReal('ios')) {
        this.setStyle({ style: mode === 'light' ? Style.Light : Style.Dark });
      } else if (this.device.isReal('android')) {
        //  this.setStyle({ style: StatusBarStyle.Dark });
         this.setStyle({ style: mode === 'light' ? Style.Dark : Style.Light });
      }

      if (this.debug) { this.getInfo().then( info => { console.log(this.constructor.name + '.getInfo', JSON.stringify(info)); }); }
    }).catch(error => {
      if (this.debug) { console.log(this.constructor.name + '.setStatusBar() error =>', error); }
    });
  }

}
