import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NativeAudio } from '@capacitor-community/native-audio'

import { DevicePlugin } from './device';

import { NativeConfig } from './native-config';

/**
 * Wrapper para el plugin `Media`. Necessita el plugin de `File` com a dependècia
 *
 * **Cordova**
 *
 *  - API:{@link https://ionicframework.com/docs/native/media}
 *
 * $ npm install cordova-plugin-media cordova-plugin-file
 * $ npm install @awesome-cordova-plugins/media @awesome-cordova-plugins/file
 *
 * Add on app.modules.ts
 *
 * ```typescript
 * import { File } from '@awesome-cordova-plugins/file/ngx';
 * import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
 *
 * providers: [
 *   Media, File
 * ],
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class MediaPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  testNativerAudio = true;
  assetId: string;
  soundPlay: any;
  playSounds: ElementRef;
  loop: boolean = false;
  constructor(
    public device: DevicePlugin,
    // public user: UserService,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
  }

  /** Create a media and play.
   *
   * @param src: string; A URI containing the audio content.
   * @param loop: boolean; loop Will loop the audio file for playback..
   * @param volumen: number; Will set the new volume for a audio file, numerical value of the volume between 0.1 - 1.0.
   * If audio file is on 'assets', example: 'audio/file.mp3'
   * @external boolean:false pass true if assetPath is a `file://` or `https://` url
   */
  async play(options: { src: string; loop?: boolean; volumen?: number; external?: boolean }): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let localUrl = '../';
        const isRealPhone = await this.device.isRealPhone;
        if (isRealPhone) { localUrl = 'public/assets/'; }
           
        this.assetId = options.src;

        await NativeAudio.preload({
          assetId: options.src,
          assetPath: localUrl + options.src,
          audioChannelNum: 1,
          isUrl: options.external || false
        }).catch((reason: any) => reject(reason));

        if (options.volumen) { this.setVolume(options.volumen); };

        await NativeAudio.play({ assetId: options.src });

        if (options.loop) { NativeAudio.loop({ assetId: options.src }); };

        if (isRealPhone) {
          NativeAudio.addListener('complete', ({ assetId }) => {
            if (this.debug) { console.log('Completed audio ', assetId); }
            resolve(localUrl + options.src);
            // Descargamos el audio de memoria
            this.unload();
          });
        } else {
          const interval = setInterval(async () => {
            const isPlaying = await this.isPlaying(); 
            if (!isPlaying) { 
              if (this.debug) { console.log('Completed audio ', this.assetId); }
              resolve(localUrl + options.src);
              // Descargamos el audio de memoria
              this.unload();
              clearInterval(interval);
            }
          }, 100);
        }
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /** Stop an audio file. */
  stop(): void {
    if (this.assetId === undefined) Promise.resolve();
    this.unload();
    NativeAudio.stop({ assetId: (this.assetId as string) });
  }

  /**
   * This method will unload the audio file from the memory.
   *
   * @returns void
   */
  async unload(): Promise<void> {
    if (this.assetId === undefined) return Promise.resolve();
    await NativeAudio.unload({ assetId: this.assetId });
    this.assetId = '';
  }

  /**
   * This method will return false if audio is paused or not loaded.
   * 
   * @returns boolean
   */  
  async isPlaying(): Promise<boolean> {
    if (this.assetId === undefined) return Promise.resolve(false);
    return NativeAudio.isPlaying({ assetId: this.assetId }).then(result => result.isPlaying);
  }

  /**
   * This method will set the new volume for a audio file.
   * @param assetId - identifier of the asset
   *        volume - numerical value of the volume between 0.1 - 1.0
   * @returns void
   */
  setVolume(volume: number): void {
    if (this.assetId === undefined) Promise.resolve();
    NativeAudio.setVolume({ assetId: this.assetId, volume });
  }

  /** This method will get the duration of an audio file.
   * only works if channels == 1
   * 
   * @returns — Returns the duration of an audio file.
   */
  async getDuration(): Promise<number> {
    return NativeAudio.getDuration({ assetId: this.assetId }).then(result => result.duration);
  }

  /** This method will get the current time of a playing audio file.
   * only works if channels == 1
   * 
   * @returns — Returns a promise with the position of the current recording.
  */
  async getCurrentTime(): Promise<number> {
    return NativeAudio.getCurrentTime({ assetId: this.assetId }).then(result => result.currentTime);
  }

}
