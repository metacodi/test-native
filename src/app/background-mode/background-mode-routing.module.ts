import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackgroundModePage } from './background-mode.page';

const routes: Routes = [
  {
    path: '',
    component: BackgroundModePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackgroundModePageRoutingModule {}
