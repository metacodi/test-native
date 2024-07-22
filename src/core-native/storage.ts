/* eslint-disable no-underscore-dangle */
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
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes('StoragePlugin');

  private storage: Storage;

  constructor(
  ) {
    this.ready();
  }

  async ready(): Promise<Storage> {
    if (!this.storage) {
      this.storage = new Storage();
      await this.storage.create();
    }
    return Promise.resolve(this.storage);
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
    const storage = await this.ready();
    const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
    return storage.get(`${appName}.${key}`).then((value: any) => value ? value : undefined);
  }

  /** Returns a promise that resolves with the keys in the app storage. */
  async keys(moduleName?: string): Promise<string[]> {
    const storage = await this.ready();
    const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
    return storage.keys().then(result => result.filter(key => key.startsWith(`${appName}.`)).map(key => key.slice(`${appName}.`.length)));
  }

  /** Returns a promise that resolves with the number of keys app storage. */
  async length(moduleName?: string): Promise<number> {
    return this.keys(moduleName).then(keys => keys.length);
  }


  /** Remove any value associated with this key. */
  async remove(key: string, moduleName?: string): Promise<any> {
    const storage = await this.ready();
    const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
    return storage.remove(`${appName}.${key}`).then(() => true);
  }

  /** Set the value for the given key. */
  async set(key: string, value: any, moduleName?: string): Promise<any> {
    const storage = await this.ready();
    const appName: string = this.packageName + (moduleName ? '.' + moduleName : '');
    return storage.set(`${appName}.${key}`, value ? value : undefined).then(() => true);
  }

}
