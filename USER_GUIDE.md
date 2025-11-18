# 📚 Používateľská Príručka - JIG Management System

## 🎯 Obsah

1. [Úvod](#úvod)
2. [Prihlásenie](#prihlásenie)
3. [Dashboard a Inventár](#dashboard-a-inventár)
4. [Pridanie Nového JIGu](#pridanie-nového-jigu)
5. [Detail JIGu](#detail-jigu)
6. [Záznam Údržby](#záznam-údržby)
7. [Import a Export](#import-a-export)
8. [Nastavenia](#nastavenia)
9. [FAQ](#faq)

---

## 📖 Úvod

JIG Management System je webová aplikácia pre evidenciu a správu JIGov (prípravkov, testovacej výstroje) vo výrobnom prostredí. Systém umožňuje sledovanie statusu, umiestnenia a histórie údržby každého JIGu.

### Hlavné funkcie:

- ✅ Evidencia JIGov s detailnými informáciami
- 📊 Filtrovanie a vyhľadávanie
- 🔧 Záznamy o údržbe
- 👥 Správa používateľov s rôznymi oprávneniami
- 🌍 Podpora troch jazykov (SK, EN, DE)
- 💾 Automatické ukladanie

---

## 🔐 Prihlásenie

### Prístupové údaje

**Administrátor:**

- Používateľské meno: `admin`
- Heslo: `password`
- Oprávnenia: Plný prístup vrátane mazania a importu/exportu

**Bežný používateľ:**

- Používateľské meno: `user`
- Heslo: `password`
- Oprávnenia: Prezeranie, pridávanie a úprava záznamov

### Postup prihlásenia:

1. Otvorte aplikáciu v prehliadači
2. Zadajte používateľské meno a heslo
3. Kliknite na tlačidlo **Prihlásiť sa**
4. Po úspešnom prihlásení sa zobrazí Dashboard

### Odhlásenie:

- Kliknite na **červené tlačidlo** s ikonou odhlásenia v pravom hornom rohu

---

## 📊 Dashboard a Inventár

### Prehľad inventára

Dashboard zobrazuje tabuľku všetkých JIGov v systéme s nasledujúcimi stĺpcami:

| Stĺpec           | Popis                                 |
| ---------------- | ------------------------------------- |
| **JIG No.**      | Unikátne číslo JIGu (napr. J_BMW_001) |
| **Customer**     | Zákazník (napr. BMW, Ford)            |
| **Model / Type** | Typ produktu alebo modelu             |
| **Location**     | Aktuálne umiestnenie                  |
| **Status**       | Aktuálny stav (4 možnosti)            |
| **Actions**      | Tlačidlá pre akcie                    |

### Statusy JIGov

JIGy môžu mať 4 statusy s farebným označením:

- 🟢 **In Stock (Na sklade)** - JIG je dostupný na sklade
- 🔵 **In Use (V používaní)** - JIG sa aktívne používa
- 🟡 **Under Maintenance (V údržbe)** - JIG je v oprave/kontrole
- 🔴 **Scrapped (Vyradený)** - JIG je vyradený z prevádzky

### Filtrovanie a vyhľadávanie

**1. Vyhľadávanie:**

- Do poľa "Search" zadajte hľadaný výraz
- Hľadá v čísle JIGu, zákazníkovi a type modelu
- Výsledky sa zobrazujú v reálnom čase

**2. Filter podľa zákazníka:**

- Dropdown menu "Customer"
- Vyberte konkrétneho zákazníka alebo "All Customers"

**3. Filter podľa statusu:**

- Dropdown menu "Status"
- Vyberte konkrétny status alebo "All Statuses"

**Kombinácia filtrov:**
Môžete kombinovať všetky tri filtre naraz pre presné vyhľadávanie.

---

## ➕ Pridanie Nového JIGu

### Postup:

1. Kliknite na **"New JIG Request"** v ľavom menu
2. Vyplňte formulár:

#### JIG Number (3 časti)

**a) Prefix:**

- `J` - pre JIG
- `C` - pre Cable (kábel)

**b) Customer Code (3 písmená):**

- Zadajte 3-písmenový kód zákazníka (napr. BMW, FRD, STL)
- Písmená sa automaticky zmenia na veľké

**c) Serial Number (3 čísla):**

- Zadajte 3-ciferné sériové číslo (napr. 001, 002)

**Príklad:** `J_BMW_001`

#### Ostatné polia:

- **Product Model / Type** - Typ produktu (napr. "F30 Headlight Test")
- **Received From** - Od koho bol JIG prijatý (napr. "EQ Department")
- **Storage Location** - Kde je JIG uložený (napr. "Shelf A-12")
- **Responsible Person** - Zodpovedná osoba
- **Notes** (voliteľné) - Poznámky

3. Kliknite na **"Save JIG"**

### Validácia:

- ❌ Všetky povinné polia musia byť vyplnené
- ❌ Customer kód musí mať presne 3 písmená
- ❌ Sériové číslo musí mať presne 3 číslice
- ❌ Číslo JIGu musí byť unikátne (nesmie už existovať)

---

## 🔍 Detail JIGu

### Zobrazenie detailu:

1. V inventári kliknite na **"View Details"** pri požadovanom JIGu
2. Zobrazí sa stránka s kompletnými informáciami

### Informácie v detaile:

**Základné info:**

- JIG číslo a typ
- Zákazník a zodpovedná osoba
- Umiestnenie
- Dátum prijatia
- Od koho bol prijatý
- Aktuálny status

**Záložky:**

#### 1. Maintenance History (História údržby)

Zobrazuje všetky záznamy o údržbe:

- Dátum kontroly
- Výsledok (OK/NOK)
- Popis problému (ak NOK)
- Nápravné opatrenie
- Kto vykonal
- Poznámky

#### 2. Transfer History (História presunov)

Zobrazuje históriu presunov JIGu:

- Typ: Acceptance (prijatie) / Submission (odovzdanie)
- Z/Do
- Preberajúci
- Poznámky

### Akcie v detaile:

**1. Log Maintenance (Zaznamenať údržbu)**

- Otvorí formulár pre nový záznam údržby

**2. Change Status (Zmena statusu)**
Dropdown menu s možnosťami:

- Set to In Stock
- Set to In Use
- Set to Under Maintenance
- Set to Scrapped

**3. Back to Inventory**

- Návrat na Dashboard

**4. Delete (iba Admin)**

- Vymazanie JIGu (s potvrdením)

---

## 🔧 Záznam Údržby

### Postup:

1. V detaile JIGu kliknite na **"Log Maintenance"**
2. Vyplňte formulár údržby:

#### Povinné polia:

**Check Result:**

- ✅ **OK** - JIG je v poriadku
- ❌ **NOK (Not OK)** - JIG má problém

**Performed By:**

- Meno osoby, ktorá vykonala kontrolu/údržbu

#### Podmienené polia (iba pri NOK):

**Problem / Issue:**

- Podrobný popis problému (povinné pri NOK)

**Corrective Action:**

- Čo bolo urobené pre nápravu (povinné pri NOK)

#### Voliteľné:

**Notes:**

- Dodatočné poznámky

3. Kliknite na **"Save Record"**

### Automatické zmeny statusu:

- Pri **OK** výsledku → Status sa zmení na "In Stock"
- Pri **NOK** výsledku → Status sa zmení na "Under Maintenance"

---

## 📤 Import a Export

### Export dát (iba Admin)

**Postup:**

1. Na Dashboarde kliknite na **"Export Data"**
2. Stiahne sa JSON súbor s názvom: `jig-inventory-export-YYYY-MM-DD.json`
3. Súbor obsahuje všetky JIGy s kompletnou históriou

**Použitie:**

- Zálohovanie dát
- Migrácia medzi prostrediami
- Analýza v externých nástrojoch

### Import dát (iba Admin)

**Postup:**

1. Kliknite na **"Import Data"**
2. Vyberte JSON súbor (exportovaný z aplikácie)
3. Potvrďte akciu

⚠️ **UPOZORNENIE:**

- Import **prepíše všetky** existujúce dáta!
- Odporúčame najprv exportovať aktuálne dáta ako zálohu
- Importovaný súbor musí mať správny formát (JSON z tejto aplikácie)

---

## ⚙️ Nastavenia

### Zmena jazyka

**Postup:**

1. Kliknite na **jazykové tlačidlo** v pravom hornom rohu (zobrazuje aktuálny jazyk, napr. "EN")
2. Vyberte požadovaný jazyk:
   - 🇬🇧 **English**
   - 🇸🇰 **Slovensky**
   - 🇩🇪 **Deutsch**
3. Rozhranie sa okamžite prepne

**Poznámka:**

- Jazykové nastavenie sa uloží a zostane aj po zatvorení prehliadača

### Uložené dáta

Aplikácia automaticky ukladá do prehliadača:

- ✅ Všetky JIGy a ich históriu
- ✅ Prihlásenie (zostanete prihlásení)
- ✅ Jazykové nastavenie

Dáta zostávajú zachované aj po:

- Zatvorení prehliadača
- Reštarte počítača
- Obnovení stránky (F5)

**Vymazanie dát:**

- Pri odhlásení sa vymažú používateľské údaje
- Pre kompletné vymazanie: Browser Settings → Clear browsing data → Cookies and site data

---

## ❓ FAQ (Často kladené otázky)

### 1. Čo robiť ak zabudnem heslo?

Pre demo verziu sú heslá fixné (`password`). V produkčnej verzii kontaktujte administrátora.

### 2. Môžem upraviť existujúci JIG?

Aktuálne nie je možné upraviť základné údaje JIGu. Môžete však:

- Zmeniť status
- Pridať záznamy údržby
- Vymazať a vytvoriť nový (Admin)

### 3. Prečo mi aplikácia nefunguje po update?

Vyčistite cache prehliadača (Ctrl+Shift+Delete) alebo otvorte v inkognito režime.

### 4. Ako zabezpečím dáta?

- Pravidelne exportujte dáta (tlačidlo Export Data)
- Uchovávajte exportované súbory na bezpečnom mieste
- Pre produkčné nasadenie použite backend databázu

### 5. Môžem používať na mobile?

Áno! Aplikácia je responzívna a funguje na:

- 📱 Smartfónoch
- 📱 Tabletoch
- 💻 Desktop počítačoch

### 6. Čo znamená NOK?

NOK = "Not OK" (Nevyhovuje) - označuje, že JIG má problém a vyžaduje opravu.

### 7. Môžem vytvoriť viacero používateľov?

V súčasnej verzii sú iba 2 fixní používatelia (admin, user). Pre vlastných používateľov je potrebný backend.

### 8. Ako dlho sa uchovávajú dáta?

Dáta v localStorage sa uchovávajú natrvalo, kým:

- Ich manuálne nevymažete
- Nevymažete browser data
- Neimportujete iné dáta (prepíše staré)

### 9. Podporuje aplikácia tlač?

Použite funkciu tlače prehliadača (Ctrl+P). Pre lepšie výsledky odporúčame najprv exportovať do JSON a spracovať v Exceli.

### 10. Funguje aplikácia offline?

Áno, po načítaní funguje aj bez internetu. Všetky dáta sú uložené lokálne v prehliadači.

---

## 🆘 Podpora a Kontakt

Pre technickú podporu:

- 📧 Email: support@example.com
- 🐛 GitHub Issues: [Report Bug](https://github.com/YOUR_USERNAME/JIG/issues)
- 📖 Dokumentácia: [README.md](./README.md)

---

## 📝 Poznámky

**Bezpečnosť:**

- Demo verzia používa zjednodušenú autentifikáciu
- Heslá v produkcii by mali byť silné a unikátne
- Pre citlivé dáta používajte produkčné riešenie s backendom

**Odporúčania:**

- Pravidelne exportujte dáta
- Nepoužívajte pre kritické produkčné dáta bez zálohovania
- Pre produkčné nasadenie implementujte backend

---

**Verzia príručky:** 1.0.0  
**Dátum aktualizácie:** November 2025  
**Autor:** AUO Corporation
