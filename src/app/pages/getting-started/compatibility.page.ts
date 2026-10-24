import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Compatibility and Contribution Guide — AngularFire Docs',
  meta: [
    {
      name: 'description',
      content: 'AngularFire, Angular, and Firebase JS SDK compatibility from Angular 12 onward, plus contribution guidance.',
    },
  ],
};

interface DocAttributes {
  title: string;
  description: string;
  category: string;
  order: number;
}

@Component({
  selector: 'app-compatibility-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Getting Started"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Core Overview', route: '/' }"
        [next]="{ label: 'Authentication', route: '/auth' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class CompatibilityPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/compatibility' }));
}
