import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Jig, JigStatus } from '../../models/jig.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-jig-inventory',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './jig-inventory.component.html',
})
export class JigInventoryComponent {
  jigs = input.required<Jig[]>();
  userRole = input.required<UserRole | undefined>();
  viewJig = output<Jig>();
  deleteJig = output<Jig>();
  
  getStatusClass(status: JigStatus): string {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'In Use':
        return 'bg-blue-100 text-blue-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scrapped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusTranslationKey(status: JigStatus): string {
    switch (status) {
      case 'In Stock': return 'status.inStock';
      case 'In Use': return 'status.inUse';
      case 'Under Maintenance': return 'status.underMaintenance';
      case 'Scrapped': return 'status.scrapped';
      default: return '';
    }
  }

  onViewClick(jig: Jig) {
    this.viewJig.emit(jig);
  }

  onDeleteClick(jig: Jig) {
    this.deleteJig.emit(jig);
  }
}