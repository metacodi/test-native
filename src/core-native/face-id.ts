import { Injectable, OnDestroy } from '@angular/core';

import { Subject, of } from 'rxjs';

import { NativeConfig } from './native-config';

import { DevicePlugin } from './device';

import { AvailableResult, BiometryType, Credentials, NativeBiometric } from "capacitor-native-biometric";


export type FaceIdResponse = 'TouchId' | 'FaceId' | 'None';

/**
 * Wrapper para el plugin `FaceId`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://github.com/epicshaggy/capacitor-native-biometric}
 *
 */
@Injectable({
  providedIn: 'root'
})
export class FaceIdPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  /** Checks if Face ID or Touch ID is available, and returns type if so.
   * BiometryType {
   *   NONE = 0,
   *   TOUCH_ID = 1,
   *   FACE_ID = 2,
   *   FINGERPRINT = 3,
   *   FACE_AUTHENTICATION = 4,
   *   IRIS_AUTHENTICATION = 5
   * }
   */
  async isAvailable(): Promise<AvailableResult> {
    return this.device.getInfo().then(() => {
      if (this.device.isRealPhone) {
        return NativeBiometric.isAvailable();
      } else {
        return Promise.resolve({ isAvailable: false, biometryType: 0, });
      }
    });
  }

  /** setCredential. 
   * { username: "username", password: "password", server: "www.example.com"}
  */
  async setCredentials(options: { username: string, password: string, server: string }): Promise<FaceIdResponse | undefined> {
    return this.device.getInfo().then(() => {
      if (this.device.isRealPhone) {
        return NativeBiometric.setCredentials({ username: options.username, password: options.password, server: options.server, });
      } else {
        return Promise.resolve({ isAvailable: false, biometryType: 0, });
      }
    });
  }

  /** getCredentials. 
   * { server: "www.example.com"}
  */
  async getCredentials(options: { server: string }): Promise<Credentials | undefined> {
    return this.device.getInfo().then(() => {
      if (this.device.isRealPhone) {
        return NativeBiometric.getCredentials({ server: options.server })
      } else {
        return Promise.resolve(undefined);
      }
    });
  }

  /** deleteCredentials. 
   * { server: "www.example.com"}
  */
  async deleteCredentials(options: { server: string }): Promise<FaceIdResponse | undefined> {
    return this.device.getInfo().then(() => {
      if (this.device.isRealPhone) {
        return NativeBiometric.deleteCredentials({ server: options.server });
      } else {
        return Promise.resolve(undefined);
      }
    });
  }

  /** Displays the Face ID or Touch ID screen. */
  async auth(options?: { reason?: string }): Promise<any> {
    return this.device.getInfo().then(value => {
      if (this.device.isRealPhone) {
        return NativeBiometric.verifyIdentity(options).then(() => true).catch(() => false);
      } else {
        return Promise.resolve(undefined);
      }
    });
  }

}
