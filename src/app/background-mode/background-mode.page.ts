import { Component, OnInit } from '@angular/core';
import { BackgroundModePlugin } from 'src/core-native';


type IsFunction<T, ReturnType = T> = T extends (...args: any) => any ? ReturnType : never;

type CallableOf<T> = { [K in keyof T as IsFunction<T[K], K>]: T[K] extends (...args: any) => any ? T[K] : never }

type PluginFnArgs = { name: keyof CallableOf<BackgroundModePlugin>, args: any[], label?: string };

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
      const f = this.plugin[fn.name];
      this.results = await (this.plugin[fn.name] as Function)(...fn.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: PluginFnArgs): string { return method?.label ? method.label : method.name; }

}
