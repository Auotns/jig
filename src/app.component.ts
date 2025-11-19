import { Component, ChangeDetectionStrategy, signal, effect, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'ngx-sonner';
import { JigService } from './services/jig.service';
import { Jig, JigStatus } from './models/jig.model';
import { JigInventoryComponent } from './components/jig-inventory/jig-inventory.component';
import { JigDetailComponent } from './components/jig-detail/jig-detail.component';
import { JigFormComponent } from './components/jig-form/jig-form.component';
import { MaintenanceFormComponent } from './components/maintenance-form/maintenance-form.component';
import { TranslationService } from './services/translation.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { User } from './models/user.model';
import { NgxSonnerToaster } from 'ngx-sonner';

export type View = 'inventory' | 'detail' | 'newJig' | 'maintenance';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JigInventoryComponent,
    JigDetailComponent,
    JigFormComponent,
    MaintenanceFormComponent,
    TranslatePipe,
    LoginComponent,
    NgxSonnerToaster,
  ],
})
export class AppComponent {
  jigService = inject(JigService);
  translationService = inject(TranslationService);
  authService = inject(AuthService);
  
  appVersion = '1.0.1'; // Application version
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentView = signal<View>('inventory');
  selectedJig = signal<Jig | undefined>(undefined);
  isLangDropdownOpen = signal(false);
  isSidebarOpen = signal(false); // Default closed for mobile
  jigStatuses: JigStatus[] = ['In Stock', 'In Use', 'Under Maintenance', 'Scrapped'];
  
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  isAuthLoading = this.authService.isAuthLoading;

  // Direct references to service signals
  jigs = this.jigService.filteredJigs;
  filter = this.jigService.filter;
  customerFilter = this.jigService.customerFilter;
  statusFilter = this.jigService.statusFilter;
  uniqueCustomers = this.jigService.uniqueCustomers;

  constructor() {
    // Effect to reset selected JIG when returning to inventory view
    effect(() => {
      if (this.currentView() === 'inventory') {
        this.selectedJig.set(undefined);
      }
    });


  }

  handleViewJig(jig: Jig) {
    this.selectedJig.set(jig);
    this.currentView.set('detail');
  }

  handleNewJig() {
    this.selectedJig.set(undefined);
    this.currentView.set('newJig');
  }
  
  handleLogMaintenance(jig: Jig) {
    this.selectedJig.set(jig);
    this.currentView.set('maintenance');
  }

  async handleSaveJig(jig: Jig) {
    try {
      await this.jigService.addJig(jig);
      this.currentView.set('inventory');
      toast.success(this.translationService.translate('toast.jigSaved'));
    } catch (error) {
      console.error('Error saving JIG:', error);
      toast.error(this.translationService.translate('toast.errorSaving'));
    }
  }

  async handleSaveMaintenance(record: {jigId: string, record: any}) {
    try {
      await this.jigService.addMaintenanceRecord(record.jigId, record.record);
      const updatedJig = this.jigService.jigs().find(j => j.id === record.jigId);
      this.selectedJig.set(updatedJig);
      this.currentView.set('detail');
      toast.success(this.translationService.translate('toast.maintenanceSaved'));
    } catch (error) {
      console.error('Error saving maintenance record:', error);
      toast.error(this.translationService.translate('toast.errorSaving'));
    }
  }

  async handleChangeStatus({ jigId, newStatus }: { jigId: string; newStatus: JigStatus }) {
    try {
      await this.jigService.updateJigStatus(jigId, newStatus);
      const updatedJig = this.jigService.jigs().find(j => j.id === jigId);
      this.selectedJig.set(updatedJig);
      toast.success(this.translationService.translate('toast.statusUpdated'));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(this.translationService.translate('toast.errorUpdating'));
    }
  }

  async handleDeleteJig(jig: Jig) {
    const confirmationMessage = this.translationService.translate('inventory.deleteConfirm.message');
    
    // Use browser confirm as fallback since custom toast confirm is complex
    if (window.confirm(confirmationMessage)) {
      try {
        await this.jigService.deleteJig(jig.id);
        toast.success(this.translationService.translate('toast.jigDeleted'));
      } catch (error) {
        console.error('Error deleting JIG:', error);
        toast.error(this.translationService.translate('toast.errorDeleting'));
      }
    }
  }

