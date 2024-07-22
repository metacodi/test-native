import { Component, OnInit } from '@angular/core';
import { StatusBarPlugin } from 'src/core-native';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.page.html',
  styleUrls: ['./status-bar.page.scss'],
})
export class StatusBarPage {
  constructor(
    public status: StatusBarPlugin) { }

  results: any = {}

  

  methods = [
    { fn: 'show', args: [] }, 
    { fn: 'hide', args: [] }, 
    { fn: 'setStatusBar', args: ['light'], label: 'setStatusBar Light' }, 
    { fn: 'setStatusBar', args: ['dark'], label: 'setStatusBar Dark' }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.status as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
