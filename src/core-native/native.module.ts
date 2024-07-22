import { NgModule, ModuleWithProviders } from '@angular/core';

import { NativeConfig } from './native-config';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [
  ],
  imports: [
    // RouterModule,
    IonicStorageModule.forRoot()
  ],
  exports: [
    // RouterModule,
  ],
  providers: [
    // FileOpener,
  ],
})
export class CoreNativeModule  {

  public static forRoot(config: any): ModuleWithProviders<CoreNativeModule> {
    return {
      ngModule: CoreNativeModule,
      providers: [
        {
          provide: 'NativeConfig',
          useValue: Object.assign(NativeConfig, config),
        }
      ]
    };
  }
}


