import { Component, OnInit } from '@angular/core';
import { BadgePlugin } from 'src/core-native';


type PluginFnArgs = { name: keyof BadgePlugin, args: any[], label?: string };

@Component({
  selector: 'app-badge',
  templateUrl: './badge.page.html',
  styleUrls: ['./badge.page.scss'],
})
export class BadgePage implements OnInit {

  constructor(
    public plugin: BadgePlugin,
  ) { }

  results: any = {}

  ngOnInit() {
  }

  methods: PluginFnArgs[] = [
    { name: 'isSupported', args: [] }, 
    { name: 'get', args: [] }, 
    { name: 'increase', args: [] }, 
    { name: 'decrease', args: [] }, 
    { name: 'checkPermissions', args: [] }, 
    { name: 'requestPermissions', args: [] }, 
    { name: 'clear', args: [] }, 
    { name: 'setBagde', args: [10], label: 'setBage 10' },
  ]

  async invokeMethod(fn: PluginFnArgs) {
    try {
      const f = this.plugin[fn.name];
      this.results = await (this.plugin[fn.name] as Function)(...fn.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: PluginFnArgs): string { return method?.label ? method.label : method.name; }

}
