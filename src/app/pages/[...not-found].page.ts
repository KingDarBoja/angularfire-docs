import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsLayoutComponent } from '../layouts/docs-layout.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, DocsLayoutComponent],
  template: `
    <app-docs-layout
      title="Page Not Found"
      description="The page you are looking for does not exist or is currently being documented."
      badge="404"
    >
      <div class="py-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-slate-400 mb-6 max-w-md mx-auto">
          We couldn't find this page. It might be under construction or the link may have moved.
        </p>
        <a
          routerLink="/"
          class="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          <span>Back to Overview</span>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </app-docs-layout>
  `,
})
export default class NotFoundPage {}
