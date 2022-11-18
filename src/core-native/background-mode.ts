import { Injectable, OnDestroy } from '@angular/core';

import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

import { DevicePlugin } from './device';
import { NativeConfig } from './native-config';


/**
 * Wrapper para el plugin `BackgroundMode`.
 *
 *
 * **Cordova**
 *
 * - Docs: {@link https://ionicframework.com/docs/native/background-mode}
 * - Repo: {@link https://github.com/katzer/cordova-plugin-background-mode}
 *
 * * Install *
 * npm install cordova-plugin-background-mode 
 * npm install @awesome-cordova-plugins/background-mode 
 * 
 * Need dependencies
 * npm i cordova-plugin-device
 * ionic cap sync
 * 
 * Info.plist
 * <key>UIBackgroundModes</key>
	 <array>
		<string>fetch</string>
		<string>location</string>
	 </array>
 */

@Injectable({
  providedIn: 'root'
})
export class BackgroundModePlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public device: DevicePlugin,
    public backgroundMode: BackgroundMode,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  enable() {
    if (!this.isEnabled) {
      this.backgroundMode.enable();
    }
  }

  disable() {
    if (this.isEnabled) {
      this.backgroundMode.disable();
    }
  }

  disableBatteryOptimizations() {
    this.backgroundMode.disableBatteryOptimizations();
  }

  moveToForeground() {
    this.backgroundMode.moveToForeground();
  }

  wakeUp() {
    this.backgroundMode.wakeUp();
  }

  moveToBackground() {
    this.backgroundMode.moveToBackground();
  }

  get isEnabled(): boolean { return this.backgroundMode.isEnabled(); }

  get isActive(): boolean { return this.backgroundMode.isActive(); }

}
