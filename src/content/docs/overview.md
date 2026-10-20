---
title: "AngularFire v21 Overview"
description: "Signals-first, tree-shakable Firebase SDK integration designed for modern Angular and AnalogJS applications."
category: "Getting Started"
order: 1
---

## Introduction

**AngularFire** is the official library that connects Firebase with Angular. In **v21**, AngularFire embraces modern Angular primitives: standalone APIs, Angular Signals, Zoneless change detection, and robust Server-Side Rendering (SSR) compatibility with meta-frameworks like **AnalogJS**.

Whether you are building real-time collaborative apps, secure enterprise applications, or AI-augmented user experiences, AngularFire provides idiomatic Angular bindings over the modular Firebase Web SDK (v11+).

> **What's New in v21**:
> - Native support for Angular Signals across all reactive streams
> - First-class integration with Vertex AI in Firebase and Google Gemini models
> - Streamlined SSR hydration with `@analogjs/platform`
> - Zero NgModule dependencies — 100% standalone and tree-shakable

---

## Quick Installation

Add AngularFire to your Angular or AnalogJS application using your favorite package manager:

```bash
# Using npm
npm install @angular/fire firebase

# Using pnpm
pnpm add @angular/fire firebase

# Using Angular CLI schematic
ng add @angular/fire
```

---

## Core Architecture

AngularFire v21 is organized around modular provider functions (`provide*`) registered in your application configuration (`app.config.ts`). Each module provides access to the corresponding modular Firebase SDK instance via standard Angular Dependency Injection.

```
┌────────────────────────────────────────────────────────┐
│                   AngularFire v21                      │
├──────────────────────────┬─────────────────────────────┤
│   Reactivity Layer       │  Angular Signals + RxJS     │
├──────────────────────────┼─────────────────────────────┤
│   Dependency Injection   │  provideFirebaseApp() & DI  │
├──────────────────────────┼─────────────────────────────┤
│   Rendering Support      │  Client, SSR & Hydration   │
├──────────────────────────┼─────────────────────────────┤
│   Underlying SDK         │  Modular Firebase v11+      │
└──────────────────────────┴─────────────────────────────┘
```

### Initializing Firebase in `app.config.ts`

Configure the core Firebase app and the services you need inside your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-YOUR-API-KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Initialize the primary Firebase app instance
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    
    // Feature providers
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
```

---

## Signals-First Reactivity

AngularFire v21 pairs seamlessly with Angular Signals. You can directly bridge reactive streams using Angular's `toSignal()` utility to bind real-time Firebase state directly into your component templates without manual subscription management:

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState, user } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

interface Project {
  id: string;
  title: string;
  stars: number;
}

@Component({
  selector: 'app-project-list',
  template: `
    <div class="projects-container">
      @if (currentUser(); as u) {
        <p>Welcome back, {{ u.displayName }}</p>
      }

      <ul>
        @for (project of projects(); track project.id) {
          <li>{{ project.title }} (★ {{ project.stars }})</li>
        } @empty {
          <li>No projects found.</li>
        }
      </ul>
    </div>
  `,
})
export class ProjectListComponent {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Convert Firebase Observables to fine-grained Angular Signals
  readonly currentUser = toSignal(user(this.auth));
  readonly projects = toSignal(
    collectionData(collection(this.firestore, 'projects'), { idField: 'id' }),
    { initialValue: [] as Project[] }
  );
}
```

---

## Local Development with Emulators

For fast local development and automated testing, configure the Firebase Local Emulator Suite. You can conditionally connect to emulators when running in development mode:

```typescript
import { isDevMode } from '@angular/core';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';

export const emulatorProviders = [
  provideAuth(() => {
    const auth = getAuth();
    if (isDevMode()) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    return auth;
  }),
  provideFirestore(() => {
    const firestore = getFirestore();
    if (isDevMode()) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
    return firestore;
  }),
];
```

---

## Module Overview

AngularFire provides comprehensive modules covering every capability of the Firebase platform:

| Module | Route | Primary Use Case |
| :--- | :--- | :--- |
| **Authentication** | `/auth` | Multi-provider sign-in, session tokens, reactive user signals |
| **Cloud Firestore** | `/firestore` | Real-time scalable NoSQL document database |
| **Realtime Database** | `/database` | Low-latency JSON data synchronization |
| **Cloud Storage** | `/storage` | Resumable file uploads, downloads, and progress signals |
| **Cloud Functions** | `/functions` | Type-safe serverless callable functions |
| **Cloud Messaging** | `/messaging` | Web push notifications and FCM token management |
| **Analytics** | `/analytics` | Event tracking, screen tracking, and user telemetry |
| **Performance** | `/performance` | Automatic page load traces and custom performance spans |
| **Remote Config** | `/remote-config` | Server-driven feature flags and parameter rollouts |
| **App Check** | `/app-check` | API protection with reCAPTCHA Enterprise and Attest |
| **Vertex AI** | `/ai` | Gemini 2.0 streaming completions and multimodal prompts |

---

## Next Steps

Explore the individual section guides to dive into detailed APIs and sample implementations:

- [Configure Authentication](/auth)
- [Query Cloud Firestore](/firestore)
- [Call Cloud Functions](/functions)
- [Integrate Vertex AI & Gemini](/ai)
