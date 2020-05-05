import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import localeIt from '@angular/common/locales/it';

import { AppComponent } from './app.component';
import {CommonModule, DatePipe, registerLocaleData} from "@angular/common";
import {GoogleMapsModule} from "@angular/google-maps";
import {HttpClientModule} from "@angular/common/http";
import {MapsComponent} from "./features/maps/maps.component";
import { HeaderComponent} from './features/header/header.component';
import { BodyComponent } from './features/body/body.component';
import { FooterComponent } from './features/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import { CalendarComponent } from './core/components/calendar/calendar.component';
import { CardComponent } from './core/components/card/card.component';
import { TabComponent } from './core/components/tab/tab.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DialogPopupComponent, PopupComponent} from './core/components/popup/popup.component';

// Setta i numei in Italiano (Es. 1.000)
registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    CalendarComponent,
    CardComponent,
    TabComponent,
    PopupComponent,
    DialogPopupComponent
  ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        GoogleMapsModule,
        HttpClientModule,
        MatTabsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
    ],
  entryComponents: [
    DialogPopupComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
    { provide: LOCALE_ID, useValue: 'it-IT' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
