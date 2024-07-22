import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timeout } from 'rxjs';

import { CallbackID, Geolocation, GeolocationPluginPermissions, Position, PositionOptions, WatchPositionCallback } from '@capacitor/geolocation';

import { registerPlugin } from '@capacitor/core';

import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';

import { DevicePlugin } from './device';
import { AppPlugin } from './app';
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
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('GeolocationPlugin');

  /** Referència a la promesa retornada per obtenir la posició. */
  positionPromise: Promise<Position> | undefined;
  /** Identificador del procés de watching pel backgraound geolocation. */
  backgroundWatcherId: any;
  /** Subscriptor intern per obtenir la posició en background mode. */
  backgroundGeolocationSubject = new Subject<Position | undefined>();

  user: any;
  connection: any;

  constructor(
    public device: DevicePlugin,
    public app: AppPlugin
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
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
  async getCurrentPosition(options?: PositionOptions, from?: string): Promise<Position> {
    if (this.debug) { console.log(this.constructor.name + 'CN !!this.positionPromise  ' + from + ' =>', !!this.positionPromise); }
    if (!!this.positionPromise) { return this.positionPromise; }
    this.positionPromise = new Promise<Position>(async (resolve: any, reject: any) => {
      if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) -> before ready()'); }
      this.device.ready().then(async () => {
        if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) -> after ready()'); }
        // Comprovem si hem d'obtenir la posició de background mode o normal.
        const isActive = await this.app.isActive;
        if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) -> app.isActive', isActive); }
        if (!isActive) {
          if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) -> backgroundGeolocationSubject.subscribe()'); }
          // const timeoutBackground = new Observable<any>(observer => observer.next(this.lastPosition));
          const timeoutBackground = new Observable<any>(observer => {
            if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) -> timeoutBackground!!!!!!!!!!!!!'); }
            observer.next(undefined);
          });
          const sub = this.backgroundGeolocationSubject.pipe(timeout({
            each: 30 * 1000,
            with: () => timeoutBackground,
            // with: () => throwError(() => new CustomTimeoutError())
          })).subscribe({
            next: position => {
              if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) background =>', JSON.stringify(position)); }
              sub.unsubscribe();
              this.positionPromise = undefined;
              resolve(position);
            },
            error: error => {
              if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) -> backgroundGeolocationSubject.subscribe() => error'); }
              sub.unsubscribe();
              this.positionPromise = undefined;
              resolve(error);
            },
          });

        } else {
          //  if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition() options', JSON.stringify(options)); }
          if (!options) { options = {}; }
          options.enableHighAccuracy = true;
          /** Capacitor 4 {@link https://capacitorjs.com/docs/updating/4-0#geolocation Timeout is now ignored for getCurrentPosition} */
          // const period = 5 * 1000;
          // const timeout = setTimeout(() => reject('timeout'), period);
          Geolocation.getCurrentPosition(options).then(position => {
            // clearTimeout(timeout);
            if (this.debug) { console.log(this.constructor.name + '.getCurrentPosition(position) =>', JSON.stringify(position)); }
            this.positionPromise = undefined;
            resolve(position);
          }).catch((error) => {
            // clearTimeout(timeout);
            this.positionPromise = undefined;
            reject(error);
          });
        }
      }).catch((error) => {
        this.positionPromise = undefined;
        reject(error);
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

  async startBackgroundGeolocation(): Promise<void> {
    if (this.debug) { console.log(this.constructor.name + '.startBackgroundGeolocation()'); }
    // await this.backgroundMode.enable();
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
        backgroundTitle: 'Traking You.',
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
        distanceFilter: 10,
        // NOTA: ens enviem l'usuari per enviarli per websocket per android.
        extraData,

      } as any, result => {
        if (this.debug) { console.log(this.constructor.name + ' -> BackgroundGeolocation.addWatcher(result)', JSON.stringify(result)); }
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
      if (this.debug) { console.log(this.constructor.name + ' -> BackgroundGeolocation.then(watcherId)', JSON.stringify(backgroundWatcherId)); }
      this.backgroundWatcherId = backgroundWatcherId;
    });
  }

  async stopBackgroundGeolocation() {
    if (this.debug) { console.log(this.constructor.name + '.stopBackgroundGeolocation()'); }
    if (!!this.backgroundWatcherId) {
      if (this.debug) { console.log(this.constructor.name + '-> BackgroundGeolocation.removeWatcher(id)', JSON.stringify(this.backgroundWatcherId)); }
      BackgroundGeolocation.removeWatcher({ id: this.backgroundWatcherId });
      this.backgroundGeolocationSubject.next(undefined);
      this.backgroundWatcherId = undefined;
    }
  }

}
