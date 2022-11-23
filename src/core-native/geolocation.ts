import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { CallbackID, Geolocation, GeolocationPluginPermissions, Position, PositionOptions, WatchPositionCallback } from '@capacitor/geolocation';

import { registerPlugin } from '@capacitor/core';

import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";

import { DevicePlugin } from './device';
import { AppPlugin } from './app';
import { BackgroundModePlugin } from './background-mode';
import { AppState } from '@capacitor/app';
import { NativeConfig } from './native-config';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@awesome-cordova-plugins/background-geolocation/ngx';


/**
 * Wrapper para el plugin `Geolocation`.
 *
 * **Capacitor**
 * 
 * - Api: {@link https://capacitor.ionicframework.com/docs/apis/geolocation}
 * - Api: {@link https://github.com/capacitor-community/background-geolocation}
 * 
 * ** Install **
 * npm i @capacitor/geolocation
 * npm i @capacitor-community/background-geolocation
 *
 *
 * ```typescript
 * import { Plugins } from '@capacitor/core';
 * const { Geolocation } = Plugins;
 * ```
 */

/**
 * NOTA: 
 * 
 * Recorda informar dels info.list per IOS i AndroidManifes.xml per android,
 * 
 * Si vols activar el brackgound Mode Geolocation, tens que anar a les configuració del dispositiu als permisos de la geolocalitzacio de l'app i activar 'Geo Sempre'
 */
