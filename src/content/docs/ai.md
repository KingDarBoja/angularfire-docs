---
title: "Firebase AI Logic"
description: "Integrate Google Gemini generative AI models directly into modern Angular applications with Firebase AI Logic, Angular Signals, and Firebase JS SDK v12."
category: "Intelligence"
order: 12
---

## Introduction

**Firebase AI Logic** (the evolution of *Vertex AI in Firebase*) provides client-side JavaScript and Angular developers direct access to Google's foundational **Gemini** models. In **AngularFire v21**, the AI integration is completely modernized to support **Firebase JS SDK v12.0.0**, replacing the former `@angular/fire/vertexai` package with `@angular/fire/ai`.

With Firebase AI Logic, you can stream completions, generate structured JSON responses, analyze multimodal inputs (images, audio, video, documents), and run multi-turn conversational agents directly from client code—safely protected by **Firebase App Check** without needing a custom proxy backend.

> **Key Capabilities in AngularFire v21 & Firebase v12**:
> - **Unified AI Namespace**: Replaces legacy `firebase/vertexai` with the official `firebase/ai` and `@angular/fire/ai` APIs.
> - **Multi-Backend Flexibility**: Switch between the **Gemini Developer API** (`GoogleAIBackend`, offering a generous no-cost prototyping tier) and the enterprise-grade **Vertex AI / Agent Platform** (`VertexAIBackend`).
> - **Real-Time Streaming**: Stream text and responses chunk-by-chunk directly into **Angular Signals**.
> - **Stateful Chat Sessions**: Retain multi-turn conversation memory with `startChat()`.
> - **Structured Outputs**: Enforce guaranteed JSON schema structures using `SchemaType` and `responseSchema`.
> - **Token Estimation**: Pre-calculate token consumption and budgeting with `countTokens()`.
> - **Multimodal Reasoning**: Combine text prompts with images, documents, audio, and video files.
> - **Next-Gen Previews**: Public preview support for real-time bidirectional audio sessions via `getLiveGenerativeModel()` and server prompt templates via `getTemplateGenerativeModel()`.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               AngularFire AI Logic (v21)               │
├──────────────────────────┬─────────────────────────────┤
│   Reactivity & UI        │  Angular Signals & Effects  │
├──────────────────────────┼─────────────────────────────┤
│   Dependency Injection   │  provideAI() & inject(AI)   │
├──────────────────────────┼─────────────────────────────┤
│   AngularFire Wrapper    │  @angular/fire/ai           │
├──────────────────────────┼─────────────────────────────┤
│   Underlying SDK         │  firebase/ai (SDK v12+)     │
├──────────────────────────┼─────────────────────────────┤
│   Backend Adapters       │  GoogleAIBackend /          │
│                          │  VertexAIBackend            │
├──────────────────────────┼─────────────────────────────┤
│   Security Gateway       │  Firebase App Check Tokens  │
├──────────────────────────┼─────────────────────────────┤
│   Foundation Models      │  Gemini 2.5 Flash / Pro     │
└──────────────────────────┴─────────────────────────────┘
```

---

## Setup & Configuration

### 1. Installation

Ensure your project is running Node.js 20+ and ES2020 target requirements declared by Firebase JS SDK v12:

```bash
# Using npm
npm install @angular/fire firebase@^12.0.0

# Using Angular CLI
ng add @angular/fire
```

### 2. Providing AI in `app.config.ts`

Configure `provideAI()` inside your `ApplicationConfig`. You can initialize the service with its default configuration, or explicitly specify your backend provider:

```typescript
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAI, getAI, GoogleAIBackend, VertexAIBackend } from '@angular/fire/ai';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({
      apiKey: 'your-api-key',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      appId: 'your-app-id',
    })),

    // Option A: Default AI initialization
    provideAI(() => getAI()),

    // Option B: Gemini Developer API backend (recommended for quick prototyping & free tier)
    // provideAI(() => getAI(undefined, { backend: new GoogleAIBackend() })),

    // Option C: Enterprise Vertex AI backend with specific region
    // provideAI(() => getAI(undefined, { backend: new VertexAIBackend('us-central1') })),
  ],
};
```

### 3. Injecting the AI Service

Inject the `AI` token into your standalone components, services, or directives using Angular's `inject()` function:

```typescript
import { Component, inject } from '@angular/core';
import { AI, getGenerativeModel } from '@angular/fire/ai';

