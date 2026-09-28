# CyberShield — Password Strength Analyzer & Virtual Internship Lab

[![NIST SP 800-63B Aligned](https://img.shields.io/badge/NIST%20SP%20800--63B-Aligned-06b6d4.svg)](#)
[![Zero-Knowledge Privacy](https://img.shields.io/badge/Audit-Zero--Knowledge-10b981.svg)](#)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8.svg)](https://tailwindcss.com/)

> A practical virtual internship project in **Cybersecurity & Cryptography** featuring real-time password strength analysis, Shannon information entropy metrics, rockyou/breached credential dictionary screening, GPU threat-to-crack matrix modeling, interactive cryptographic hashing lab, and zero-knowledge audit logging.

---

## 📌 Project Overview

Traditional password policies (such as forced 90-day expiration and arbitrary symbol mandates) often degrade security by nudging users toward predictable mutations (e.g. `Winter2023!` $\to$ `Spring2024!`). 

**CyberShield** aligns with modern **NIST SP 800-63B Digital Identity Guidelines**:
- Prioritizes password **length and passphrases** over arbitrary complexity rules.
- Screens candidates against **real-world compromised password datasets** (RockYou, HaveIBeenPwned).
- Evaluates **Shannon information entropy** ($H = -\sum p_i \log_2(p_i)$) to penalize repetition collapse.
- Employs **zero-knowledge telemetry** where plaintext credentials are never logged or stored.

---

## 🚀 Key Features

### 1. 🛡️ Real-Time Strength Analyzer & Heuristics
- **Dynamic Character Pool ($R$):** Detects Lowercase ($26$), Uppercase ($26$), Digits ($10$), Symbols ($33$), and Unicode Runes ($50$).
- **Spatial Keyboard Walk Detection:** Traverses horizontal rows (forward/reverse) and keypad column diagonals.
- **Sequential Run & Repetition Detectors:** Flags consecutive runs (`abcdef`, `12345`) and repeating blocks (`ababab`).
- **Leetspeak Normalization Engine:** Automatically decodes `@` $\to$ `a`, `$` $\to$ `s`, `0` $\to$ `o`, `3` $\to$ `e` to foil obfuscation.
- **Passphrase Generator:** XKCD #936 compliant 4-word Diceware generator with CSPRNG entropy.

### 2. ⚡ Brute-Force Threat Modeling (Time-to-Crack)
Calculates real-world resistance ($2^{E-1} / \text{rate}$) across 4 operational scenarios:
1. **Online Throttled:** $100$ attempts / hour (standard enterprise web rate limit).
2. **Online Unthrottled API:** $100$ attempts / sec (unprotected endpoint).
3. **Offline Fast GPU Rig:** $100$ Billion hashes / sec (8x NVIDIA RTX 4090 cluster on MD5 / SHA-256).
4. **Offline Slow Hash:** $10,000$ hashes / sec (Key-stretched memory-hard bcrypt cost 12 / Argon2id).

### 3. 🧪 Authentication Concepts Lab
- **Cryptographic Hashing Sandbox:** Interactive SHA-256 vs. PBKDF2 (up to $100,000$ iterations) with real-time latency profiling.
- **Salt Demonstration:** Proves why 128-bit CSPRNG salts prevent Rainbow Table pre-computations and multi-user bulk cracking.
- **Rainbow Table Query Simulator:** Live test against known hashes to demonstrate vulnerability of unsalted digests.
- **NIST vs. Legacy Comparison:** Comprehensive matrix breaking down why 90-day resets fail.

### 4. 📝 Zero-Knowledge Audit Logging
- Enforces ISO/IEC 27001 & NIST 800-53 standards by never persisting plaintexts.
- Logs truncated SHA-256 fingerprint prefixes, masked length tokens, execution durations (ms), and severity badges (`INFO`, `SUCCESS`, `WARN`, `CRITICAL`).
- One-click export to **JSON** and **CSV**.

### 5. 🔬 Automated Testing Suite & Vectors
- 8 pre-configured test vectors verifying trivial PINs, keyboard walks, corporate legacy habits, leetspeak, repetition collapse, Diceware passphrases, CSPRNG random strings, and Unicode hybrids.
- Custom test assertion builder with live pass/fail verification.

### 6. 🎓 Virtual Internship Project Submission
- Complete architectural documentation and mathematical formulas.
- Interactive 5-question knowledge certification quiz.
- Formal project verification sign-off generating an official **Printable Certificate of Completion** and downloadable **Markdown Project Report**.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Vite 8)
- **Language:** TypeScript 7 (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Cryptography:** Native Web Crypto API (`crypto.subtle`, CSPRNG `getRandomValues`)
- **Animation & Effects:** Canvas-Confetti, Motion

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or pnpm

### Installation

```bash
# 1. Clone this repository
git clone https://github.com/<your-username>/password-strength-analyzer.git

# 2. Navigate to project root
cd password-strength-analyzer

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
```

---

## 🧮 Mathematical Foundations

### Shannon Entropy Formula
$$\text{Bits per symbol: } H = -\sum_{i=1}^{k} p_i \log_2(p_i)$$

Where $p_i$ is the empirical probability of character $i$ appearing in the input string of length $L$.

### Combinatorial Search Space
$$S = R^L \implies E_{\text{combinatorial}} = L \times \log_2(R)$$

### Effective Entropy with Heuristic Penalties
$$E_{\text{effective}} = \max(0, E_{\text{combinatorial}} - \sum \text{Penalties})$$

---

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
