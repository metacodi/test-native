import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextZoomPageRoutingModule } from './text-zoom-routing.module';

import { TextZoomPage } from './text-zoom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextZoomPageRoutingModule
  ],
  declarations: [TextZoomPage]
})
export class TextZoomPageModule {}
