import { Injectable, OnDestroy } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Subject } from 'rxjs';




import { Network, ConnectionStatus } from '@capacitor/network';
import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `Network`.
 *
 * **Cordova**
 *
 * - Docs: {@link https://ionicframework.com/docs/native/network}
 * - Repo: {@link https://github.com/apache/cordova-plugin-network-information}
 *
 * ```bash
 * ionic cordova plugin add cordova-plugin-network-information
 * npm install @ionic-native/network --save
 * ```
 * ```typescript
 * import { Network } from '@ionic-native/network/ngx';
 * ```
 *
 * **Capacitor**
 *
 * - Api: {@link https://capacitor.ionicframework.com/docs/apis/network}
 *
 * ```typescript
 * import { Plugins } from '@capacitor/core';
 * const { Network } = Plugins;
 *
 * Network.show();
 * Network.hide();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkPlugin implements OnDestroy {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  connectionChangedSubject = new Subject<ConnectionStatus>();

  constructor() {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }

    Network.addListener('networkStatusChange', status => this.connectionChangedSubject.next(status));
  }

  ngOnDestroy(): void {
    Network.removeAllListeners();
  }

  // /** iOS only. */
  // addListenerNetworkStatusChange(callback: (status: ConnectionStatus) => void): PluginListenerHandle {
  //   return Network.addListener('networkStatusChange', callback);
  // }

  /** NetworkStatus. */
  getStatus(): Promise<ConnectionStatus> {
    return Network.getStatus();
  }


}
