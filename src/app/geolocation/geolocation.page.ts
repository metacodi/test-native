import { Component, OnInit } from '@angular/core';
import { DevicePlugin, GeolocationPlugin } from 'src/core-native';
import { WatchPositionCallback } from '@capacitor/geolocation';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {

  constructor(
    public device: DevicePlugin,
    public geo: GeolocationPlugin,

  ) { }

  isEnabled: boolean;

  results: any = {}

  watchPositionId = '';

  ngOnInit() {
  }

  methods = [
    { fn: 'checkPermissions', args: []}, 
    { fn: 'requestPermissions', args: []}, 
    { fn: 'openSettings', args: []}, 
    { fn: 'getCurrentPosition', args: []}, 
    { fn: 'watchPosition', args: [
      {enableHighAccuracy: true},
      (coords: WatchPositionCallback) => {
        this.results = coords; 
        console.log('watchPosition: ', JSON.stringify(coords));
        
      }
    ]}, 
    { fn: 'clearWatch', args: [{id: this.watchPositionId}]}, 
    { fn: 'startBackgroundGeolocation', args: []}, 
    { fn: 'stopBackgroundGeolocation', args: []}, 
  ]

  setContinuousGeolocationRequired(){
    this.isEnabled = true;
    this.geolocation();
  }

  async geolocation(){
    if (this.isEnabled) setTimeout(async () => {
      this.results = await this.geo.getCurrentPosition();
      this.geolocation();
    }, 5000); 
  }

  setContinuousGeolocationRequiredStop(){
    this.isEnabled = false;
  }

  setBackgroundMode(){
    // this.geo.backgroundMode.enable();
  }



  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      if (method.fn === 'watchPosition' && !!this.watchPositionId) { return; }
      this.results = await (this.geo as any)[method.fn](...method.args);
      if (method.fn === 'watchPosition') { this.watchPositionId = this.results; }
      if (method.fn === 'clearWatch') { this.watchPositionId = ''; }
    } catch (error) {
      this.results = error;
    }
  }
 
  label(method: any): string { return method?.label ? method.label : method.fn; }

}
