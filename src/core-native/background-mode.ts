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

/**
 * NOTA: A partir de la versió 31 i derreres s'ha de fer una modificació a l'axiu:
 * /node_modules/cordova-plugin-background-mode/src/android/ForegroundService.java
 * 
 * Linia 225
 * PendingIntent.FLAG_UPDATE_CURRENT);
 * 
 * Canviar per 
 * PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
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

  async enable() {
    if (!this.device.isRealPhone || this.isEnabled) { return; }
    await this.backgroundMode.enable();
    setTimeout(() => { if (!this.isEnabled) { this.enable(); } }, 500);
  }
  
  async disable() {
    if (!this.device.isRealPhone || !this.isEnabled) { return; }
    await this.backgroundMode.disable();
    setTimeout(() => { if (this.isEnabled) { this.disable(); } }, 500);
  }

  disableBatteryOptimizations() {
    if (!this.device.isRealPhone) { return; }
    this.backgroundMode.disableBatteryOptimizations();
  }

  moveToForeground() {
    if (!this.device.isRealPhone) { return; }
    this.backgroundMode.moveToForeground();
  }

  wakeUp() {
    if (!this.device.isRealPhone) { return; }
    this.backgroundMode.wakeUp();
  }

  moveToBackground() {
    if (!this.device.isRealPhone) { return; }
    this.backgroundMode.moveToBackground();
  }

  get isEnabled(): boolean { return this.device.isRealPhone ? this.backgroundMode.isEnabled() : false; }

  get isActive(): boolean { return this.device.isRealPhone ? this.backgroundMode.isActive() : false; }

}
