import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DevicePlugin } from 'src/core-native';
import { routes } from './app-routing.module';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  
  constructor() {}

  get routes(): any { return routes.sort((a, b) => (a.path as string).localeCompare(b.path as string)); }
}
