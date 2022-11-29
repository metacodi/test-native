import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { DevicePlugin } from './device';
import { NativeConfig } from './native-config';

declare var NavigationBar: any;

/**
 * Wrapper para el plugin `NavigationBarColor`.
 *
 * **Cordova**
 *
 * npm i cordova-plugin-navigationbar-color --save
 * ionic cap sync
 *
 * ```typescript
 * declare var NavigationBar: any;
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationBarColorPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public plt: Platform,
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }


  }

  setColor(color: any) {
    this.plt.ready().then(() => {
      this.device.getInfo().then(value => {
        if (this.device.isRealPhone && this.device.isAndroid) {
          // Example NavigationBar.backgroundColorByHexString('#1f1f1f');
          // NavigationBar.backgroundColorByHexString(color);

          NavigationBar.backgroundColorByName(color ===  'dark' ? 'black' : 'white', color ===  'dark' ? false : true);
        }
      });
    });
  }


}
