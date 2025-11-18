# Firebase Setup Guide

## Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Project ID: `jigmanagement`

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to Firebase Console
2. Click "Add Project"
3. Enter project name: `jigmanagement`
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get Started"
3. Enable **Email/Password** provider
4. Save changes

### 1.3 Enable Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Choose **production mode** (you can adjust rules later)
4. Select your region (choose closest to your users)
5. Click "Enable"

### 1.4 Configure Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write jigs
    match /jigs/{jigId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 2: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `JIG Management Web`
5. Copy the Firebase configuration object

## Step 3: Update Environment Files

### Development Environment

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  version: "1.0.0-dev",
  appName: "JIG Management System (Dev)",
  apiUrl: "http://localhost:3000/api",
  enableDebugLog: true,
  firebase: {
    projectId: "jigmanagement",
    appId: "YOUR_APP_ID", // From Firebase Console
    storageBucket: "jigmanagement.firebasestorage.app",
    apiKey: "YOUR_API_KEY", // From Firebase Console
    authDomain: "jigmanagement.firebaseapp.com",
    messagingSenderId: "YOUR_SENDER_ID", // From Firebase Console
  },
};
```

### Production Environment

Update `src/environments/environment.prod.ts` with the same Firebase config.

## Step 4: Create Initial Admin User

Since Firebase Authentication requires email/password, you'll need to create an admin user:

### Option A: Using Firebase Console

1. Go to **Authentication > Users**
2. Click "Add User"
3. Email: `admin@jigmanagement.com`
4. Password: Create a secure password
5. Click "Add User"

### Option B: Using the App (Registration Helper)

The app includes a `register()` method in AuthService for initial setup:

```typescript
// Temporary code to create admin user - remove after use
this.authService
  .register("admin@jigmanagement.com", "your-password", "Administrator")
  .subscribe((success) => console.log("Admin created:", success));
```

**Important:** After creating the admin user, set their `displayName` to "Administrator" in Firebase Console:

1. Go to **Authentication > Users**
2. Click on the user
3. Edit **Display Name** to: `Administrator`

## Step 5: Testing

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` and login with:

- Email: `admin@jigmanagement.com`
- Password: Your admin password

### Production Deployment

The app will automatically use production Firebase config when built for production.

## Security Best Practices

### 1. API Key Security

- Firebase API keys are safe to include in client code
- They identify your Firebase project
- Security is enforced through Firestore rules, not API keys

### 2. Firestore Rules Enhancement

For production, enhance rules to check user roles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.name == 'Administrator';
    }

    match /jigs/{jigId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if isAdmin();
    }
  }
}
```

### 3. Custom Claims (Advanced)

For production systems, use Firebase Custom Claims instead of displayName for roles:

```javascript
// Firebase Admin SDK (backend)
admin.auth().setCustomUserClaims(uid, { role: "Administrator" });
```

## Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"

- Check that `apiKey` in environment files matches Firebase Console
- Verify Firebase Authentication is enabled

### Issue: "Missing or insufficient permissions"

- Check Firestore security rules
- Verify user is authenticated
- Ensure rules allow read/write for authenticated users

### Issue: Login fails silently

- Check browser console for errors
- Verify email/password are correct
- Check Firebase Authentication is enabled with Email/Password provider

## Data Migration from localStorage

To migrate existing localStorage data to Firestore:

1. Export data using "Export Data" button (downloads JSON)
2. Login to the new Firebase-enabled app
3. Use "Import Data" button to upload the JSON file
4. Data will be imported to Firestore automatically

## Firebase Pricing

- **Spark Plan (Free)**:

  - 50,000 reads/day
  - 20,000 writes/day
  - 1 GB storage
  - Suitable for small teams

- **Blaze Plan (Pay as you go)**:
  - Free tier included
  - Additional usage billed
  - Required for production apps

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure Authentication
3. ✅ Create Firestore database
4. ✅ Update environment files
5. ✅ Create admin user
6. ✅ Test login
7. ✅ Import existing data (if any)
8. 🔄 Deploy to GitHub Pages
9. 🔄 Monitor usage in Firebase Console

## Support

For issues or questions:

- Firebase Documentation: https://firebase.google.com/docs
- Angular Fire Documentation: https://github.com/angular/angularfire
