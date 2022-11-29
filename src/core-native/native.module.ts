import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { NativeConfig } from './native-config';


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
    Media,
    File,
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


