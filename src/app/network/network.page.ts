import { Component, OnInit } from '@angular/core';
import { NetworkPlugin } from 'src/core-native';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {

  constructor(
    public network: NetworkPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'getStatus', args: [] }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.network as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
