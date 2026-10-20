import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Cloud Functions — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Serverless backend execution with type-safe HTTPS callable functions in AngularFire v21.',
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
  selector: 'app-functions-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Cloud Functions"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Cloud Storage', route: '/storage' }"
        [next]="{ label: 'Cloud Messaging', route: '/messaging' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    }
  `,
})
export default class FunctionsPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/functions' }));
}
