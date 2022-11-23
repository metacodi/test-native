import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
// import { Badge } from '@awesome-cordova-plugins/badge/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
// import { Media } from '@awesome-cordova-plugins/media/ngx';
// import { File } from '@awesome-cordova-plugins/file/ngx';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

// import { AppPlugin } from './app';

// import { BadgePlugin } from './badge';
import { DevicePlugin } from './device';
import { NativeConfig } from './native-config';
// import { FaceIdPlugin } from './face-id';
// import { FileSystemPlugin } from './file-system';
// import { GeolocationPlugin } from './geolocation';
// import { InAppBrowserPlugin } from './in-app-browser';
// import { CapacitorKeepScreenOnPlugin } from './keep-screen-on';
// import { KeyboardPlugin } from './keyboard';
// import { NavigationBarColorPlugin } from './navigation-bar-color';
// import { NetworkPlugin } from './network';
// import { LocalNotificationPlugin } from './local-notification';
// import { MediaPlugin } from './media';
// import { SpeechRecognitionPlugin } from './speech-recognition';
// import { SplashScreenPlugin } from './splash-screen';
// import { StatusBarPlugin } from './status-bar';
// import { StoragePlugin } from './storage';


@NgModule({
  declarations: [
  ],
  imports: [
    // RouterModule,
  ],
  exports: [
    // RouterModule,
  ],
  providers: [
    // Badge,
    InAppBrowser,
    // Media,
    // File,
    // FileOpener,
    BackgroundMode
  ],
})
export class NativeModule  {

  public static forRoot(config: any): ModuleWithProviders<NativeModule> {
    return {
      ngModule: NativeModule,
      providers: [
        {
          provide: 'NativeConfig',
          useValue: Object.assign(NativeConfig, config),
        }
      ]
    };
  }
}


