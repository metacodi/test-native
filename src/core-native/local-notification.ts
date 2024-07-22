import { Injectable, OnDestroy } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
// import { LocalNotificationEnabledResult, Plugins, PluginListenerHandle, NotificationPermissionResponse } from '@capacitor/core';
import { CancelOptions, LocalNotifications, PermissionStatus } from '@capacitor/local-notifications';
// import { ElectronService } from 'ngx-electron';

import { DevicePlugin } from './device';
import { NativeConfig } from './native-config';


// const { LocalNotifications } = Plugins;

/**
 * Wrapper para el plugin `Network`.
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitorjs.com/docs/apis/local-notifications}
 *
 * ```typescript
 * import { Plugins } from '@capacitor/core';
 * const { LocalNotifications } = Plugins;
 *
 * areEnabled();
 * requestPermission();
 * send(title: string, message: string);
 * addListenerlocalNotificationReceived()
 * addListenerlocalNotificationActionPerformed()
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LocalNotificationPlugin implements OnDestroy {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    ///// public device: DevicePlugin,
    // public electronService: ElectronService,
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }

    this.device.ready().then(() => {

      // this.checkPermissions().then(granted => {
      //   if (this.debug) {
      //     if (this.debug) { console.log(this.constructor.name + '.requestPermission', granted); }
      //   }
      // });

      this.addListenerlocalNotificationActionPerformed((notification) => {
        if (this.debug) { console.log(this.constructor.name + '.addListenerlocalNotificationActionPerformed: ', notification); }
      });

      this.addListenerlocalNotificationReceived((notification) => {
        if (this.debug) { console.log(this.constructor.name + '.addListenerlocalNotificationReceived: ', notification); }
      });
    });

  }

  ngOnDestroy(): void {
    LocalNotifications.removeAllListeners();
  }

  addListenerlocalNotificationReceived(callback: (notification: any) => void): Promise<PluginListenerHandle> {
    return LocalNotifications.addListener('localNotificationReceived', callback);
  }
  addListenerlocalNotificationActionPerformed(callback: (notificationAction: any) => void): Promise<PluginListenerHandle> {
    // this.electronService.
    return LocalNotifications.addListener('localNotificationActionPerformed', callback);
  }

  requestPermission(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // if (!this.electronService.isElectronApp) { return resolve(false); }
      LocalNotifications.requestPermissions().then((response: PermissionStatus) => {
        if (response.display === 'granted') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async checkPermissions(): Promise<PermissionStatus> {
    return this.device.ready().then(value => LocalNotifications.checkPermissions());
  }

  push(options: { idNotification: number; title: string; message?: string; sound?: string; schedule?: Date }): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {

      let localUrl = '';
      const isIos = await this.device.isIos;
      const isAndroid = await this.device.isAndroid;
      if (isAndroid) {
        localUrl = '/android_asset/public/assets/audio/';
      } else if (isIos) {
        localUrl = './public/assets/audio/';
      }

      const at = options.schedule === undefined ? new Date(Date.now() + 500) : options.schedule;

      if (this.debug) { console.log('Local Notification scheduled sound => ', localUrl + options.sound); }

      LocalNotifications.schedule({
        notifications: [
          {
            title: options.title,
            body: options.message ? options.message : '',
            id: options.idNotification,
            schedule: { at },
            sound: options.sound ? localUrl + options.sound : '',
            actionTypeId: '',
            extra: null
          }
        ]
      }).then(() => { resolve(true); });
    });
  }

  cancelAllLocalNotifications() {
    const ids: any[] = [];
    LocalNotifications.getPending().then(pendings => {
      pendings.notifications.map(l => { ids.push({ id: l.id }); });
      if (ids.length > 0) {
        const options: CancelOptions = { notifications: ids };
        LocalNotifications.cancel(options);
      }
    });
  }
}
