import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Performance Monitoring — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Real-time performance traces, web vitals, and latency tracking in AngularFire v21.',
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
  selector: 'app-performance-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Performance"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Analytics', route: '/analytics' }"
        [next]="{ label: 'Remote Config', route: '/remote-config' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    }
  `,
})
export default class PerformancePage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/performance' }));
}
