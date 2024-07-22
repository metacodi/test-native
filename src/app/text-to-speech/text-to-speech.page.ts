import { Component, OnInit } from '@angular/core';
import { TextToSpeechPlugin } from 'src/core-native';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.page.html',
  styleUrls: ['./text-to-speech.page.scss'],
})
export class TextToSpeechPage {
  constructor(
    public status: TextToSpeechPlugin) { }

  results: any = {}

  

  methods = [
    { fn: 'getSupportedLanguages', args: [] },
    { fn: 'getSupportedVoices', args: [] },
    { fn: 'isLanguageSupported', args: [{ lang: 'es-ES' }], label: 'IOS isLanguageSupported es-ES' },
    { fn: 'isLanguageSupported', args: [{ lang: 'spa-default' }], label: 'Android isLanguageSupported spa-default' },
    { fn: 'speak', args: [{ text: 'Hola.', lang: 'es-ES', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'IOS speak hola' },
    { fn: 'speak', args: [{ text: 'Por favor, centre la cara respecto en el rectangulo verde.', lang: 'es-ES', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'IOS speak centre la cara' },
    { fn: 'speak', args: [{ text: 'How are you, today is a great day to go out', lang: 'en-EN', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'IOS speak En' },
    { fn: 'speak', args: [{ text: 'Hola.', lang: 'spa-default', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'Android speak hola' },
    { fn: 'speak', args: [{ text: 'como estás, hoy hace un día genial para salir a la calle', lang: 'spa-x-lvariant-f00', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'Android speak como estás' },
    { fn: 'speak', args: [{ text: 'com estàs, avui fa un dia genial per sortir al carrer', lang: 'ca-ES', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'IOS speak com estàs CA' },
    { fn: 'speak', args: [{ text: 'Hola.', lang: 'spa-default', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'Android speak hola' },
    { fn: 'speak', args: [{ text: 'como estás, hoy hace un día genial para salir a la calle', lang: 'spa-default', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'Android speak como estás' },
    { fn: 'speak', args: [{ text: 'com estàs, avui fa un dia genial per sortir al carrer', lang: 'spa-x-lvariant-f00', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient', }], label: 'Android speak com estàs' },
  ]

  async invokeMethod(method: { fn: string, args: any[] }) {
    try {
      this.results = await (this.status as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
