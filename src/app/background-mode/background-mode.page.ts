import { Component, OnInit } from '@angular/core';
import { BackgroundModePlugin, DevicePlugin } from 'src/core-native';

@Component({
  selector: 'app-background-mode',
  templateUrl: './background-mode.page.html',
  styleUrls: ['./background-mode.page.scss'],
})
export class BackgroundModePage implements OnInit {

  constructor(
    public device: DevicePlugin,
    public backgroundModePlugin: BackgroundModePlugin,
  ) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'enable', args: [] }, 
    { fn: 'disable', args: [] }, 
    { fn: 'disableBatteryOptimizations', args: [] }, 
    { fn: 'moveToForeground', args: [] }, 
    { fn: 'wakeUp', args: [] }, 
    { fn: 'moveToBackground', args: [] }, 
    
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
       
      this.results = await (this.backgroundModePlugin as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
