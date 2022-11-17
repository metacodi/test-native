import { Component, OnInit } from '@angular/core';
import { AppPlugin } from 'src/core-native';

@Component({
  selector: 'app-app',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss'],
})
export class AppPage implements OnInit {

  
  constructor(public device: AppPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'getInfo', args: [] }, 

  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.device as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }
 

}