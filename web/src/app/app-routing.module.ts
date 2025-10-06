import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleListComponent } from './person/person-list.component';
import { ProgramsListComponent } from './programs/programs-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  { path: 'people', component: PeopleListComponent },
  { path: 'programs', component: ProgramsListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
