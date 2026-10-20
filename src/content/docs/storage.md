---
title: "Cloud Storage"
description: "Robust file uploads and downloads, resumable transfers, progress signals, and secure Google Cloud Storage integration."
category: "Auth & Data"
order: 5
---

## Introduction

**Cloud Storage for Firebase** is built for developers who need to store and serve user-generated content, such as photos, videos, and audio. In **AngularFire v21**, the storage module provides reactive helpers for monitoring upload progress via **Angular Signals**, generating download URLs, and configuring custom metadata.

> **Key Capabilities**:
> - Resumable uploads that survive network interruptions
> - `percentage()` progress signal tracking upload percentages in real-time
> - Direct download URL generation via `getDownloadURL()`
> - Custom metadata attachment and file access rules validation

---

## Setup & Configuration

Add `provideStorage()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    provideStorage(() => getStorage()),
  ],
};
```

---

## File Upload Component with Progress Signals

AngularFire provides the `percentage()` operator to transform an upload task into a reactive progress stream, easily converted into an Angular Signal:

```typescript
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Storage,
  ref,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
} from '@angular/fire/storage';
import { of } from 'rxjs';

@Component({
  selector: 'app-avatar-uploader',
  template: `
    <div class="uploader-container">
      <input type="file" (change)="onFileSelected($event)" accept="image/*" />

      @if (isUploading()) {
        <div class="progress-bar-wrapper">
          <div
            class="progress-fill"
            [style.width.%]="uploadProgress()?.progress ?? 0"
          ></div>
          <span>{{ uploadProgress()?.progress ?? 0 }}%</span>
        </div>
      }

      @if (downloadUrl(); as url) {
        <div class="preview">
          <p>Upload Complete!</p>
          <img [src]="url" alt="Uploaded file" class="avatar-preview" />
        </div>
      }
    </div>
  `,
})
export class AvatarUploaderComponent {
  private storage = inject(Storage);

  readonly isUploading = signal<boolean>(false);
  readonly downloadUrl = signal<string | null>(null);

  // Dynamic upload progress signal
  private uploadTask$ = signal(of({ progress: 0 }));
  readonly uploadProgress = toSignal(this.uploadTask$());

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const storageRef = ref(this.storage, `avatars/${Date.now()}_${file.name}`);

    this.isUploading.set(true);

    // Resumable upload task
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { uploadedBy: 'AngularFire-v21' },
    });

    // Track percentage stream
    percentage(task).subscribe({
      next: (pct) => {
        // Updated percentage value (0 to 100)
      },
      complete: async () => {
        this.isUploading.set(false);
        const url = await getDownloadURL(storageRef);
        this.downloadUrl.set(url);
      },
    });
  }
}
```

---

## File Operations & Metadata

Retrieve file metadata, update custom headers, or delete files:

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  getMetadata,
  updateMetadata,
  deleteObject,
  listAll,
} from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private storage = inject(Storage);

  // List all files in a folder
  async listFolder(path: string): Promise<string[]> {
    const folderRef = ref(this.storage, path);
    const result = await listAll(folderRef);
    return result.items.map((item) => item.fullPath);
  }

  // Update Cache-Control or Custom Metadata
  async setCacheControl(filePath: string, maxAgeSeconds: number): Promise<void> {
    const fileRef = ref(this.storage, filePath);
    await updateMetadata(fileRef, {
      cacheControl: `public, max-age=${maxAgeSeconds}`,
    });
  }

  // Delete file
  async deleteFile(filePath: string): Promise<void> {
    const fileRef = ref(this.storage, filePath);
    await deleteObject(fileRef);
  }
}
```

---

## Related Topics

- [Cloud Firestore](/firestore)
- [Cloud Functions](/functions)
- [App Check Security](/app-check)
