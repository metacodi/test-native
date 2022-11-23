import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavigationbarColorPage } from './navigationbar-color.page';

const routes: Routes = [
  {
    path: '',
    component: NavigationbarColorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavigationbarColorPageRoutingModule {}
