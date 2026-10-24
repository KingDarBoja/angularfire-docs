import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'AngularFire v21 — Documentation & Overview',
  meta: [
    {
      name: 'description',
      content: 'Signals-first, tree-shakable Firebase SDK integration for modern Angular and AnalogJS.',
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
  selector: 'app-overview-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="v21 Core"
        [toc]="page.toc ?? []"
        [next]="{ label: 'Compatibility & Contribution', route: '/getting-started/compatibility' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class OverviewPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/overview' }));
}