  handleLogout() {
    this.authService.logout().subscribe(() => {
      this.currentView.set('inventory');
    });
  }

  handleCancel() {
    const jig = this.selectedJig();
    if (this.currentView() === 'maintenance' && jig) {
        this.currentView.set('detail');
    } else {
        this.currentView.set('inventory');
    }
  }

  onFilterChange(event: Event) {
      const input = event.target as HTMLInputElement;
      this.jigService.filter.set(input.value);
  }

  onCustomerFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.jigService.customerFilter.set(select.value);
  }

  onStatusFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.jigService.statusFilter.set(select.value as JigStatus | '');
  }

  setLanguage(lang: 'en' | 'sk' | 'de') {
    this.translationService.setLanguage(lang);
    this.isLangDropdownOpen.set(false);
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

  triggerImport(): void {
    this.fileInput.nativeElement.click();
  }

  handleExportData(): void {
    const jigsToExport = this.jigService.jigs();
    const dataStr = JSON.stringify(jigsToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `jig-inventory-export-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  handleExportPdf(): void {
    const jigs = this.jigs();
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Helper function to remove diacritics
    const removeDiacritics = (text: string): string => {
      return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    
    // Title
    doc.setFontSize(18);
    doc.text('JIG Inventory Report', 14, 20);
    
    // Date
    doc.setFontSize(11);
    const date = new Date().toLocaleDateString('en-US');
    doc.text(`Generated: ${date}`, 14, 30);
    
    // Table headers (without diacritics)
    const headers = [
      removeDiacritics(this.translationService.translate('inventory.table.jigNo')),
      removeDiacritics(this.translationService.translate('inventory.table.customer')),
      removeDiacritics(this.translationService.translate('inventory.table.modelType')),
      removeDiacritics(this.translationService.translate('inventory.table.location')),
      removeDiacritics(this.translationService.translate('inventory.table.status'))
    ];
    
    // Table data (without diacritics)
    const data = jigs.map(jig => [
      removeDiacritics(jig.id),
      removeDiacritics(jig.customer),
      removeDiacritics(jig.productModelType),
      removeDiacritics(jig.storageLocation),
      removeDiacritics(this.translationService.translate(this.getStatusTranslationKey(jig.status)))
    ]);
    
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    const fileName = `jig-inventory-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }

  handleExportExcel(): void {
    const jigs = this.jigs();
    
    // Prepare data with translated headers
    const data = jigs.map(jig => ({
      [this.translationService.translate('inventory.table.jigNo')]: jig.id,
      [this.translationService.translate('inventory.table.customer')]: jig.customer,
      [this.translationService.translate('inventory.table.modelType')]: jig.productModelType,
      [this.translationService.translate('inventory.table.location')]: jig.storageLocation,
      [this.translationService.translate('inventory.table.status')]: this.translationService.translate(this.getStatusTranslationKey(jig.status)),
      'Date of Receive': jig.dateOfReceive,
      'Received From': jig.receivedFrom,
      'Responsible Person': jig.responsiblePerson,
      'Notes': jig.notes || ''
    }));
    
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'JIG Inventory');
    
    // Auto-size columns
    const maxWidth = 50;
    const colWidths = Object.keys(data[0] || {}).map(key => {
      const maxLen = Math.max(
        key.length,
        ...data.map(row => String(row[key as keyof typeof row] || '').length)
      );
      return { wch: Math.min(maxLen + 2, maxWidth) };
    });
    worksheet['!cols'] = colWidths;
    
    // Save file
    const fileName = `jig-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  handleImportData(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];

    if (file.type !== 'application/json') {
      alert(this.translationService.translate('import.error.invalidFile'));
      input.value = '';
      return;
    }

    const confirmationMessage = this.translationService.translate('import.confirm.message');
    if (!window.confirm(confirmationMessage)) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const importedJigs: Jig[] = JSON.parse(text);

        if (Array.isArray(importedJigs) && (importedJigs.length === 0 || (importedJigs[0].id && importedJigs[0].customer))) {
          await this.jigService.importJigs(importedJigs);
          alert(this.translationService.translate('import.success.message'));
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(this.translationService.translate('import.error.invalidFile'));
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(file);
  }
}