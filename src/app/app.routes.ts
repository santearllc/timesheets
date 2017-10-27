import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdministrateComponent } from './administrate/administrate.component';
import { ApprovalComponent } from './approval/approval.component';
import { ExportComponent } from './export/export.component';
import { EntryComponent } from './entry/entry.component';
import { UserDetailsComponent } from './user-details/user-details.component';


export const router: Routes = [
  { path: '', redirectTo : 'administrate', pathMatch: 'full' },
  { path: 'approval', component: ApprovalComponent },
  { path: 'export', component: ExportComponent },
  { path: 'administrate', component: AdministrateComponent },
  { path: 'entry', component: EntryComponent },
  { path: 'user/:id', component: UserDetailsComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
