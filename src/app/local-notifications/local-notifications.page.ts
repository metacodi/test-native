import { Component, OnInit } from '@angular/core';
import { DevicePlugin, LocalNotificationPlugin } from 'src/core-native';

@Component({
  selector: 'app-local-notifications',
  templateUrl: './local-notifications.page.html',
  styleUrls: ['./local-notifications.page.scss'],
})
export class LocalNotificationsPage implements OnInit {

  constructor(
    public device: DevicePlugin,
    public localNotifications: LocalNotificationPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'checkPermissions', args: [] }, 
    { fn: 'requestPermission', args: [] }, 
    { fn: 'push', args: [{ idNotification: 1, title: 'Tit', message: 'mess'}], label: 'Send now'}, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.localNotifications as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
