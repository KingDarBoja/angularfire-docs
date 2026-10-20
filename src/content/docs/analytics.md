---
title: "Analytics"
description: "User telemetry, screen tracking, custom event logging, and Google Analytics 4 integration in AngularFire v21."
category: "Operations & Security"
order: 8
---

## Introduction

**Google Analytics for Firebase** provides free, unlimited reporting on up to 500 distinct event types. In **AngularFire v21**, the analytics module includes automatic page view and screen tracking services designed to observe the Angular router seamlessly.

> **Key Capabilities**:
> - Automatic screen tracking via `ScreenTrackingService`
> - Automatic user ID and property synchronization via `UserTrackingService`
> - Custom event logging with `logEvent()`
> - DebugView support for real-time validation in the Firebase Console

---

## Setup & Configuration

Add `provideAnalytics()` alongside `ScreenTrackingService` and `UserTrackingService` in your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideAnalytics(() => getAnalytics()),
    // Automatically logs screen_view events on router navigation
    ScreenTrackingService,
    // Automatically sets user ID and properties when Auth user changes
    UserTrackingService,
  ],
};
```

---

## Custom Telemetry & Event Logging

Inject the `Analytics` instance to record business events and conversion funnels:

```typescript
import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent, setUserId, setUserProperties } from '@angular/fire/analytics';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private analytics = inject(Analytics);

  // E-commerce purchase event
  logPurchase(transactionId: string, value: number, currency = 'USD') {
    logEvent(this.analytics, 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }

  // Feature adoption tracking
  logFeatureUsed(featureName: string) {
    logEvent(this.analytics, 'feature_used', {
      feature: featureName,
      timestamp: Date.now(),
    });
  }

  // User demographic and tier tagging
  setUserProfile(userId: string, planTier: 'free' | 'pro' | 'enterprise') {
    setUserId(this.analytics, userId);
    setUserProperties(this.analytics, {
      account_tier: planTier,
    });
  }
}
```

---

## Standard Firebase Analytics Events

Firebase defines recommended events for common application flows:

| Event Name | Common Parameters | Description |
| :--- | :--- | :--- |
| `login` | `method` | Triggered when a user logs in (e.g. Google, email) |
| `sign_up` | `method` | Triggered when a new account is registered |
| `share` | `content_type`, `item_id` | Triggered when content is shared to social channels |
| `search` | `search_term` | Triggered when a user submits an in-app query |
| `select_content` | `content_type`, `item_id` | Triggered when an article or card is clicked |

---

## Related Topics

- [Performance Monitoring](/performance)
- [Remote Config](/remote-config)
- [Authentication](/auth)
