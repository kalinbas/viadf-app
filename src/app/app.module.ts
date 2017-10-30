import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { InfoPage } from '../pages/info/info';
import { RoutesPage } from '../pages/routes/routes';
import { RouteDetailPage } from '../pages/routedetail/routedetail';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ResultPage } from '../pages/result/result';
import { ResultDetailPage } from '../pages/resultdetail/resultdetail';

import { Api } from '../providers/api';
import { Messages } from '../providers/messages';

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMobPro } from '@ionic-native/admob-pro';


@NgModule({
  declarations: [
    MyApp,
    InfoPage,
    RoutesPage,
    RouteDetailPage,
    HomePage,
    TabsPage,
    ResultPage,
    ResultDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      apiServerUrl: 'https://viadf.mx',
      apiKey: '0NSlW6dbj57EoyH3i0yQ3yI575kI8mb4'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InfoPage,
    RoutesPage,
    RouteDetailPage,
    HomePage,
    TabsPage,
    ResultPage,
    ResultDetailPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Messages, Api, Geolocation, StatusBar, SplashScreen, AdMobPro]
})
export class AppModule { }
