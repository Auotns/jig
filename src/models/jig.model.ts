
export type JigStatus = 'In Stock' | 'In Use' | 'Under Maintenance' | 'Scrapped';

export interface Jig {
  id: string; // JIG NO.
  customer: string;
  dateOfReceive: string; // ISO date string
  productModelType: string;
  receivedFrom: string;
  storageLocation: string;
  responsiblePerson: string;
  status: JigStatus;
  notes?: string;
  maintenanceHistory: MaintenanceRecord[];
  transferHistory: TransferRecord[];
}

export interface MaintenanceRecord {
  date: string; // ISO date string
  checkResult: 'OK' | 'NOK';
  issue?: string;
  correctiveAction?: string;
  performedBy: string;
  notes?: string;
}

export interface TransferRecord {
  date: string;
  type: 'Acceptance' | 'Submission';
  from: string;
  to: string;
  recipient: string;
  notes?: string;
}
