import { Routes } from '@angular/router';
import { PeopleListComponent } from './person/person-list.component';
import { ProgramsListComponent } from './programs/programs-list.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'people' },
  { path: 'people', component: PeopleListComponent },
  { path: 'programs', component: ProgramsListComponent },
];
