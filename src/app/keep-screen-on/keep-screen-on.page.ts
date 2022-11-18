import { Component, OnInit } from '@angular/core';
import { CapacitorKeepScreenOnPlugin } from 'src/core-native';

@Component({
  selector: 'app-keep-screen-on',
  templateUrl: './keep-screen-on.page.html',
  styleUrls: ['./keep-screen-on.page.scss'],
})
export class KeepScreenOnPage implements OnInit {

  constructor(public device: CapacitorKeepScreenOnPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'enable', args: [] }, 
    { fn: 'disable', args: [] }, 
    { fn: 'isSupported', args: [] }, 


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
