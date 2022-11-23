import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DevicePlugin, MediaPlugin } from 'src/core-native';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
export class MediaPage implements AfterViewInit, OnInit {

  @ViewChild('playSound', { static: true }) playSound: ElementRef;

  constructor(
    public device: DevicePlugin,
    public media: MediaPlugin) { }

  results: any = {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.media.playSounds = this.playSound;
  }

  methods = [
    { fn: 'play', args: [{ src: 'audio/' + 'notification0.mp3'}] }, 
    { fn: 'stop', args: [] }, 
  ]

  async invokeMethod(method: {fn: string, args: any[]}) {
    try {
      this.results = await (this.media as any)[method.fn](...method.args);
    } catch (error) {
      this.results = error;
    }
  }

  label(method: any): string { return method?.label ? method.label : method.fn; }

}
