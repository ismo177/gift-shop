import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Login2Component } from './app/login2/login2.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
