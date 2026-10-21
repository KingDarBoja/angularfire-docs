import {
  provideHttpClient,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideFileRouter } from '@analogjs/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(),
    provideClientHydration(withEventReplay()),
    provideContent(
      withMarkdownRenderer()
    ),
  ],
};
