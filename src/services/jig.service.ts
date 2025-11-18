import { signal, computed, Injectable, Signal, inject, effect } from '@angular/core';
import { Jig, MaintenanceRecord, JigStatus } from '../models/jig.model';
import { StorageService } from './storage.service';

const MOCK_JIGS: Jig[] = [
  {
    id: 'J_BMW_001',
    customer: 'BMW',
    dateOfReceive: '2023-10-15T00:00:00.000Z',
    productModelType: 'F30 Headlight Test',
    receivedFrom: 'EQ Department',
    storageLocation: 'Shelf A-12',
    responsiblePerson: 'John Doe',
    status: 'In Stock',
    maintenanceHistory: [
      {
        date: '2024-03-20T00:00:00.000Z',
        checkResult: 'OK',
        performedBy: 'Jane Smith',
        notes: 'Routine monthly check.'
      }
    ],
    transferHistory: []
  },
  {
    id: 'J_STL_005',
    customer: 'Stellantis',
    dateOfReceive: '2023-11-01T00:00:00.000Z',
    productModelType: 'Dashboard Connector',
    receivedFrom: 'MPE Department',
    storageLocation: 'Line 3',
    responsiblePerson: 'Peter Jones',
    status: 'In Use',
    maintenanceHistory: [],
    transferHistory: [
        {
            date: '2024-01-10T00:00:00.000Z',
            type: 'Submission',
            from: 'Warehouse',
            to: 'Line 3',
            recipient: 'Peter Jones'
        }
    ]
  },
  {
    id: 'J_FRD_002',
    customer: 'Ford',
    dateOfReceive: '2024-01-20T00:00:00.000Z',
    productModelType: 'Sync 4 Test Cable',
    receivedFrom: 'External Supplier',
    storageLocation: 'Maintenance Room',
    responsiblePerson: 'Susan Bell',
    status: 'Under Maintenance',
    maintenanceHistory: [
       {
        date: '2024-05-10T00:00:00.000Z',
        checkResult: 'NOK',
        issue: 'Connector pin bent.',
        correctiveAction: 'Replaced connector head.',
        performedBy: 'Susan Bell',
       }
    ],
    transferHistory: []
  },
   {
    id: 'C_DMR_011',
    customer: 'Daimler',
    dateOfReceive: '2022-05-10T00:00:00.000Z',
    productModelType: 'LVDS Cable',
    receivedFrom: 'QC Department',
    storageLocation: 'Scrap Bin',
    responsiblePerson: 'Admin',
    status: 'Scrapped',
    notes: 'Damaged beyond repair.',
    maintenanceHistory: [],
    transferHistory: []
  }
];
@Injectable({
  providedIn: 'root'
})
export class JigService {
  private storageService = inject(StorageService);
  
  private _jigs = signal<Jig[]>(this.loadInitialJigs());
  public readonly jigs: Signal<Jig[]> = this._jigs.asReadonly();

  constructor() {
    // Auto-save to localStorage whenever jigs change
    effect(() => {
      const currentJigs = this._jigs();
      this.storageService.saveJigs(currentJigs);
    });
  }

  private loadInitialJigs(): Jig[] {
    const savedJigs = this.storageService.loadJigs();
    return savedJigs && savedJigs.length > 0 ? savedJigs : MOCK_JIGS;
  }
  
  filter = signal<string>('');
  customerFilter = signal<string>('');
  statusFilter = signal<JigStatus | ''>('');

  uniqueCustomers = computed(() => {
    const customers = this._jigs().map(jig => jig.customer);
    return [...new Set(customers)].sort();
  });

  filteredJigs = computed(() => {
    const searchTerm = this.filter().toLowerCase();
    const customer = this.customerFilter();
    const status = this.statusFilter();
    
    return this._jigs().filter(jig => {
      const matchesSearch = !searchTerm || 
        jig.id.toLowerCase().includes(searchTerm) ||
        jig.customer.toLowerCase().includes(searchTerm) ||
        jig.productModelType.toLowerCase().includes(searchTerm);

      const matchesCustomer = !customer || jig.customer === customer;
      
      const matchesStatus = !status || jig.status === status;

      return matchesSearch && matchesCustomer && matchesStatus;
    });
  });

  isJigIdTaken(id: string): boolean {
    return this._jigs().some(jig => jig.id.toLowerCase() === id.toLowerCase());
  }
  
  addJig(jig: Jig) {
    this._jigs.update(jigs => [jig, ...jigs]);
  }

  deleteJig(jigId: string) {
    this._jigs.update(jigs => jigs.filter(j => j.id !== jigId));
  }

  updateJigStatus(jigId: string, newStatus: JigStatus) {
    this._jigs.update(jigs => {
        const jigIndex = jigs.findIndex(j => j.id === jigId);
        if (jigIndex > -1) {
            const updatedJig = {...jigs[jigIndex], status: newStatus};
            const newJigs = [...jigs];
            newJigs[jigIndex] = updatedJig;
            return newJigs;
        }
        return jigs;
    });
  }

  addMaintenanceRecord(jigId: string, record: MaintenanceRecord) {
    this._jigs.update(jigs => {
        const jigIndex = jigs.findIndex(j => j.id === jigId);
        if (jigIndex > -1) {
            const updatedJig = {...jigs[jigIndex]};
            updatedJig.maintenanceHistory = [record, ...updatedJig.maintenanceHistory];
            
            if (record.checkResult === 'OK') {
              updatedJig.status = 'In Stock'; // Assuming it goes back to stock after OK maintenance
            } else {
              updatedJig.status = 'Under Maintenance';
            }

            const newJigs = [...jigs];
            newJigs[jigIndex] = updatedJig;
            return newJigs;
        }
        return jigs;
    });
  }
  
  importJigs(newJigs: Jig[]): void {
    this._jigs.set(newJigs);
  }
}