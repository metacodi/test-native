import { Component, OnInit } from '@angular/core';
import { TextZoomPlugin } from 'src/core-native';

@Component({
  selector: 'app-text-zoom',
  templateUrl: './text-zoom.page.html',
  styleUrls: ['./text-zoom.page.scss'],
})
export class TextZoomPage implements OnInit {

  constructor(
    public status: TextZoomPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'set', args: [1], label: 'set 100% Light' }, 
    { fn: 'set', args: [0.75], label: 'set 75%' }, 
    { fn: 'set', args: [0.50], label: 'set 50%' }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.status as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
