import { Component, OnInit } from '@angular/core';
import { DevicePlugin } from 'src/core-native';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {

  constructor(public device: DevicePlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'getInfo', args: []}, 
    { fn: 'getId', args: []}, 
    { fn: 'getLanguageCode', args: []}, 
    { fn: 'getBatteryInfo', args: []}, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.device as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }
 
  label(method: any): string { return method?.label ? method.label : method.fn; }

}
