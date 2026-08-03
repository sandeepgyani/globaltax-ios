# Global Tax & Cost of Living — iOS build notes

Single-file offline app (15-country tax calculator + CostCompass cost-of-living explorer + retirement & migration planners) wrapped with Capacitor 8.

- Bundle ID: `in.co.pcssolutions.globaltax` (ASC bundle id YUH2CL6TWT)
- Display name: Global Tax · Store name: "Global Tax & Cost of Living"
- Web content: `www/index.html` (self-contained, no network calls; synced from `C:\Users\sande\OneDrive\Desktop\Global Tax Calculator.html`)
- Custom `GlobalTaxViewController` (CAPBridgeViewController subclass) in AppDelegate.swift
- `ITSAppUsesNonExemptEncryption=false` in Info.plist
- Signing: cert C4U99ML96C (Apple Distribution: Sandeep Gyani) + profile "globaltax appstore profile" (`globaltax_appstore_profile.mobileprovision`, UUID 56b16f0e-5435-4bef-a9d0-71986fa009d7) — upload to Codemagic code-signing identities as `globaltax_appstore_profile`
- Build: Codemagic `ios-release` workflow (mac_mini_m2), auto-publishes to TestFlight; repo https://github.com/sandeepgyani/globaltax-ios (public, branch main)
- ASC helper scripts: asc-register (DONE 3 Aug 2026) / asc-finalize / asc-listing / asc-screenshots / asc-attach / asc-buildpoll / asc-buildcheck / asc-submit — all take Issuer ID as argv[2]: 9ac95791-6854-413d-aca4-3efdc7e535fb
- ⚠️ ASC app record is UI-only (POST /v1/apps forbidden) — create in ASC web: New App, iOS, name "Global Tax & Cost of Living", bundle in.co.pcssolutions.globaltax, SKU globaltax
- ⚠️ Screenshots MUST be JPEG (PNG rejected) — iPhone 6.5" 1284×2778 + iPad 12.9" 2048×2732
- Privacy policy (already live): https://sandeepgyani.github.io/app-privacy-policies/globaltax-privacy-policy.html
