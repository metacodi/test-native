import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusBarPage } from './status-bar.page';

const routes: Routes = [
  {
    path: '',
    component: StatusBarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusBarPageRoutingModule {}
