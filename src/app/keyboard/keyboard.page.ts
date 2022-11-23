import { Component, OnInit } from '@angular/core';
import { DevicePlugin, KeyboardPlugin } from 'src/core-native';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.page.html',
  styleUrls: ['./keyboard.page.scss'],
})
export class KeyboardPage implements OnInit {

  constructor(
    public device: DevicePlugin,
    public keyboard: KeyboardPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'show', args: [], label: 'Show (only supported on Android)'}, 
    { fn: 'hide', args: [] }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.keyboard as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
