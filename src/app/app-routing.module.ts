import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'speech-recognition',
    pathMatch: 'full'
  },
  {
    path: 'device',
    loadChildren: () => import('./device/device.module').then( m => m.DevicePageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./app/app.module').then( m => m.AppPageModule)
  },
  {
    path: 'badge',
    loadChildren: () => import('./badge/badge.module').then( m => m.BadgePageModule)
  },
  {
    path: 'keep-screen-on',
    loadChildren: () => import('./keep-screen-on/keep-screen-on.module').then( m => m.KeepScreenOnPageModule)
  },
  {
    path: 'face-id',
    loadChildren: () => import('./face-id/face-id.module').then( m => m.FaceIdPageModule)
  },
  {
    path: 'file-system',
    loadChildren: () => import('./file-system/file-system.module').then( m => m.FileSystemPageModule)
  },
  {
    path: 'background-mode',
    loadChildren: () => import('./background-mode/background-mode.module').then( m => m.BackgroundModePageModule)
  },
  {
    path: 'geolocation',
    loadChildren: () => import('./geolocation/geolocation.module').then( m => m.GeolocationPageModule)
  },
  {
    path: 'in-app-browser',
    loadChildren: () => import('./in-app-browser/in-app-browser.module').then( m => m.InAppBrowserPageModule)
  },
  {
    path: 'keyboard',
    loadChildren: () => import('./keyboard/keyboard.module').then( m => m.KeyboardPageModule)
  },
  {
    path: 'local-notifications',
    loadChildren: () => import('./local-notifications/local-notifications.module').then( m => m.LocalNotificationsPageModule)
  },
  {
    path: 'media',
    loadChildren: () => import('./media/media.module').then( m => m.MediaPageModule)
  },
  {
    path: 'navigationbar-color',
    loadChildren: () => import('./navigationbar-color/navigationbar-color.module').then( m => m.NavigationbarColorPageModule)
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then( m => m.NetworkPageModule)
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./splash-screen/splash-screen.module').then( m => m.SplashScreenPageModule)
  },
  {
    path: 'status-bar',
    loadChildren: () => import('./status-bar/status-bar.module').then( m => m.StatusBarPageModule)
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then( m => m.StoragePageModule)
  },
  {
    path: 'speech-recognition',
    loadChildren: () => import('./speech-recognition/speech-recognition.module').then( m => m.SpeechRecognitionPageModule)
  },
  {
    path: 'text-zoom',
    loadChildren: () => import('./text-zoom/text-zoom.module').then( m => m.TextZoomPageModule)
  },
  {
    path: 'text-to-speech',
    loadChildren: () => import('./text-to-speech/text-to-speech.module').then( m => m.TextToSpeechPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
