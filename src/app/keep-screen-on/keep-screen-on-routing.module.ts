import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KeepScreenOnPage } from './keep-screen-on.page';

const routes: Routes = [
  {
    path: '',
    component: KeepScreenOnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeepScreenOnPageRoutingModule {}
