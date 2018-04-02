// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Custom Modules
import { MessageModule } from './modules/message/message.module';
import { LoadingModule } from './modules/loading/loading.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/main/pages/home/home.component';
import { HeaderComponent } from './components/main/header/header.component';
import { UploadFormComponent } from './components/main/forms/upload-form/upload-form.component';
import { ErrorPageComponent } from './components/errors/error-page/error-page.component';
import { ErrorFormComponent } from './components/errors/error-form/error-form.component';

// Services
import { ValidationService } from './services/validation/validation.service';
import { ShrinkService } from './services/shrink/shrink.service';

// Directives
import { DefaultImageDirective } from './directives/default-image/default-image.directive';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorFormComponent,
    ErrorPageComponent,
    DefaultImageDirective,
    HeaderComponent,
    UploadFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    RouterModule,
    HttpClientModule,
    MessageModule.forRoot(),
    LoadingModule.forRoot()
  ],
  providers: [
    ValidationService,
    ShrinkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
