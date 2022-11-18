import { Injectable } from '@angular/core';
import { Badge, IsSupportedResult, GetBadgeResult, PermissionStatus } from '@capawesome/capacitor-badge';
import { CapacitorElectronMetacodi } from '@metacodi/capacitor-electron';

import { NativeConfig } from './native-config';

import { DevicePlugin } from './device';


/**
 * Wrapper para el plugin `Badge`.
 *
 * {@link https://github.com/capawesome-team/capacitor-badge}
 */

@Injectable({
  providedIn: 'root'
})
export class BadgePlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  /**
   * export interface IsSupportedResult {
   *   isSupported: boolean;
   * }
   * @returns isSupported: boolean;
   */
  async isSupported(): Promise<IsSupportedResult> {
    return Badge.isSupported();
  }

  /**
   * export interface GetBadgeResult {
   *   count: number;
   * }
   * @returns count: number;
   */
  async get(): Promise<GetBadgeResult> {
    return Badge.get();
  }

  /** Aumenta en 1 el valor del Badge */
  async increase(): Promise<void> {
    return Badge.increase();
    
  }
  
  /** Devementa en 1 el valor del Badge */
  async decrease(): Promise<void> {
    return Badge.decrease();
  }

  /** Estableix a 0 el valor del Badge */
  async clear(): Promise<void> {
    return Badge.clear();
  }

  /**
   * export interface PermissionStatus {
   *   display: PermissionState; <--- 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';
   * }
   * @returns display: PermissionState;
   */
  async checkPermissions(): Promise<PermissionStatus> {
    return Badge.checkPermissions();
  }

  /**
   * export interface PermissionStatus {
   *   display: PermissionState; <--- 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';
   * }
   * @returns display: PermissionState;
   */
  async requestPermissions(): Promise<PermissionStatus> {
    return Badge.requestPermissions();
  }
  
  /** Set Badge. */
  async setBagde(badgeNumber: number): Promise<void> {
    return this.device.ready().then(async () => {
      if (this.device.isRealPhone) {
        if (badgeNumber > 0){
          Badge.set({count: badgeNumber});
        } else {
          Badge.clear();
        }
        return;
      } else if (this.device.isElectron) {
        badgeNumber = badgeNumber === undefined || badgeNumber < 1 ? 0 : badgeNumber;
        CapacitorElectronMetacodi.setBadge({ value: badgeNumber});
      } else  {
        const isSupported = await this.isSupported();
        if (isSupported.isSupported) { Badge.set({count: badgeNumber}); }
        return;
      }
    });
  }

}
