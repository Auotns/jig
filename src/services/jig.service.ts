import { signal, computed, Injectable, Signal, inject, effect } from '@angular/core';
import { Jig, MaintenanceRecord, JigStatus, TransferRecord } from '../models/jig.model';
import { AuthService } from './auth.service';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class JigService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private jigsCollection = collection(this.firestore, 'jigs');
  
  private _jigs = signal<Jig[]>([]);
  public readonly jigs: Signal<Jig[]> = this._jigs.asReadonly();

  constructor() {
    // Subscribe to Firestore collection for real-time updates
    this.loadJigsFromFirestore();
  }

  private loadJigsFromFirestore(): void {
    const jigsQuery = query(this.jigsCollection, orderBy('dateOfReceive', 'desc'));
    
    // Use onSnapshot for real-time updates with metadata changes
    onSnapshot(
      jigsQuery,
      { includeMetadataChanges: true }, // Get updates even for local changes
      (snapshot) => {
        const jigs: Jig[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: data['id'] || doc.id,
            customer: data['customer'],
            dateOfReceive: data['dateOfReceive'],
            productModelType: data['productModelType'],
            receivedFrom: data['receivedFrom'],
            storageLocation: data['storageLocation'],
            responsiblePerson: data['responsiblePerson'],
            status: data['status'],
            notes: data['notes'] || '',
            maintenanceHistory: data['maintenanceHistory'] || [],
            transferHistory: data['transferHistory'] || [],
            firestoreId: doc.id
          };
        });
        
        this._jigs.set(jigs);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        if (error?.code === 'permission-denied') {
          console.error('Permission denied. Please check Firestore security rules.');
        }
        if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
          console.error('Missing Firestore index. Check Firebase console for index creation link.');
        }
      }
    );
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
  
  async addJig(jig: Jig): Promise<void> {
    try {
      const jigData = { ...jig };
      delete (jigData as any).firestoreId;
      
      // Remove undefined values - Firestore doesn't support them
      Object.keys(jigData).forEach(key => {
        if ((jigData as any)[key] === undefined) {
          delete (jigData as any)[key];
        }
      });
      
      await addDoc(this.jigsCollection, jigData);
    } catch (error: any) {
      console.error('Error adding JIG:', error?.message || error);
      alert('Chyba pri ukladaní JIG do databázy: ' + (error?.message || 'Neznáma chyba. Skontrolujte či ste prihlásený a či máte internetové pripojenie.'));
      throw error;
    }
  }

  async deleteJig(jigId: string): Promise<void> {
    try {
      const jig = this._jigs().find(j => j.id === jigId);
      if (jig && (jig as any).firestoreId) {
        const docRef = doc(this.firestore, 'jigs', (jig as any).firestoreId);
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error('Error deleting JIG:', error);
      throw error;
    }
  }

  async updateJigStatus(jigId: string, newStatus: JigStatus): Promise<void> {
    try {
      const jig = this._jigs().find(j => j.id === jigId);
      if (jig && (jig as any).firestoreId) {
        const currentUser = this.authService.currentUser();
        const username = currentUser?.username || 'System';
        
        // Create transfer record for status change
        const transferRecord: TransferRecord = {
          date: new Date().toISOString(),
          type: newStatus === 'In Stock' ? 'Acceptance' : 'Submission',
          from: this.getStatusLocationText(jig.status),
          to: this.getStatusLocationText(newStatus),
          recipient: username,
          notes: `Status changed from ${jig.status} to ${newStatus}`
        };
        
        const updatedHistory = [...jig.transferHistory, transferRecord];
        
        const docRef = doc(this.firestore, 'jigs', (jig as any).firestoreId);
        await updateDoc(docRef, { 
          status: newStatus,
          transferHistory: updatedHistory
        });
      }
    } catch (error) {
      console.error('Error updating JIG status:', error);
      throw error;
    }
  }

  private getStatusLocationText(status: JigStatus): string {
    switch (status) {
      case 'In Stock':
        return 'Storage';
      case 'In Use':
        return 'Production';
      case 'Under Maintenance':
        return 'Maintenance Department';
      case 'Scrapped':
        return 'Scrap';
      default:
        return 'Unknown';
    }
  }

  async addMaintenanceRecord(jigId: string, record: MaintenanceRecord): Promise<void> {
    try {
      const jig = this._jigs().find(j => j.id === jigId);
      if (jig && (jig as any).firestoreId) {
        const docRef = doc(this.firestore, 'jigs', (jig as any).firestoreId);
        const updatedHistory = [record, ...jig.maintenanceHistory];
        const newStatus = record.checkResult === 'OK' ? 'In Stock' : 'Under Maintenance';
        
        await updateDoc(docRef, {
          maintenanceHistory: updatedHistory,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      throw error;
    }
  }
  
  async importJigs(newJigs: Jig[]): Promise<void> {
    try {
      for (const jig of newJigs) {
        const jigData = { ...jig };
        delete (jigData as any).firestoreId;
        await addDoc(this.jigsCollection, jigData);
      }
    } catch (error) {
      console.error('Error importing JIGs:', error);
      throw error;
    }
  }
}