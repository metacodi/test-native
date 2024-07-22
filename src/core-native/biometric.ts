import { Injectable, OnDestroy } from '@angular/core';

import { Subject, of } from 'rxjs';

import { NativeConfig } from './native-config';

import { DevicePlugin } from './device';

import { AvailableResult, BiometryType, Credentials, NativeBiometric } from 'capacitor-native-biometric';

export interface CredentialsBiometricPlugin extends Credentials {
  idLang: number;
}
/**
 * Wrapper para el plugin `FaceId`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://github.com/epicshaggy/capacitor-native-biometric}
 *
 * * Install *
 *
 * npm i capacitor-native-biometric
 *
 * Info.plist
 * <key>NSFaceIDUsageDescription</key>
 * <string>For an easier and faster log in.</string>
 *
 * AndroidManifest.xml
 * <uses-permission android:name="android.permission.USE_BIOMETRIC">
 */
@Injectable({
  providedIn: 'root'
})
export class BiometricPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('BiometricPlugin');

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
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return NativeBiometric.isAvailable();
    } else {
      return Promise.resolve({ isAvailable: false, biometryType: BiometryType.NONE } as AvailableResult);
    }
  }

  /** setCredential.
   * { username: "username", password: "password", server: "www.example.com"}
   */
  async setCredentials(options: { username: string; password: string; server: string; idLang: number }): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      const { username, password, server, idLang } = options;
      const passwordJSON = JSON.stringify({ password, idLang });
      return NativeBiometric.setCredentials({ username, password: passwordJSON, server, });
    } else {
      return Promise.resolve();
    }
  }

  /** getCredentials.
   * { server: "www.example.com"}
   */
  async getCredentials(options: { server: string }): Promise<CredentialsBiometricPlugin | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      const credentilals = await NativeBiometric.getCredentials({ server: options.server });
      if (credentilals) {
        const { username } = credentilals;
        const { password, idLang } = JSON.parse(credentilals.password);
        return { username, password, idLang };
      } else {
        return Promise.resolve(undefined);
      }
    } else {
      return Promise.resolve(undefined);
    }
  }

  /** deleteCredentials.
   * { server: "www.example.com"}
   */
  async deleteCredentials(options: { server: string }): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return NativeBiometric.deleteCredentials({ server: options.server });
    } else {
      return Promise.resolve(undefined);
    }
  }

  /** Displays the Face ID or Touch ID screen. */
  async auth(options?: { reason?: string }): Promise<any> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      return NativeBiometric.verifyIdentity(options).then(() => true).catch(() => false);
    } else {
      return Promise.resolve(undefined);
    }
  }

}
