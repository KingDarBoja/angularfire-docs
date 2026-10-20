---
title: "Cloud Firestore"
description: "Scalable NoSQL document database with real-time listeners, offline persistence, and first-class Angular Signals integration."
category: "Auth & Data"
order: 3
---

## Introduction

**Cloud Firestore** is Firebase's flexible, scalable NoSQL cloud database for client and server development. In **AngularFire v21**, Firestore operations are designed to integrate directly with **Angular Signals** and standalone dependency injection, enabling real-time document and collection synchronization with zero boilerplate.

> **Key Capabilities**:
> - Real-time snapshot streams via `collectionData()` and `docData()`
> - Direct conversion to Angular Signals via `toSignal()` with initial values
> - Automatic ID mapping with `{ idField: 'id' }`
> - Robust offline persistence with IndexedDB caching
> - Atomic transactions and batched writes

---

## Firestore Architecture in Angular

```
┌────────────────────────────────────────────────────────┐
│                   Cloud Firestore                      │
├──────────────────────────┬─────────────────────────────┤
│   Query Builder Layer    │  collection(), query(), where()│
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
