import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TocComponent, TocItem } from './toc.component';

@Component({
  template: '<app-toc [items]="items" />',
  imports: [TocComponent],
})
class TestHostComponent {
  items: TocItem[] = [
    { id: 'intro', text: 'Introduction' },
    { id: 'setup--configuration', text: 'Setup &amp; Configuration' },
    { id: 'auth-tokens', text: 'Tokens &amp;amp; &quot;Claims&quot; &#39;Check&#39; &lt;Data&gt;' },
  ];
}

describe('TocComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([{ path: 'auth', component: TestHostComponent }]), provideLocationMocks()],
    }).compileComponents();
  });

  it('renders decoded text without html entities like &amp;', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('ul a');
    expect(links.length).toBe(3);

    expect(links[0].textContent.trim()).toBe('Introduction');
    expect(links[0].getAttribute('title')).toBe('Introduction');

    expect(links[1].textContent.trim()).toBe('Setup & Configuration');
    expect(links[1].getAttribute('title')).toBe('Setup & Configuration');

    expect(links[2].textContent.trim()).toBe('Tokens & "Claims" \'Check\' <Data>');
    expect(links[2].getAttribute('title')).toBe('Tokens & "Claims" \'Check\' <Data>');
  });

  it('routes to the fragment within the current page rather than root', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/auth');

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('ul a');
    expect(links[1].getAttribute('href')).toBe('/auth#setup--configuration');
  });

  it('scrolls into view when section link is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const targetElement = document.createElement('div');
    targetElement.id = 'setup--configuration';
    const scrollSpy = vi.fn();
    targetElement.scrollIntoView = scrollSpy;
    document.body.appendChild(targetElement);

    const link = fixture.nativeElement.querySelectorAll('ul a')[1];
    link.click();

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(targetElement);
  });
});

