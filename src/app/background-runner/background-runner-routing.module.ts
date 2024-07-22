import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackgroundRunnerPage } from './background-runner.page';

const routes: Routes = [
  {
    path: '',
    component: BackgroundRunnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackgroundRunnerPageRoutingModule {}
