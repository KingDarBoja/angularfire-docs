---
title: "Cloud Firestore"
description: "Scalable NoSQL document database with real-time listeners, offline persistence, and first-class Angular Signals integration."
category: "Auth & Data"
order: 3
---

## Introduction

**Cloud Firestore** is Firebase's flexible, scalable NoSQL cloud database for client and server development. In **AngularFire v21**, Firestore operations are designed to integrate directly with **Angular Signals** and standalone dependency injection, enabling real-time document and collection synchronization with zero boilerplate.

> **Key Capabilities**:
>
> - Real-time snapshot streams via `collectionData()` and `docData()`
> - Direct conversion to Angular Signals via `toSignal()` with initial values
> - Automatic ID mapping with `{ idField: 'id' }`
> - Robust offline persistence with IndexedDB caching
> - Atomic transactions and batched writes
> - Enterprise pipeline operations via `@angular/fire/firestore/pipelines`

---

## Firestore Architecture in Angular

```
┌────────────────────────────────────────────────────────┐
│                   Cloud Firestore                      │
├──────────────────────────┬─────────────────────────────┤
│   Query Builder Layer    │  collection(), query(), where()│
├──────────────────────────┼─────────────────────────────┤
│   Pipeline Layer         │  pipeline(), field(), execute()│
├──────────────────────────┼─────────────────────────────┤
│   Observable Operators   │  collectionData(), docData()│
├──────────────────────────┼─────────────────────────────┤
│   Reactivity Bridge      │  toSignal(collectionData()) │
├──────────────────────────┼─────────────────────────────┤
│   UI Consumption         │  @for (item of items(); ...)│
└──────────────────────────┴─────────────────────────────┘
```

---

## Setup & Configuration

Add `provideFirestore()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideFirestore(() => getFirestore()),
  ],
};
```

---

## Reading Collections with Signals

`collectionData()` streams real-time updates from a collection or query. Wrapping it with `toSignal()` provides a synchronous signal API:

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  limit,
} from '@angular/fire/firestore';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

@Component({
  selector: 'app-task-list',
  template: `
    <div class="tasks-container">
      <h2>Active Tasks ({{ activeTasksCount() }})</h2>

      <ul>
        @for (task of tasks(); track task.id) {
          <li [class.completed]="task.completed">
            <span>{{ task.title }}</span>
            <span class="badge">{{ task.priority }}</span>
          </li>
        } @empty {
          <li class="empty-state">No pending tasks found.</li>
        }
      </ul>
    </div>
  `,
})
export class TaskListComponent {
  private firestore = inject(Firestore);

  // Define query: incomplete tasks ordered by creation date
  private tasksQuery = query(
    collection(this.firestore, 'tasks'),
    where('completed', '==', false),
    orderBy('createdAt', 'desc'),
    limit(25)
  );

  // Real-time signal with automatic document ID mapping
  readonly tasks = toSignal(
    collectionData(this.tasksQuery, { idField: 'id' }),
    { initialValue: [] as Task[] }
  );

  // Derived signal calculation
  readonly activeTasksCount = () => this.tasks().length;
}
```

---

## Reading Single Documents

Synchronize a single document with real-time updates using `docData()`:

```typescript
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, doc, docData } from '@angular/fire/firestore';

export interface UserProfile {
  username: string;
  bio: string;
  role: string;
}

@Component({
  selector: 'app-user-card',
  template: `
    @if (profile(); as p) {
      <div class="card">
        <h3>{{ p.username }}</h3>
        <p>{{ p.bio }}</p>
        <span class="role-badge">{{ p.role }}</span>
      </div>
    }
  `,
})
export class UserCardComponent {
  private firestore = inject(Firestore);
  readonly userId = input.required<string>();

  // Document reference and signal binding
  readonly profile = toSignal(
    docData(doc(this.firestore, `users/${this.userId()}`))
  );
}
```

---

## Pipeline Operations

Cloud Firestore Enterprise edition introduces **Pipeline queries**, enabling advanced multi-stage data processing, aggregation expressions, vector distance computations, sub-pipeline joins, and transformations directly on the database engine.

In AngularFire, pipeline operations are available via dedicated submodules for both the standard and lightweight Firestore SDKs:

```typescript
// Standard Firestore SDK
import { field, execute, greaterThan } from '@angular/fire/firestore/pipelines';

// Firestore Lite SDK
import { field as liteField, execute as liteExecute } from '@angular/fire/firestore/lite/pipelines';
```

Choose the `/lite/pipelines` entrypoint when using Firestore Lite. All exported functions and pipeline expressions are wrapped with Angular's zone management for seamless change detection.

### Building and Executing Pipelines

Inject `Firestore` (or `Firestore` from `@angular/fire/firestore/lite`), create a pipeline with `this.firestore.pipeline()`, configure your query stages, and pass the pipeline to `execute()`:

```typescript
import { Component, inject, signal } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { execute, field, greaterThan } from '@angular/fire/firestore/pipelines';

export interface Book {
  id: string;
  title: string;
  rating: number;
  author: string;
}