@Component({
  selector: 'app-ai-demo',
  template: `<p>AI Service Ready</p>`,
})
export class AiDemoComponent {
  private ai = inject(AI);
  private model = getGenerativeModel(this.ai, { model: 'gemini-2.5-flash' });
}
```

---

## Supported Methods & API Reference

Firebase JS SDK v12 and `@angular/fire/ai` expose a modular API covering model retrieval, inference, live sessions, and token management:

### Core Top-Level Functions

| Function | Description |
| :--- | :--- |
| `provideAI(initFn)` | Angular provider function that registers the `AI` dependency injection token in `ApplicationConfig`. |
| `getAI(app?, options?)` | Returns or initializes the `FirebaseAI` instance for a given `FirebaseApp`, optionally accepting a backend configuration (`GoogleAIBackend` or `VertexAIBackend`). |
| `getGenerativeModel(ai, modelParams, requestOptions?)` | Instantiates a `GenerativeModel` configured with model name, system instructions, generation settings, safety filters, and tools. |
| `getLiveGenerativeModel(ai, modelParams)` *(Public Preview)* | Returns a `LiveGenerativeModel` for low-latency, real-time bidirectional communication via the Gemini Live API. |
| `getTemplateGenerativeModel(ai, requestOptions?)` *(Public Preview)* | Returns a `TemplateGenerativeModel` instance for executing prompt templates stored and managed on the server. |
| `startAudioConversation(liveSession, options)` *(Public Preview)* | Helper utility function that manages client-side microphone streaming, audio decoding, playback, and interruption handling. |

### GenerativeModel Methods

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `generateContent(request, options?)` | `Promise<GenerateContentResult>` | Sends a single prompt (text, multimodal parts, or structured objects) and waits for the entire response to finish generating. |
| `generateContentStream(request, options?)` | `Promise<GenerateContentStreamResult>` | Initiates a streaming response, allowing chunks to be read asynchronously as they are generated by the model. |
| `startChat(params?)` | `ChatSession` | Instantiates a stateful conversation session that automatically maintains turn history. |
| `countTokens(request, options?)` | `Promise<CountTokensResponse>` | Calculates the number of tokens in the given content before running inference to help manage costs and context budgets. |
| `initializeDeviceModel()` | `Promise<void>` | Pre-warms or prepares on-device models for hybrid inference scenarios where offline or local processing is enabled. |

### ChatSession Methods

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `sendMessage(request, options?)` | `Promise<GenerateContentResult>` | Sends a user message in the chat conversation and returns the complete model reply. |
| `sendMessageStream(request, options?)` | `Promise<GenerateContentStreamResult>` | Sends a message and returns an async iterable stream for real-time incremental rendering. |
| `getHistory()` | `Promise<Content[]>` | Retrieves the current array of past conversation messages and turns. |

---

## Real-Time Streaming Chat with Angular Signals

Combine `sendMessageStream()` with modern **Angular Signals** to deliver a responsive, progressive token streaming experience:

```typescript
import { Component, inject, signal } from '@angular/core';
import {
  AI,
  getGenerativeModel,
  ChatSession,
} from '@angular/fire/ai';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-gemini-chat',
  template: `
    <div class="chat-wrapper">
      <div class="message-feed">
        @for (msg of messages(); track $index) {
          <div [class]="msg.role === 'user' ? 'bubble-user' : 'bubble-model'">
            <strong>{{ msg.role === 'user' ? 'You' : 'Gemini' }}:</strong>
            <p>{{ msg.text }}</p>
          </div>
        }

        @if (currentStream()) {
          <div class="bubble-model streaming">
            <strong>Gemini:</strong>
            <p>{{ currentStream() }}</p>
          </div>
        }
      </div>

      <div class="chat-input-row">
        <input
          #inputBox
          type="text"
          placeholder="Ask a question..."
          [disabled]="isLoading()"
          (keyup.enter)="send(inputBox.value); inputBox.value = ''"
        />
        <button
          [disabled]="isLoading()"
          (click)="send(inputBox.value); inputBox.value = ''"
        >
          {{ isLoading() ? 'Generating...' : 'Send' }}
        </button>
      </div>
    </div>
  `,
})
export class GeminiChatComponent {
  private ai = inject(AI);

  private model = getGenerativeModel(this.ai, {
    model: 'gemini-2.5-flash',
    systemInstruction: {
      role: 'system',
      parts: [{ text: 'You are an expert fullstack AngularFire engineer. Provide concise, modern code.' }],
    },
  });

  private chat: ChatSession = this.model.startChat();

