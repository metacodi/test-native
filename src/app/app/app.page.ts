import { Component, OnInit } from '@angular/core';
import { AppPlugin, DevicePlugin } from 'src/core-native';

@Component({
  selector: 'app-app',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss'],
})
export class AppPage implements OnInit {

  
  constructor(
    public device: DevicePlugin,
    public app: AppPlugin
  ) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'getInfo', args: []},
    { fn: 'exitApp', args: []}, 

  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.app as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }
 
  label(method: any): string { return method?.label ? method.label : method.fn; }

}
