import { Component, OnInit } from '@angular/core';
import { SpeechRecognitionPlugin } from 'src/core-native';

@Component({
  selector: 'app-speech-recognition',
  templateUrl: './speech-recognition.page.html',
  styleUrls: ['./speech-recognition.page.scss'],
})
export class SpeechRecognitionPage {
  
  constructor(
    public speech: SpeechRecognitionPlugin) { }

  results: any = {}

  ngOnInit() {
    this.speech.partialResultsSubject.subscribe(data => this.results = data);
  }

  methods = [
    { fn: 'hasPermission', args: [] }, 
    { fn: 'requestPermission', args: [] }, 
    { fn: 'getSupportedLanguages', args: [] }, 
    { fn: 'start', args: [{language: 'ca-ES'}], label: 'Català' }, 
    { fn: 'start', args: [{language: 'es-ES'}], label: 'Castellà' }, 
    { fn: 'start', args: [{language: 'en-US'}], label: 'English' }, 
    { fn: 'stop', args: [] }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.speech as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
