import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { Person, Role } from '../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule]
})
export class PersonFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  roles: Role[] = [];
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roleIds: [[] as number[]] // optional: assign roles on create/update
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Person | null,
    protected ref: MatDialogRef<PersonFormComponent>
  ) {}

  ngOnInit() {
    this.api.getRoles().subscribe(r => this.roles = r);

    if (this.data) {
      this.form.patchValue({
        firstName: this.data.firstName,
        lastName:  this.data.lastName,
        email:     this.data.email,
        roleIds:   (this.data.roles ?? []).map(pr => pr.id)
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value;

    const dto = {
      firstName: (v.firstName ?? '').toString(),
      lastName:  (v.lastName  ?? '').toString(),
      email:     (v.email     ?? '').toString(),
      roleIds:    v.roleIds ?? undefined
    };
    if (this.data) {
      this.api.updatePerson(this.data.id, dto).subscribe({
        next: () => { this.snack.open('Updated', 'Close', { duration: 2000 }); this.ref.close(true); },
        error: () => this.snack.open('Update failed', 'Close', { duration: 3000 })
      });
    } else {
      this.api.createPerson(dto as any).subscribe({
        next: () => { this.snack.open('Created', 'Close', { duration: 2000 }); this.ref.close(true); },
        error: () => this.snack.open('Create failed', 'Close', { duration: 3000 })
      });
    }
  }
}
