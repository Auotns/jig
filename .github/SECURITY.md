# Security Policy

## Firebase API Keys in Source Code

This repository contains Firebase configuration including API keys in the source code (`src/environments/`). **This is intentional and safe.**

### Why Firebase API Keys Are Public

Firebase API keys are not secret keys. They are used to identify your Firebase project with Google's servers. According to [Firebase documentation](https://firebase.google.com/docs/projects/api-keys):

> Unlike how API keys are typically used, API keys for Firebase services are not used to control access to backend resources; that can only be done with Firebase Security Rules. Usually, you need to fastidiously guard API keys (for example, by using a vault service or setting the keys as environment variables); however, API keys for Firebase services are ok to include in code or checked-in config files.

### Security is Enforced Through:

1. **Firestore Security Rules** - Control who can read/write data
2. **Firebase Authentication** - Verify user identity
3. **Authorized domains** - Only specified domains can use Firebase Authentication

### Our Security Measures

- ✅ Firestore Security Rules require authentication for all operations
- ✅ Only authenticated users can access JIG data
- ✅ GitHub Pages domain is added to Firebase authorized domains
- ✅ Users can only modify their own profile data

### Reporting Security Issues

If you discover a security vulnerability, please email: auotns@gmail.com

Do NOT create a public GitHub issue for security vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

When deploying this application:

1. Review and update Firestore Security Rules regularly
2. Monitor Firebase Console for unusual activity
3. Use strong passwords for admin accounts
4. Enable Firebase App Check for additional protection (optional)
5. Regularly update dependencies (`npm audit fix`)
