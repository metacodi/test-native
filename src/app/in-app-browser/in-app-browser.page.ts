import { Component, OnInit } from '@angular/core';
import { DevicePlugin, InAppBrowserPlugin } from 'src/core-native';

@Component({
  selector: 'app-in-app-browser',
  templateUrl: './in-app-browser.page.html',
  styleUrls: ['./in-app-browser.page.scss'],
})
export class InAppBrowserPage implements OnInit {

  constructor(
    public device: DevicePlugin,
    public iabPlugin: InAppBrowserPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'openWindow', args: [{ url: 'https://www.metacodi.com', optionsWindow: { width: 1000, height: 800 } }] }, 
    { fn: 'close', args: [] }, 
   
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
       
      this.results = await (this.iabPlugin as any)[method.fn](...method.args);
      if (method.fn === 'openWindow') {
        this.iabPlugin.onStatusUpdate().subscribe(result => {
          if (result.status === 'navigate') {
            console.log(this.constructor.name + '.onStatusUpdate => Navigate', result.url); 
          }
          if (result.status === 'close') {
            console.log(this.constructor.name + '.onStatusUpdate => Closed'); 
          }
        });
      }
    } catch (error) {
      this.results = error;
    }
  }

  


  label(method: any): string { return method?.label ? method.label : method.fn; }

}
