import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { RouteMeta } from '@analogjs/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

export const routeMeta: RouteMeta = {
  title: 'Vertex AI & Genkit — AngularFire v21 Docs',
  meta: [
    {
      name: 'description',
      content: 'Generative AI with Google Gemini 2.0 models, streaming completions, and multimodal reasoning in AngularFire v21.',
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
  selector: 'app-ai-page',
  imports: [DocsLayoutComponent, MarkdownComponent],
  template: `
    @if (doc(); as page) {
      <app-docs-layout
        [title]="page.attributes.title"
        [description]="page.attributes.description"
        badge="Vertex AI & Gemini"
        [toc]="page.toc ?? []"
        [prev]="{ label: 'App Check', route: '/app-check' }"
        [next]="{ label: 'Core Overview', route: '/' }"
      >
        <analog-markdown [content]="page.content" />
      </app-docs-layout>
    } @else {
      <app-docs-layout [loading]="true" />
    }
  `,
})
export default class AiPage {
  readonly doc = toSignal(injectContent<DocAttributes>({ customFilename: 'docs/ai' }));
}
