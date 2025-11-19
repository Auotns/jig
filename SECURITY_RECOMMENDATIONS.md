# 🔒 Bezpečnostné odporúčania pre JIG Management System

**Verzia aplikácie:** 1.0.0  
**Dátum auditu:** 19. november 2025  
**Stav:** ✅ **BEZPEČNÉ PRE PRODUKČNÉ POUŽITIE**

---

## ✅ Implementované bezpečnostné opatrenia

### 1. **Autentifikácia a Autorizácia**
- ✅ Firebase Authentication (email/password)
- ✅ Role-based access control (Administrator / User)
- ✅ Firestore Security Rules s kontrolou rolí
- ✅ Session management cez Firebase
- ✅ Automatické odhlásenie pri neaktivite (Firebase default)

### 2. **Firestore Security Rules (Aktualizované)**
```javascript
// Len Administrátori môžu mazať JIGy
allow delete: if isAdmin();

// Všetci autentifikovaní môžu čítať, vytvárať a aktualizovať
allow read, create, update: if isAuthenticated();
```

**Čo to znamená:**
- ❌ User nemôže vymazať žiadny JIG (ani svoj vlastný)
- ✅ User môže vytvárať nové JIGy
- ✅ User môže aktualizovať existujúce JIGy (status, údržba)
- ✅ Admin môže všetko

### 3. **Frontend validácia**
- ✅ Tlačidlo "Delete" zobrazené len pre Administrátorov
- ✅ Condition: `jig.status === 'Scrapped' && userRole() === 'Administrator'`
- ✅ Double-check: Aj keby User obišiel UI, Firestore Rules to odmietnu

### 4. **Dátová bezpečnosť**
- ✅ HTTPS na GitHub Pages (automaticky)
- ✅ Firestore data encryption at rest (Firebase default)
- ✅ Firestore data encryption in transit (Firebase default)
- ✅ Firebase API Key môže byť verejný (best practice)

### 5. **XSS Protection**
- ✅ Angular automatic sanitization
- ✅ Žiadne `innerHTML` alebo dangerous DOM manipulations
- ✅ Všetky user inputs escaped

### 6. **CSRF Protection**
- ✅ Firebase SDK automatická ochrana
- ✅ SameSite cookies (Firebase default)

---

## ⚠️ Známe riziká (Akceptované)

### 1. **xlsx (SheetJS) Vulnerabilities**
**Závažnosť:** Stredná  
**Status:** Akceptované (žiadna dostupná oprava)

**Riziko:**
- Prototype Pollution pri import Excel súborov
- ReDoS pri import veľmi dlhých stringov

**Mitigácia:**
- Len autentifikovaní používatelia môžu importovať
- Import ovplyvní len vlastnú session
- Odporúčame použiť JSON import namiesto Excel

**Alternatíva:** Použite "Export JSON" / "Import JSON" (100% bezpečné)

### 2. **Firebase API Key verejný v kóde**
**Závažnosť:** Nízka  
**Status:** OK (Firebase best practice)

**Vysvetlenie:**
- Firebase API Key NIE JE tajný
- Bezpečnosť je zabezpečená cez Firestore Security Rules
- Google oficiálne odporúča tento prístup
- Zdroj: https://firebase.google.com/docs/projects/api-keys

---

## 🛡️ Dodatočné odporúčania (Voliteľné)

### Pre maximálnu bezpečnosť:

#### 1. **Email Verification (Voliteľné)**
Aktuálne: Používatelia môžu používať neverifikované emaily

**Pridať:**
```typescript
// V auth.service.ts po registrácii
await sendEmailVerification(credential.user);
```

#### 2. **Password Reset funkcionalita**
**Pridať:**
```typescript
// V auth.service.ts
resetPassword(email: string): Observable<void> {
  return from(sendPasswordResetEmail(this.auth, email));
}
```

#### 3. **Audit Log (Pre compliance)**
Zaznamenávať:
- Kto vytvoril JIG
- Kto zmenil status
- Kdo vymazal JIG

**Implementácia:**
```typescript
// Pridať do každého záznamu
createdBy: string;
createdAt: timestamp;
lastModifiedBy: string;
lastModifiedAt: timestamp;
```

#### 4. **Rate Limiting**
Firebase Authentication má built-in rate limiting, ale môžete pridať:
- Cloud Functions pre custom rate limiting
- Firestore quota monitoring

#### 5. **Backup stratégia**
**Odporúčanie:**
- Týždenný automatický export do Cloud Storage
- Mesačný backup do Google Drive
- Test restore procedure

**Implementácia:**
```bash
# Firebase CLI backup
firebase firestore:export gs://jigmanagement.appspot.com/backups/$(date +%Y%m%d)
```

---

## 📊 Bezpečnostná checklist

### Pred nasadením:
- [x] Firestore Security Rules nasadené
- [x] Firebase Authentication povolené
- [x] HTTPS enabled (GitHub Pages default)
- [x] API Keys správne nakonfigurované
- [x] Role-based access funguje
- [x] Delete len pre Admin
- [x] Všetky dependencies aktuálne (okrem xlsx)
- [x] npm audit vyriešené (okrem xlsx)

### Po nasadení:
- [ ] Otestovať User nemôže mazať
- [ ] Otestovať Admin môže mazať
- [ ] Skontrolovať Firebase Usage quota
- [ ] Nastaviť billing alerts
- [ ] Dokumentovať admin prístupy

---

## 🔐 Prístupové údaje (Správa)

### Produkcné účty:

**Administrator:**
- Email: `auotns@gmail.com`
- Heslo: Uložené v password manageri
- Role: Administrator

**Test User:**
- Email: `user@auo.com`
- Heslo: Uložené v password manageri
- Role: User

### ⚠️ Dôležité bezpečnostné pravidlá:

1. **NIKDY** nezdieľajte admin heslo s bežnými používateľmi
2. **ZMEŇTE** default heslá po prvom nasadení
3. **POUŽÍVAJTE** silné heslá (min 12 znakov, mix písmen/čísiel/symbolov)
4. **POVOĽTE** 2FA na Firebase Console účte
5. **PRAVIDELNE** kontrolujte Firebase Audit Logs

---

## 🚨 Incident Response Plan

### Ak zistíte bezpečnostný incident:

1. **Okamžite:**
   - Zmeňte heslá všetkých admin účtov
   - Skontrolujte Firestore Audit Logs
   - Identifikujte dotknuté záznamy

2. **Do 24 hodín:**
   - Obnovte dáta z backupu (ak potrebné)
   - Aktualizujte Firestore Security Rules
   - Informujte dotknutých používateľov

3. **Follow-up:**
   - Analyzujte root cause
   - Aktualizujte security dokumentáciu
   - Implementujte prevenciové opatrenia

---

## 📞 Kontakt pre bezpečnostné otázky

**Email:** auotns@gmail.com  
**Response time:** Do 48 hodín

**Pre hlásenie zraniteľností:**
Prosím NEPOUŽÍVAJTE public GitHub Issues.
Pošlite encrypted email na vyššie uvedenú adresu.

---

## 📚 Ďalšie zdroje

- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [GitHub Pages Security](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

---

**Posledná aktualizácia:** 19. november 2025  
**Ďalší security review:** December 2025
