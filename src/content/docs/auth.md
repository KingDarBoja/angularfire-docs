---
title: "Authentication"
description: "Robust identity management, social logins, multi-factor authentication, and signal-based reactive auth states."
category: "Auth & Data"
order: 2
---

## Introduction

**AngularFire Auth** connects Angular applications with the **Firebase Authentication** service. It provides reactive wrappers around user authentication state changes, ID token refreshes, and multi-provider sign-ins, allowing you to secure routes and bind user profiles directly to Angular Signals.

> **Key Capabilities**:
> - Reactive `user()` and `authState()` observables easily convertible to Signals via `toSignal()`
> - Email/password, passwordless email links, and OAuth providers (Google, GitHub, Apple, Microsoft)
> - Functional `canActivate` route guards with built-in redirect pipelines
> - Automatic token refresh and custom claims support for role-based authorization

---

## Authentication Architecture

AngularFire coordinates authentication state between Firebase's client SDK, browser persistence (indexedDB/localStorage), and Angular's reactivity graph:

```
┌────────────────────────────────────────────────────────┐
│                   Firebase Auth SDK                    │
├──────────────────────────┬─────────────────────────────┤
│   Credentials / OAuth    │  Google, GitHub, Apple, PW │
├──────────────────────────┼─────────────────────────────┤
│   State Dispatcher       │  authState() / user()       │
├──────────────────────────┼─────────────────────────────┤
│   AngularFire Bridge     │  toSignal(authState(auth))  │
├──────────────────────────┼─────────────────────────────┤
│   Application Layer      │  Signals, Guards, Templates │
└──────────────────────────┴─────────────────────────────┘
```

---

## Setup & Configuration

To enable Authentication in your application, add `provideAuth()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideAuth(() => getAuth()),
  ],
};
```

---

## Supported Identity Providers

AngularFire supports all standard Firebase Authentication providers:

| Provider | Method | Best For |
| :--- | :--- | :--- |
| **Google** | `GoogleAuthProvider` | One-click login on Android, Chrome, and Web |
| **Email & Password** | `signInWithEmailAndPassword` | Traditional credential-based user accounts |
| **Email Link** | `sendSignInLinkToEmail` | Passwordless sign-in with magic links |
| **GitHub / Gitlab** | `GithubAuthProvider` | Developer-focused platforms and tools |
| **Apple** | `OAuthProvider('apple.com')` | Required for iOS App Store compliance |
| **Anonymous** | `signInAnonymously` | Guest checkouts and frictionless onboarding |

---

## Signal-Based Auth Service

Creating a centralized authentication service using Angular Signals gives your entire application instant, reactive access to the current user state without subscribing in templates.

```typescript
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  User,
  authState,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  // Core reactive signal: holds current User or null
  readonly currentUser = toSignal<User | null>(authState(this.auth), {
    initialValue: null,
  });

  // Computed signals for common UI states
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly userEmail = computed(() => this.currentUser()?.email ?? '');
  readonly displayName = computed(() => this.currentUser()?.displayName ?? 'Anonymous');
  readonly photoUrl = computed(() => this.currentUser()?.photoURL ?? '');

  // Sign in with Google Popup
  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const credential = await signInWithPopup(this.auth, provider);
    return credential.user;
  }

  // Sign in with Email and Password
  async loginWithEmail(email: string, pass: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, pass);
    return credential.user;
  }

  // Register with Email and Password
  async registerWithEmail(email: string, pass: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    return credential.user;
  }

  // Sign out
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
```

---

## Consuming in Components

With the `AuthService` implemented, your component templates can leverage the new control flow syntax (`@if`, `@else`) directly with Angular Signals:

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile-card">
      @if (auth.isLoggedIn()) {
        <div class="user-info">
          @if (auth.photoUrl()) {
            <img [src]="auth.photoUrl()" alt="Avatar" class="avatar" />
          }
          <h3>{{ auth.displayName() }}</h3>
          <p>{{ auth.userEmail() }}</p>
          <button (click)="auth.logout()">Sign Out</button>
        </div>
      } @else {
        <div class="sign-in-prompt">
          <p>Please sign in to access your dashboard.</p>
          <button (click)="auth.loginWithGoogle()">Sign in with Google</button>
        </div>
      }
    </div>
  `,
})
export class UserProfileComponent {
  readonly auth = inject(AuthService);
}
```

---

## Route Protection & Functional Guards

Protect your routes using modern Angular functional router guards combined with AngularFire's `AuthPipe` generators.

### Method 1: Using AngularFire `AuthGuard`

AngularFire provides an out-of-the-box `AuthGuard` along with helper pipes for redirection:

```typescript
import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/dashboard']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login.component'),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component'),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];
```

### Method 2: Custom Functional Guard with Signals

You can also construct a lightweight functional guard utilizing `inject(Auth)` and `inject(Router)`:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
```

---

## Role-Based Authorization & Custom Claims

To restrict content based on user roles (e.g. admin, editor), read Firebase Custom Claims using `idTokenResult`:

```typescript
import { inject, Injectable } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private auth = inject(Auth);

  readonly claims = toSignal(
    idToken(this.auth).pipe(
      map(async (token) => {
        if (!token || !this.auth.currentUser) return null;
        const result = await this.auth.currentUser.getIdTokenResult();
        return result.claims;
      })
    )
  );
}
```

---

## SSR & Hydration Considerations

When rendering pages on the server with AnalogJS or Angular SSR:

1. **Client-only Auth Operations**: Authentication state typically initializes on the browser client. Use `isPlatformBrowser(this.platformId)` when calling methods like `signInWithPopup` or checking browser cookies.
2. **Session Cookies for SSR**: For full SSR authentication where the server renders personalized content, pass Firebase session cookies in incoming requests and verify them using the Firebase Admin SDK within an Analog server route (`src/server/routes/api/auth.ts`).

---

## Related Topics

- [Core Overview & Setup](/)
- [Cloud Firestore](/firestore)
- [Security with App Check](/app-check)
