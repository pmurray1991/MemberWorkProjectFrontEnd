import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { ApiService } from '../core/api.service';
import { Person, Program } from '../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatCheckbox,
    MatDialogClose
  ],
  templateUrl: './assign-dialog.component.html'
})
export class AssignDialogComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  people: Person[] = [];
  selectedIds = new Set<number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public program: Program,
    private ref: MatDialogRef<AssignDialogComponent>
  ) {}

  ngOnInit() {
    this.api.getPeople().subscribe(p => {
      this.people = p;
      const already = new Set((this.program.personPrograms ?? []).map(pp => pp.personId));
      // preselect assigned
      this.selectedIds = already;
    });
  }

  toggle(personId: number, checked: boolean) {
    if (checked) this.selectedIds.add(personId);
    else this.selectedIds.delete(personId);
  }

  save() {
    const ids = Array.from(this.selectedIds);
    this.api.assignPeopleToProgram(this.program.id, ids).subscribe({
      next: () => { this.snack.open('Assignments updated', 'Close', { duration: 2000 }); this.ref.close(true); },
      error: () => this.snack.open('Update failed', 'Close', { duration: 3000 })
    });
  }
}
