import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DocsLayoutComponent } from './docs-layout.component';

describe('DocsLayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsLayoutComponent],
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();
  });

  it('keeps the docs shell visible while page content is loading', () => {
    const fixture = TestBed.createComponent(DocsLayoutComponent);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-header')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('analog-markdown')).toBeNull();
  });
});
