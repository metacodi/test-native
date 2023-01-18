import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { DevicePlugin } from './device';
import { NativeConfig } from './native-config';

import { TextToSpeech, TTSOptions } from '@capacitor-community/text-to-speech';

/**
 * Wrapper para el plugin `TextToSpeech`.
 *
 * ** Capacitor **
 * 
 * - Api: {@link https://github.com/capacitor-community/text-to-speech}
 * 
 * npm install @capacitor-community/text-to-speech
 * ionic cap sync
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TextToSpeechPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  constructor(
    public plt: Platform,
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }


  }

  /**
   * 
   * - Api: {@link https://github.com/capacitor-community/text-to-speech#speakh}
   * Example
   * 
   * {
   *    text: 'This is a sample text.',
   *    lang: 'en-US',
   *    rate: 1.0,
   *    pitch: 1.0,
   *    volume: 1.0,
   *    category: 'ambient',
   *  }
   * 
   */
  speak(options: TTSOptions) {
    return this.device.getInfo().then(async value => {
      if (this.device.isRealPhone) {
        const { text, lang, rate, pitch, volume, category } = options;
        return TextToSpeech.speak({ text, lang, rate, pitch, volume, category });
      } else {
        return 'Not Implemented fro this platform';
      }
    });
  }

  /**
   * Returns a list of supported BCP 47 language tags.
   * @param none
   * @returns Promise<{ languages: string[]; }>
   */
  async getSupportedLanguages(): Promise<{ languages: string[]; }> {
    return this.device.getInfo().then(async value => {
      if (!this.device.isRealPhone) { return Promise.resolve({ languages: [] }); } else { return await TextToSpeech.getSupportedLanguages(); }
    });
  }

  /**
   * Returns a list of supported voices.
   * @param none
   * @returns Promise<{ voices: SpeechSynthesisVoice[]; }>
   */
  async getSupportedVoices(): Promise<{ voices: SpeechSynthesisVoice[]; }> {
    return this.device.getInfo().then(async value => {
      if (!this.device.isRealPhone) { return Promise.resolve({ voices: [] }); } else { return await TextToSpeech.getSupportedVoices(); }
    });
  }

  /**
   * Checks if a specific BCP 47 language tag is supported.
   * @param lang: string
   * @returns Promise<{ supported: boolean; }>
   */
  async isLanguageSupported(options: { lang: string; }): Promise<{ supported: boolean; }> {
    return this.device.getInfo().then(async value => {
      if (!this.device.isRealPhone) { return Promise.resolve({ supported: false }); } else { return await TextToSpeech.isLanguageSupported(options); }
    });
  }

}