  readonly messages = signal<ChatMessage[]>([]);
  readonly currentStream = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  async send(prompt: string): Promise<void> {
    const query = prompt.trim();
    if (!query || this.isLoading()) return;

    this.messages.update((prev) => [...prev, { role: 'user', text: query }]);
    this.isLoading.set(true);
    this.currentStream.set('');

    try {
      const responseStream = await this.chat.sendMessageStream(query);
      let accumulated = '';

      for await (const chunk of responseStream.stream) {
        accumulated += chunk.text();
        this.currentStream.set(accumulated);
      }

      this.messages.update((prev) => [...prev, { role: 'model', text: accumulated }]);
      this.currentStream.set('');
    } catch (error) {
      console.error('Failed to stream chat completion:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

---

## Multimodal Analysis (Images & Files)

Analyze images, invoices, screenshots, or documents alongside textual instructions using `generateContent()`:

```typescript
import { Injectable, inject } from '@angular/core';
import { AI, getGenerativeModel, Part } from '@angular/fire/ai';

export interface ReceiptAnalysis {
  merchant: string;
  total: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentAnalysisService {
  private ai = inject(AI);
  private model = getGenerativeModel(this.ai, { model: 'gemini-2.5-flash' });

  async analyzeDocument(file: File, prompt: string): Promise<string> {
    const filePart = await this.fileToInlinePart(file);

    const result = await this.model.generateContent([
      prompt,
      filePart,
    ]);

    return result.response.text();
  }

  private async fileToInlinePart(file: File): Promise<Part> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
```

---

## Structured Output with JSON Schema

Use `responseMimeType: 'application/json'` and `responseSchema` to guarantee strict JSON output matching a strongly typed schema:

```typescript
import { Injectable, inject } from '@angular/core';
import {
  AI,
  getGenerativeModel,
  SchemaType,
} from '@angular/fire/ai';

export interface ProductSummary {
  name: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  pros: string[];
  cons: string[];
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewExtractorService {
  private ai = inject(AI);

  private model = getGenerativeModel(this.ai, {
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          sentiment: {
            type: SchemaType.STRING,
            enum: ['positive', 'neutral', 'negative'],
          },
          pros: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          cons: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          rating: { type: SchemaType.NUMBER },
        },
        required: ['name', 'sentiment', 'pros', 'cons', 'rating'],
      },
    },
  });

  async extractSummary(reviewText: string): Promise<ProductSummary> {
    const result = await this.model.generateContent(
      `Extract structured product feedback from the following review:\n${reviewText}`
    );

    return JSON.parse(result.response.text()) as ProductSummary;
  }
}
```

---

## Token Counting & Context Limits

Estimate the prompt size before executing requests to avoid unexpected latency or quota issues:

```typescript
import { Injectable, inject } from '@angular/core';
import { AI, getGenerativeModel } from '@angular/fire/ai';

@Injectable({ providedIn: 'root' })
export class TokenBudgetService {
  private ai = inject(AI);
  private model = getGenerativeModel(this.ai, { model: 'gemini-2.5-flash' });

  async checkTokenBudget(prompt: string, maxAllowedTokens = 4000): Promise<{ valid: boolean; totalTokens: number }> {
    const tokenCountResult = await this.model.countTokens(prompt);
    const totalTokens = tokenCountResult.totalTokens;

    return {
      totalTokens,
      valid: totalTokens <= maxAllowedTokens,
    };
  }
}
```

---

## Safety Settings & System Instructions

Fine-tune safety filters across harassment, hate speech, explicit content, and dangerous content:

```typescript
import {
  AI,
  getGenerativeModel,
  HarmCategory,
  HarmBlockThreshold,
} from '@angular/fire/ai';

export const createModeratedModel = (ai: AI) =>
  getGenerativeModel(ai, {
    model: 'gemini-2.5-pro',
    systemInstruction: {
      role: 'system',
      parts: [{ text: 'You are a compliant enterprise customer support assistant.' }],
    },
    generationConfig: {
      temperature: 0.1, // Deterministic, factual output
      topK: 40,
      topP: 0.95,
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
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });
```

---

## Migration from Legacy Vertex AI (`@angular/fire/vertexai`)

When upgrading to **AngularFire v21** and **Firebase JS SDK v12.0.0**, apply the following changes:

| Feature / Concept | Legacy Vertex AI (v11) | Modern Firebase AI Logic (v12) |
| :--- | :--- | :--- |
| **Package Import** | `@angular/fire/vertexai` | `@angular/fire/ai` |
| **Firebase SDK Path** | `firebase/vertexai` *(removed in v12)* | `firebase/ai` |
| **Provider Function** | `provideVertexAI(() => getVertexAI(...))` | `provideAI(() => getAI(...))` |
| **Injection Token** | `inject(VertexAI)` | `inject(AI)` |
| **Backend Providers** | Cloud Vertex AI only | `GoogleAIBackend` (Developer API) & `VertexAIBackend` (Enterprise) |
| **Node.js Baseline** | Node.js 18+ | Node.js 20+ & ES2020 |

---

## Related Topics

- [App Check Security](/app-check)
- [Cloud Firestore](/firestore)
- [Cloud Functions](/functions)
- [Core Overview](/)
