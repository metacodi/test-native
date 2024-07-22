import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppLauncher, CanOpenURLOptions, CanOpenURLResult, OpenURLOptions, OpenURLResult } from '@capacitor/app-launcher';

import { NativeConfig } from './native-config';

import { DevicePlugin } from './device';


/**
 *
 * Wrapper para el plugin `AppLauncher`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitorjs.com/docs/apis/app-launcher}
 *
 */
@Injectable({
  providedIn: 'root'
})
export class AppLauncherPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('AppPlugin');

  constructor(
    public device: DevicePlugin,
    public router: Router,
    public platform: Platform,
    // public routerOutlet: IonRouterOutlet,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }

  }


  /**
   *
   * Open an app with the given URL. On iOS the URL should be a known URLScheme. On Android the URL can be a known URLScheme or an app package name.
   *
   * Returns: OpenURLResult
   */
  async openUrl(options: OpenURLOptions): Promise<OpenURLResult | void> {
    return AppLauncher.openUrl(options);
    // const isRealPhone = await this.device.isRealPhone;
    // if (isRealPhone) {
    // } else {
    //   return Promise.resolve();
    // }
  }

  /**
   *
   * Check if an app can be opened with the given URL.
   *
   * Returns: CanOpenURLResult
   */
  async canOpenUrl(options: CanOpenURLOptions): Promise<CanOpenURLResult | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return AppLauncher.canOpenUrl(options);
    } else {
      return Promise.resolve(undefined);
    }
  }

}
