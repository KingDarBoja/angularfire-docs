import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="menuToggle.emit()"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a routerLink="/" class="group flex items-center gap-2.5 transition">
            <!-- Firebase Flame Icon -->
            <div class="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-md shadow-orange-500/20">
              <svg class="h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.68 18.06L8.43 2.68c.11-.47.69-.62.99-.25l3.29 4.12 2.3-4.32c.22-.41.79-.44 1.04-.06l5.77 15.89c.28.77-.28 1.58-1.1 1.58H5.78c-.82 0-1.38-.81-1.1-1.58z" />
              </svg>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                AngularFire
              </span>
              <span class="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-300">
                v21
              </span>
            </div>
          </a>
        </div>

        <!-- Desktop Quick Navigation -->
        <nav class="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <a
            routerLink="/"
            routerLinkActive="text-amber-400 bg-amber-500/10"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Overview
          </a>
          <a
            routerLink="/auth"
            routerLinkActive="text-amber-400 bg-amber-500/10"
            class="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Auth
          </a>
          <a
            routerLink="/firestore"
            routerLinkActive="text-amber-400 bg-amber-500/10"
            class="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Firestore
          </a>
          <a
            routerLink="/functions"
            routerLinkActive="text-amber-400 bg-amber-500/10"
            class="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Functions
          </a>
          <a
            routerLink="/ai"
            routerLinkActive="text-amber-400 bg-amber-500/10"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <span>Vertex AI</span>
            <span class="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.2 text-[9px] font-bold text-slate-950 uppercase tracking-wider">
              NEW
            </span>
          </a>
        </nav>

        <!-- Right Side Links -->
        <div class="flex items-center gap-2.5">
          <a
            href="https://analogjs.org"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-400 hover:border-slate-700 hover:text-slate-200 transition"
          >
            <span>Powered by</span>
            <span class="font-semibold text-red-400">AnalogJS</span>
          </a>

          <a
            href="https://github.com/KingDarBoja/angularfire-docs"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition"
            aria-label="GitHub Repository"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly menuToggle = output<void>();
}
