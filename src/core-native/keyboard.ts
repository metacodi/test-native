import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { Subject, of } from 'rxjs';

import { DevicePlugin } from './device';


import { Keyboard, KeyboardInfo, KeyboardStyleOptions, KeyboardResizeOptions } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';
import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `Keyboard`.
 * **Capacitor**
 *
 * - Api: {@link https://capacitor.ionicframework.com/docs/apis/keyboard}
 */
@Injectable({
  providedIn: 'root'
})
export class KeyboardPlugin implements OnInit, OnDestroy {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('KeyboardPlugin');

  constructor(
    public device: DevicePlugin
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  async ngOnInit() {
    const isRealPhone = await this.device.isRealPhone;
    // Actualizamos los teclados de los dispositivos móviles.
    if (isRealPhone) { Keyboard.setAccessoryBarVisible({ isVisible: true }); }
  }

  async ngOnDestroy() {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) { Keyboard.removeAllListeners(); }
  }


  async addListenerWillShow(callback: (info: KeyboardInfo) => void): Promise<PluginListenerHandle | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.addListener('keyboardWillShow', callback); }
  }

  async addListenerDidShow(callback: (info: KeyboardInfo) => void): Promise<PluginListenerHandle | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.addListener('keyboardDidShow', callback); }
  }

  async addListenerWillHide(callback: () => void): Promise<PluginListenerHandle | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.addListener('keyboardWillHide', callback); }
  }

  async addListenerDidHide(callback: () => void): Promise<PluginListenerHandle | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.addListener('keyboardDidHide', callback); }
  }


  /** Set whether the accessory bar should be visible on the keyboard. We recommend disabling the accessory bar for short forms (login, signup, etc.) to provide a cleaner UI */
  async setAccessoryBarVisible(options: { isVisible: boolean }): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.setAccessoryBarVisible(options); }
  }

  /** Programmatically set the keyboard style. */
  async setStyle(options: KeyboardStyleOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.setStyle(options); }
  }

  /** Programmatically set the resize mode. */
  async setResizeMode(options: KeyboardResizeOptions): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.setResizeMode(options); }
  }

  /** Programmatically enable or disable the WebView scroll. */
  async setScroll(options: { isDisabled: boolean }): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.setScroll(options); }
  }

  /** Show the keyboard. */
  async show(): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.show(); }
  }

  /** Hide the keyboard. */
  async hide(): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) { return Promise.resolve(undefined); } else { return Keyboard.hide(); }
  }

}
