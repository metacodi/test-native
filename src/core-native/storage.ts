import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `Storage`.
 *
 * Añade información del módulo (aplicación) al prinicipio de las claves.
 *
 * **Capacitor**
 *
 * - Api: {@link https://github.com/ionic-team/ionic-storage}
 * 
 * First, edit your NgModule declaration in src/app/app.module.ts or in the module for the component you'll 
 * use the storage library in, and add IonicStorageModule as an import:
 * 
 * import { IonicStorageModule } from '@ionic/storage-angular';
 *
 *   @NgModule({
 *      imports: [
 *        IonicStorageModule.forRoot()
 *      ]
 *    })
 * 
 * NOTA: les dades es guarden en Aplication -> IndexedDB -> _ionicstorage -> http://localhost:8100 -> ionickv
 * 
 * {@link https://developer.chrome.com/docs/devtools/storage/indexeddb/?utm_source=devtools }
 */
@Injectable({
  providedIn: 'root'
})
export class StoragePlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);
  private _storage: Storage = new Storage;

  constructor(
    private storage: Storage,
    ) {
    
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  get packageName(): string {
    return NativeConfig?.app ? NativeConfig.app.package || '' : '';
  }

  /** Clear the entire key value of app storage. */
  async clear(moduleName?: string): Promise<void> {
    return this.keys(moduleName).then(keys => {
      Promise.all(keys.map(key => this.remove(key, moduleName)));
    });
  }

  /** Get the value associated with the given key. */
  async get(key: string, moduleName?: string): Promise<any> {
    const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
    return this._storage.get(`${appName}.${key}`).then(value => value ? value : undefined);
    // return new Promise<{value: string}>((resolve: any, reject: any) => {
    //     const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
    //     Storage.get({key : `${appName}.${key}`}).then(value => {
    //       resolve(value && value.value ? JSON.parse(value.value) : undefined);
    //     }).catch(error => reject(error));
    // });
  }

  /** Returns a promise that resolves with the keys in the app storage. */
  keys(moduleName?: string): Promise<string[]> {
    return new Promise<string[]>((resolve: any, reject: any) => {
        const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
        this._storage.keys().then(result => {
          // resolve(result.keys.filter(key => key.startsWith(`${appName}.`)).map(key => key.slice(0, `${appName}.`.length)));
          resolve(result.filter(key => key.startsWith(`${appName}.`)).map(key => key.slice(`${appName}.`.length)));
        }).catch(error => reject(error));
    });
  }

  /** Returns a promise that resolves with the number of keys app storage. */
  length(moduleName?: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      this.keys(moduleName).then(keys => resolve(keys.length)).catch(error => reject(error));
    });
  }


  /** Remove any value associated with this key. */
  remove(key: string, moduleName?: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
        const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
        this._storage.remove(`${appName}.${key}`).then(() => {
          resolve(true);
        }).catch(error => reject(error));
    });
  }

  /** Set the value for the given key. */
  set(key: string, value: any, moduleName?: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
        const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
        this._storage.set(`${appName}.${key}`, value ? value : undefined).then(() => {
          resolve(true);
      }).catch(error => reject(error));
    });
  }

}
