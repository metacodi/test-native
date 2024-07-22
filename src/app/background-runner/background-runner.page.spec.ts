import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundRunnerPage } from './background-runner.page';

describe('BackgroundRunnerPage', () => {
  let component: BackgroundRunnerPage;
  let fixture: ComponentFixture<BackgroundRunnerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BackgroundRunnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
