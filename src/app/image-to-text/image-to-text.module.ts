import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageToTextPageRoutingModule } from './image-to-text-routing.module';

import { ImageToTextPage } from './image-to-text.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageToTextPageRoutingModule
  ],
  declarations: [ImageToTextPage]
})
export class ImageToTextPageModule {}
