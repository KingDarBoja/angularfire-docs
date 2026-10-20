import { Component, input } from '@angular/core';

export interface TocItem {
  id: string;
  text: string;
  level?: number;
}

@Component({
  selector: 'app-toc',
  template: `
    <nav class="space-y-4 text-sm" aria-label="Table of contents">
      <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <svg class="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h7" />
        </svg>
        <span>{{ title() }}</span>
      </div>

      @if (items().length > 0) {
        <ul class="space-y-2 border-l border-slate-800 text-xs">
          @for (item of items(); track item.id) {
            <li [class.pl-5]="item.level === 3" [class.pl-3]="item.level !== 3">
              <a
                [href]="'#' + item.id"
                class="block truncate text-slate-400 transition hover:text-amber-300"
                [title]="item.text"
              >
                {{ item.text }}
              </a>
            </li>
          }
        </ul>
      } @else {
        <p class="text-xs text-slate-500 italic">No section headings</p>
      }

      <!-- Community / Helpful Links -->
      <div class="border-t border-slate-800/80 pt-4 space-y-2 text-xs">
        <span class="block font-semibold uppercase tracking-wider text-slate-400">Community</span>
        <a
          href="https://firebase.google.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Firebase Official Docs</span>
        </a>
        <a
          href="https://github.com/angular/angularfire"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>AngularFire Repo</span>
        </a>
      </div>
    </nav>
  `,
})
export class TocComponent {
  readonly title = input<string>('On this page');
  readonly items = input<TocItem[]>([]);
}
