import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CreateViewComponent } from './components/create-view/create-view.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { WebInterceptor } from './interceptors/web.interceptor';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    CreateViewComponent,
    LoginComponent,
    SignUpComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
