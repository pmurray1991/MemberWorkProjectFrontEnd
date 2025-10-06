import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { Program } from '../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  templateUrl: './program-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
})
export class ProgramFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    startDate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    endDate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Program | null,
    protected ref: MatDialogRef<ProgramFormComponent>
  ) {}

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name ?? '',
        description: this.data.description ?? '',
        startDate: this.data.startDate ? new Date(this.data.startDate) : null,
        endDate: this.data.endDate ? new Date(this.data.endDate) : null,
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    const { name, description, startDate, endDate } = this.form.getRawValue();

    const dto = {
      name,
      description: description || undefined,
      startDate: new Date(startDate!).toISOString(),
      endDate: new Date(endDate!).toISOString(),
    };

    if (this.data) {
      this.api.updateProgram(this.data.id, dto).subscribe({
        next: () => { this.snack.open('Updated', 'Close', { duration: 2000 }); this.ref.close(true); },
        error: () => this.snack.open('Update failed', 'Close', { duration: 3000 })
      });
    } else {
      this.api.createProgram(dto as any).subscribe({
        next: () => { this.snack.open('Created', 'Close', { duration: 2000 }); this.ref.close(true); },
        error: () => this.snack.open('Create failed', 'Close', { duration: 3000 })
      });
    }
  }
}
