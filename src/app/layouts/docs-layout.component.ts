import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TocComponent, TocItem } from '../components/toc.component';

export interface PageLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-docs-layout',
  imports: [RouterLink, HeaderComponent, SidebarComponent, TocComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <!-- Sticky Header -->
      <app-header (menuToggle)="toggleMobileMenu()" />

      <!-- Main Layout Container -->
      <div class="mx-auto w-full max-w-7xl flex-1 flex">
        <!-- Sidebar Navigation -->
        <app-sidebar
          [isOpen]="isMobileMenuOpen()"
          (close)="closeMobileMenu()"
        />

        <!-- Main Content Area -->
        <main class="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
          @if (loading()) {
            <header aria-hidden="true" class="mb-8 animate-pulse border-b border-slate-800 pb-6">
              <div class="mb-4 h-5 w-28 rounded-full bg-slate-800"></div>
              <div class="h-10 max-w-lg rounded bg-slate-800"></div>
              <div class="mt-4 h-5 max-w-3xl rounded bg-slate-800/70"></div>
            </header>
          }

          <!-- Page Header (if title exists) -->
          @if (!loading() && title()) {
            <header class="mb-8 border-b border-slate-800 pb-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-mono font-medium text-amber-300">
                  {{ badge() }}
                </span>
              </div>
              <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                {{ title() }}
              </h1>
              @if (description()) {
                <p class="mt-3 text-lg text-slate-400 max-w-3xl leading-relaxed">
                  {{ description() }}
                </p>
              }
            </header>
          }

          <!-- Transcluded Content (Markdown or custom) -->
          <article class="prose max-w-none">
            @if (loading()) {
              <div role="status" class="animate-pulse space-y-5" aria-label="Loading documentation page">
                <span class="sr-only">Loading documentation page</span>
                <div class="h-5 max-w-3xl rounded bg-slate-800/80"></div>
                <div class="h-5 max-w-2xl rounded bg-slate-800/70"></div>
                <div class="h-32 rounded-xl border border-slate-800 bg-slate-900/70"></div>
                <div class="h-5 max-w-3xl rounded bg-slate-800/70"></div>
                <div class="h-5 max-w-xl rounded bg-slate-800/60"></div>
              </div>
            } @else {
              <ng-content />
            }
          </article>

          <!-- Prev / Next Navigation -->
          @if (prev() || next()) {
            <div class="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
              @if (prev()) {
                <a
                  [routerLink]="prev()!.route"
                  class="group flex flex-col items-start rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition hover:border-amber-500/50 hover:bg-slate-900"
                >
                  <span class="text-xs font-medium text-slate-500 group-hover:text-amber-400 flex items-center gap-1">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                  <span class="mt-1 text-sm font-semibold text-slate-200 group-hover:text-white">
                    {{ prev()!.label }}
                  </span>
                </a>
              } @else {
                <div></div>
              }

              @if (next()) {
                <a
                  [routerLink]="next()!.route"
                  class="group flex flex-col items-end rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition hover:border-amber-500/50 hover:bg-slate-900"
                >
                  <span class="text-xs font-medium text-slate-500 group-hover:text-amber-400 flex items-center gap-1">
                    Next
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span class="mt-1 text-sm font-semibold text-slate-200 group-hover:text-white">
                    {{ next()!.label }}
                  </span>
                </a>
              }
            </div>
          }

          <!-- Footer -->
          <footer class="mt-16 border-t border-slate-800/80 pt-8 pb-12 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              AngularFire v21 Documentation • Built with
              <a href="https://analogjs.org" target="_blank" rel="noopener" class="text-slate-400 hover:text-amber-300">AnalogJS</a>
              &
              <a href="https://angular.dev" target="_blank" rel="noopener" class="text-slate-400 hover:text-amber-300">Angular v22</a>.
            </p>
            <div class="flex items-center gap-4 text-xs">
              <a href="https://github.com/KingDarBoja/angularfire-docs" target="_blank" rel="noopener" class="hover:text-slate-300 transition">
                GitHub Repository
              </a>
              <span>•</span>
              <a href="https://firebase.google.com" target="_blank" rel="noopener" class="hover:text-slate-300 transition">
                Firebase
              </a>
            </div>
          </footer>
        </main>

        <!-- Right Side Table of Contents (Desktop only) -->
        <aside class="hidden xl:block w-64 shrink-0 py-8 pr-4">
          <div class="sticky top-24">
            <app-toc [items]="toc()" />
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class DocsLayoutComponent {
  readonly isMobileMenuOpen = signal<boolean>(false);

  readonly loading = input(false);
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly badge = input<string>('v21 Guide');
  readonly toc = input<TocItem[]>([]);
  readonly prev = input<PageLink | null>(null);
  readonly next = input<PageLink | null>(null);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
