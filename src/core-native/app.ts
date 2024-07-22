import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App, AppInfo, AppLaunchUrl, AppState, BackButtonListenerEvent } from '@capacitor/app';
import { Subject } from 'rxjs';

import { CapacitorElectronMetacodi } from '@metacodi/capacitor-electron';

import { NativeConfig } from './native-config';

import { DevicePlugin } from './device';


/**
 * Wrapper para el plugin `App`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitorjs.com/docs/apis/app}
 * - Examples : {@link https://medium.com/javascript-in-plain-english/opening-another-app-from-your-ionic-5-app-becf8c098d0e}
 */
@Injectable({
  providedIn: 'root'
})
export class AppPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('AppPlugin');

  stateChangedSubject = new Subject<AppState>();

  constructor(
    public device: DevicePlugin,
    public router: Router,
    public platform: Platform,
    // public routerOutlet: IonRouterOutlet,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }

    this.listenAppStateChange();
    this.listenBackButton();
  }

  async listenAppStateChange() {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone) {
      // Ens suscribim als canvis d'estat per notificar-los a través del BehaviorSubject creat.
      App.addListener('appStateChange', state => this.stateChangedSubject.next(state));
    }
  }

  async listenBackButton() {
    /** A la documentació diu que el eventName és 'ionBackButton'.
     * > "When running in a Capacitor or Cordova application, Ionic Framework
     * >  will emit an ionBackButton event when a user presses the hardware back button."
     * {@link https://ionicframework.com/docs/developing/hardware-back-button#hardware-back-button-in-capacitor-and-cordova }
     */
    const isRealPhone = await this.device.isRealPhone;
    // if (this.device.isAndroid) {
      App.addListener('backButton', (data: BackButtonListenerEvent) => {
        if (this.debug) { console.log('backButton state:', JSON.stringify(data), this.router.url); }
        const onRoot = !data.canGoBack || this.router.url === '/home' || this.router.url === '/login';
        if (onRoot) { this.exitApp(); }
      });
      // this.platform.ready().then(() => {
      //   this.platform.backButton.subscribeWithPriority(-1, () => {
      //     // const onRoot = !this.routerOutlet.canGoBack() || this.router.url === '/home' || this.router.url === '/login';
      //     const onRoot = !this.routerOutlet.canGoBack();
      //     if (this.debug) { console.log(this.constructor.name + '.ensureExitAppOnAndroid()', onRoot); }
      //     if (onRoot) { App.exitApp(); }
      //   });
      // });
    // }
  }


  /** Force exit the app. This should only be used in conjunction with the backButton handler for Android to exit the app when navigation is complete.
   *
   * Ionic handles this itself so you shouldn’t need to call this if using Ionic
   *
   * Returns: never
   */
  async exitApp(): Promise<void> {
    const isRealPhone = await this.device.isRealPhone;
    const isElectron = this.device.isElectron;
    if (isRealPhone) {
      return App.exitApp();
    } else if (isElectron) {
      return CapacitorElectronMetacodi.exitApp();
    } else {
      return Promise.resolve();
    }
  }

  /** Return information about the app.
   * ```typescript
   * interface AppInfo { name: string; id: string; build: string; version: string; }
   * ```
   *
   * Example:
   * ```typescript
   * const info = { name: 'novaApp', build: '1', version: '1.0', id: 'test.metacodi.com' };
   * ```
   */
   async getInfo(): Promise<AppInfo | undefined> {
    const isRealPhone = await this.device.isRealPhone;
    const isElectron = this.device.isElectron;
    if (isRealPhone || isElectron) {
      return App.getInfo();
    } else {
      return Promise.resolve(undefined);
    }
  }
  // async getInfo(): Promise<AppInfo> {
  //   return App.getInfo();
  // }

  /** Gets the current app state.
   * ```typescript
   * interface AppState { isActive: boolean }
   * ```
   *
   * Example:
   * ```typescript
   * const state = { isActive: true }
   * ```
   */
  async getState(): Promise<AppState> {
    const isRealPhone = await this.device.isRealPhone;
    const isElectron = this.device.isElectron;
    if (isRealPhone || isElectron) {
      return App.getState();
    } else {
      return Promise.resolve({ isActive: true });
    }
  }

  /** Get the URL the app was launched with, if any.
   * ```typescript
   * interface AppLaunchUrl { url: string }
   * ```
   */
  async getLaunchUrl(): Promise<AppLaunchUrl | undefined> {
    return App.getLaunchUrl();
  }

  /** Minimizes the application. */
  async minimizeApp(): Promise<void> {
    return App.minimizeApp();
  }

  /** Resolve if app is Active */
  get isActive(): Promise<boolean> {
    return new Promise<boolean>(async (resolve: any) => {
      const isRealPhone = await this.device.isRealPhone;
      if (isRealPhone) {
        const appState = await App.getState();
        resolve(appState.isActive);
      } else {
        resolve(false);
      }
    });
  }

}
