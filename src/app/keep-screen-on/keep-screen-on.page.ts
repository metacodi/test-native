import { Component, OnInit } from '@angular/core';
import { CapacitorKeepScreenOnPlugin, DevicePlugin } from 'src/core-native';

@Component({
  selector: 'app-keep-screen-on',
  templateUrl: './keep-screen-on.page.html',
  styleUrls: ['./keep-screen-on.page.scss'],
})
export class KeepScreenOnPage {

  constructor(
    public device: DevicePlugin,
    public keep: CapacitorKeepScreenOnPlugin
  ) { }

  results: any = {}

  methods = [
    { fn: 'enable', args: [] }, 
    { fn: 'disable', args: [] }, 
    { fn: 'isSupported', args: [] }, 


  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
       
      this.results = await (this.keep as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
