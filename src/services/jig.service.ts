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
    
    console.log('🔵 Starting Firestore subscription for JIGs collection...');
    console.log('🔵 Current user:', this.authService.currentUser());
    console.log('🔵 Query collection path:', 'jigs');
    
    // Use onSnapshot for real-time updates with metadata changes
    const unsubscribe = onSnapshot(
      jigsQuery,
      { includeMetadataChanges: true }, // Get updates even for local changes
      (snapshot) => {
        console.log('🟢 Firestore snapshot received at', new Date().toISOString());
        console.log('🟢 Documents count:', snapshot.docs.length);
        console.log('🟢 Snapshot metadata:');
        console.log('   - fromCache:', snapshot.metadata.fromCache);
        console.log('   - hasPendingWrites:', snapshot.metadata.hasPendingWrites);
        
        // Log document changes
        snapshot.docChanges().forEach(change => {
          console.log(`   - ${change.type}:`, change.doc.data()['id']);
        });
        
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
        
        console.log('🟢 Setting jigs signal with', jigs.length, 'items');
        if (jigs.length > 0) {
          console.log('🟢 First JIG ID:', jigs[0].id);
          console.log('🟢 Last JIG ID:', jigs[jigs.length - 1].id);
        }
        this._jigs.set(jigs);
        console.log('🟢 Signal updated successfully');
      },
      (error) => {
        console.error('🔴 Error in Firestore subscription:', error);
        console.error('🔴 Error code:', error?.code);
        console.error('🔴 Error message:', error?.message);
        console.error('🔴 Full error:', error);
        if (error?.code === 'permission-denied') {
          console.error('⚠️ FIRESTORE SECURITY RULES ERROR: Permission denied. Check Firebase Console → Firestore → Rules');
        }
        if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
          console.error('⚠️ FIRESTORE INDEX ERROR: Missing index. Check console for index creation link.');
          console.error('Index link might be in the error:', error);
        }
      }
    );
    
    console.log('🔵 Subscription created successfully');
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
      
      console.log('Attempting to add JIG to Firestore:', jig.id);
      console.log('JIG data:', jigData);
      console.log('Current user:', this.authService.currentUser());
      
      const docRef = await addDoc(this.jigsCollection, jigData);
      console.log('JIG added to Firestore successfully:', jig.id, 'Document ID:', docRef.id);
      console.log('Firestore should trigger subscription update automatically...');
    } catch (error: any) {
      console.error('Error adding JIG to Firestore:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
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
        console.log('JIG status updated in Firestore:', jigId, newStatus);
      }
    } catch (error) {
      console.error('Error updating JIG status in Firestore:', error);
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