import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdministrateComponent } from './administrate/administrate.component';
import { ApprovalComponent } from './approval/approval.component';
import { ExportComponent } from './export/export.component';
import { EntryComponent } from './entry/entry.component';
import { StatusComponent } from './status/status.component'
import { LoginComponent } from './login/login.component'



export const router: Routes = [
  { path: '', redirectTo : 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'approval', component: ApprovalComponent },  
  { path: 'peek', component: ApprovalComponent },  
  { path: 'export', component: ExportComponent },
  { path: 'administrate', component: AdministrateComponent },
  { path: 'entry', component: EntryComponent },
  { path: 'status', component: StatusComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
