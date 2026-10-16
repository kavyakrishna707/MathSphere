# MathSphere 🌐📐
> **"Explore Mathematics. Expand Your Mind."**

MathSphere is a modern, responsive, client-side educational mathematics platform built entirely with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**. It requires **no frameworks (no React)**, **no backend**, **no database**, and **no API keys**.

MathSphere is engineered specifically for static web hosting platforms such as **GitHub Pages** and **Vercel**, delivering instant load speeds, complete offline functionality, and high cryptographic/code safety by strictly avoiding `eval()`.

---

## 📑 Table of Contents
1. [Features Overview](#1-features-overview)
2. [Design System & UI/UX](#2-design-system--uiux)
3. [File Structure & Purpose](#3-file-structure--purpose)
4. [How to Run Locally](#4-how-to-run-locally)
5. [Comprehensive Feature Testing Guide](#5-comprehensive-feature-testing-guide)
6. [How to Upload to GitHub](#6-how-to-upload-to-github)
7. [Deploying to GitHub Pages & Vercel](#7-deploying-to-github-pages--vercel)
8. [Architecture & Educational Notes](#8-architecture--educational-notes)

---

## 1. Features Overview

### A. Home Page & Tool Finder
- **Branding & Hero:** Glowing SVG orbital sphere logo with the official tagline.
- **Dynamic Search & Filtering:** Filter tools by category (*Calculators*, *Linear Algebra*, *Number Systems*, *Visuals & Graphing*, *Learning & Practice*) or search by keywords in real time.
- **Direct Launch Cards:** Clear descriptions, category tags, and jump links for all 7 mathematical features.

### B. Scientific Calculator (Safe Custom AST Engine)
- **Zero `eval()` Implementation:** Custom tokenizer, Shunting-Yard algorithm (infix to postfix/RPN conversion), and Reverse Polish Notation evaluator.
- **Operations Supported:** Addition, subtraction, multiplication, division, modulo, exponents ($x^y$), square roots ($\sqrt{x}$), natural log ($\ln$), base-10 log ($\log$), parentheses grouping, and mathematical constants ($\pi$, $e$).
- **Trigonometry:** Sine ($\sin$), Cosine ($\cos$), and Tangent ($\tan$) with instant **DEG / RAD** angle mode toggle.
- **Safety & Error Handling:** Safe error traps for division by zero, negative square roots, and mismatched parentheses without crashing.
- **History Tape:** Displays recent calculations with click-to-restore and clear history functions.
- **Full Keyboard Navigation:** Supports digits, operators, Enter, Backspace, and Escape.

### C. Matrix Calculator (Linear Algebra)
- **Dynamic Dimensions:** Configure matrices $A$ and $B$ independently from $1 \times 1$ up to $4 \times 4$.
- **Binary Matrix Operations:**
  - Matrix Addition ($A + B$) with dimension compatibility check ($r_1 = r_2$ and $c_1 = c_2$).
  - Matrix Subtraction ($A - B$).
  - Matrix Multiplication ($A \times B$) with inner dimension validation ($c_1 = r_2$).
  - Swap matrices ($A \leftrightarrow B$).
- **Unary Operations:**
  - Transpose ($A^T$, $B^T$).
  - Determinant ($\det A$, $\det B$) for square matrices using cofactor expansion and Gaussian elimination.
  - Matrix Inverse ($A^{-1}$, $B^{-1}$) using Gauss-Jordan elimination with singular matrix detection ($\det = 0$).
- **Educational Explanations:** Explains why dimensions are incompatible or why singular matrices cannot be inverted.
- **Presets & Copy:** $2\times 2$ Identity, $3\times 3$ Identity, systems of equations, random integer generation, and clipboard export.

### D. Number System Converter
- **4 Radix Conversions:** Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16).
- **Real-Time Synchronous Input:** Modifying any input immediately updates all other three bases.
- **Strict Digit Validation:** Real-time character checking highlights invalid characters (e.g., typing '8' or '9' in octal, or '2' in binary) with explicit warning messages.
- **Step-by-Step Breakdown:**
  - *Decimal to Binary / Octal / Hex:* Repeated division tables showing dividends, quotients, and remainders read bottom-to-top.
  - *Binary to Decimal:* Positional notation expansion $\sum d_i \times 2^i$.

### E. Algebra Solver
- **Linear Equation Solver ($ax + b = c$):**
  - Isolates $x = (c - b) / a$ step-by-step.
  - Handles edge cases: $a = 0$ with $b = c$ (infinite solutions) and $a = 0$ with $b \neq c$ (no solution).
- **Quadratic Equation Solver ($ax^2 + bx + c = 0$):**
  - Calculates discriminant $\Delta = b^2 - 4ac$.
  - Real roots when $\Delta > 0$, repeated root when $\Delta = 0$, and complex conjugate roots ($u \pm vi$) when $\Delta < 0$.
  - Degenerates gracefully to linear equation when $a = 0$.
  - Displays parabola vertex $(h, k)$ and opening orientation (upwards/downwards).

### F. Interactive Graph Plotter
- **Pure Canvas Implementation:** High-DPI (Retina-ready) HTML5 `<canvas>` without external charting packages.
- **Built-in Functions:** Presets for $y = x$, $y = x^2$, $y = x^3$, $y = \sin(x)$, $y = \cos(x)$, and custom mathematical expressions.
- **Range & View Controls:** Custom $X_{min}$, $X_{max}$, $Y_{min}$, $Y_{max}$ with quick zoom presets (Standard, Trigonometric $-2\pi \dots 2\pi$, Zoom In, Zoom Out).
- **Interactive Cursor Tracker:** Real-time hover crosshair and coordinate badge showing exact $(x, y)$ values on the curve.
- **PNG Export:** Single-click export to download high-resolution graph screenshots.

### G. Interactive Math Quiz
- **10 Core Questions:** Covering arithmetic, binary conversions, matrix algebra, quadratic formulas, and trigonometry.
- **Instant Educational Feedback:** Color-coded option buttons (green for correct, red for incorrect) with detailed mathematical explanations.
- **Scoring & Progress:** Real-time progress bar, score counter, final performance badges, and a restart button.

### H. Educational Learning Hub
- **4 In-Depth Guides:**
  1. *Number Systems & Binary Math* (bit weights, radix, conversion algorithms).
  2. *Matrices & Linear Transformations* (dimension compatibility, determinants, inverse geometry).
  3. *Algebra & Quadratic Equations* (balancing equations, completing the square, discriminant analysis).
  4. *Trigonometry & The Unit Circle* (radians vs degrees, unit circle derivation, periodic waves).
- **"Practice in Tool" Links:** Direct smooth-scroll buttons to jump directly into the relevant calculator.

### I. Shared Interface & Accessibility
- **Theme Switcher:** Dark Navy Theme (default) and Crisp Light Mode persisted in `localStorage`.
- **Mobile Menu Drawer:** Accessible sliding drawer with background overlay and `Esc` key dismissal.
- **Keyboard Navigation:** High-contrast focus rings (`:focus-visible`), skip links, and ARIA landmarks.
- **Dynamic Footer:** Current year auto-calculated via JavaScript.

---

## 2. Design System & UI/UX

| Token | Dark Navy Theme (Default) | Light Theme |
| :--- | :--- | :--- |
| **Primary Background** | `#070b14` (Deep Space Navy) | `#f8fafc` (Clean Slate) |
| **Secondary Background** | `#0d1527` | `#f1f5f9` |
| **Card Background** | `#111c35` | `#ffffff` |
| **Primary Accent** | `#00f0ff` (Electric Cyan) | `#0284c7` (Cobalt Blue) |
| **Secondary Accent** | `#a855f7` (Vibrant Purple) | `#7c3aed` (Royal Violet) |
| **Glow Effects** | `0 0 20px rgba(0, 240, 255, 0.35)` | `0 4px 14px rgba(2, 132, 199, 0.25)` |
| **Typography** | System UI / Segoe UI / Roboto | System UI / Segoe UI / Roboto |
| **Math & Code Font** | Cascadia Code, Fira Code, Consolas | Cascadia Code, Fira Code, Consolas |

---

## 3. File Structure & Purpose

```
MathSphere/
├── index.html       # Complete semantic HTML5 structure, ARIA roles, and section layouts
├── style.css        # Responsive CSS3 stylesheet, CSS custom properties, and animations
├── script.js        # Vanilla JS logic: Shunting-Yard parser, matrix engine, canvas, quiz
└── README.md        # Comprehensive documentation, testing walkthrough, and deployment guide
```

### What Each File Does:
1. **`index.html`**:
   - Contains semantic page landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Declares accessible interactive controls (`role="tab"`, `role="radiogroup"`, `aria-live` containers for screen readers).
   - Houses the layouts for all 8 modules (Hero, Calculator, Matrix, Converter, Algebra, Plotter, Quiz, Tutorials).

2. **`style.css`**:
   - Implements the complete Dark Navy and Electric Blue/Purple scientific visual identity using CSS Variables (`:root` and `[data-theme="light"]`).
   - Uses CSS Grid and Flexbox for responsive desktop, tablet, and smartphone layouts.
   - Provides smooth transitions, frosted glass styling, and WCAG 2.1 AA accessible focus rings.

3. **`script.js`**:
   - **Tokenizer & Shunting-Yard Parser:** Parses mathematical expressions into Postfix (RPN) tokens and evaluates them safely without `eval()`.
   - **Matrix Engine:** Handles addition, subtraction, matrix multiplication, determinants, and matrix inverses.
   - **Number System Module:** Validates radix inputs and builds step-by-step division tables.
   - **Canvas Plotter:** Renders cartesian axes, grid lines, labels, mathematical curves, and cursor tracking.
   - **Quiz Engine:** Manages question state, feedback rendering, and scoring.
   - **Theme & UI:** Syncs dark/light modes with `localStorage` and controls the mobile navigation drawer.

---

## 4. How to Run Locally

Because MathSphere uses pure static files without dependencies or build steps, you can run it using any of the following methods:

### Method 1: Direct Browser Launch (Fastest)
1. Navigate to the project folder (`d:\MathSphere`).
2. Double-click `index.html` (or right-click $\rightarrow$ **Open with** $\rightarrow$ Chrome / Firefox / Edge / Safari).
3. The platform is immediately functional!

### Method 2: Python Local Server
If you have Python installed, open your terminal or command prompt in the project folder and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Method 3: VS Code Live Server
1. Open the `MathSphere` directory in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.

---

## 5. Comprehensive Feature Testing Guide

Follow this step-by-step verification checklist to test all features:

### 1. Scientific Calculator Tests
| Test Case | Inputs / Action | Expected Result |
| :--- | :--- | :--- |
| **Arithmetic & Order of Operations** | `18 - 3 * (4 + 2) / 9` $\rightarrow$ `=` | Result is `16` |
| **Exponents & Powers** | `2 ^ 8` $\rightarrow$ `=` | Result is `256` |
| **Square Root** | `sqrt(144)` $\rightarrow$ `=` | Result is `12` |
| **Negative Square Root Error** | `sqrt(-25)` $\rightarrow$ `=` | Error: *"Cannot calculate square root of a negative real number"* |
| **Division by Zero** | `50 / 0` $\rightarrow$ `=` | Error: *"Cannot divide by zero"* |
| **Trigonometry (DEG)** | Switch mode to `DEG`, enter `sin(30)` $\rightarrow$ `=` | Result is `0.5` |
| **Trigonometry (RAD)** | Switch mode to `RAD`, enter `sin(pi / 2)` $\rightarrow$ `=` | Result is `1` |
| **Keyboard Input** | Type `7 * 8` on your physical keyboard and press `Enter` | Expression displays `7*8`, result displays `56` |
| **History Recall** | Click on any past entry in the calculation history list | Restores that value to the display |

### 2. Matrix Calculator Tests
| Test Case | Inputs / Action | Expected Result |
| :--- | :--- | :--- |
| **$2\times 2$ Determinant** | Set Matrix A to $[[3, 2], [1, 4]]$, click **det(A)** | Result is `10` |
| **$2\times 2$ Inverse** | Set Matrix A to $[[4, 7], [2, 6]]$, click **A⁻¹ (Inverse)** | Result is $[[0.6, -0.7], [-0.2, 0.4]]$ with step explanation |
| **Singular Matrix Error** | Set Matrix A to $[[2, 4], [1, 2]]$, click **A⁻¹ (Inverse)** | Error: *"The matrix is singular because its determinant is 0..."* |
| **Matrix Multiplication** | Set A to $2\times 3$ and B to $3\times 2$, click **A × B** | Result is a valid $2\times 2$ matrix |
| **Dimension Mismatch** | Set A to $2\times 3$ and B to $2\times 2$, click **A + B** | Error: *"Addition requires identical dimensions..."* |
| **Transpose** | Set A to $[[1, 2, 3], [4, 5, 6]]$, click **Transpose Aᵀ** | Result is $3\times 2$ matrix $[[1, 4], [2, 5], [3, 6]]$ |

### 3. Number System Converter Tests
| Test Case | Inputs / Action | Expected Result |
| :--- | :--- | :--- |
| **Decimal $\rightarrow$ All** | Type `255` in Decimal | Bin: `11111111`, Oct: `377`, Hex: `FF` |
| **Hex $\rightarrow$ All** | Type `1A` in Hexadecimal | Dec: `26`, Bin: `11010`, Oct: `32` |
| **Binary Validation** | Type `102` in Binary | Warning: *"Binary input can only contain bits 0 and 1"*, input border turns red |
| **Octal Validation** | Type `789` in Octal | Warning: *"Octal input can only contain octal digits 0-7"* |
| **Mathematical Steps** | Click the **Dec $\rightarrow$ Bin** tab | Displays full division table by 2 with remainders |

### 4. Algebra Solver Tests
| Test Case | Inputs / Action | Expected Result |
| :--- | :--- | :--- |
| **Standard Linear** | $a = 3, b = 7, c = 19$, click **Solve** | $x = 4$ with step-by-step subtraction and division |
| **Linear Infinite Solutions** | $a = 0, b = 5, c = 5$, click **Solve** | Identity $5 = 5 \rightarrow$ *"Infinite Solutions"* |
| **Linear No Solution** | $a = 0, b = 4, c = 9$, click **Solve** | Contradiction $4 \neq 9 \rightarrow$ *"No Solution (∅)"* |
| **Two Real Roots** | $a = 1, b = -5, c = 6$ | $\Delta = 1 \rightarrow x_1 = 3, x_2 = 2$, Vertex $(2.5, -0.25)$ |
| **Repeated Root** | $a = 1, b = -4, c = 4$ | $\Delta = 0 \rightarrow x = 2$ |
| **Complex Conjugate Roots** | $a = 1, b = 2, c = 5$ | $\Delta = -16 \rightarrow x = -1 \pm 2i$ |

### 5. Graph Plotter Tests
| Test Case | Inputs / Action | Expected Result |
| :--- | :--- | :--- |
| **Preset Switching** | Select $y = \sin(x)$ | Sine wave curve rendered across the coordinate plane |
| **Custom Function** | Select *Custom Expression*, type `x^3 - 3*x` | Cubic polynomial curve rendered smoothly |
| **Range Adjustment** | Set $X_{min} = -5, X_{max} = 5$, click **Update Plot** | Grid and curve dynamically rescale |
| **Coordinate Hover** | Hover your mouse across the canvas | Tracking dot follows curve; coordinate badge displays precise $(x, y)$ |
| **PNG Export** | Click **📸 Export PNG** | Downloads `MathSphere-<function>.png` screenshot |

### 6. Quiz & Theme Tests
| Test Case | Inputs / Action | Expected Result |
| :--- | :--- | :--- |
| **Answer Feedback** | Click an option in Question 1 | Turns green if correct, red if incorrect; displays explanation |
| **Quiz Completion** | Complete all 10 questions | Shows percentage score, fraction, performance rank, and **Restart Quiz** |
| **Theme Toggle** | Click the Moon/Sun button | Seamlessly toggles between Dark Navy and Light mode; refreshes canvas colors |
| **Persistence** | Refresh the browser page | Selected theme is preserved via `localStorage` |
| **Mobile Menu** | Resize window to mobile width ($< 860$px) and click hamburger | Navigation drawer slides in smoothly; closes with close button or `Esc` |

---

## 6. How to Upload to GitHub

You can publish this project to GitHub in a few simple commands:

1. **Initialize Git repository locally:**
   ```bash
   cd d:\MathSphere
   git init
   git add .
   git commit -m "Initial commit: MathSphere complete educational platform"
   ```

2. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new).
   - Name the repository `MathSphere`.
   - Leave it public and do not check "Initialize with README" (we already created one).

3. **Link and push to GitHub:**
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/MathSphere.git
   git branch -M main
   git push -u origin main
   ```

---

## 7. Deploying to GitHub Pages & Vercel

MathSphere requires **no build step, no npm packages, and no server configuration**.

### Option A: GitHub Pages (100% Free)
1. Go to your repository on GitHub (`https://github.com/<YOUR_USERNAME>/MathSphere`).
2. Click on **Settings** (top tab) $\rightarrow$ **Pages** (left sidebar under "Code and automation").
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**.
   - Branch: Select **`main`** and folder **`/ (root)`**.
4. Click **Save**.
5. Wait 30–60 seconds. GitHub will display your live URL:
   `https://<YOUR_USERNAME>.github.io/MathSphere/`

---

### Option B: Vercel (100% Free)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Import your `MathSphere` repository.
4. In the configuration screen:
   - **Framework Preset:** Leave as *Other* (static HTML).
   - **Build Command:** Leave blank.
   - **Output Directory:** Leave blank.
5. Click **Deploy**.
6. Within 10 seconds, Vercel will provide your global SSL URL:
   `https://mathsphere.vercel.app`

---

## 8. Architecture & Educational Notes

### Why Zero `eval()`?
Using JavaScript's built-in `eval()` function introduces critical code injection vulnerabilities (XSS) and poor performance. In MathSphere, the mathematical evaluator in `script.js` uses a classic computer science pipeline:
1. **Lexical Analysis (Tokenizer):** Breaks raw input strings into structured tokens (`NUMBER`, `OPERATOR`, `FUNCTION`, `PAREN`).
2. **Shunting-Yard Algorithm:** Converts human-readable infix notation (e.g. `3 + 4 * 2`) into Reverse Polish Notation / Postfix (`3 4 2 * +`) using an operator stack and precedence table.
3. **RPN Evaluator:** Processes the postfix token stream using an evaluation stack, strictly enforcing domain rules (such as zero division checks and negative root prevention).

### Accessible Web Design (WCAG 2.1 AA)
- Semantic landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Contrast ratios exceeding 4.5:1 for body copy and 3:1 for large graphical headings.
- Keyboard accessible focus rings (`:focus-visible`) on all interactive buttons and inputs.
- ARIA live regions (`aria-live="polite"`) ensure screen readers announce calculation results and validation updates.

---

**MathSphere** — *Explore Mathematics. Expand Your Mind.*  
Built with precision and passion for mathematics education.
#   M a t h S p h e r e  
 