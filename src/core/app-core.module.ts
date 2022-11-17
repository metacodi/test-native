import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppConfig } from './app-config';
import { NativeModule } from './native/native.module';


@NgModule({
  imports: [

  ],
  declarations: [
  ],
  exports: [
    NativeModule,
  ],
  providers: [
  ],

})
export class AppCoreModule {

  public static forRoot(config: any): ModuleWithProviders<AppCoreModule> {
    return {
      ngModule: AppCoreModule,
      providers: [
        {
          provide: 'AppConfig',
          useValue: Object.assign(AppConfig, config),
        }
      ]
    };
  }
}


