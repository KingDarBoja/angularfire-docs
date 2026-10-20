---
title: "Cloud Functions"
description: "Serverless backend execution with type-safe HTTPS callable functions and emulator support in AngularFire v21."
category: "Compute & Messaging"
order: 6
---

## Introduction

**Cloud Functions for Firebase** lets you run backend TypeScript/JavaScript code in response to events triggered by Firebase features and HTTPS requests. In **AngularFire v21**, the `httpsCallableData()` operator delivers end-to-end type safety and returns an Observable that converts directly to an **Angular Signal** or Promise.

> **Key Capabilities**:
> - End-to-end TypeScript request and response types
> - `httpsCallableData()` operator with automatic error handling
> - Automatic authentication token injection into requests
> - Seamless local debugging with the Firebase Functions emulator

---

## Setup & Configuration

Add `provideFunctions()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideFunctions(() => getFunctions(undefined, 'us-central1')), // specify region
  ],
};
```

---

## Type-Safe Callable Functions

Define strongly-typed request and response interfaces for your callable backend functions:

```typescript
import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallableData, httpsCallable } from '@angular/fire/functions';
import { firstValueFrom } from 'rxjs';

// Request & Response Contract
export interface StripeCheckoutRequest {
  planId: string;
  currency: string;
}

export interface StripeCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private functions = inject(Functions);

  // Observable-based caller
  createCheckoutSession(req: StripeCheckoutRequest) {
    const callable = httpsCallableData<StripeCheckoutRequest, StripeCheckoutResponse>(
      this.functions,
      'createCheckoutSession'
    );
    return callable(req);
  }

  // Promise-based caller with async/await
  async checkout(planId: string): Promise<string> {
    const callable = httpsCallable<StripeCheckoutRequest, StripeCheckoutResponse>(
      this.functions,
      'createCheckoutSession'
    );
    const result = await callable({ planId, currency: 'usd' });
    return result.data.checkoutUrl;
  }
}
```

---

## Invoking from Angular Components

Call backend functions and manage loading signals:

```typescript
import { Component, inject, signal } from '@angular/core';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-upgrade-button',
  template: `
    <button
      (click)="upgradeAccount('pro-annual')"
      [disabled]="isLoading()"
      class="btn-upgrade"
    >
      @if (isLoading()) {
        <span>Connecting to Stripe...</span>
      } @else {
        <span>Upgrade to Pro ($99/yr)</span>
      }
    </button>
  `,
})
export class UpgradeButtonComponent {
  private paymentService = inject(PaymentService);
  readonly isLoading = signal<boolean>(false);

  async upgradeAccount(planId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      const url = await this.paymentService.checkout(planId);
      window.location.href = url;
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

---

## Local Functions Emulator

Connect to your locally running emulator during development:

```typescript
import { isDevMode } from '@angular/core';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';

export const emulatorFunctionsProvider = provideFunctions(() => {
  const functions = getFunctions(undefined, 'us-central1');
  if (isDevMode()) {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
  return functions;
});
```

---

## Related Topics

- [Authentication](/auth)
- [Cloud Storage](/storage)
- [Vertex AI & Genkit](/ai)
