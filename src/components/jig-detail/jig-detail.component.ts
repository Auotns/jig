import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Jig, JigStatus } from '../../models/jig.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

type DetailTab = 'maintenance' | 'transfer';

@Component({
  selector: 'app-jig-detail',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './jig-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JigDetailComponent {
  jig = input.required<Jig>();
  logMaintenance = output<Jig>();
  changeStatus = output<{ jigId: string, newStatus: JigStatus }>();
  close = output<void>();

  activeTab = signal<DetailTab>('maintenance');
  
  getStatusClass(status: JigStatus): string {
     switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800 border-green-300';
      case 'In Use': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Scrapped': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  onChangeStatus(newStatus: JigStatus) {
    this.changeStatus.emit({ jigId: this.jig().id, newStatus });
  }
}
