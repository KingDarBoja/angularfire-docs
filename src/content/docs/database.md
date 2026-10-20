---
title: "Realtime Database"
description: "Blazing-fast JSON document sync with low-latency WebSocket connections and Angular Signals."
category: "Auth & Data"
order: 4
---

## Introduction

The **Firebase Realtime Database** is a cloud-hosted NoSQL database where data is stored as JSON and synchronized in real-time to every connected client. In **AngularFire v21**, the Realtime Database provides dedicated reactive primitives like `listVal()` and `objectVal()` that bridge easily to **Angular Signals**.

> **Key Capabilities**:
> - Millisecond latency real-time updates over persistent WebSockets
> - `listVal()` and `objectVal()` reactive streams with optional key mapping
> - Presence detection (`.info/connected`) for tracking online/offline status
> - Atomic transactions for incrementing counters and financial balances

---

## Setup & Configuration

Add `provideDatabase()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideDatabase(() => getDatabase()),
  ],
};
```

---

## Synchronizing Objects with Signals

Use `objectVal()` to subscribe to a specific path in your JSON tree and expose it as a reactive signal:

```typescript
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Database, ref, objectVal } from '@angular/fire/database';

interface RoomSettings {
  name: string;
  maxUsers: number;
  isOpen: boolean;
}

@Component({
  selector: 'app-room-header',
  template: `
    @if (settings(); as s) {
      <div class="room-header">
        <h2>{{ s.name }}</h2>
        <span [class.open]="s.isOpen">
          {{ s.isOpen ? 'Open Room' : 'Locked' }}
        </span>
      </div>
    }
  `,
})
export class RoomHeaderComponent {
  private db = inject(Database);
  readonly roomId = input.required<string>();

  // Real-time object signal
  readonly settings = toSignal(
    objectVal<RoomSettings>(ref(this.db, `rooms/${this.roomId()}/settings`))
  );
}
```

---

## Synchronizing Lists with Signals

Use `listVal()` to stream an array of children under a database reference with automatic key preservation:

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Database, ref, listVal, query, limitToLast, orderByChild } from '@angular/fire/database';

interface ChatMessage {
  key: string;
  sender: string;
  text: string;
  timestamp: number;
}

@Component({
  selector: 'app-chat-feed',
  template: `
    <div class="chat-container">
      <div class="messages">
        @for (msg of messages(); track msg.key) {
          <div class="message">
            <strong>{{ msg.sender }}:</strong>
            <span>{{ msg.text }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class ChatFeedComponent {
  private db = inject(Database);

  // Query: last 50 messages ordered by timestamp
  private chatQuery = query(
    ref(this.db, 'messages'),
    orderByChild('timestamp'),
    limitToLast(50)
  );

  // Real-time list signal with { keyField: 'key' }
  readonly messages = toSignal(
    listVal<ChatMessage>(this.chatQuery, { keyField: 'key' }),
    { initialValue: [] }
  );
}
```

---

## Writing Data & Transactions

Mutate the JSON tree using `set()`, `update()`, `push()`, and `runTransaction()`:

```typescript
import { Injectable, inject } from '@angular/core';
import { Database, ref, push, set, update, remove, runTransaction } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private db = inject(Database);

  // Append new item to list
  async sendMessage(sender: string, text: string): Promise<void> {
    const messagesRef = ref(this.db, 'messages');
    const newMsgRef = push(messagesRef);
    await set(newMsgRef, {
      sender,
      text,
      timestamp: Date.now(),
    });
  }

  // Atomic counter increment
  async upvotePost(postId: string): Promise<void> {
    const postVotesRef = ref(this.db, `posts/${postId}/votes`);
    await runTransaction(postVotesRef, (currentVotes) => {
      return (currentVotes || 0) + 1;
    });
  }
}
```

---

## Presence Tracking (`.info/connected`)

Detect whether a client is currently connected or offline:

```typescript
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Database, ref, objectVal, onDisconnect, set } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private db = inject(Database);

  // Boolean signal indicating active connection
  readonly isConnected = toSignal(
    objectVal<boolean>(ref(this.db, '.info/connected')),
    { initialValue: false }
  );

  setupUserPresence(userId: string) {
    const userStatusRef = ref(this.db, `status/${userId}`);

    // Set offline payload on disconnect
    onDisconnect(userStatusRef).set({ state: 'offline', lastChanged: Date.now() });

    // Set online
    set(userStatusRef, { state: 'online', lastChanged: Date.now() });
  }
}
```

---

## Related Topics

- [Cloud Firestore](/firestore)
- [Cloud Storage](/storage)
- [Authentication](/auth)
