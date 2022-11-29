import { Component, OnInit } from '@angular/core';
import { BackgroundModePlugin } from 'src/core-native';


type PluginFnArgs = { name: keyof BackgroundModePlugin, args: any[] };

@Component({
  selector: 'app-background-mode',
  templateUrl: './background-mode.page.html',
  styleUrls: ['./background-mode.page.scss'],
})
export class BackgroundModePage implements OnInit {

  constructor(
    public plugin: BackgroundModePlugin,
  ) { }

  results: any = {}

  ngOnInit() {
  }

  methods: PluginFnArgs[] = [
    { name: 'enable', args: [] },
    { name: 'disable', args: [] },
    { name: 'disableBatteryOptimizations', args: [] },
    { name: 'moveToForeground', args: [] },
    { name: 'wakeUp', args: [] },
    { name: 'moveToBackground', args: [] },
  ]

  async invokeMethod(fn: PluginFnArgs) {
    try {
      this.results = await this.plugin[fn.name](...fn.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
