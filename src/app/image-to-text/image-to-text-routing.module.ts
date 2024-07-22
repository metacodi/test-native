import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageToTextPage } from './image-to-text.page';

const routes: Routes = [
  {
    path: '',
    component: ImageToTextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageToTextPageRoutingModule {}
