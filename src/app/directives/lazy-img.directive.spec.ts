import { LazyImgDirective } from './lazy-img.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<img />`,
})
class TestComponent {}
describe('LazyImgDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let imgEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, LazyImgDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    imgEl = fixture.debugElement.query(By.css('img'));
  });

  it('should contain attribute', () => {
    const imgElement = imgEl.nativeElement.getAttribute('loading');
    expect(imgElement).toEqual('lazy');
  });
});
