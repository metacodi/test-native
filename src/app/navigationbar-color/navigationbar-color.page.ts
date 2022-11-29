import { Component, OnInit } from '@angular/core';
import { DevicePlugin, NavigationBarColorPlugin } from 'src/core-native';

@Component({
  selector: 'app-navigationbar-color',
  templateUrl: './navigationbar-color.page.html',
  styleUrls: ['./navigationbar-color.page.scss'],
})
export class NavigationbarColorPage implements OnInit {

  constructor(
    public device: DevicePlugin,
    public media: NavigationBarColorPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'setColor', args: ['dark'], label: 'SetColor -> dark' }, 
    { fn: 'setColor', args: ['white'], label: 'SetColor -> white' }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.media as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}