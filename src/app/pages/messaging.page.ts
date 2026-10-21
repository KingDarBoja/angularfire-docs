import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Cloud Messaging — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Web push notifications, FCM registration tokens, and real-time message handling in AngularFire v21.',
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
  selector: 'app-messaging-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Cloud Messaging"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Cloud Functions', route: '/functions' }"
        [next]="{ label: 'Analytics', route: '/analytics' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class MessagingPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/messaging' }));
}
