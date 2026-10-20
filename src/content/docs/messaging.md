---
title: "Cloud Messaging"
description: "Cross-platform push notifications and real-time message delivery via Firebase Cloud Messaging (FCM)."
category: "Compute & Messaging"
order: 7
---

## Introduction

**Firebase Cloud Messaging (FCM)** provides a reliable and battery-efficient connection between your server and devices that allows you to deliver and receive messages and notifications on iOS, Android, and the web at no cost.

In **AngularFire v21**, the messaging module provides clean APIs for requesting notification permissions, retrieving registration tokens, and listening to foreground push messages.

> **Key Capabilities**:
> - Browser notification permission request management
> - FCM registration token retrieval with VAPID key support
> - Reactive foreground message stream via `onMessage()`
> - Service Worker background notification handling

---

## Setup & Configuration

Add `provideMessaging()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideMessaging(() => getMessaging()),
  ],
};
```

---

## Service Worker Configuration

Create `public/firebase-messaging-sw.js` to handle background push notifications when your Angular app tab is closed:

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

---

## FCM Notification Service with Signals

Create an Angular service to manage permissions, tokens, and incoming messages:

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { Messaging, getToken, onMessage, MessagePayload } from '@angular/fire/messaging';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging = inject(Messaging);

  readonly fcmToken = signal<string | null>(null);
  readonly currentMessage = signal<MessagePayload | null>(null);
  readonly permissionStatus = signal<NotificationPermission>('default');

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionStatus.set(Notification.permission);
      this.listenToMessages();
    }
  }

  // Request browser permission and obtain device token
  async requestPermission(vapidKey: string): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      this.permissionStatus.set(permission);

      if (permission === 'granted') {
        const token = await getToken(this.messaging, { vapidKey });
        this.fcmToken.set(token);
        return token;
      }
      return null;
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
      return null;
    }
  }

  // Listen to foreground notifications
  private listenToMessages(): void {
    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      this.currentMessage.set(payload);
    });
  }
}
```

---

## Displaying Notifications in Components

```typescript
import { Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-banner',
  template: `
    <!-- Permission Request Prompt -->
    @if (notifications.permissionStatus() === 'default') {
      <div class="permission-banner">
        <p>Enable push notifications to receive real-time updates.</p>
        <button (click)="enableNotifications()">Enable</button>
      </div>
    }

    <!-- In-App Notification Toast -->
    @if (notifications.currentMessage(); as msg) {
      <div class="toast">
        <h4>{{ msg.notification?.title }}</h4>
        <p>{{ msg.notification?.body }}</p>
      </div>
    }
  `,
})
export class NotificationBannerComponent {
  readonly notifications = inject(NotificationService);

  enableNotifications() {
    this.notifications.requestPermission('YOUR_PUBLIC_VAPID_KEY');
  }
}
```

---

## Related Topics

- [Cloud Functions](/functions)
- [Analytics](/analytics)
- [Authentication](/auth)
