import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { DevicePlugin } from './device';
import { NativeConfig } from './native-config';

import { SpeechSynthesisVoice, TextToSpeech, TTSOptions } from '@capacitor-community/text-to-speech';

export type PropertyName = keyof Pick<SpeechSynthesisUtterance, 'rate' | 'pitch' | 'text'>;
export type SpeechProperties = { name: PropertyName; value: string };
export type GenereType = 'Home' | 'Dona';
export type SpeechOptions = { text: string; gender: GenereType };

/**
 * Wrapper para el plugin `TextToSpeech`.
 *
 * ** Capacitor **
 *
 * - Api: {@link https://github.com/capacitor-community/text-to-speech}
 *
 * ```
 * npm install @capacitor-community/text-to-speech
 *
 * ionic cap sync
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TextToSpeechPlugin {
  protected debug = true && NativeConfig.debugEnabled && NativeConfig.debugPlugins.includes(this.constructor.name);

  // public rates: number[];
  // public selectedRate: number;
  // public selectedVoice: SpeechSynthesisVoice | null;
  // public text: string;
  public voices: SpeechSynthesisVoice[];
  // public languages: string[];

  isPlaying: boolean;

  constructor(
    public plt: Platform,
    public device: DevicePlugin,
  ) {
    if (this.debug) { console.log(this.constructor.name + '.constructor()'); }
    // this.rates = [ .25, .5, .75, .85, .90, .95, 1, 1.25, 1.5, 1.75, 2 ];
    // this.selectedVoice = null;
    // this.selectedRate = 1;
    this.init();

  }

  private async init() {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone) {
      this.voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('es-'));
    }
  }

  /**
   *
   * - Api: {@link https://github.com/capacitor-community/text-to-speech#speakh}
   *
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
  async speak(options: any) {
    return new Promise<void>(async (resolve: any, reject: any) => {
      const isRealPhone = await this.device.isRealPhone;
      this.isPlaying = true;
      if (isRealPhone || this.device.isElectron) {
        const lang = options.lang;
        const rate = 1;
        const pitch = 1;
        const volume = 1;
        const category = 'ambient';
        TextToSpeech.speak({ text: options.text, lang, rate, pitch, volume, category })
          .then(() => { this.isPlaying = false; resolve(); })
          .catch(error => { this.isPlaying = false; reject(error); });
      } else {
        const utterance = new SpeechSynthesisUtterance();
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = options.lang;
        utterance.text = options.text;
        utterance.voice = this.resolveVoice(options.gender);
        utterance.rate = options.gender === 'Home' ? 1 : 0.9;
        utterance.onboundary = (event: any) => { if (this.debug) { console.log(`${event.name} boundary reached after ${event.elapsedTime} milliseconds.`); } };
        utterance.onmark = (event: any) => { if (this.debug) { console.log(`A mark was reached: ${event.name}`); } };
        utterance.onstart = (event: any) => { if (this.debug) { console.log(`We have started uttering this speech: ${event.utterance.text}`); } };
        utterance.onerror = (event) => {
          if (this.debug) { console.warn(`An error has occurred with the speech synthesis: ${event.error}`); }
          this.isPlaying = false;
          reject(event);
        };
        utterance.onend = (event: any) => {
          this.isPlaying = false;
          if (this.debug) { console.log(`Utterance has finished being spoken after ${event.elapsedTime} milliseconds.`); }
          resolve();
        };
        speechSynthesis.speak(utterance);
      }
    });
  }

  private resolveVoice(gender: GenereType): SpeechSynthesisVoice {

    // TODO: discernir totes les platforms.

    // Platform WEB
    // Establecer el género de la voz
    const voices = speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) =>
      // Verificar el nombre de la voz para establecer el género correcto
      gender === 'Home' ? voice.name.includes('Google español') : voice.name.includes('Mónica (mejorada)')
    );
    return matchingVoice ? matchingVoice : voices[0];
  }

  /**
   * Stops the TTS engine..
   *
   * @param none
   * @returns Promise<void>
   */
  async stop() {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone || this.device.isElectron) {
      return TextToSpeech.stop();
    } else {
      speechSynthesis.pause();
      return Promise.resolve();
    }
  }

  /**
   * Returns a list of supported BCP 47 language tags.
   *
   * @param none
   * @returns Promise<{ languages: string[]; }>
   */
  async getSupportedLanguages(): Promise<{ languages: string[] }> {
    const isRealPhone = await this.device.isRealPhone;
    if (!isRealPhone || this.device.isElectron) {
      return Promise.resolve({ languages: [] });
    } else {
      return await TextToSpeech.getSupportedLanguages();
    }
  }

  /**
   * Returns a list of supported voices.
   *
   * @param none
   * @returns Promise<{ voices: SpeechSynthesisVoice[]; }>
   */
  async getSupportedVoices(): Promise<{ voices: SpeechSynthesisVoice[] }> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone || this.device.isElectron) {
      return await TextToSpeech.getSupportedVoices();
    } else {
      return Promise.resolve({ voices: this.voices });
    }
  }

  /**
   * Checks if a specific BCP 47 language tag is supported.
   *
   * @param lang: string
   * @returns Promise<{ supported: boolean; }>
   */
  async isLanguageSupported(options: { lang: string }): Promise<{ supported: boolean }> {
    const isRealPhone = await this.device.isRealPhone;
    if (isRealPhone || this.device.isElectron) {
      return Promise.resolve({ supported: false });
    } else {
      return await TextToSpeech.isLanguageSupported(options);
    }
  }

}
