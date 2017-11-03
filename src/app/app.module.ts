import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { EntryComponent } from './entry/entry.component';
import { ApprovalComponent } from './approval/approval.component';
import { ExportComponent } from './export/export.component';
import { AdministrateComponent } from './administrate/administrate.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserDetailsComponent } from './user-details/user-details.component';

import { DataService } from './services/data.service';
import { ServiceService } from './services/service.service';

import { routes } from './app.routes'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatDatepickerModule } from '@angular/material';
import 'hammerjs';
import { EntryRowComponent } from './entry-row/entry-row.component';


@NgModule({
  declarations: [
    AppComponent,
    EntryComponent,
    ApprovalComponent,
    ExportComponent,
    AdministrateComponent,
    NavigationComponent,
    UserDetailsComponent,
    EntryRowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routes,
    MatDatepickerModule,
    FormsModule,
    HttpModule
  ],
  providers: [DataService, ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
