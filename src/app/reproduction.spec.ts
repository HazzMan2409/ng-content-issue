import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  NgModule,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createCustomElement } from '@angular/elements';

@NgModule()
export class CustomElementsModule {
  toBeElements = [['my-content-projection', MyContentProjection]] as const;

  constructor(injector: Injector) {
    for (const [name, componentClass] of this.toBeElements) {
      const elementClass = createCustomElement(componentClass, { injector });
      customElements.define(name, elementClass);
    }
  }
}

@Component({
  selector: 'my-content-projection',
  standalone: true,
  template: `<div class="content"><ng-content></ng-content></div>`,
})
export class MyContentProjection {}

@Component({
  selector: 'my-test',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <my-content-projection>
      <h1>Some content</h1>
    </my-content-projection>
  `,
})
export class MyTestComponent {}

describe('MyContentProjection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTestComponent, CustomElementsModule],
    }).compileComponents();
  });

  it('should project content inside the .content element', () => {
    const fixture = TestBed.createComponent(MyTestComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(
        'my-content-projection > .content > h1'
      )
    ).toBeTruthy();
  });
});
