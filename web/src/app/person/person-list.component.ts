import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../core/api.service';
import { Person } from '../core/models';
import { PersonFormComponent } from './person-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'app-people-list',
  templateUrl: './person-list.component.html',
  imports: [
    CommonModule, MatTableModule, DatePipe
    // Angular
    // Material
  ]
})
export class PeopleListComponent implements OnInit {
  readonly Boolean = Boolean;
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  people: Person[] = [];
  displayed = ['firstName', 'lastName', 'email', 'roles', 'createdAt', 'actions'];

  ngOnInit() { this.load(); }

  rolesList(p: Person): string {
    return (p.roles ?? [])
      .map(pr => pr.role? pr.role : '')
      .filter(r => !!r)
      .join(', ');
  }

  load() {
    this.api.getPeople().subscribe({
      next: (res) => {
        // Sort by createdAt descending per requirement
        this.people = [...res].sort((a,b) => a.createdAt < b.createdAt ? 1 : -1);
      },
      error: () => this.snack.open('Failed to load people', 'Close', { duration: 3000 })
    });
  }

  create() {
    const ref = this.dialog.open(PersonFormComponent, { width: '420px', data: null });
    ref.afterClosed().subscribe(saved => saved && this.load());
  }

  edit(person: Person) {
    const ref = this.dialog.open(PersonFormComponent, { width: '420px', data: person });
    ref.afterClosed().subscribe(saved => saved && this.load());
  }

  delete(person: Person) {
    if (!confirm(`Delete ${person.firstName} ${person.lastName}?`)) return;
    this.api.deletePerson(person.id).subscribe({
      next: () => { this.snack.open('Deleted', 'Close', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }
}
