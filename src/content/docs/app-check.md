---
title: "App Check"
description: "Protect your backend resources from abuse, billing spikes, and scraping using reCAPTCHA Enterprise and attestation providers."
category: "Operations & Security"
order: 11
---

## Introduction

**Firebase App Check** helps protect your backend resources (Firestore, Realtime Database, Cloud Storage, and Cloud Functions) from abuse such as billing fraud, credential stuffing, scraping, and unauthorized API traffic.

It ensures that requests originating from your application arrive only from legitimate clients verified by **reCAPTCHA Enterprise** (on the web) or device attestation providers (Play Integrity on Android, App Attest on Apple).

> **Key Capabilities**:
> - Web verification via Google reCAPTCHA v3 or reCAPTCHA Enterprise
> - Automatic token injection for all outgoing Firebase SDK requests
> - Custom token refresh management with `getToken()`
> - Debug token support for local development and CI testing

---

## App Check Request Flow

```
┌──────────────┐          1. Attest          ┌───────────────────────┐
│              │ ──────────────────────────> │                       │
│  Angular     │                             │  reCAPTCHA Enterprise │
│  Application │ <────────────────────────── │                       │
│              │       2. App Check Token    └───────────────────────┘
└──────────────┘
       │
       │ 3. API Request + Token Header
       ▼
┌────────────────────────────────────────────┐
│      Firebase Backend (Firestore, etc.)     │
│  ✓ Validates Token → Grants Access          │
└────────────────────────────────────────────┘
```

---

## Setup & Configuration

Add `provideAppCheck()` with a `ReCaptchaEnterpriseProvider` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  CustomProvider,
} from '@angular/fire/app-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideAppCheck(() => {
      // In development, configure debug token
      if (isDevMode()) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      return initializeAppCheck(undefined, {
        provider: new ReCaptchaEnterpriseProvider('YOUR_RECAPTCHA_SITE_KEY'),
        isTokenAutoRefreshEnabled: true,
      });
    }),
  ],
};
```

---

## Local Development with Debug Tokens

When developing on `localhost`:

1. Set `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;` before `initializeAppCheck()`.
2. Open the browser console to view the generated debug token:
   ```text
   Firebase App Check debug token: '9B7B8D62-7A77-4FE8-9999-XXXXXXXXXXXX'
   ```
3. Navigate to **Firebase Console > App Check > Apps > Manage Debug Tokens**.
4. Register the token string. Your local development requests will now pass App Check verification.

---

## Custom Backend Verification

If you have custom backend APIs that require App Check validation, read the token in your Angular app and attach it as a header:

```typescript
import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SecureApiService {
  private appCheck = inject(AppCheck);
  private http = inject(HttpClient);

  async callSecureEndpoint(): Promise<any> {
    // Obtain active App Check token
    const appCheckTokenResponse = await getToken(this.appCheck, false);
    const token = appCheckTokenResponse.token;

    const headers = new HttpHeaders({
      'X-Firebase-AppCheck': token,
    });

    return firstValueFrom(
      this.http.get('/api/v1/protected-data', { headers })
    );
  }
}
```

---

## Related Topics

- [Authentication](/auth)
- [Cloud Firestore](/firestore)
- [Cloud Functions](/functions)
