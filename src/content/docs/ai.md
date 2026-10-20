---
title: "Vertex AI & Genkit"
description: "Build generative AI features into Angular using Google Gemini 2.0 models, streaming responses, and multimodal reasoning."
category: "Intelligence"
order: 12
---

## Introduction

**Vertex AI in Firebase** allows developers to directly call the **Google Gemini** family of foundational models from Angular applications. Protected by Firebase App Check and integrated with your Firebase project, Vertex AI makes it safe and straightforward to generate text, stream completions, analyze images, and build conversational AI interfaces without managing bespoke backend proxy servers.

> **Key Capabilities**:
> - Direct client-side calls to Gemini 2.0 Flash and Pro models
> - Real-time streaming completions with `generateContentStream()`
> - Multimodal support (text, images, PDFs, audio)
> - Seamless security integration with Firebase App Check
> - System instructions, temperature control, and safety settings

---

## Gemini Inference Architecture

```
┌────────────────────────────────────────────────────────┐
│                   AngularFire AI                       │
├──────────────────────────┬─────────────────────────────┤
│   Model Selection        │  Gemini 2.0 Flash / Pro     │
├──────────────────────────┼─────────────────────────────┤
│   Security Layer         │  Firebase App Check Token   │
├──────────────────────────┼─────────────────────────────┤
│   Execution Mode         │  generateContentStream()    │
├──────────────────────────┼─────────────────────────────┤
│   Reactive Signal UI     │  Signal accumulator stream  │
└──────────────────────────┴─────────────────────────────┘
```

---

## Setup & Configuration

Add `provideVertexAI()` to your `ApplicationConfig`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ /* firebaseConfig */ })),
    // Initialize Vertex AI with target region
    provideVertexAI(() => getVertexAI(undefined, { location: 'us-central1' })),
  ],
};
```

---

## Streaming Chat Completions with Signals

Build a reactive conversational AI interface that streams tokens directly into an Angular Signal:

```typescript
import { Component, inject, signal } from '@angular/core';
import {
  VertexAI,
  getGenerativeModel,
  ChatSession,
} from '@angular/fire/vertexai';

@Component({
  selector: 'app-gemini-chat',
  template: `
    <div class="chat-container">
      <div class="messages-window">
        @for (msg of conversation(); track $index) {
          <div [class]="msg.role === 'user' ? 'msg-user' : 'msg-ai'">
            <strong>{{ msg.role === 'user' ? 'You' : 'Gemini' }}:</strong>
            <p>{{ msg.text }}</p>
          </div>
        }

        @if (currentStreamChunk()) {
          <div class="msg-ai streaming">
            <strong>Gemini:</strong>
            <p>{{ currentStreamChunk() }}</p>
          </div>
        }
      </div>

      <div class="input-bar">
        <input
          #promptInput
          type="text"
          placeholder="Ask Gemini anything..."
          (keyup.enter)="sendMessage(promptInput.value); promptInput.value = ''"
          [disabled]="isGenerating()"
        />
        <button
          (click)="sendMessage(promptInput.value); promptInput.value = ''"
          [disabled]="isGenerating()"
        >
          {{ isGenerating() ? 'Thinking...' : 'Send' }}
        </button>
      </div>
    </div>
  `,
})
export class GeminiChatComponent {
  private vertexAI = inject(VertexAI);

  // Initialize Gemini 2.0 Flash model
  private model = getGenerativeModel(this.vertexAI, {
    model: 'gemini-2.0-flash',
    systemInstruction: {
      role: 'system',
      parts: [{ text: 'You are an expert assistant specialized in modern AngularFire and AnalogJS.' }],
    },
  });

  private chat: ChatSession = this.model.startChat();

  readonly conversation = signal<{ role: 'user' | 'model'; text: string }[]>([]);
  readonly currentStreamChunk = signal<string>('');
  readonly isGenerating = signal<boolean>(false);

  async sendMessage(prompt: string): Promise<void> {
    if (!prompt.trim() || this.isGenerating()) return;

    // Append user query
    this.conversation.update((msgs) => [...msgs, { role: 'user', text: prompt }]);
    this.isGenerating.set(true);
    this.currentStreamChunk.set('');

    try {
      const responseStream = await this.chat.sendMessageStream(prompt);
      let accumulatedText = '';

      for await (const chunk of responseStream.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        this.currentStreamChunk.set(accumulatedText);
      }

      // Finalize conversation state
      this.conversation.update((msgs) => [
        ...msgs,
        { role: 'model', text: accumulatedText },
      ]);
      this.currentStreamChunk.set('');
    } catch (err) {
      console.error('Gemini generation error', err);
    } finally {
      this.isGenerating.set(false);
    }
  }
}
```

---

## Multimodal Analysis (Images + Prompts)

Analyze photos, invoices, and charts directly from the client:

```typescript
import { Injectable, inject } from '@angular/core';
import { VertexAI, getGenerativeModel } from '@angular/fire/vertexai';

@Injectable({ providedIn: 'root' })
export class VisionService {
  private vertexAI = inject(VertexAI);
  private model = getGenerativeModel(this.vertexAI, { model: 'gemini-2.0-flash' });

  async analyzeReceipt(imageFile: File): Promise<string> {
    const imageBase64 = await this.fileToGenerativePart(imageFile);

    const result = await this.model.generateContent([
      "Extract the merchant name, total price, and date from this receipt as clean JSON:",
      imageBase64,
    ]);

    return result.response.text();
  }

  private async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  }
}
```

---

## Safety Settings & System Instructions

Control safety thresholds and generation parameters:

```typescript
import {
  HarmCategory,
  HarmBlockThreshold,
  getGenerativeModel,
} from '@angular/fire/vertexai';

export const configuredModel = (vertexAI: any) =>
  getGenerativeModel(vertexAI, {
    model: 'gemini-2.0-pro-exp',
    generationConfig: {
      temperature: 0.2, // Lower temperature for factual deterministic output
      topK: 40,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });
```

---

## Related Topics

- [App Check Security](/app-check)
- [Cloud Functions](/functions)
- [Core Overview](/)
