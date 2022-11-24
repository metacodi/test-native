import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusBarPageRoutingModule } from './status-bar-routing.module';

import { StatusBarPage } from './status-bar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusBarPageRoutingModule
  ],
  declarations: [StatusBarPage]
})
export class StatusBarPageModule {}
