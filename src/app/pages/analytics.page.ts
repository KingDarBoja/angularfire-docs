import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Analytics — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'User telemetry, screen tracking, and custom event logging with AngularFire v21.',
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
  selector: 'app-analytics-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Analytics"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Cloud Messaging', route: '/messaging' }"
        [next]="{ label: 'Performance', route: '/performance' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    }
  `,
})
export default class AnalyticsPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/analytics' }));
}
