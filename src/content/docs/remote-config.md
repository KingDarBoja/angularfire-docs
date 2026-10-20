---
title: "Remote Config"
description: "Server-driven feature flags, dynamic configuration, and real-time parameter rollouts with Angular Signals."
category: "Operations & Security"
order: 10
---

## Introduction

**Firebase Remote Config** enables you to change the behavior and appearance of your application without publishing an app update. In **AngularFire v21**, Remote Config parameters can be read via typed getters or bound to **Angular Signals** for reactive feature flag toggling.

> **Key Capabilities**:
> - Dynamic feature toggling without redeploying code
> - In-app default values for offline and cold-start fallback
> - Real-time config updates via `addOnConfigUpdateListener()`
> - Percentage-based rollouts and user segment targeting

---

## Setup & Configuration

Add `provideRemoteConfig()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideRemoteConfig(() => {
      const remoteConfig = getRemoteConfig();
      // In dev mode, fetch immediately without caching
      remoteConfig.settings.minimumFetchIntervalMillis = isDevMode() ? 0 : 3600000;
      return remoteConfig;
    }),
  ],
};
```

---

## Signal-Based Feature Flag Service

Create a feature flag service that encapsulates config values into readable Angular Signals:

```typescript
import { Injectable, inject, signal } from '@angular/core';
import {
  RemoteConfig,
  fetchAndActivate,
  getValue,
  getBoolean,
  getString,
  getNumber,
  addOnConfigUpdateListener,
} from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private remoteConfig = inject(RemoteConfig);

  // Reactive signals for flags
  readonly isNewDashboardEnabled = signal<boolean>(false);
  readonly promoBannerText = signal<string>('Welcome to AngularFire v21!');
  readonly maxUploadSizeMb = signal<number>(50);

  constructor() {
    this.initFlags();
  }

  private async initFlags(): Promise<void> {
    // 1. Set local defaults
    this.remoteConfig.defaultConfig = {
      enable_new_dashboard: false,
      promo_banner_text: 'Welcome to AngularFire v21!',
      max_upload_size_mb: 50,
    };

    // 2. Fetch and activate remote parameters
    await fetchAndActivate(this.remoteConfig);
    this.syncSignals();

    // 3. Real-time updates listener
    addOnConfigUpdateListener(this.remoteConfig, {
      onUpdate: async () => {
        await fetchAndActivate(this.remoteConfig);
        this.syncSignals();
      },
      onError: (err) => console.error('Remote config update error', err),
    });
  }

  private syncSignals(): void {
    this.isNewDashboardEnabled.set(
      getBoolean(this.remoteConfig, 'enable_new_dashboard')
    );
    this.promoBannerText.set(
      getString(this.remoteConfig, 'promo_banner_text')
    );
    this.maxUploadSizeMb.set(
      getNumber(this.remoteConfig, 'max_upload_size_mb')
    );
  }
}
```

---

## Conditional Template Rendering

Use the feature flag signals with Angular's built-in `@if` control flow:

```typescript
import { Component, inject } from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';

@Component({
  selector: 'app-dashboard',
  template: `
    @if (flags.isNewDashboardEnabled()) {
      <div class="modern-dashboard">
        <h2>⚡ Modern Dashboard (v2)</h2>
        <p>{{ flags.promoBannerText() }}</p>
      </div>
    } @else {
      <div class="legacy-dashboard">
        <h2>Classic Dashboard (v1)</h2>
      </div>
    }
  `,
})
export class DashboardComponent {
  readonly flags = inject(FeatureFlagService);
}
```

---

## Related Topics

- [Analytics](/analytics)
- [Performance Monitoring](/performance)
- [App Check Security](/app-check)
