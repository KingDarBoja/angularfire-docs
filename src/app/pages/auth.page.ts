import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Authentication — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Robust identity management, social logins, and signal-based reactive auth states in AngularFire v21.',
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
  selector: 'app-auth-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Auth & Identity"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Core Overview', route: '/' }"
        [next]="{ label: 'Cloud Firestore', route: '/firestore' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class AuthPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/auth' }));
}
