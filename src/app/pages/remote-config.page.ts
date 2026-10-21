import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Remote Config — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Server-driven feature flags and real-time parameter rollouts with Angular Signals in AngularFire v21.',
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
  selector: 'app-remote-config-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Remote Config"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'Performance', route: '/performance' }"
        [next]="{ label: 'App Check', route: '/app-check' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class RemoteConfigPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/remote-config' }));
}
