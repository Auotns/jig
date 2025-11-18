import { signal, computed, Injectable, Signal, inject, effect } from '@angular/core';
import { Jig, MaintenanceRecord, JigStatus } from '../models/jig.model';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class JigService {
  private firestore = inject(Firestore);
  private jigsCollection = collection(this.firestore, 'jigs');
  
  private _jigs = signal<Jig[]>([]);
  public readonly jigs: Signal<Jig[]> = this._jigs.asReadonly();

  constructor() {
    // Subscribe to Firestore collection for real-time updates
    this.loadJigsFromFirestore();
  }

  private loadJigsFromFirestore(): void {
    const jigsQuery = query(this.jigsCollection, orderBy('dateOfReceive', 'desc'));
    
    collectionData(jigsQuery, { idField: 'firestoreId' }).subscribe({
      next: (data: any[]) => {
        const jigs: Jig[] = data.map(item => ({
          id: item.id || item.firestoreId,
          customer: item.customer,
          dateOfReceive: item.dateOfReceive,
          productModelType: item.productModelType,
          receivedFrom: item.receivedFrom,
          storageLocation: item.storageLocation,
          responsiblePerson: item.responsiblePerson,
          status: item.status,
          notes: item.notes || '',
          maintenanceHistory: item.maintenanceHistory || [],
          transferHistory: item.transferHistory || [],
          firestoreId: item.firestoreId
        }));
        this._jigs.set(jigs);
      },
      error: (error) => {
        console.error('Error loading JIGs from Firestore:', error);
      }
    });
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
      await addDoc(this.jigsCollection, jigData);
      console.log('JIG added to Firestore:', jig.id);
    } catch (error) {
      console.error('Error adding JIG to Firestore:', error);
    }
  }

  async deleteJig(jigId: string): Promise<void> {
    try {
      const jig = this._jigs().find(j => j.id === jigId);
      if (jig && (jig as any).firestoreId) {
        const docRef = doc(this.firestore, 'jigs', (jig as any).firestoreId);
        await deleteDoc(docRef);
        console.log('JIG deleted from Firestore:', jigId);
      }
    } catch (error) {
      console.error('Error deleting JIG from Firestore:', error);
    }
  }

  async updateJigStatus(jigId: string, newStatus: JigStatus): Promise<void> {
    try {
      const jig = this._jigs().find(j => j.id === jigId);
      if (jig && (jig as any).firestoreId) {
        const docRef = doc(this.firestore, 'jigs', (jig as any).firestoreId);
        await updateDoc(docRef, { status: newStatus });
        console.log('JIG status updated in Firestore:', jigId, newStatus);
      }
    } catch (error) {
      console.error('Error updating JIG status in Firestore:', error);
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
        console.log('Maintenance record added in Firestore:', jigId);
      }
    } catch (error) {
      console.error('Error adding maintenance record in Firestore:', error);
    }
  }
  
  async importJigs(newJigs: Jig[]): Promise<void> {
    try {
      for (const jig of newJigs) {
        const jigData = { ...jig };
        delete (jigData as any).firestoreId;
        await addDoc(this.jigsCollection, jigData);
      }
      console.log('JIGs imported to Firestore');
    } catch (error) {
      console.error('Error importing JIGs to Firestore:', error);
    }
  }
}