import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  exact?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Backdrop -->
    @if (isOpen()) {
      <div
        (click)="close.emit()"
        class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        aria-hidden="true"
      ></div>
    }

    <!-- Sidebar Aside -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950/95 lg:bg-slate-950/50 backdrop-blur-md border-r border-slate-800/80 p-5 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:z-0 lg:w-64 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:top-16"
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()"
    >
      <!-- Mobile Close Button -->
      <div class="flex items-center justify-between pb-4 lg:hidden border-b border-slate-800 mb-4">
        <span class="text-sm font-semibold text-slate-200">Documentation</span>
        <button
          type="button"
          (click)="close.emit()"
          class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Close menu"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Quick Version Pill -->
      <div class="mb-6 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-amber-300">AngularFire v21</span>
          <span class="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">Angular 22 Ready</span>
        </div>
        <p class="mt-1 text-[11px] text-slate-400">Signals-first Firebase SDK integration</p>
      </div>

      <!-- Nav Sections -->
      <nav class="space-y-6">
        @for (section of sections; track section.title) {
          <div>
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {{ section.title }}
            </h3>
            <ul class="space-y-1">
              @for (item of section.items; track item.route) {
                <li>
                  <a
                    [routerLink]="item.route"
                    routerLinkActive="border-amber-400 bg-amber-500/10 text-amber-300 font-semibold"
                    [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                    (click)="close.emit()"
                    class="group flex items-center justify-between rounded-r-md border-l-2 border-transparent px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-900/60 hover:text-slate-200"
                  >
                    <span>{{ item.label }}</span>
                    @if (item.badge) {
                      <span
                        class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        [class]="item.badgeColor ?? 'bg-slate-800 text-slate-300'"
                      >
                        {{ item.badge }}
                      </span>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>

      <!-- Bottom Resources Link -->
      <div class="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <p>Built for AngularFire & AnalogJS</p>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();

  readonly sections: NavSection[] = [
    {
      title: 'Getting Started',
      items: [
        { label: 'Core Overview', route: '/', exact: true, badge: 'v21', badgeColor: 'bg-amber-500/20 text-amber-300' },
      ],
    },
    {
      title: 'Auth & Data',
      items: [
        { label: 'Authentication', route: '/auth' },
        { label: 'Cloud Firestore', route: '/firestore' },
        { label: 'Realtime Database', route: '/database' },
        { label: 'Cloud Storage', route: '/storage' },
      ],
    },
    {
      title: 'Compute & Messaging',
      items: [
        { label: 'Cloud Functions', route: '/functions' },
        { label: 'Cloud Messaging', route: '/messaging' },
      ],
    },
    {
      title: 'Operations & Security',
      items: [
        { label: 'Analytics', route: '/analytics' },
        { label: 'Performance', route: '/performance' },
        { label: 'Remote Config', route: '/remote-config' },
        { label: 'App Check', route: '/app-check' },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { label: 'Vertex AI & Genkit', route: '/ai', badge: 'NEW', badgeColor: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold' },
      ],
    },
  ];
}
