import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Jig } from '../../models/jig.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { JigService } from '../../services/jig.service';

@Component({
  selector: 'app-jig-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './jig-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JigFormComponent {
  save = output<Jig>();
  cancel = output<void>();

  private fb = inject(FormBuilder);
  private jigService = inject(JigService);

  private duplicateJigIdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const prefix = control.get('prefix')?.value;
    const customer = control.get('customer')?.value;
    const serial = control.get('serial')?.value;

    // Only run validation if the constituent parts are present and valid according to their own validators
    if (prefix && customer && serial && control.get('customer')?.valid && control.get('serial')?.valid) {
      const jigId = `${prefix}_${customer.toUpperCase()}_${serial}`;
      if (this.jigService.isJigIdTaken(jigId)) {
        return { duplicateId: true };
      }
    }
    
    return null;
  };

  jigForm = this.fb.group({
    prefix: ['J', Validators.required],
    customer: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('^[a-zA-Z]{3}$')]],
    serial: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
    productModelType: ['', Validators.required],
    receivedFrom: ['', Validators.required],
    storageLocation: ['', Validators.required],
    responsiblePerson: ['', Validators.required],
    notes: [''],
  }, { validators: this.duplicateJigIdValidator });

  onSubmit() {
    if (this.jigForm.valid) {
      const formValue = this.jigForm.value;
      const newJig: Jig = {
        id: `${formValue.prefix}_${formValue.customer?.toUpperCase()}_${formValue.serial}`,
        customer: formValue.customer!,
        dateOfReceive: new Date().toISOString(),
        productModelType: formValue.productModelType!,
        receivedFrom: formValue.receivedFrom!,
        storageLocation: formValue.storageLocation!,
        responsiblePerson: formValue.responsiblePerson!,
        status: 'In Stock',
        notes: formValue.notes?.trim() || '',
        maintenanceHistory: [],
        transferHistory: [],
      };
      this.save.emit(newJig);
    } else {
      this.jigForm.markAllAsTouched();
    }
  }
}