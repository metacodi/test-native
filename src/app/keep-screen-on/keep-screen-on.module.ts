import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeepScreenOnPageRoutingModule } from './keep-screen-on-routing.module';

import { KeepScreenOnPage } from './keep-screen-on.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeepScreenOnPageRoutingModule
  ],
  declarations: [KeepScreenOnPage]
})
export class KeepScreenOnPageModule {}
