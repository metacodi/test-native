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
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(public device: DevicePlugin) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }

  }

  /** Enable keep screen on. */
  async enable(): Promise<void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return of(undefined).toPromise(); } else { return KeepAwake.keepAwake(); }
    });
  }

  /** Disable keep screen on. */
  async disable(): Promise<void> {
    return this.device.getInfo().then(value => {
      if (!this.device.isRealPhone) { return of(undefined).toPromise(); } else { return KeepAwake.allowSleep(); }
    });
  }
  
  /** Whether keep awake is supported or not. */
  async isSupported(): Promise<IsSupportedResult> {
    return this.device.getInfo().then(() => {
      if (this.device.isRealPhone) {
        return KeepAwake.isSupported();
      } else {
        return Promise.resolve({ isSupported: false });
      }
    });
  }

}
