import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavigationbarColorPageRoutingModule } from './navigationbar-color-routing.module';

import { NavigationbarColorPage } from './navigationbar-color.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavigationbarColorPageRoutingModule
  ],
  declarations: [NavigationbarColorPage]
})
export class NavigationbarColorPageModule {}
