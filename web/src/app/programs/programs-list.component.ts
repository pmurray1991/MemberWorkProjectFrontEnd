import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { ApiService } from '../core/api.service';
import { Program } from '../core/models';
import { ProgramFormComponent } from './program-form.component';
import { AssignDialogComponent } from './assign-dialog.component';

@Component({
  standalone: true,
  selector: 'app-programs-list',
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,      // ✅ correct module
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './programs-list.component.html',
})
export class ProgramsListComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  programs: Program[] = [];
  displayed = ['name', 'dates', 'assigned', 'actions']; // column ids

  ngOnInit() { this.load(); }

  load() {
    this.api.getPrograms().subscribe({
      next: (res) => this.programs = res,
      error: () => this.snack.open('Failed to load programs', 'Close', { duration: 3000 })
    });
  }

  create() {
    this.dialog.open(ProgramFormComponent, { width: '460px', data: null })
      .afterClosed().subscribe(saved => saved && this.load());
  }

  edit(p: Program) {
    this.dialog.open(ProgramFormComponent, { width: '460px', data: p })
      .afterClosed().subscribe(saved => saved && this.load());
  }

  delete(p: Program) {
    if (!confirm(`Delete program "${p.name}"?`)) return;
    this.api.deleteProgram(p.id).subscribe({
      next: () => { this.snack.open('Deleted', 'Close', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }

  assign(p: Program) {
    this.dialog.open(AssignDialogComponent, { width: '520px', data: p })
      .afterClosed().subscribe(saved => saved && this.load());
  }
}
