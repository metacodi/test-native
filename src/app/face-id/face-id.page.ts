import { Component, OnInit } from '@angular/core';
import { DevicePlugin, BiometricPlugin } from 'src/core-native';

@Component({
  selector: 'app-face-id',
  templateUrl: './face-id.page.html',
  styleUrls: ['./face-id.page.scss'],
})
export class FaceIdPage {

  constructor(
    public device: DevicePlugin,
    public badge: BiometricPlugin) { }

  results: any = {}

  

  methods = [
    { fn: 'isAvailable', args: [] }, 
    { fn: 'setCredentials', args: [{ username: 'xavi', password: '12345', server: 'test-native' }] }, 
    { fn: 'getCredentials', args: [{server: 'test-native' }] }, 
    { fn: 'deleteCredentials', args: [{server: 'test-native' }] }, 
    { fn: 'auth', args: [ { reason: 'Auth IOS'}], label: 'Auth IOS' }, 
    { fn: 'auth', args: [ { reason: 'Auth Android'}], label: 'Auth Android' }, 
    
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
       
      this.results = await (this.badge as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
