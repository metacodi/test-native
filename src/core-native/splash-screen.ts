import { Injectable } from '@angular/core';

import { DevicePlugin } from './device';

import { SplashScreen, ShowOptions } from '@capacitor/splash-screen';
import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `SplashScreen`.
 *
 * **Cordova**
 *
 * ```typescript
 * import { SplashScreen } from '@ionic-native/splash-screen/ngx';
 * ```
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitor.ionicframework.com/docs/apis/splash-screen}
 *
 *
 * SplashScreen.show();
 * SplashScreen.hide();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SplashScreenPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }


  /** Show the splash screen. */
  async show(options: ShowOptions): Promise<void> {
    return this.device.ready().then(() => {
      if (this.device.isRealPhone) {
        return SplashScreen.show();
      } else {
        return;
      }
    });
  }

  /** Hide the splash screen. */
  async hide(): Promise<void> {
    return this.device.ready().then(() => {
      if (this.device.isRealPhone) {
        return SplashScreen.hide();
      } else {
        return;
      }
    });
  }

}
