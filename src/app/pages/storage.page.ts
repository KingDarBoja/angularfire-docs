import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Cloud Storage — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Robust file uploads, downloads, and upload progress signals with AngularFire v21.',
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
  selector: 'app-storage-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Cloud Storage"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Realtime Database', route: '/database' }"
        [next]="{ label: 'Cloud Functions', route: '/functions' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    }
  `,
})
export default class StoragePage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/storage' }));
}
