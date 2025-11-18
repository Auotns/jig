# 🚀 Deployment Guide - JIG Management System

Komplexný návod pre nasadenie JIG Management aplikácie na GitHub Pages.

## 📋 Obsah

- [GitHub Pages Setup](#github-pages-setup)
- [Automatický Deployment](#automatický-deployment)
- [Manuálny Deployment](#manuálny-deployment)
- [Konfigurácia](#konfigurácia)
- [Troubleshooting](#troubleshooting)

---

## 🌐 GitHub Pages Setup

### Krok 1: Príprava Repozitára

1. **Vytvorte nový GitHub repozitár** alebo použite existujúci
2. **Uploadnite kód** do repozitára:

```bash
git init
git add .
git commit -m "Initial commit - JIG Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/JIG.git
git push -u origin main
```

### Krok 2: Povoliť GitHub Pages

1. Prejdite do **Settings** vášho repozitára
2. V ľavom menu kliknite na **Pages**
3. V sekcii **Source** vyberte:
   - Source: **GitHub Actions** (nie Branch!)
4. Uložte nastavenia

### Krok 3: Nastavenie Base URL

V súbore `package.json` upravte build script s vaším používateľským menom:

```json
"build": "ng build --configuration production --base-href /JIG/"
```

Kde `/JIG/` je názov vášho repozitára.

---

## ⚙️ Automatický Deployment

### GitHub Actions Workflow

Workflow súbor `.github/workflows/deploy.yml` je už nakonfigurovaný a nasadí aplikáciu automaticky pri každom pushu do `main` branch.

**Čo sa stane pri pushu:**

1. ✅ Nainštalujú sa dependencies
2. ✅ Zbuilduje sa produkčná verzia
3. ✅ Vytvorí sa artifact
4. ✅ Nasadí sa na GitHub Pages

### Sledovanie Deploymentu

1. Prejdite do záložky **Actions** vo vašom repozitári
2. Uvidíte bežiaci/dokončený workflow "Deploy to GitHub Pages"
3. Kliknite na workflow pre detaily
4. Po úspešnom deploymente bude aplikácia dostupná na:
   ```
   https://YOUR_USERNAME.github.io/JIG/
   ```

---

## 🔧 Manuálny Deployment

Ak chcete nasadiť manuálne bez GitHub Actions:

### Option 1: gh-pages Package

```bash
# Nainštalujte gh-pages
npm install --save-dev gh-pages

# Pridajte script do package.json
"deploy": "ng build --configuration production --base-href /JIG/ && gh-pages -d dist"

# Spustite deployment
npm run deploy
```

### Option 2: Manuálny Push

```bash
# Build aplikácie
npm run build

# Prejdite do dist folder
cd dist

# Inicializujte git a pushite do gh-pages branch
git init
git add .
git commit -m "Deploy"
git branch -M gh-pages
git remote add origin https://github.com/YOUR_USERNAME/JIG.git
git push -f origin gh-pages
```

---

## ⚙️ Konfigurácia

### Angular Configuration

V `angular.json` je už nakonfigurovaný output path:

```json
{
  "outputPath": {
    "base": "./dist",
    "browser": "."
  }
}
```

### Base Href

**Dôležité:** `--base-href` musí zodpovedať názvu vášho repozitára:

- Repozitár: `https://github.com/username/JIG`
- Base href: `/JIG/`
- URL: `https://username.github.io/JIG/`

### Environment Variables

Pre rôzne prostredia:

**Development** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  version: "1.0.0-dev",
  apiUrl: "http://localhost:3000/api",
};
```

**Production** (`src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  version: "1.0.0",
  apiUrl: "", // Backend URL keď bude implementovaný
};
```

---

## 🔍 Troubleshooting

### Problem 1: 404 Error po deploye

**Riešenie:**

- Skontrolujte `--base-href` v build scripte
- Musí byť `/REPOSITORY_NAME/` s lomítkami na začiatku aj konci

### Problem 2: Aplikácia sa nenačíta (biela stránka)

**Riešenie:**

1. Otvorte DevTools (F12) a pozrite Console
2. Pravdepodobne zlý `base-href` alebo chyba v budovaní
3. Skontrolujte deploy logs v GitHub Actions

### Problem 3: GitHub Actions workflow zlyhá

**Riešenie:**

1. Skontrolujte, či máte povolené GitHub Pages v Settings
2. Overte, že ste zvolili "GitHub Actions" ako source
3. Skontrolujte Permissions v Settings → Actions → General:
   - Workflow permissions: "Read and write permissions"

### Problem 4: Dependencies chyby

**Riešenie:**

```bash
# Vyčistite cache a reinstalujte
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problem 5: localStorage nefunguje

**Riešenie:**

- GitHub Pages používa HTTPS, localStorage by malo fungovať
- Skontrolujte Browser Privacy settings
- Otvorte Application tab v DevTools → Local Storage

---

## 🔐 Bezpečnosť Pre Produkciu

Pre produkčné nasadenie odporúčame:

### 1. Backend API

```
Frontend (GitHub Pages) → Backend API (Heroku/Vercel/AWS)
                          ↓
                      Database (PostgreSQL/MongoDB)
```

### 2. Autentifikácia

- Implementujte JWT tokens
- Použite HTTPS (GitHub Pages má default)
- Secure cookie storage
- Refresh token mechanizmus

### 3. Environment Secrets

```bash
# Pre GitHub Actions secrets
Settings → Secrets → Actions → New repository secret

# Pridajte:
- API_URL
- JWT_SECRET (pre backend)
```

---

## 📊 Post-Deployment Checklist

Po úspešnom deploye:

- [ ] Otestujte všetky funkcie na live URL
- [ ] Overte localStorage perzistenciu
- [ ] Skontrolujte responzívnosť na mobile
- [ ] Testujte všetky tri jazyky (EN, SK, DE)
- [ ] Vyskúšajte import/export funkcionalitu
- [ ] Overte autentifikáciu a role
- [ ] Skontrolujte Console pre errory
- [ ] Testujte na rôznych prehliadačoch

---

## 🆘 Podpora

Ak narazíte na problémy:

1. **Skontrolujte GitHub Actions logs** - najčastejší zdroj info
2. **Browser DevTools Console** - frontend chyby
3. **GitHub Issues** - vytvorte issue s error logmi
4. **Angular Build Logs** - `npm run build` pre lokálne testovanie

---

## 🔄 Update Workflow

Pre update aplikácie:

```bash
# 1. Urobte zmeny v kóde
# 2. Commit a push
git add .
git commit -m "Feature: Your feature description"
git push origin main

# 3. GitHub Actions automaticky deployne
# 4. Sledujte v Actions tab
# 5. Overte na live URL
```

---

## 📈 Monitoring

### Analytics (Voliteľné)

Pridajte Google Analytics do `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

---

## ✅ Záver

Vaša aplikácia je teraz nasadená a dostupná na:

```
https://YOUR_USERNAME.github.io/JIG/
```

Pre ďalšie otázky alebo problémy vytvorte issue v repozitári.

**Happy Deploying! 🚀**
