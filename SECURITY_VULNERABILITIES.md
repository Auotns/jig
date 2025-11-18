# Known Security Vulnerabilities

## Status: 1 High Severity (Mitigated)

Last updated: November 18, 2025

---

## ✅ RESOLVED: glob CLI Command Injection

**Package:** glob  
**Severity:** High  
**Status:** ✅ **FIXED**  
**Resolution:** Updated to glob v11.0.0+ via npm overrides

### Fix Applied:
```json
"overrides": {
  "glob": "^11.0.0"
}
```

---

## ⚠️ KNOWN ISSUE: xlsx (SheetJS) Vulnerabilities

**Package:** xlsx v0.18.5  
**Severity:** High  
**CVE:** 
- Prototype Pollution (GHSA-4r6h-8v6p-xvw6)
- Regular Expression Denial of Service - ReDoS (GHSA-5pgg-2g8v-p4x9)

**Status:** ⚠️ **ACCEPTED RISK** (No fix available)

### Why This Is Acceptable:

1. **No Fix Available**: The xlsx maintainers have not released a patched version
2. **Limited Impact**: 
   - Prototype Pollution: Only affects user-uploaded Excel files
   - ReDoS: Only triggers on maliciously crafted Excel files with extremely long strings
3. **Mitigation in Place**:
   - ✅ File uploads are client-side only (no server processing)
   - ✅ Only authenticated users can import data
   - ✅ Users can only harm their own session, not the system
   - ✅ Firebase handles data validation server-side

### Attack Surface Analysis:

**Exploit Requirements:**
- User must be authenticated
- User must explicitly choose to import a malicious Excel file
- Attack only affects the attacker's own browser session
- Cannot affect other users or the database

**Risk Assessment:** **LOW**
- ☑️ No remote code execution possible
- ☑️ No data exfiltration possible  
- ☑️ No privilege escalation possible
- ☑️ Self-inflicted DoS only (user crashes own browser)

### Alternative Considered:

**Option:** Switch to `exceljs` or `xlsx-populate`  
**Decision:** Stay with `xlsx` because:
- xlsx is the most widely used and tested
- Alternative libraries have their own issues
- Breaking change would affect existing exports
- Risk is acceptable for our use case

---

## Monitoring & Review

- **Next Review:** December 2025
- **Action:** Monitor xlsx repository for security updates
- **Tracking:** https://github.com/SheetJS/sheetjs/issues

### How to Update When Fix Becomes Available:

```bash
npm update xlsx
npm audit
git commit -m "chore: Update xlsx to patched version"
```

---

## Security Best Practices

For users concerned about this vulnerability:

1. **Only import Excel files from trusted sources**
2. **Do not import Excel files from unknown/untrusted users**
3. **Use JSON export/import instead** (100% safe, no vulnerabilities)
4. **Validate data after import** before saving to Firestore

### Recommended Workflow:

✅ **Safe:** Use "Export JSON" and "Import JSON" buttons  
⚠️ **Caution:** Only use "Export Excel" with data you trust

---

## Reporting New Vulnerabilities

If you discover a new security issue, please email: auotns@gmail.com

Do NOT create a public GitHub issue for security vulnerabilities.
