import { Injectable, signal, inject, effect } from '@angular/core';
import { StorageService } from './storage.service';

type Language = 'en' | 'sk' | 'de';

const translations: Record<string, Record<Language, string>> = {
  // Sidebar & Footer
  'sidebar.title': { en: 'JIG Manager', sk: 'JIG Manažér', de: 'JIG Manager' },
  'sidebar.inventory': { en: 'Inventory', sk: 'Inventár', de: 'Inventar' },
  'sidebar.newJigRequest': { en: 'New JIG Request', sk: 'Nová požiadavka na JIG', de: 'Neue JIG-Anfrage' },
  'footer.copyright': { en: '© 2025 created by PoRast', sk: '© 2025 vytvoril PoRast', de: '© 2025 erstellt von PoRast' },

  // Header
  'header.dashboard': { en: 'Dashboard', sk: 'Prehľad', de: 'Dashboard' },
  'header.jigDetails': { en: 'JIG Details', sk: 'Detaily JIGu', de: 'JIG-Details' },
  'header.newJigRegistration': { en: 'New JIG Registration', sk: 'Nová registrácia JIGu', de: 'Neue JIG-Registrierung' },
  'header.logMaintenance': { en: 'Log Maintenance', sk: 'Záznam údržby', de: 'Wartung protokollieren' },
  'header.searchPlaceholder': { en: 'Search...', sk: 'Hľadať...', de: 'Suchen...' },
  'header.actions.export': { en: 'Export Data', sk: 'Exportovať dáta', de: 'Daten exportieren' },
  'header.actions.exportPdf': { en: 'Export PDF', sk: 'Exportovať PDF', de: 'PDF exportieren' },
  'header.actions.exportExcel': { en: 'Export Excel', sk: 'Exportovať Excel', de: 'Excel exportieren' },
  'header.actions.import': { en: 'Import Data', sk: 'Importovať dáta', de: 'Daten importieren' },
  'header.actions.adminTitle': { en: 'Admin Actions', sk: 'Akcie administrátora', de: 'Admin-Aktionen' },
  
  // Import/Export Messages
  'import.confirm.message': { en: 'Are you sure you want to import data? This will overwrite all current JIG inventory.', sk: 'Naozaj chcete importovať dáta? Týmto prepíšete celý aktuálny inventár JIGov.', de: 'Möchten Sie die Daten wirklich importieren? Dadurch wird der gesamte aktuelle JIG-Bestand überschrieben.' },
  'import.success.message': { en: 'Data imported successfully!', sk: 'Dáta boli úspešne importované!', de: 'Daten erfolgreich importiert!' },
  'import.error.invalidFile': { en: 'Invalid file format. Please import a valid JSON file exported from this application.', sk: 'Neplatný formát súboru. Prosím, importujte platný súbor JSON exportovaný z tejto aplikácie.', de: 'Ungültiges Dateiformat. Bitte importieren Sie eine gültige JSON-Datei, die von dieser Anwendung exportiert wurde.' },


  // Filter Controls
  'filter.customerLabel': { en: 'Customer', sk: 'Zákazník', de: 'Kunde' },
  'filter.statusLabel': { en: 'Status', sk: 'Stav', de: 'Status' },
  'filter.allCustomers': { en: 'All Customers', sk: 'Všetci zákazníci', de: 'Alle Kunden' },
  'filter.allStatuses': { en: 'All Statuses', sk: 'Všetky stavy', de: 'Alle Status' },
  'filter.searchLabel': { en: 'Search', sk: 'Hľadať', de: 'Suchen' },

  // Inventory Page
  'inventory.table.jigNo': { en: 'JIG No.', sk: 'Číslo JIGu', de: 'JIG-Nr.' },
  'inventory.table.customer': { en: 'Customer', sk: 'Zákazník', de: 'Kunde' },
  'inventory.table.modelType': { en: 'Model / Type', sk: 'Model / Typ', de: 'Modell / Typ' },
  'inventory.table.location': { en: 'Location', sk: 'Umiestnenie', de: 'Standort' },
  'inventory.table.status': { en: 'Status', sk: 'Stav', de: 'Status' },
  'inventory.table.actions': { en: 'Actions', sk: 'Akcie', de: 'Aktionen' },
  'inventory.viewDetails': { en: 'View Details', sk: 'Zobraziť detaily', de: 'Details anzeigen' },
  'inventory.actions.delete': { en: 'Delete', sk: 'Vymazať', de: 'Löschen' },
  'inventory.deleteConfirm.message': { en: 'Are you sure you want to permanently delete this JIG? This action cannot be undone.', sk: 'Naozaj chcete natrvalo vymazať tento JIG? Táto akcia sa nedá vrátiť späť.', de: 'Möchten Sie diesen JIG wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.' },
  'inventory.empty.title': { en: 'No JIGs found.', sk: 'Nenašli sa žiadne JIGy.', de: 'Keine JIGs gefunden.' },
  'inventory.empty.message': { en: 'Try adjusting your search or adding a new JIG.', sk: 'Skúste upraviť vyhľadávanie alebo pridať nový JIG.', de: 'Passen Sie Ihre Suche an oder fügen Sie einen neuen JIG hinzu.' },

  // Statuses
  'status.inStock': { en: 'In Stock', sk: 'Na sklade', de: 'Auf Lager' },
  'status.inUse': { en: 'In Use', sk: 'V používaní', de: 'In Benutzung' },
  'status.underMaintenance': { en: 'Under Maintenance', sk: 'V údržbe', de: 'In Wartung' },
  'status.scrapped': { en: 'Scrapped', sk: 'Vyradený', de: 'Verschrottet' },

  // Detail Page
  'detail.logMaintenance': { en: 'Log Maintenance', sk: 'Záznam údržby', de: 'Wartung protokollieren' },
  'detail.statusLabel': { en: 'Status', sk: 'Stav', de: 'Status' },
  'detail.customer': { en: 'Customer', sk: 'Zákazník', de: 'Kunde' },
  'detail.responsiblePerson': { en: 'Responsible Person', sk: 'Zodpovedná osoba', de: 'Verantwortliche Person' },
  'detail.storageLocation': { en: 'Storage Location', sk: 'Miesto uloženia', de: 'Lagerort' },
  'detail.dateReceived': { en: 'Date Received', sk: 'Dátum prijatia', de: 'Empfangsdatum' },
  'detail.receivedFrom': { en: 'Received From', sk: 'Prijaté od', de: 'Erhalten von' },
  'detail.notes': { en: 'Notes', sk: 'Poznámky', de: 'Notizen' },
  'detail.maintenanceHistoryTab': { en: 'Maintenance History', sk: 'História údržby', de: 'Wartungshistorie' },
  'detail.transferHistoryTab': { en: 'Transfer History', sk: 'História presunov', de: 'Transferhistorie' },
  'detail.maintenance.by': { en: 'by', sk: 'vykonal', de: 'von' },
  'detail.maintenance.issue': { en: 'Issue', sk: 'Problém', de: 'Problem' },
  'detail.maintenance.action': { en: 'Action', sk: 'Opatrenie', de: 'Maßnahme' },
  'detail.maintenance.empty': { en: 'No maintenance history available.', sk: 'Nie je dostupná žiadna história údržby.', de: 'Keine Wartungshistorie verfügbar.' },
  'detail.transfer.acceptance': { en: 'Acceptance', sk: 'Príjem', de: 'Annahme' },
  'detail.transfer.submission': { en: 'Submission', sk: 'Odovzdanie', de: 'Übergabe' },
  'detail.transfer.from': { en: 'from', sk: 'z', de: 'von' },
  'detail.transfer.to': { en: 'to', sk: 'do', de: 'nach' },
  'detail.transfer.recipient': { en: 'Recipient', sk: 'Preberajúci', de: 'Empfänger' },
  'detail.transfer.empty': { en: 'No transfer history available.', sk: 'Nie je dostupná žiadna história presunov.', de: 'Keine Transferhistorie verfügbar.' },
  'detail.action.title': { en: 'Change Status', sk: 'Zmeniť stav', de: 'Status ändern' },
  'detail.action.setInStock': { en: 'Set to In Stock', sk: 'Na sklade', de: 'Auf Lager setzen' },
  'detail.action.setInUse': { en: 'Set to In Use', sk: 'V používaní', de: 'In Benutzung setzen' },
  'detail.action.setUnderMaintenance': { en: 'Set to Under Maintenance', sk: 'V údržbe', de: 'In Wartung setzen' },
  'detail.action.setScrapped': { en: 'Set to Scrapped', sk: 'Vyradený', de: 'Verschrotten' },
  

  // JIG Form
  'form.jig.title': { en: 'JIG Registration Details', sk: 'Detaily registrácie JIGu', de: 'JIG-Registrierungsdetails' },
  'form.jig.numberLabel': { en: 'JIG Number', sk: 'Číslo JIGu', de: 'JIG-Nummer' },
  'form.jig.numberHint': { en: 'Format: Prefix_Customer (3 letters)_Serial (3 numbers)', sk: 'Formát: Prefix_Zákazník (3 písmená)_Sériové číslo (3 čísla)', de: 'Format: Präfix_Kunde (3 Buchstaben)_Seriennummer (3 Zahlen)' },
  'form.jig.prefix': { en: 'Prefix', sk: 'Prefix', de: 'Präfix' },
  'form.jig.prefixOptionJig': { en: 'J - JIG', sk: 'J - JIG', de: 'J - JIG' },
  'form.jig.prefixOptionCable': { en: 'C - Cable', sk: 'C - Kábel', de: 'C - Kabel' },
  'form.jig.customerCode': { en: 'Customer Code', sk: 'Kód zákazníka', de: 'Kundencode' },
  'form.jig.customerPlaceholder': { en: 'e.g., BMW', sk: 'napr., BMW', de: 'z.B. BMW' },
  'form.jig.customerError': { en: '3-letter code required.', sk: 'Vyžaduje sa 3-písmenový kód.', de: '3-stelliger Code erforderlich.' },
  'form.jig.serialNumber': { en: 'Serial Number', sk: 'Sériové číslo', de: 'Seriennummer' },
  'form.jig.serialPlaceholder': { en: 'e.g., 001', sk: 'napr., 001', de: 'z.B. 001' },
  'form.jig.serialError': { en: '3-digit number required.', sk: 'Vyžaduje sa 3-ciferné číslo.', de: '3-stellige Nummer erforderlich.' },
  'form.jig.modelType': { en: 'Product Model / Type', sk: 'Model / Typ produktu', de: 'Produktmodell / Typ' },
  'form.jig.receivedFrom': { en: 'Received From', sk: 'Prijaté od', de: 'Erhalten von' },
  'form.jig.storageLocation': { en: 'Storage Location', sk: 'Miesto uloženia', de: 'Lagerort' },
  'form.jig.responsiblePerson': { en: 'Responsible Person', sk: 'Zodpovedná osoba', de: 'Verantwortliche Person' },
  'form.jig.notes': { en: 'Notes', sk: 'Poznámky', de: 'Notizen' },
  'form.jig.cancel': { en: 'Cancel', sk: 'Zrušiť', de: 'Abbrechen' },
  'form.jig.save': { en: 'Save JIG', sk: 'Uložiť JIG', de: 'JIG speichern' },
  'form.jig.duplicateIdError': { en: 'This JIG number already exists.', sk: 'Toto číslo JIGu už existuje.', de: 'Diese JIG-Nummer existiert bereits.' },

  // Maintenance Form
  'form.maint.title': { en: 'Maintenance Log', sk: 'Záznam o údržbe', de: 'Wartungsprotokoll' },
  'form.maint.forJig': { en: 'For JIG', sk: 'Pre JIG', de: 'Für JIG' },
  'form.maint.checkResult': { en: 'Check Result', sk: 'Výsledok kontroly', de: 'Prüfergebnis' },
  'form.maint.ok': { en: 'OK', sk: 'OK', de: 'OK' },
  'form.maint.nok': { en: 'NOK (Not OK)', sk: 'NOK (Nevyhovuje)', de: 'NOK (Nicht OK)' },
  'form.maint.performedBy': { en: 'Performed By', sk: 'Vykonal', de: 'Durchgeführt von' },
  'form.maint.issue': { en: 'Problem / Issue', sk: 'Problém / Chyba', de: 'Problem / Fehler' },
  'form.maint.issueError': { en: 'Issue description is required for NOK status.', sk: 'Pre stav NOK je povinný popis problému.', de: 'Problembeschreibung ist für NOK-Status erforderlich.' },
  'form.maint.correctiveAction': { en: 'Corrective Action', sk: 'Nápravné opatrenie', de: 'Korrekturmaßnahme' },
  'form.maint.correctiveActionError': { en: 'Corrective action is required for NOK status.', sk: 'Pre stav NOK je povinné nápravné opatrenie.', de: 'Korrekturmaßnahme ist für NOK-Status erforderlich.' },
  'form.maint.notes': { en: 'Notes (Optional)', sk: 'Poznámky (Voliteľné)', de: 'Notizen (Optional)' },
  'form.maint.cancel': { en: 'Cancel', sk: 'Zrušiť', de: 'Abbrechen' },
  'form.maint.save': { en: 'Save Record', sk: 'Uložiť záznam', de: 'Eintrag speichern' },
  'form.maint.requiredField': { en: 'This field is required.', sk: 'Toto pole je povinné.', de: 'Dieses Feld ist erforderlich.' },

  // Auth & Login
  'auth.login.title': { en: 'JIG Management System Login', sk: 'Prihlásenie do JIG Management Systému', de: 'JIG Management System Login' },
  'auth.login.email': { en: 'Email', sk: 'Email', de: 'E-Mail' },
  'auth.login.username': { en: 'Username', sk: 'Používateľské meno', de: 'Benutzername' },
  'auth.login.password': { en: 'Password', sk: 'Heslo', de: 'Passwort' },
  'auth.login.button': { en: 'Login', sk: 'Prihlásiť sa', de: 'Anmelden' },
  'auth.login.error': { en: 'Invalid email or password.', sk: 'Neplatný email alebo heslo.', de: 'Ungültige E-Mail oder Passwort.' },
  'auth.logout': { en: 'Logout', sk: 'Odhlásiť sa', de: 'Abmelden' },
  'user.role.Administrator': { en: 'Administrator', sk: 'Administrátor', de: 'Administrator' },
  'user.role.User': { en: 'User', sk: 'Používateľ', de: 'Benutzer' },

  // Toast Messages
  'toast.jigSaved': { en: 'JIG saved successfully!', sk: 'JIG úspešne uložený!', de: 'JIG erfolgreich gespeichert!' },
  'toast.maintenanceSaved': { en: 'Maintenance record saved!', sk: 'Záznam o údržbe uložený!', de: 'Wartungseintrag gespeichert!' },
  'toast.statusUpdated': { en: 'Status updated successfully!', sk: 'Stav úspešne aktualizovaný!', de: 'Status erfolgreich aktualisiert!' },
  'toast.jigDeleted': { en: 'JIG deleted successfully!', sk: 'JIG úspešne vymazaný!', de: 'JIG erfolgreich gelöscht!' },
  'toast.errorSaving': { en: 'Error saving. Please try again.', sk: 'Chyba pri ukladaní. Skúste znova.', de: 'Fehler beim Speichern. Bitte versuchen Sie es erneut.' },
  'toast.errorUpdating': { en: 'Error updating. Please try again.', sk: 'Chyba pri aktualizácii. Skúste znova.', de: 'Fehler beim Aktualisieren. Bitte versuchen Sie es erneut.' },
  'toast.errorDeleting': { en: 'Error deleting. Please try again.', sk: 'Chyba pri mazaní. Skúste znova.', de: 'Fehler beim Löschen. Bitte versuchen Sie es erneut.' },
  'toast.confirm': { en: 'Confirm', sk: 'Potvrdiť', de: 'Bestätigen' },
  'toast.cancel': { en: 'Cancel', sk: 'Zrušiť', de: 'Abbrechen' },
};

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private storageService = inject(StorageService);
  
  language = signal<Language>(this.loadInitialLanguage());

  constructor() {
    // Auto-save language preference
    effect(() => {
      const lang = this.language();
      this.storageService.saveLanguage(lang);
    });
  }

  private loadInitialLanguage(): Language {
    const saved = this.storageService.loadLanguage();
    return (saved as Language) || 'en';
  }

  setLanguage(lang: Language) {
    this.language.set(lang);
  }

  translate(key: string): string {
    const lang = this.language();
    return translations[key]?.[lang] || key;
  }
}