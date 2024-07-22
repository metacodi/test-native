import { Component, OnInit } from '@angular/core';
import { DevicePlugin } from 'src/core-native';
import { AppLauncherPlugin } from 'src/core-native/app-launcher';

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.page.html',
  styleUrls: ['./app-launcher.page.scss'],
})
export class AppLauncherPage {

  constructor(
    public device: DevicePlugin,
    public badge: AppLauncherPlugin) { }

  results: any = {}

  

  methods = [
    { fn: 'canOpenUrl', args: [{ url: 'com.google.android.apps.maps'}], label: 'ANDROID Google maps' }, 
    { fn: 'canOpenUrl', args: [{ url: 'com.waze'}], label: 'ANDROID Waze' }, 
    { fn: 'canOpenUrl', args: [{ url: 'comgooglemaps://'}], label: 'IOS Google Maps 01' }, 
    { fn: 'canOpenUrl', args: [{ url: 'comgooglemaps-x-callback://'}], label: 'IOS Google Maps 2' }, 
    { fn: 'canOpenUrl', args: [{ url: 'comgooglemapsurl://'}], label: 'IOS Google Maps 3' }, 
    { fn: 'canOpenUrl', args: [{ url: 'maps.google.com://'}], label: 'IOS Google Maps 4' }, 
    { fn: 'canOpenUrl', args: [{ url: 'goo.gl/maps://'}], label: 'IOS Google Maps 5' }, 
    { fn: 'canOpenUrl', args: [{ url: 'https://www.google.com/maps/'}], label: 'IOS Google Maps 6' }, 
    { fn: 'canOpenUrl', args: [{ url: 'maps://'}], label: 'IOS Apple Maps' }, 
    { fn: 'canOpenUrl', args: [{ url: 'waze://'}], label: 'IOS Waze' }, 
    
    // https://developers.google.com/waze/deeplinks?hl=es
    { fn: 'openUrl', args: [{ url: 'waze://?ll=41.815104,3.064241&navigate=yes'}], label: 'IOS Open Waze' },
    { fn: 'openUrl', args: [{ url: 'waze://?ll=41.384159,2.162639&q=Port%20Aut%C3%B2nom%20de%20Barcelona,%20Moll%20Adossat,%2008039%20Barcelona'}], label: 'Open Waze 7' },
    { fn: 'openUrl', args: [{ url: 'waze://?q=Carrer%20Mossen%20Cinto%20Verdaguer,%207,%2017250%20Platja%20d%20Aro,%20Girona1&navigate=yes'}], label: 'IOS Open Waze String' },
    
    // https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
    { fn: 'openUrl', args: [{ url: 'http://maps.apple.com/?daddr=41.815104,3.064241'}], label: 'IOS Open Apple Maps Lat Lng' }, 
    { fn: 'openUrl', args: [{ url: 'http://maps.apple.com/?saddr=41.815104,3.064241&daddr=Carrer%20Mossen%20Cinto%20Verdaguer,%207,%2017250%20Platja%20d%20Aro,%20Girona&dirflg=d'}], label: 'IOS Open Apple Maps String 5' }, 
    { fn: 'openUrl', args: [{ url: 'https://www.google.com/maps/dir/?api=1&destination=Carrer%20Mossen%20Cinto%20Verdaguer,%207,%2017250%20Platja%20d%20Aro,%20Girona&travelmode=driving'}], label: 'IOS Open Google Maps String 3' }, 
    
    // https://developers.google.com/maps/documentation/urls/ios-urlscheme?hl=es-419
    { fn: 'openUrl', args: [{ url: 'comgooglemaps://?api=1&daddr=Carrer%20Mossen%20Cinto%20Verdaguer,%207,%2017250%20Platja%20d%20Aro,%20Girona&travelmode=driving'}], label: 'IOS Open Google Maps String 4' }, 
    { fn: 'openUrl', args: [{ url: 'com.google.android.apps.maps://?api=1&daddr=Carrer%20Mossen%20Cinto%20Verdaguer,%207,%2017250%20Platja%20d%20Aro,%20Girona&travelmode=driving'}], label: 'IOS Open Google Maps String 4' }, 

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
