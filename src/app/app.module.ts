import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { NativeModule } from 'src/core-native';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    NativeModule.forRoot({ debugEnabled: true, 
      debugPlugins: [
        'AppPlugin',
        'BadgePlugin',
        'DevicePlugin',
        'FaceIdPlugin',
        'FileSystemPlugin',
        'BackgroundModePlugin',
        'GeolocationPlugin',
        'InAppBrowserPlugin',
        'KeyboardPlugin',
        'LocalNotificationsPlugin',
        'MediaPlugin',
        'StoragePlugin',
      ] 
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
