import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { of } from 'rxjs';
import { KeepAwake, IsSupportedResult } from '@capacitor-community/keep-awake';

import { NativeConfig } from './native-config';

import { DevicePlugin } from './device';


const { CapacitorKeepScreenOn } = Plugins;

/**
 * Wrapper para el plugin `CapacitorKeepScreenOn`.
 *
 * **Capacitor Community**
 *
 * - Api: {@link https://github.com/go-u/capacitor-keep-screen-on/tree/master/docs/en}
 *
 * ```typescript
 * import { Plugins } from '@capacitor/core';
 * const { CapacitorKeepScreenOn } = Plugins;
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CapacitorKeepScreenOnPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('CapacitorKeepScreenOnPlugin');

  constructor(public device: DevicePlugin) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }

  }

  /** Enable keep screen on. */
  async enable(): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return KeepAwake.keepAwake();
    } else {
      return Promise.resolve();
    }
  }

  /** Disable keep screen on. */
  async disable(): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      KeepAwake.allowSleep();
    } else {
      Promise.resolve();
    }
  }

  /** Whether keep awake is supported or not. */
  async isSupported(): Promise<IsSupportedResult> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return KeepAwake.isSupported();
    } else {
      return Promise.resolve({ isSupported: false });
    }
  }

}
