import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLauncherPage } from './app-launcher.page';

describe('AppLauncherPage', () => {
  let component: AppLauncherPage;
  let fixture: ComponentFixture<AppLauncherPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AppLauncherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
