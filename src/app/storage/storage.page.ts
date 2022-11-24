import { Component, OnInit } from '@angular/core';
import { StoragePlugin } from 'src/core-native';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.page.html',
  styleUrls: ['./storage.page.scss'],
})
export class StoragePage implements OnInit {
  constructor(
    public storage: StoragePlugin) { }

  results: any = {}

  ngOnInit() {
  }

  methods = [
    { fn: 'set', args: ['name1', { name: 'Nom 1', surmane: 'Cognoms 1'}, 'testNative'], label: 'set 1' }, 
    { fn: 'set', args: ['name2', { name: 'Nom 2', surmane: 'Cognoms 2'}, 'testNative'], label: 'set 2' }, 
    { fn: 'get', args: ['name1', 'testNative'], label: 'get 1' }, 
    { fn: 'get', args: ['name2', 'testNative'], label: 'get 2' }, 
    { fn: 'remove', args: ['name1', 'testNative'], label: 'remove 1' }, 
    { fn: 'remove', args: ['name2', 'testNative'], label: 'remove 2' }, 
    { fn: 'clear', args: ['testNative'] }, 
    { fn: 'keys', args: ['testNative'] }, 
    { fn: 'length', args: ['testNative'] }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.storage as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
