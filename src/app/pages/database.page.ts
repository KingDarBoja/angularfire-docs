import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Realtime Database — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Low-latency real-time JSON database synchronization with Angular Signals in AngularFire v21.',
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
  selector: 'app-database-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Realtime Database"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Cloud Firestore', route: '/firestore' }"
        [next]="{ label: 'Cloud Storage', route: '/storage' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    }
  `,
})
export default class DatabasePage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/database' }));
}