@Component({
  selector: 'app-books-pipeline',
  template: `
    <div class="pipeline-container">
      <h3>Top Rated Books</h3>
      <button (click)="loadTopBooks()" [disabled]="loading()">
        {{ loading() ? 'Executing Pipeline...' : 'Fetch Books' }}
      </button>

      <ul>
        @for (book of books(); track book.id) {
          <li>
            <strong>{{ book.title }}</strong> — ★ {{ book.rating }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class BooksPipelineComponent {
  private firestore = inject(Firestore);

  readonly books = signal<Book[]>([]);
  readonly loading = signal(false);

  async loadTopBooks(): Promise<void> {
    this.loading.set(true);
    try {
      // Pipelines support both Method Chaining and Functional approaches:

      // 1. Method Chaining:
      const chainedPipeline = this.firestore.pipeline()
        .collection('books')
        .where(field('rating').greaterThan(4.5));

      // 2. Functional Approach:
      const functionalPipeline = this.firestore.pipeline()
        .collection('books')
        .where(greaterThan(field('rating'), 4.5));

      // Execute the pipeline against Firestore Enterprise
      const results = await execute(functionalPipeline);
      this.books.set(results as Book[]);
    } finally {
      this.loading.set(false);
    }
  }
}
```

### Expression Styles: Method Chaining vs. Functional

Firestore Pipelines support two interchangeable expression paradigms:

- **Method Chaining**: Call comparison methods directly on field references:

  ```typescript
  const pipeline = this.firestore.pipeline()
    .collection('books')
    .where(field('rating').greaterThan(4.5));
  ```

- **Functional Approach**: Pass field references and operands to expression helpers:

  ```typescript
  const pipeline = this.firestore.pipeline()
    .collection('books')
    .where(greaterThan(field('rating'), 4.5));
  ```

### Advanced Operators and Capabilities

The `@angular/fire/firestore/pipelines` submodule exposes the full suite of Firestore Pipeline expressions:

- **Aggregations**: `count()`, `sum()`, `average()`, `minimum()`, `maximum()`, `arrayAgg()`
- **Array Operations**: `arrayFilter()`, `arraySlice()`, `arraySum()`, `arrayContains()`
- **Logic & Control Flow**: `and()`, `or()`, `not()`, `conditional()`, `coalesce()`, `ifNull()`, `switchOn()`
- **String & Math Functions**: `toUpper()`, `toLower()`, `stringConcat()`, `round()`, `abs()`
- **Vector & Distance**: `cosineDistance()`, `euclideanDistance()`, `dotProduct()`, `vectorLength()`
- **Joins & Sub-pipelines**: Perform relational joins between collections using `join()` and `subcollection()`

> **Firestore Enterprise Requirement**:
>
> - Pipelines require a Cloud Firestore **Enterprise edition** database. Standard edition databases are limited to Firestore Core query operations.
> - Learn more about [Firestore Editions Comparison](https://firebase.google.com/docs/firestore/compare-editions-for-native-mode).
> - Explore the official Firebase guides on [Getting Started with Pipelines](https://firebase.google.com/docs/firestore/pipelines/get-started-with-pipelines?hl=en) and [Performing Joins with Sub-Pipelines](https://firebase.google.com/docs/firestore/pipelines/perform-joins-with-sub-pipelines).

---

## Writing Data: CRUD Operations

Firestore provides modern async/await methods for document mutations:

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private firestore = inject(Firestore);
  private tasksCol = collection(this.firestore, 'tasks');

  // Create
  async createTask(title: string, priority: 'low' | 'medium' | 'high'): Promise<string> {
    const docRef = await addDoc(this.tasksCol, {
      title,
      priority,
      completed: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Update
  async toggleComplete(taskId: string, completed: boolean): Promise<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    await updateDoc(taskDoc, { completed });
  }

  // Delete
  async deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    await deleteDoc(taskDoc);
  }
}
```

---

## Atomic Batches and Transactions

When modifying multiple documents that require all-or-nothing guarantees:

```typescript
import { inject, Injectable } from '@angular/core';
import { Firestore, writeBatch, doc, runTransaction } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private firestore = inject(Firestore);

  // Batched Write
  async archiveTasks(taskIds: string[]): Promise<void> {
    const batch = writeBatch(this.firestore);

    for (const id of taskIds) {
      const taskRef = doc(this.firestore, `tasks/${id}`);
      batch.update(taskRef, { archived: true });
    }

    await batch.commit();
  }

  // Transaction with read-then-write consistency
  async reserveTicket(eventId: string, userId: string): Promise<boolean> {
    return runTransaction(this.firestore, async (transaction) => {
      const eventRef = doc(this.firestore, `events/${eventId}`);
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists()) {
        throw new Error("Event does not exist");
      }

      const available = eventSnap.data()['availableTickets'];
      if (available <= 0) {
        return false;
      }

      transaction.update(eventRef, { availableTickets: available - 1 });
      const bookingRef = doc(collection(this.firestore, `events/${eventId}/bookings`));
      transaction.set(bookingRef, { userId, bookedAt: Date.now() });

      return true;
    });
  }
}
```

---

## Offline Persistence

Enable local persistence so queries work seamlessly while offline:

```typescript
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from '@angular/fire/firestore';
import { initializeApp, getApp } from '@angular/fire/app';

export const offlineFirestoreProvider = provideFirestore(() => {
  return initializeFirestore(getApp(), {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
});
```

---

## Related Topics

- [Authentication](/auth)
- [Realtime Database](/database)
- [App Check Security](/app-check)
