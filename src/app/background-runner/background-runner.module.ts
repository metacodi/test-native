import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackgroundRunnerPageRoutingModule } from './background-runner-routing.module';

import { BackgroundRunnerPage } from './background-runner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackgroundRunnerPageRoutingModule
  ],
  declarations: [BackgroundRunnerPage]
})
export class BackgroundRunnerPageModule {}
