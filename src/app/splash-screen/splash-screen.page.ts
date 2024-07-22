import { Component, OnInit } from '@angular/core';
import { SplashScreenPlugin } from 'src/core-native';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage {
  constructor(
    public splash: SplashScreenPlugin) { }

  results: any = {}

  

  methods = [
    { fn: 'show', args: [{ showDuration: 2000, autoHide: true }] }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.splash as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
