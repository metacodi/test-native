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
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('StatusBarPlugin');

  constructor(
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  /** iOS only. */
  async addListenerStatusTap(callback: () => void): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    const isIos = await this.device.isIos;
    if (!isRealPhone && isIos) { return Promise.resolve(); } else { window.addEventListener('statusTap', callback); return Promise.resolve(); }
  }

  /** Show the status bar. */
  async show(options?: AnimationOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(); } else { return StatusBar.show(options); }
  }

  /** Hide the status bar. */
  async hide(options?: AnimationOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(); } else { return StatusBar.hide(options); }
  }

  /** Set the background color of the status bar. */
  async setBackgroundColor(options: BackgroundColorOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(); } else { return StatusBar.setBackgroundColor(options); }
  }

  /** Get info about the current state of the status bar. */
  async getInfo(): Promise<StatusBarInfo | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return StatusBar.getInfo(); }
  }

  /** Set whether or not the status bar should overlay the webview to allow usage of the space around a device "notch". */
  async setOverlaysWebView(options: SetOverlaysWebViewOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(); } else { return StatusBar.setOverlaysWebView(options); }
  }

  /** Set the current style of the status bar. */
  async setStyle(options: StyleOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(); } else { return StatusBar.setStyle(options); }
  }

  async setStatusBar(mode: 'light' | 'dark') {
    const platform = await this.device.platform;
    const isRealPhone = await this.device.isRealPhone;
    const isIos = await this.device.isIos;
    const isAndroid = await this.device.isAndroid;
    if (this.debug) { console.log(this.constructor.name + '.setStatusBar() => this.device.platform', platform); }
    if (isRealPhone && isIos) {
      this.setStyle({ style: mode === 'light' ? Style.Light : Style.Dark });
    } else if (isRealPhone && isAndroid) {
      this.setStyle({ style: mode === 'light' ? Style.Dark : Style.Light });
    }
  }

}
