import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackgroundModePageRoutingModule } from './background-mode-routing.module';

import { BackgroundModePage } from './background-mode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackgroundModePageRoutingModule
  ],
  declarations: [BackgroundModePage]
})
export class BackgroundModePageModule {}
