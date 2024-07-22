import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageToTextPage } from './image-to-text.page';

describe('ImageToTextPage', () => {
  let component: ImageToTextPage;
  let fixture: ComponentFixture<ImageToTextPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageToTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
