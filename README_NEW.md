<div align="center">

# 🔧 JIG Management System

**Moderný systém pre správu JIG inventáru a údržby**

[![Deploy](https://github.com/YOUR_USERNAME/JIG/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/JIG/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[🌐 Live Demo](https://YOUR_USERNAME.github.io/JIG/) | [📖 Dokumentácia](./DEPLOYMENT.md) | [🐛 Report Bug](https://github.com/YOUR_USERNAME/JIG/issues)

</div>

---

## 📋 O Projekte

JIG Management System je webová aplikácia pre správu a sledovanie JIG (Jigs, fixtures, test equipment) inventára vo výrobnom prostredí. Aplikácia poskytuje kompletné riešenie pre:

- ✅ Registráciu a evidenciu JIGov
- 📊 Sledovanie statusu a umiestnenia
- 🔧 Záznamy o údržbe a kontrolách
- 👥 Role-based prístup (Admin/User)
- 🌍 Viacjazyčnosť (EN, SK, DE)
- 💾 Automatické ukladanie do localStorage
- 📤 Import/Export dát

## ✨ Hlavné Funkcie

### 🎯 Inventár Management

- Prehľadná tabuľka všetkých JIGov
- Filtrovanie podľa zákazníka a statusu
- Vyhľadávanie v reálnom čase
- Farebné označenie statusov

### 📝 Detailné Záznamy

- Kompletné informácie o každom JIGu
- História údržby s výsledkami kontrol
- História presunov a transferov
- Zmena statusu jedným kliknutím

### 🔐 Autentifikácia a Oprávnenia

- Prihlásenie používateľov
- Admin a User role
- Rôzne oprávnenia pre mazanie a import/export

### 🌐 Internationalization

- Slovenčina (SK)
- Angličtina (EN)
- Nemčina (DE)

## 🚀 Rýchly Štart

### Predpoklady

- Node.js 20+
- npm alebo yarn

### Inštalácia

```bash
# 1. Klonujte repozitár
git clone https://github.com/YOUR_USERNAME/JIG.git
cd JIG

# 2. Nainštalujte závislosti
npm install

# 3. Spustite vývojový server
npm run dev
```

Aplikácia bude dostupná na `http://localhost:3000`

### Prihlasovacie údaje

**Administrátor:**

- Username: `admin`
- Password: `password`

**Bežný používateľ:**

- Username: `user`
- Password: `password`

## 🏗️ Build & Deploy

### Lokálny Build

```bash
# Vývojová verzia
npm run build:dev

# Produkčná verzia
npm run build
```

### GitHub Pages Deployment

Aplikácia je automaticky nasadená na GitHub Pages pri každom pushu na `main` branch.

**Setup kroky:**

1. Fork/Clone tohto repozitára
2. Povoľte GitHub Pages v Settings → Pages
3. Zvoľte "GitHub Actions" ako source
4. Push do `main` branch spustí deployment

Viac informácií v [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Technológie

- **Framework:** Angular 20.3 (Standalone Components)
- **State Management:** Angular Signals
- **Styling:** Tailwind CSS
- **Forms:** Reactive Forms
- **Build Tool:** Angular CLI + Vite
- **Deployment:** GitHub Pages + GitHub Actions
- **Storage:** localStorage API

## 📁 Štruktúra Projektu

```
JIG/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── src/
│   ├── components/
│   │   ├── jig-inventory/      # Tabuľka inventára
│   │   ├── jig-detail/         # Detail JIGu
│   │   ├── jig-form/           # Formulár nového JIGu
│   │   ├── maintenance-form/   # Formulár údržby
│   │   └── login/              # Prihlásenie
│   ├── models/
│   │   ├── jig.model.ts        # JIG dátový model
│   │   └── user.model.ts       # User model
│   ├── services/
│   │   ├── jig.service.ts      # JIG business logika
│   │   ├── auth.service.ts     # Autentifikácia
│   │   ├── storage.service.ts  # localStorage wrapper
│   │   └── translation.service.ts # i18n
│   ├── pipes/
│   │   └── translate.pipe.ts   # Translation pipe
│   ├── environments/           # Env konfigurácia
│   └── app.component.ts        # Root component
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

## 🎨 Používateľské Rozhranie

### Dashboard

Hlavný prehľad s filtrovacími možnosťami a vyhľadávaním.

### JIG Detail

Kompletné informácie vrátane histórie údržby a transferov.

### Formuláre

Validované formuláre pre registráciu JIGov a záznamov údržby.

## 💾 Perzistencia Dát

Aplikácia používa **localStorage** pre ukladanie:

- JIG inventár
- Používateľské sedenie
- Jazykové nastavenia

Dáta zostávajú zachované aj po zatvorení prehliadača.

## 🔒 Bezpečnosť

⚠️ **Upozornenie:** Súčasná implementácia používa mock autentifikáciu vhodnú pre demo účely. Pre produkčné nasadenie odporúčame:

- Implementovať backend API s JWT tokens
- Použiť HTTPS
- Hashované heslá (bcrypt/Argon2)
- Rate limiting
- CSRF protection

## 📊 Budúce Vylepšenia

- [ ] Backend API (Node.js/Express alebo .NET)
- [ ] Databáza (PostgreSQL/MongoDB)
- [ ] Real-time collaboration (WebSockets)
- [ ] QR code scanning pre JIGy
- [ ] Email notifikácie pre údržbu
- [ ] Advanced reporting a analytics
- [ ] PWA support pre offline použitie
- [ ] Unit a E2E testy
- [ ] Docker containerizácia

## 🤝 Príspevky

Príspevky sú vítané! Prosím:

1. Fork the repository
2. Vytvorte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmeny (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otvorte Pull Request

## 📄 Licencia

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Autor

**AUO Corporation**

## 🙏 Poďakovanie

- Angular Team za výborný framework
- Tailwind CSS za utility-first styling
- Open source community

---

<div align="center">

**Vyrobené s ❤️ pre efektívnu správu JIG inventáru**

[⬆ Späť na vrch](#-jig-management-system)

</div>
