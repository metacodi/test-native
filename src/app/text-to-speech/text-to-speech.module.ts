import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextToSpeechPageRoutingModule } from './text-to-speech-routing.module';

import { TextToSpeechPage } from './text-to-speech.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextToSpeechPageRoutingModule
  ],
  declarations: [TextToSpeechPage]
})
export class TextToSpeechPageModule {}
