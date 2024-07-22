import { Injectable } from '@angular/core';

import { DevicePlugin } from './device';

import { TextZoom, SetOptions } from '@capacitor/text-zoom';
import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `TextZoom`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitorjs.com/docs/apis/text-zoom}
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TextZoomPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('TextZoomPlugin');

  constructor(
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }


  /** Show the splash screen. */
  async set(value: number): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return TextZoom.set({ value });
    } else {
      return Promise.resolve();
    }
  }

}
