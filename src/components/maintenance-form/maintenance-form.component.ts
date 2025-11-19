import { Component, ChangeDetectionStrategy, output, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Jig, MaintenanceRecord } from '../../models/jig.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './maintenance-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceFormComponent {
  jig = input.required<Jig>();
  save = output<{jigId: string, record: MaintenanceRecord}>();
  cancel = output<void>();

  private fb = inject(FormBuilder);

  maintenanceForm = this.fb.group({
    checkResult: ['OK', Validators.required],
    issue: [''],
    correctiveAction: [''],
    performedBy: ['', Validators.required],
    notes: [''],
  });

  isNok = false;

  constructor() {
    this.maintenanceForm.get('checkResult')?.valueChanges.subscribe(value => {
        this.isNok = value === 'NOK';
        const issueControl = this.maintenanceForm.get('issue');
        const actionControl = this.maintenanceForm.get('correctiveAction');
        if (this.isNok) {
            issueControl?.setValidators(Validators.required);
            actionControl?.setValidators(Validators.required);
        } else {
            issueControl?.clearValidators();
            actionControl?.clearValidators();
            issueControl?.setValue('');
            actionControl?.setValue('');
        }
        issueControl?.updateValueAndValidity();
        actionControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.maintenanceForm.valid) {
      const formValue = this.maintenanceForm.value;
      const newRecord: MaintenanceRecord = {
        date: new Date().toISOString(),
        checkResult: formValue.checkResult as 'OK' | 'NOK',
        issue: formValue.issue || '',
        correctiveAction: formValue.correctiveAction || '',
        performedBy: formValue.performedBy!,
        notes: formValue.notes || '',
      };
      this.save.emit({jigId: this.jig().id, record: newRecord});
    } else {
      this.maintenanceForm.markAllAsTouched();
    }
  }
}
