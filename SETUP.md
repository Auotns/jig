# 🚀 Quick Setup Guide

## Krok za krokom inštrukcie pre nasadenie JIG Management System

### ⚡ Rýchly Štart (5 minút)

```bash
# 1. Nainštalujte Node.js dependencies
npm install

# 2. Spustite development server
npm run dev

# 3. Otvorte http://localhost:3000 v prehliadači
```

**Prihlasovacie údaje:**

- Admin: `admin` / `password`
- User: `user` / `password`

---

## 📦 Inštalácia Dependencies

### Automatická inštalácia (Odporúčané)

```powershell
# V PowerShell spustite:
npm install
```

Toto nainštaluje všetky potrebné balíčky:

- Angular 20.3 framework
- Angular Router
- RxJS pre reactive programming
- Tailwind CSS pre styling
- TypeScript compiler
- Vite build tool

### Manuálna kontrola

Ak chcete skontrolovať, že všetko je nainštalované:

```powershell
# Skontrolujte verziu Node.js (min 20.x)
node --version

# Skontrolujte npm verziu
npm --version

# Zoznam nainštalovaných packages
npm list --depth=0
```

---

## 🏗️ Build Aplikácie

### Development Build

```powershell
npm run build:dev
```

Výstup: `dist/` folder s unoptimalizovanou verziou

### Production Build

```powershell
npm run build
```

Výstup: `dist/` folder s optimalizovanou verziou pre GitHub Pages

**Build options v package.json:**

- Minifikácia kódu
- Tree-shaking (odstránenie nepoužitého kódu)
- Base href nastavený na `/JIG/`

---

## 🌐 GitHub Pages Setup

### Krok 1: Vytvorte GitHub Repozitár

1. Prejdite na https://github.com/new
2. Zadajte názov: `JIG`
3. Zvoľte Public (pre GitHub Pages free tier)
4. Neklikajte na "Initialize with README" (už máte)
5. Kliknite "Create repository"

### Krok 2: Upload Kódu

```powershell
# V priečinku JIG spustite:
git init
git add .
git commit -m "Initial commit: JIG Management System v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/JIG.git
git push -u origin main
```

**⚠️ Nahraďte `YOUR_USERNAME` vaším GitHub používateľským menom!**

### Krok 3: Povoliť GitHub Pages

1. V GitHub repozitári prejdite do **Settings**
2. V ľavom menu kliknite **Pages**
3. V sekcii **Source** vyberte:
   - Source: **GitHub Actions** (NIE Branch!)
4. Uložte

### Krok 4: Sledovať Deployment

1. Prejdite do záložky **Actions**
2. Uvidíte workflow "Deploy to GitHub Pages" spustený
3. Počkajte cca 2-3 minúty
4. Po dokončení bude aplikácia dostupná na:
   ```
   https://YOUR_USERNAME.github.io/JIG/
   ```

---

## 🔧 Konfigurácia

### Upravte Base Href

Ak ste zmenili názov repozitára z `JIG` na niečo iné, upravte v `package.json`:

```json
{
  "scripts": {
    "build": "ng build --configuration production --base-href /NOVY_NAZOV/"
  }
}
```

### Aktualizujte README

V súboroch `README_NEW.md` a `DEPLOYMENT.md` nahraďte:

- `YOUR_USERNAME` → váš GitHub username
- `JIG` → názov vášho repozitára (ak je iný)

**Príklad:**

```
https://YOUR_USERNAME.github.io/JIG/
```

↓

```
https://johndoe.github.io/JIG/
```

---

## ✅ Post-Deployment Checklist

Po nasadení otestujte:

### Funkčné Testy

- [ ] Prihlásenie (admin/user)
- [ ] Zobrazenie inventára
- [ ] Filtrovanie a vyhľadávanie
- [ ] Pridanie nového JIGu
- [ ] Detail JIGu
- [ ] Záznam údržby
- [ ] Zmena statusu
- [ ] Export dát
- [ ] Import dát (admin)
- [ ] Odhlásenie

