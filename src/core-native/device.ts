import { Injectable } from '@angular/core';
import { Platforms } from '@ionic/core';
import { Platform } from '@ionic/angular';

import { BatteryInfo, Device, DeviceId, DeviceInfo, GetLanguageCodeResult, LanguageTag, OperatingSystem } from '@capacitor/device';

import { NativeConfig } from './native-config';


interface DevicePluginInfo extends DeviceInfo {
  uuid: string;
  isoCode: string;
  langCode: string;
}


/**
 * Wrapper para combinar plugins `Device` y `Platform` de `Cordova` o `Capacitor`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitor.ionicframework.com/docs/apis/device}
 *
 */
@Injectable({
  providedIn: 'root'
})
export class DevicePlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('DevicePlugin');

  isReady = false;

  get info(): DevicePluginInfo { return this.deviceInfo; }
  set info(value: DevicePluginInfo) {
    this.deviceInfo = value;
    this.setInstant();
  }
  private deviceInfo: DevicePluginInfo;

  constructor(
    public plt: Platform,
    // public electronService: ElectronService,
  ) {
    console.log(this.constructor.name, this.debug);
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
    this.ready();
  }


  // ---------------------------------------------------------------------------------------------------
  //  instant
  // ---------------------------------------------------------------------------------------------------

  instant: {
    platform: string;
    operatingSystem: OperatingSystem;
    isVirtual: boolean;
    isRealPhone: boolean;
    isIos: boolean;
    isAndroid: boolean;
    isElectron: boolean;
    isWindows: boolean;
    isMac: boolean;
  } = {} as any;

  async setInstant() {
    const platform = await this.platform;
    const operatingSystem = await this.operatingSystem;
    const isVirtual = await this.isVirtual;
    const isRealPhone = await this.isRealPhone;
    const isIos = await this.isIos;
    const isAndroid = await this.isAndroid;
    const isElectron = this.isElectron;
    const isWindows = await this.isWindows;
    const isMac = await this.isMac;
    Object.assign(this.instant, {
      platform,
      operatingSystem,
      isVirtual,
      isRealPhone,
      isIos,
      isAndroid,
      isElectron,
      isWindows,
      isMac,
    });
  }

  // ---------------------------------------------------------------------------------------------------
  //  Plugin wrapper
  // ---------------------------------------------------------------------------------------------------

  /** Devuelve información sobre el dispositivo/sistema operativo/plataforma subyacente.
   * DevicePage getInfo:
   *
   * IOS
   * {
   *  "platform":"ios",
   *  "model":"iPhone",
   *  "name":"iPhone X",
   *  "memUsed":72318976,
   *  "isVirtual":false,
   *  "manufacturer":"Apple",
   *  "realDiskFree":46098519144,
   *  "realDiskTotal":63883563008,
   *  "diskFree":39898214400,
   *  "diskTotal":63883563008,
   *  "webViewVersion":"15.4.1",
   *  "operatingSystem":"ios",
   *  "osVersion":"15.4.1"
   * },
   *
   * ANDROID
   * {
   *  "platform":"android",
   *  "model":"SM-G970F",
   *  "name":"Galaxy S10e",
   *  "memUsed":7443664,
   *  "isVirtual":false,
   *  "manufacturer":"samsung",
   *  "realDiskFree":110057353216,
   *  "realDiskTotal":118053482496,
   *  "diskFree":148787200,
   *  "diskTotal":5790150656,
   *  "webViewVersion":"100.0.4896.127"
   *  "operatingSystem":"android",
   *  "osVersion":"12",
   * }
   *
   * ELECTRON MAC
   * {
   *  "model":"Macintosh",
   *  "platform":"web",
   *  "operatingSystem":"mac",
   *  "osVersion":"10.15.7",
   *  "manufacturer":"Google Inc.",
   *  "isVirtual":false,
   *  "webViewVersion":"93.0.4577.82"
   * }
   *
   * ELECTRON WINDOWS
   * {
   *  "model":"Windows NT 10.0",
   *  "platform":"web",
   *  "operatingSystem":"windows",
   *  "osVersion":"Windows NT 10.0; Win64; x64",
   *  "manufacturer":"Google Inc.",
   *  "isVirtual":false,
   *  "webViewVersion":"93.0.4577.82"
   * }
   */

  /** Referència a la promesa retornada per obtenir els valors del dispositiu. */
  devicePromise: Promise<any> | undefined;

  ready(): Promise<DevicePluginInfo> {
    if (this.isReady && !!this.info) {
      if (this.debug) { console.log(this.constructor.name + '.ready()', this.info); }
      return Promise.resolve(this.info);
    } else {
      if (!!this.devicePromise) {
        if (this.debug) { console.log(this.constructor.name + '.ready() -> EXISTING promise', this.info); }
        return this.devicePromise;
      }
      if (this.debug) { console.log(this.constructor.name + '.ready() -> NEW promise', this.info); }
      this.devicePromise = new Promise<DevicePluginInfo>(async (resolve: any, reject: any) => {
        this.plt.ready().then(async () => {
          const uuid = await Device.getId();
          const isoCode = await this.getIsoCode();
          const langCode = await this.getLangCode();
          if (this.debug) { console.log(this.constructor.name + '.ready() -> plt.ready().then() => uuid', uuid); }
          Device.getInfo().then(info => {
            this.devicePromise = undefined;
            this.isReady = true;
            this.info = { ...info, ...{ uuid: uuid.identifier, isoCode, langCode } };
            if (this.debug) { console.log(this.constructor.name + '.ready() -> ready.then()', this.info); }
            resolve(info);
          }).catch(error => { this.devicePromise = undefined; reject(error); });
        }).catch(error => { this.devicePromise = undefined; reject(error); });
      });
      return this.devicePromise;
    }
  }

  /** Devolver información sobre la batería.
   * DevicePage getBatteryInfo: IOS {"batteryLevel":1,"isCharging":true}
   * DevicePage getBatteryInfo: ANDROID {"batteryLevel":1,"isCharging":true}
   * DevicePage getBatteryInfo: ELECTRON {"batteryLevel":1,"isCharging":true}
   */
  getBatteryInfo(): Promise<BatteryInfo> {
    return Device.getBatteryInfo();
  }

  /** Obtenga el código de configuración regional del idioma actual del dispositivo.
   * DevicePage getLanguageCode: IOS {"value":"ca"}
   * DevicePage getLanguageCode: ANDROID {"value":"es"}
   * DevicePage getLanguageCode: ELECTRON {"value":"es"}
   */
  async getIsoCode(): Promise<string> {
    const language = await Device.getLanguageCode();
    if (this.info) { this.info.isoCode = language.value; }
    return language.value;
  }

  /**
   *
   * Obtenga la etiqueta de configuración regional del idioma actual del dispositivo.
   *
   * @returns value: "en-US"
   */
  async getLangCode(): Promise<string> {
    const language = await Device.getLanguageTag();
    if (this.info) { this.info.langCode = language.value; }
    return language.value;
  }


  doesMyVersionMeetMinimum(myVersion: any, minimumVersion: any) {

    if (typeof myVersion === 'number' && typeof minimumVersion === 'number') {
      return (myVersion >= minimumVersion);
    }

    let v1 = myVersion.split(".")
    let v2 = minimumVersion.split(".")
    let minLength;

    minLength = Math.min(v1.length, v2.length);

    for (let i = 0; i < minLength; i++) {
      if (Number(v1[i]) < Number(v2[i])) {
        return false;
      }
      else if (Number(v1[i]) < Number(v2[i])) {
        return true;
      }

    }

    return (v1.length >= v2.length);
  }

  // ---------------------------------------------------------------------------------------------------
  //  Additional functionality
  // ---------------------------------------------------------------------------------------------------

  /** Comprueba la plataforma del dispositivo. */
  async is(platform: Platforms): Promise<boolean> { return this.ready().then(info => info.platform === platform); }

  /** Comprueba si el dispositivo es de la plataforma indicada y además no es virtual. */
  async isReal(platform: Platforms): Promise<boolean> { return this.ready().then(info => !info.isVirtual && info.platform === platform); }

  /** Obtiene la plataforma del dispositivo. */
  // get platform(): Promise<DevicePluginInfo['platform']> { return this.electronService.isElectronApp ? Promise.resolve('electron') : this.ready().then(info => info.platform); }
  get platform(): Promise<string> { return this.ready().then(info => info.platform); }
  /** Devuelve el sistema operativo del dispositivo. */
  get operatingSystem(): Promise<OperatingSystem> { return this.ready().then(info => info.operatingSystem); }
  /** Indica si el dispositivo está virtualizado. */
  get isVirtual(): Promise<boolean> { return this.ready().then(info => info.isVirtual); }
  /** Indica si el dispositivo es un teléfono `ios` o `android` no virtualizado. */
  get isRealPhone(): Promise<boolean> { return this.ready().then(info => !info.isVirtual && (info.platform === 'ios' || info.platform === 'android')); }
  /** Indica si la plataforma del dispositiu és 'iOS'. */
  get isIos(): Promise<boolean> { return this.ready().then(info => info.platform === 'ios'); }
  /** Indica si la plataforma del dispositiu és 'iOS'. */
  get osVersion(): Promise<string> { return this.ready().then(info => info.osVersion); }
  /** Indica si la plataforma del dispositiu és 'iOS'. */
  get isAndroid(): Promise<boolean> { return this.ready().then(info => info.platform === 'android'); }
  /** Indica si la plataforma del dispositiu és 'electron'. */
  // get isElectron(): Promise<boolean> { return this.ready().then(info => info.platform === 'electron' || info.operatingSystem === 'windows' || info.operatingSystem === 'mac' || info.operatingSystem === 'linux'); }
  get isElectron(): boolean { return !!window.navigator.userAgent.match(/Electron/); }
  /** Indica si la plataforma del dispositiu és 'windows'. */
  get isWindows(): Promise<boolean> { return this.ready().then(info => info.operatingSystem === 'windows'); }
  /** Indica si la plataforma del dispositiu és 'mac'. */
  get isMac(): Promise<boolean> { return this.ready().then(info => info.operatingSystem === 'mac'); }
}
