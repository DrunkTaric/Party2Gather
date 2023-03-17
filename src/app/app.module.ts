import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';

//routing
import { AppRoutingModule } from './app-routing.module';
import { ErrorModule } from "./pages/error/error.module"

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//edit
import { SelectorModule } from './pages/selector/selector.module';
import { SearchModule } from './pages/search/search.module';
import { LoadModule } from './pages/load/load.module';
import { HomeModule } from './pages/home/home.module';
import { AppComponent } from './app.component';
import { PartyModule } from './pages/party/party.module';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SearchModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    ErrorModule,
    PartyModule,
    LoadModule,
    SelectorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
