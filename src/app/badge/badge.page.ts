import { Component, OnInit } from '@angular/core';
import { BadgePlugin } from 'src/core-native';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.page.html',
  styleUrls: ['./badge.page.scss'],
})
export class BadgePage implements OnInit {

  constructor(public device: BadgePlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'isSupported', args: [] }, 
    { fn: 'get', args: [] }, 
    { fn: 'increase', args: [] }, 
    { fn: 'decrease', args: [] }, 
    { fn: 'checkPermissions', args: [] }, 
    { fn: 'requestPermissions', args: [] }, 
    { fn: 'setBagde', args: [10], label: 'setBage 10' }, 

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
