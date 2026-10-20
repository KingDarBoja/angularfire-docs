---
title: "Performance Monitoring"
description: "Real-time user performance insights, automatic web vital traces, and custom latency metrics in AngularFire v21."
category: "Operations & Security"
order: 9
---

## Introduction

**Firebase Performance Monitoring** is a real-time service that helps you gain insight into the performance characteristics of your web applications. In **AngularFire v21**, the performance module automatically tracks page load traces, network requests, and provides fine-grained custom traces.

> **Key Capabilities**:
> - Automatic Core Web Vitals collection (LCP, FID, CLS, INP)
> - Automatic HTTP network request latency and payload size tracking
> - Custom performance traces with metrics and attributes
> - Real-time dashboards in the Firebase Console

---

## Setup & Configuration

Add `providePerformance()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getPerformance, providePerformance } from '@angular/fire/performance';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    providePerformance(() => getPerformance()),
  ],
};
```

---

## Custom Latency Traces

Measure complex client-side calculations, initial data hydration, or media rendering times:

```typescript
import { Injectable, inject } from '@angular/core';
import { Performance, trace } from '@angular/fire/performance';

@Injectable({ providedIn: 'root' })
export class BenchmarkService {
  private perf = inject(Performance);

  // Measure custom code execution
  async measureDataParsing(dataset: string): Promise<any[]> {
    const customTrace = trace(this.perf, 'parse_heavy_dataset');
    customTrace.start();

    try {
      customTrace.putAttribute('dataset_type', 'financial_records');
      const parsed = JSON.parse(dataset);
      customTrace.putMetric('record_count', parsed.length);
      return parsed;
    } finally {
      customTrace.stop();
    }
  }
}
```

---

## Core Web Vitals Captured Automatically

When enabled on the web, Firebase Performance automatically gathers:

| Metric | Target (Good) | Description |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Perceived load speed of the main visual content |
| **INP** (Interaction to Next Paint) | ≤ 200ms | Responsiveness to user interactions |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Visual stability of page elements during load |
| **FID** (First Input Delay) | ≤ 100ms | Input latency before main thread processes click |

---

## Related Topics

- [Analytics](/analytics)
- [Remote Config](/remote-config)
- [Cloud Functions](/functions)
