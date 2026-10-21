import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Cloud Firestore — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Scalable NoSQL document database with real-time listeners and Angular Signals in AngularFire v21.',
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
  selector: 'app-firestore-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Cloud Firestore"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Authentication', route: '/auth' }"
        [next]="{ label: 'Realtime Database', route: '/database' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class FirestorePage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/firestore' }));
}