@Injectable({
  providedIn: 'root'
})
export class GeolocationPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  /** Referència a la promesa retornada per obtenir la posició. */
  positionPromise: Promise<Position> | undefined;
  /** Identificador del procés de watching pel backgraound geolocation. */
  backgroundWatcherId: any;
  /** Indicador d'estat per iniciar o aturar el watcher quan l'app passa a segon pla. */
  continuousGeolocationRequired = false;
  /** Subscriptor intern per obtenir la posició en background mode. */
  backgroundGeolocationSubject = new Subject<Position>();

  user: any;
  connection: any;

  constructor(
    public device: DevicePlugin,
    // public app: AppPlugin,
    // public backgroundMode: BackgroundModePlugin,
  ) {
     if (this.debug) {console.log(this.constructor.name + '.constructor()'); }
    // this.app.stateChangedSubject.subscribe(state => this.onAppStateChanged(state));
  }


  /** Comprobar permisos de ubicación
   * {"location":"granted","coarseLocation":"granted"} || {"errorMessage":"Location services are not enabled"}
   */
  checkPermissions(): Promise<PermissionStatus> {
    return new Promise<PermissionStatus>(async (resolve: any, reject: any) => {
      this.device.ready().then(async () => {
        Geolocation.checkPermissions().then(response => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    });
  }

  /** Solicitar permisos de ubicación.
   * {"location":"granted","coarseLocation":"granted"} || {"errorMessage":"Location services are not enabled"}
   */
  requestPermissions(permissions?: GeolocationPluginPermissions | undefined): Promise<PermissionStatus> {
    return new Promise<PermissionStatus>(async (resolve: any, reject: any) => {
      Geolocation.requestPermissions().then(response => {
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /** Obtener la ubicación GPS actual del dispositivo. */
  async getCurrentPosition(options?: PositionOptions): Promise<Position> {
    if (this.positionPromise) { return this.positionPromise; }
    this.positionPromise = new Promise<Position>(async (resolve: any, reject: any) => {
      this.device.ready().then(async () => {
        // Comprovem si hem d'obtenir la posició de background mode o normal.
        // if (this.backgroundMode.isActive === true && this.backgroundMode.isEnabled === true) {
        //   // const sub = this.backgroundGeolocationSubject.subscribe(position => {
        //   const sub = this.backgroundGeolocationSubject.subscribe({
        //     next: position => {
        //        if (this.debug) { console.log('getCurrentPosition background position:', JSON.stringify(position)); }
        //       sub.unsubscribe();
        //       this.positionPromise = undefined;
        //       resolve(position);
        //     },
        //     error: error => {
        //       sub.unsubscribe();
        //       this.positionPromise = undefined;
        //       resolve(error);
        //     },
        //   });

        // } else {
        //   //  if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition() isRealPhone', this.device.isRealPhone); }
        //   //  if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition() options', JSON.stringify(options)); }
        //   if (!options) { options = {}; }
        //   options.enableHighAccuracy = true;
        //   /** Capacitor 4 {@link https://capacitorjs.com/docs/updating/4-0#geolocation Timeout is now ignored for getCurrentPosition} */
        //   // const period = 5 * 1000;
        //   // const timeout = setTimeout(() => reject('timeout'), period);
        //   Geolocation.getCurrentPosition(options).then(position => {
        //     // clearTimeout(timeout);
        //      if (this.debug) { console.log('getCurrentPosition position:', JSON.stringify(position)); }
        //     this.positionPromise = undefined;
        //     resolve(position);
        //   }).catch((error) => {
        //     // clearTimeout(timeout);
        //     this.positionPromise = undefined;
        //     reject(error);
        //   });
        // }
      });
    });
    return this.positionPromise;
  }

  /** Get the current GPS location of the device. */
  watchPosition(options: PositionOptions, callback: WatchPositionCallback): Promise<CallbackID> {
    return Geolocation.watchPosition(options, callback);
  }

  /** Clear a given watch. */
  clearWatch(options: { id: string }): Promise<void> {
    return Geolocation.clearWatch(options);
  }

  geolocationPos(): Promise<Position> {
    return Geolocation.getCurrentPosition();
  }

  openSettings(): Promise<void> {
    return BackgroundGeolocation.openSettings();
  }

  // ---------------------------------------------------------------------------------------------------
  //  BackgroundGeolocation
  // ---------------------------------------------------------------------------------------------------

  // async setContinuousGeolocationRequired(value: boolean) {
  //   const old = this.continuousGeolocationRequired;
  //   this.continuousGeolocationRequired = value;
  //   if (old !== value) {
  //     const state = await this.app.getState();
  //     if (state) {
  //       this.backgroundMode.enable();
  //       this.onAppStateChanged(state);
  //     }
  //   }
  // }

  // private onAppStateChanged(state: AppState) {
  //   if (this.debug) { console.log(this.constructor.name + '.onAppStateChanged(state) => ', JSON.stringify(state)); }
  //   if (this.debug) { console.log(this.constructor.name + '.onAppStateChanged(continuousGeolocationRequired) => ', JSON.stringify(this.continuousGeolocationRequired)); }
  //   if (!!state.isActive || !this.continuousGeolocationRequired) {
  //     this.backgroundMode.disable();
  //     this.stopBackgroundGeolocation();
  //   } else if (this.continuousGeolocationRequired) {
  //     if (!this.backgroundWatcherId) {
  //       this.backgroundMode.enable();
  //       // NOTA: Donem temps al TrackingService perquè estableixi l'usuari.
  //       setTimeout(() => this.startBackgroundGeolocation(), 100);
  //     }
  //   }
  // }
  
  startBackgroundGeolocation(): void {
    if (this.debug) {console.log('startBackgroundGeolocation result: start'); }
    this.stopBackgroundGeolocation();
    const extraData = { user: this.user, connection: this.connection };
    BackgroundGeolocation.addWatcher(
      {
        // If the "backgroundMessage" option is defined, the watcher will
        // provide location updates whether the app is in the background or the
        // foreground. If it is not defined, location updates are only
        // guaranteed in the foreground. This is true on both platforms.

        // On Android, a notification must be shown to continue receiving
        // location updates in the background. This option specifies the text of
        // that notification.
        backgroundMessage: 'Cancel to prevent battery drain.',

        // The title of the notification mentioned above. Defaults to "Using
        // your location".
        backgroundTitle: 'Test Native',
        // Whether permissions should be requested from the user automatically,
        // if they are not already granted. Defaults to "true".
        requestPermissions: true,

        // If "true", stale locations may be delivered while the device
        // obtains a GPS fix. You are responsible for checking the "time"
        // property. If "false", locations are guaranteed to be up to date.
        // Defaults to "false".
        stale: true,
        // The minimum number of metres between subsequent locations. Defaults
        // to 0.
        distanceFilter: 0,
        // NOTA: ens enviem l'usuari per enviarli per websocket per android.
        extraData,

      } as any, result => {
        if (this.debug) {console.log('BackgroundGeolocation result:', JSON.stringify(result)); }
        if (result) {
          const position: Position = {
            timestamp: (result.time as number),
            coords: {
              latitude: result.latitude,
              longitude: result.longitude,
              accuracy: result.accuracy,
              altitudeAccuracy: result.altitudeAccuracy,
              altitude: result.altitude,
              speed: result.speed,
              heading: null
            }
          };
          this.backgroundGeolocationSubject.next(position);
        }
      }
    ).then((backgroundWatcherId) => {
       if (this.debug) {console.log('BackgroundGeolocation backgroundWatcherId:', JSON.stringify(backgroundWatcherId)); }
      this.backgroundWatcherId = backgroundWatcherId;
    });
  }

  private stopBackgroundGeolocation() {
    if (!!this.backgroundWatcherId) {
      if (this.debug) {console.log('BackgroundGeolocation -> stopBackgroundGeolocation: removed'); }
      BackgroundGeolocation.removeWatcher({ id: this.backgroundWatcherId });
      this.backgroundWatcherId = undefined;
    }
  }

}
