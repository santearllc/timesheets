import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdministrateComponent } from './administrate/administrate.component';
import { ApprovalComponent } from './approval/approval.component';
import { ExportComponent } from './export/export.component';
import { EntryComponent } from './entry/entry.component';
import { StatusComponent } from './status/status.component'


export const router: Routes = [
  { path: '', redirectTo : 'entry', pathMatch: 'full' },
  { path: 'approval', component: ApprovalComponent },
  { path: 'export', component: ExportComponent },
  { path: 'administrate', component: AdministrateComponent },
  { path: 'entry', component: EntryComponent },
  { path: 'status', component: StatusComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
