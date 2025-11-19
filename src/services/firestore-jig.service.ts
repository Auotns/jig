import { Injectable, inject, signal, effect } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Jig, JigStatus, MaintenanceRecord } from '../models/jig.model';
import { Observable, map } from 'rxjs';
import { computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirestoreJigService {
  private firestore = inject(Firestore);
  private jigsCollection = collection(this.firestore, 'jigs');

  // Signals for reactive state
  jigs = signal<Jig[]>([]);
  filter = signal('');
  customerFilter = signal('');
  statusFilter = signal<JigStatus | ''>('');

  // Computed signals for filtering
  filteredJigs = computed(() => {
    let result = this.jigs();

    // Filter by search term
    const searchTerm = this.filter().toLowerCase();
    if (searchTerm) {
      result = result.filter(jig =>
        jig.id.toLowerCase().includes(searchTerm) ||
        jig.customer.toLowerCase().includes(searchTerm) ||
        jig.productModelType.toLowerCase().includes(searchTerm) ||
        jig.storageLocation.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by customer
    const customer = this.customerFilter();
    if (customer) {
      result = result.filter(jig => jig.customer === customer);
    }

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      result = result.filter(jig => jig.status === status);
    }

    return result;
  });

  uniqueCustomers = computed(() => {
    const customers = this.jigs().map(jig => jig.customer);
    return Array.from(new Set(customers)).sort();
  });

  constructor() {
    // Subscribe to Firestore collection
    this.loadJigs();
  }

  private loadJigs(): void {
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
          notes: item.notes,
          maintenanceHistory: item.maintenanceHistory || [],
          transferHistory: item.transferHistory || [],
          firestoreId: item.firestoreId
        }));
        this.jigs.set(jigs);
      },
      error: (error) => {
        console.error('Error loading JIGs from Firestore:', error);
      }
    });
  }

  async addJig(jig: Jig): Promise<void> {
    try {
      const jigData = { ...jig };
      delete (jigData as any).firestoreId; // Remove firestoreId if present
      
      // Remove undefined values - Firestore doesn't support them
      Object.keys(jigData).forEach(key => {
        if ((jigData as any)[key] === undefined) {
          delete (jigData as any)[key];
        }
      });
      
      await addDoc(this.jigsCollection, jigData);
    } catch (error) {
      console.error('Error adding JIG:', error);
      throw error;
    }
  }

  async updateJigStatus(jigId: string, newStatus: JigStatus): Promise<void> {
    try {
      const jig = this.jigs().find(j => j.id === jigId);
      if (!jig || !(jig as any).firestoreId) {
        throw new Error('JIG not found or missing Firestore ID');
      }
      
      const jigDoc = doc(this.firestore, 'jigs', (jig as any).firestoreId);
      await updateDoc(jigDoc, { status: newStatus });
    } catch (error) {
      console.error('Error updating JIG status:', error);
      throw error;
    }
  }

  async addMaintenanceRecord(jigId: string, record: MaintenanceRecord): Promise<void> {
    try {
      const jig = this.jigs().find(j => j.id === jigId);
      if (!jig || !(jig as any).firestoreId) {
        throw new Error('JIG not found or missing Firestore ID');
      }

      const updatedHistory = [...jig.maintenanceHistory, record];
      const jigDoc = doc(this.firestore, 'jigs', (jig as any).firestoreId);
      await updateDoc(jigDoc, { maintenanceHistory: updatedHistory });
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      throw error;
    }
  }

  async deleteJig(jigId: string): Promise<void> {
    try {
      const jig = this.jigs().find(j => j.id === jigId);
      if (!jig || !(jig as any).firestoreId) {
        throw new Error('JIG not found or missing Firestore ID');
      }

      const jigDoc = doc(this.firestore, 'jigs', (jig as any).firestoreId);
      await deleteDoc(jigDoc);
    } catch (error) {
      console.error('Error deleting JIG:', error);
      throw error;
    }
  }

  async importJigs(jigs: Jig[]): Promise<void> {
    try {
      // Delete all existing JIGs
      const existingJigs = this.jigs();
      for (const jig of existingJigs) {
        if ((jig as any).firestoreId) {
          await deleteDoc(doc(this.firestore, 'jigs', (jig as any).firestoreId));
        }
      }

      // Add all new JIGs
      for (const jig of jigs) {
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