### Jazyky

- [ ] Angličtina (EN)
- [ ] Slovenčina (SK)
- [ ] Nemčina (DE)

### Perzistencia

- [ ] Data zostávajú po F5 refresh
- [ ] Používateľ zostane prihlásený
- [ ] Jazyk zostane nastavený

### Responsívnosť

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Browser Compatibility

- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

---

## 🐛 Troubleshooting

### Problém: "Cannot find module '@angular/core'"

**Riešenie:**

```powershell
rm -rf node_modules, package-lock.json
npm install
```

### Problém: GitHub Actions workflow zlyhá

**Riešenie:**

1. Skontrolujte v Settings → Actions → General:
   - Workflow permissions: "Read and write permissions" ✅
2. Skontrolujte v Settings → Pages:
   - Source: "GitHub Actions" ✅

### Problém: 404 Error po deploye

**Riešenie:**
Skontrolujte `--base-href` v `package.json`:

```json
"build": "ng build --configuration production --base-href /JIG/"
```

Musí zodpovedať názvu repozitára!

### Problém: Aplikácia sa nenačíta (biela stránka)

**Riešenie:**

1. Otvorte DevTools (F12)
2. Pozrite Console tab
3. Pravdepodobne zlý base-href
4. Skontrolujte GitHub Actions logs

### Problém: localStorage nefunguje

**Riešenie:**

- GitHub Pages používa HTTPS, localStorage by malo fungovať
- Skontrolujte Browser Privacy Settings
- Pozrite Application → Local Storage v DevTools

---

## 📊 Development Workflow

### Denne Development Cyklus

```powershell
# 1. Pull latest changes
git pull origin main

# 2. Vytvorte feature branch
git checkout -b feature/my-new-feature

# 3. Urobte zmeny v kóde

# 4. Test lokálne
npm run dev

# 5. Build test
npm run build

# 6. Commit
git add .
git commit -m "feat: Add new feature"

# 7. Push
git push origin feature/my-new-feature

# 8. Vytvorte Pull Request na GitHub

# 9. Po merge do main, GitHub Actions automaticky deployne
```

### Konvencie Commit Messages

```
feat: Nová funkcia
fix: Oprava bugu
docs: Zmeny v dokumentácii
style: Formatting, missing semi colons, etc
refactor: Refactoring kódu
test: Pridanie testov
chore: Build process, dependencies
```

---

## 🔐 Environment Variables (Pre budúcnosť)

Keď budete pridávať backend, použite GitHub Secrets:

1. V GitHub repo → Settings → Secrets → Actions
2. Kliknite "New repository secret"
3. Pridajte:
   - `API_URL` - URL vášho backend API
   - `JWT_SECRET` - Secret pre JWT tokens
   - atď.

V workflow súbore:

```yaml
- name: Build
  env:
    API_URL: ${{ secrets.API_URL }}
  run: npm run build
```

---

## 📚 Ďalšie Zdroje

- [README_NEW.md](./README_NEW.md) - Prehľad projektu
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailný deployment guide
- [USER_GUIDE.md](./USER_GUIDE.md) - Používateľská príručka
- [ANALYSIS.md](./ANALYSIS.md) - Technická analýza a odporúčania
- [CHANGELOG.md](./CHANGELOG.md) - História zmien

---

## 🆘 Pomoc

Ak narazíte na problémy:

1. **Skontrolujte dokumentáciu** v tomto priečinku
2. **GitHub Issues** - vytvorte issue s detailmi
3. **StackOverflow** - Angular/GitHub Pages tagy
4. **Angular Discord** - https://discord.gg/angular

---

## ✨ Gratulujeme!

Vaša JIG Management aplikácia je teraz pripravená na deployment! 🎉

**Ďalšie kroky:**

1. ✅ Setup GitHub repository
2. ✅ Push code
3. ✅ Povoliť GitHub Pages
4. ✅ Testovať live URL
5. 🔜 Začať s vylepšeniami z ANALYSIS.md

**Happy coding! 🚀**
