# TECNOTERM VALENZA — EDITORIAL DESIGN SYSTEM (DS-2.0)
*Creative Developer, Senior Web Architect & Digital Art Director Directive*
*Stile Cardine: Editoriale & Moderno (Layout Asimmetrici d'Autore, Display Typography Imponente, Ampio Spazio Bianco, Accenti Minimali)*

---

## 0. VISION & BRAND PERSONALITY: EDITORIALE & MODERNO

L'esperienza visiva di Tecnoterm si ispira alle migliori pubblicazioni di architettura contemporanea e design industriale (riferimenti: *SiteInspire, Awwwards, Kinfolk Magazine, Apple HIG*).
Non è un catalogo commerciale standard: è un **racconto editoriale di ingegneria, comfort ed eccellenza artigiana**.

### Principi Cardine:
1. **Tipografia Monumentale d'Autore:**
   Titoli display imponenti, kerning calibrato negativamente (`-0.035em`), ritmo sincopato tra dimensioni extra-large e micro-metadati tecnici.
2. **Respiro e Spazio Negativo (Negative Space):**
   Ampie aree di vuoto intenzionale (`padding-block` fino a `160px`) che creano tensione visiva, eleganza e chiarezza di lettura, eliminando ogni senso di affollamento.
3. **Composizioni Asimmetriche Dinamiche:**
   Rifiuto di griglie di card monotone e identiche. Utilizzo di layout asimmetrici (70/30, composizioni editoriali bento sfalsate, blocchi testuali sticky affiancati a immagini a tutta altezza).
4. **Accenti Visivi Minimali (Anti-Slop):**
   Nessun alone neon, nessun gradiente pastello decorativo. Linee hairline sottilissime (`1px solid rgba(12, 30, 54, 0.08)`), tocchi grafici monocromatici o in blu cobalto istituzionale, micro-numerazioni d'archivio (`[ 01 ]`, `[ 02 ]`).

---

## 1. COLOR ARCHITECTURE & TOKEN SPECIFICATION

```css
:root {
  /* Primitive Scale */
  --blue-950: #040D1A;
  --blue-900: #071526;  /* Deep Technical Ink */
  --blue-800: #0C1E36;  /* Primary Contrast Headings */
  --blue-700: #003F75;
  --blue-600: #005BAB;  /* Tecnoterm Royal Blue (Signature) */
  --blue-500: #1A73E8;
  --blue-100: #EBF4FC;
  --blue-50:  #F4F8FD;

  --cyan-500: #28B5DD;  /* Minimal Energy Accent */
  --cyan-400: #4DC3E3;
  --cyan-50:  #F0FAFC;

  --neutral-1000: #000000;
  --neutral-900:  #0C1E36;
  --neutral-800:  #1E293B;
  --neutral-700:  #334155;  /* Body Slate */
  --neutral-500:  #64748B;  /* Meta Slate */
  --neutral-400:  #94A3B8;
  --neutral-200:  #E2E8F0;  /* Hairline Border */
  --neutral-100:  #F8FAFD;  /* Canvas Subtle */
  --neutral-0:    #FFFFFF;  /* Pure White Canvas */

  /* Semantic Application */
  --bg-canvas:        var(--neutral-0);
  --bg-subtle:        var(--neutral-100);
  --bg-dark:          var(--blue-900);
  --bg-dark-surface:  var(--blue-800);

  --text-display:     var(--blue-800);
  --text-body:        var(--neutral-700);
  --text-muted:       var(--neutral-500);
  --text-inverse:     #FFFFFF;

  --accent-signature: var(--blue-600);
  --accent-energy:    var(--cyan-500);

  --border-hairline:  rgba(12, 30, 54, 0.08);
  --border-subtle:    rgba(12, 30, 54, 0.14);
  --border-dark:      rgba(255, 255, 255, 0.10);
}
```

---

## 2. MONUMENTAL EDITORIAL TYPOGRAPHY

### 2.1 Scala Tipografica d'Autore

| Livello | Dimensione Fluida | Line-Height | Weight | Letter-Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero XL** | `clamp(3rem, 6.8vw, 5.6rem)` | `1.04` | `800` | `-0.038em` |
| **Display Editorial L** | `clamp(2.4rem, 4.5vw, 3.8rem)` | `1.10` | `800` | `-0.032em` |
| **Section Title M** | `clamp(1.85rem, 3.2vw, 2.75rem)` | `1.18` | `700` | `-0.025em` |
| **Subheading S** | `clamp(1.25rem, 1.8vw, 1.6rem)` | `1.28` | `600` | `-0.015em` |
| **Editorial Lead** | `clamp(1.125rem, 1.6vw, 1.35rem)` | `1.65` | `400` | `-0.005em` |
| **Body Regular** | `1.0625rem (17px)` | `1.70` | `400` | `0` |
| **Technical Meta** | `0.8125rem (13px)` | `1.4` | `600` | `0.08em` (Uppercase) |
| **Index Numbering** | `0.75rem (12px)` | `1` | `700` | `0.12em` (Mono-spaced tracking) |

---

## 3. SPATIAL RHYTHM & ASYMMETRIC GRID SYSTEM

### 3.1 Macro-Spaziatura (Il Respiro del Bianco)
- **Inter-Section Padding:** `clamp(96px, 14vh, 160px)` per creare stacchi netti e scenografici tra un capitolo narrativo e il successivo.
- **Container Max Width:** `1320px` con margini laterali fluidi `clamp(20px, 5vw, 64px)`.
- **Reading Measure:** Massimo `62ch` per i blocchi di testo, garantendo equilibrio visivo e perfetta leggibilità.

### 3.2 Strutture di Layout Asimmetriche
1. **Hero Asimmetrico (Split 60/40 sfalsato):**
   - A sinistra: Titolo monumentale, badge editoriale e dual CTA.
   - A destra/sotto: Finestra visiva con fotografia di cantiere ad alta precisione e metadati tecnici a sbalzo.
2. **Servizi in Composizione Editoriale Bento Asimmetrica:**
   - Invece di 6 rettangolini identici:
     - **Servizio Hero (Pompe di Calore & Clima):** Blocco panoramico a 2 colonne di larghezza con immagine hero d'autore, metriche di efficienza energetica e testo descrittivo dettagliato.
     - **Card a ritmo alternato (Caldaie, Idraulica, Radiante, Solare, Assistenza):** Composizioni modulari con accenti fotografici, numerazione editoriale `[ 01 ]` fino a `[ 06 ]` e contrasti rigorosi.
3. **Timeline Storica & Archivio (Layout Split Narrativo):**
   - Colonna sinistra sticky con grande titolo e citazione d'archivio.
   - Colonna destra con tappe cronologiche spaziate e galleria fotografica a mosaico asimmetrico.
4. **Richiesta Preventivo Minimal Frame:**
   - Modulo d'autore diviso in due blocchi scultorei: form pulito a sinistra e monolite informativo scuro/bianco a destra con canali diretti e orari.

---

## 4. SHAPE & MINIMAL ELEVATION

- **Bordi:** Hairline sottili `1px solid rgba(12, 30, 54, 0.08)`.
- **Raggi:**
  - Micro: `8px` (input, tag, badge tecnici).
  - Medi: `16px` (card bento, finestre fotografiche).
  - Grandi: `24px` (container di sezione, banner).
  - Pillola: `9999px` (solo per bottoni primari di navigazione).
- **Ombre:** Quasi impercettibili, prive di aloni colorati. Unica elevazione `0 20px 48px -12px rgba(12, 30, 54, 0.08)` per dare profondità organica agli elementi al passaggio del mouse.

---

## 5. MOTION SYSTEM

- **Durata:** `400ms - 750ms` per reveal fluidi e lenti, ispirati all'alta moda e all'architettura.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Apple quintic out).
- **Interazioni:** Micro-traslazioni di `3px` al passaggio del mouse con zoom impercettibile (`1.03x`) sulle immagini fotografiche d'archivio.
