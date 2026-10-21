import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'App Check — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Protect your backend resources with reCAPTCHA Enterprise and App Check in AngularFire v21.',
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
  selector: 'app-app-check-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Security & App Check"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Remote Config', route: '/remote-config' }"
        [next]="{ label: 'Vertex AI & Genkit', route: '/ai' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class AppCheckPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/app-check' }));
}
