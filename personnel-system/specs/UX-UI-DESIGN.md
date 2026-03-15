# UX/UI Design System - Gestion du Personnel

## Vue d'ensemble

Système de design pour l'application de gestion du personnel. Ce document définit les foundations visuelles, les composants et wireframes pour l'interface de gestion des employés.

---

## 1. Design System

### 1.1 Palette de couleurs

```css
:root {
  /* Couleurs primaires */
  --color-primary: #6366f1;          /* Indigo - principales actions */
  --color-primary-hover: #4f46e5;
  --color-primary-light: #e0e7ff;
  
  /* Couleurs secondaires */
  --color-secondary: #8b5cf6;       /* Violet - accents */
  --color-secondary-hover: #7c3aed;
  
  /* Couleurs sémantiques */
  --color-success: #10b981;         /* Vert - succès, actif */
  --color-success-light: #d1fae5;
  --color-warning: #f59e0b;         /* Orange - attention */
  --color-warning-light: #fef3c7;
  --color-danger: #ef4444;          /* Rouge - erreur, supprimer */
  --color-danger-light: #fee2e2;
  --color-info: #3b82f6;           /* Bleu - information */
  --color-info-light: #dbeafe;
  
  /* Couleurs neutres */
  --color-bg-primary: #f8fafc;      /* Fond principal */
  --color-bg-secondary: #ffffff;    /* Fond cartes */
  --color-bg-tertiary: #f1f5f9;     /* Fond inputs */
  
  /* Couleurs texte */
  --color-text-primary: #1e293b;   /* Texte principal */
  --color-text-secondary: #64748b; /* Texte secondaire */
  --color-text-muted: #94a3b8;     /* Texte placeholder */
  --color-text-inverse: #ffffff;    /* Texte sur fond sombre */
  
  /* Bordures */
  --color-border: #e2e8f0;
  --color-border-focus: #6366f1;
}
```

### 1.2 Typographie

```css
:root {
  /* Font family */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Font sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### 1.3 Espacement

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### 1.4 Ombres

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### 1.5 Rayons de bordures

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
}
```

### 1.6 Breakpoints (Responsive)

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

---

## 2. Composants UI

### 2.1 Boutons (Button)

```
Variantes:
├── Primary    → Fond indigo (#6366f1), texte blanc
├── Secondary  → Fond transparent, bordure indigo
├── Ghost      → Transparent, sans bordure
├── Danger     → Fond rouge (#ef4444)
└── Sizes
    ├── sm     → padding: 0.5rem 1rem, font-size: 0.875rem
    ├── md     → padding: 0.625rem 1.25rem, font-size: 1rem
    └── lg     → padding: 0.75rem 1.5rem, font-size: 1.125rem

États: default, hover, active, disabled, loading
```

### 2.2 Champs de formulaire (Input)

```
Structure:
├── Label (obligatoire pour accessibilité)
├── Input field
│   └── height: 40px
│   └── border-radius: 6px
│   └── focus: bordure indigo + shadow
├── Helper text (optionnel)
└── Error message (rouge, si erreur)

Types supportés:
├── text
├── email
├── tel
├── number
├── date
├── select
└── textarea
```

### 2.3 Tableau (DataTable)

```
Structure d'une ligne:
├── Checkbox (pour sélection multiple)
├── Avatar + Nom employé
├── Email
├── Poste
├── Département
├── Statut (badge)
├── Date d'embauche
└── Actions (modifier, archiver)

Fonctionnalités:
├── Tri par colonne
├── Pagination (10/25/50 par page)
├── Recherche globale
├── Filtres par département/statut
└── Sélectionne tout
```

### 2.4 Badge/Status

```
Variantes de statut:
├── Actif  → Fond vert clair (#d1fae5), texte vert foncé
├── Inactif → Fond gris clair (#f1f5f9), texte gris
└── Archivé → Fond rouge clair (#fee2e2), texte rouge foncé
```

### 2.5 Modal

```
Structure:
├── Overlay (fond noir semi-transparent)
├── Container
│   ├── Header
│   │   ├── Titre
│   │   └── Bouton fermer (X)
│   ├── Body (scrollable si nécessaire)
│   └── Footer
│       ├── Bouton annuler
│       └── Bouton confirmer
└── Tailles: sm (400px), md (600px), lg (800px)
```

### 2.6 Navigation

```
Sidebar (320px):
├── Logo + Nom entreprise
├── Navigation principale
│   ├── Tableau de bord
│   ├── Employés (actif)
│   ├── Départements
│   └── Paramètres
└── Profil utilisateur (bas de page)
```

---

## 3. Wireframes

### 3.1 Page Liste des Employés

```
┌─────────────────────────────────────────────────────────────────────┐
│ Gestion du Personnel                              [Admin] [Log out] │
├────────────┬────────────────────────────────────────────────────────┤
│            │ ┌────────────────────────────────────────────────────┐ │
│ □ Dashboard│ │ Employés                                [+ Ajouter] │ │
│            │ ├────────────────────────────────────────────────────┤ │
│ ■ Employés│ │ ┌──────────┐ ┌──────────┐                            │ │
│ □ Départs  │ │ │Filtres:  │ │Rechercher│          [Exporter]      │ │
│            │ │ │Tous ▼    │ │🔍       │                            │ │
│ □ Paramètres│ └──────────┘ └──────────┘                            │ │
│            │ ┌────────────────────────────────────────────────────┐ │
│            │ │ □ │ Employé      │ Email    │ Poste   │ Départ.   │ │
│            │ │───│──────────────│──────────│─────────│───────────│ │
│            │ │ □ │ Jean Dupont   │ jean@... │ Dévelop │ IT        │ │
│            │ │ □ │ Marie Martin  │ marie@.. │ Chef    │ RH        │ │
│            │ │ □ │ Pierre Durant │ pierre@..│ Designer│ Marketing │ │
│            │ │ □ │ Sophie Bernard│ sophie@..│ Manager │ Finance   │ │
│            │ └────────────────────────────────────────────────────┘ │
│            │                                                         │
│ [Profil]   │  Affichage 1-4 sur 156  [< 1 2 3 ... 39 >]            │
└────────────┴────────────────────────────────────────────────────────┘
```

### 3.2 Page Fiche Employé (Vue détaillée)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Gestion du Personnel                              [Admin] [Log out] │
├────────────┬────────────────────────────────────────────────────────┤
│            │ ← Retour à la liste                                    │
│ □ Dashboard│ ┌────────────────────────────────────────────────────┐ │
│            │ │                                                    │ │
│ □ Employés │ │  ┌──────┐  Jean Dupont                             │ │
│ □ Départs  │ │  │Avatar│  Développeur Senior                     │ │
│            │ │  └──────┘  IT Department                          │ │
│ □ Paramètres│ │                                                    │ │
│            │ ├────────────────────────────────────────────────────┤ │
│            │ │ [Éditer]  [Archiver]  [Supprimer]                  │ │
│            │ └────────────────────────────────────────────────────┘ │
│            │ ┌────────────────────────────────────────────────────┐ │
│            │ │ INFORMATIONS PRINCIPALES                           │ │
│            │ │ ├─ Email:    jean.dupont@entreprise.fr            │ │
│ [Profil]   │ │ ├─ Téléphone: +33 6 12 34 56 78                   │ │
│            │ │ ├─ Poste:    Développeur Senior                    │ │
│            │ │ ├─ Départem.: IT                                   │ │
│            │ │ └─ Statut:   [Actif]                               │ │
│            │ │                                                    │ │
│            │ │ INFORMATIONS EMPLOI                                │ │
│            │ │ ├─ Date d'embauche: 15 Mars 2023                  │ │
│            │ │ └─ Salaire:     55 000 € /an                      │ │
│            │ └────────────────────────────────────────────────────┘ │
└────────────┴────────────────────────────────────────────────────────┘
```

### 3.3 Formulaire d'ajout/modification employé

```
┌─────────────────────────────────────────────────────────────────────┐
│ Ajouter un empleado                                    [✕]          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─ Informations personnelles ────────────────────────────────────┐ │
│ │                                                                │ │
│ │ Prénom *                    Nom *                              │ │
│ │ ┌────────────────────────┐   ┌────────────────────────┐       │ │
│ │ │ Jean                   │   │ Dupont                 │       │ │
│ │ └────────────────────────┘   └────────────────────────┘       │ │
│ │                                                                │ │
│ │ Email *                    Téléphone                           │ │
│ │ ┌────────────────────────┐   ┌────────────────────────┐       │ │
│ │ │ jean.dupont@email.fr   │   │ +33 6 12 34 56 78      │       │ │
│ │ └────────────────────────┘   └────────────────────────┘       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─ Informations emploi ─────────────────────────────────────────┐ │
│ │                                                                │ │
│ │ Poste *                      Département *                    │ │
│ │ ┌────────────────────────┐   ┌────────────────────────┐       │ │
│ │ │ Développeur Senior   ▼ │   │ IT                  ▼ │       │ │
│ │ └────────────────────────┘   └────────────────────────┘       │ │
│ │                                                                │ │
│ │ Date d'embauche *           Salaire (€)                       │ │
│ │ ┌────────────────────────┐   ┌────────────────────────┐       │ │
│ │ │ 📅 15/03/2023          │   │ 55000                  │       │ │
│ │ └────────────────────────┘   └────────────────────────┘       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                         [Annuler]  [Enregistrer]                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Modal de confirmation suppression

```
┌───────────────────────────────────┐
│ Confirmer la suppression          │
├───────────────────────────────────┤
│                                   │
│  Êtes-vous sûr de vouloir         │
│  archiver cet employé ?           │
│                                   │
│  Cette action peut être           │
│  annulée ultérieurement.          │
│                                   │
├───────────────────────────────────┤
│  [Annuler]  [Archiver]            │
└───────────────────────────────────┘
```

---

## 4. Accessibilité (WCAG 2.1)

### Points clés

1. **Contraste**
   - Ratio minimum 4.5:1 pour le texte
   - Ratio minimum 3:1 pour les éléments graphiques

2. **Navigation clavier**
   - Tous les éléments interactifs accessibles au clavier
   - Ordre de focus logique (tabindex)
   - Indicateur de focus visible

3. **Aria labels**
   - `aria-label` sur les boutons icônes
   - `aria-required="true"` sur les champs obligatoires
   - `aria-invalid="true"` sur les erreurs

4. **Formulaire**
   - Labels associés aux champs (for/id)
   - Messages d'erreur explicites
   - Description des champs obligatoires

5. **Responsive**
   - Fonctionne de 320px à 1920px+
   - Pas de scroll horizontal

---

## 5. Tokens de Design (CSS Variables)

```css
/* À inclure dans :root du fichier CSS principal */
:root {
  /* Couleurs - utilitarias */
  --bg-primary: var(--color-bg-primary);
  --bg-secondary: var(--color-bg-secondary);
  --bg-tertiary: var(--color-bg-tertiary);
  
  /* Texte */
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-muted: var(--color-text-muted);
  
  /* Borders */
  --border-color: var(--color-border);
  --border-focus: var(--color-border-focus);
  
  /* Buttons */
  --btn-primary-bg: var(--color-primary);
  --btn-primary-hover: var(--color-primary-hover);
  --btn-danger-bg: var(--color-danger);
  
  /* Status */
  --status-active-bg: var(--color-success-light);
  --status-active-text: var(--color-success);
  --status-inactive-bg: var(--color-bg-tertiary);
  --status-archived-bg: var(--color-danger-light);
}
```

---

## 6. Checklist Implémentation

- [ ] Intégrer les variables CSS globales
- [ ] Implémenter le layout avec sidebar
- [ ] Créer le composant Button (toutes variantes)
- [ ] Créer le composant Input (avec labels ARIA)
- [ ] Créer le composant DataTable (tri, pagination)
- [ ] Créer le composant Modal
- [ ] Créer le composant Badge/Status
- [ ] Implémenter la page liste employé
- [ ] Implémenter la page détail employé
- [ ] Implémenter le formulaire d'édition
- [ ] Tests accessibilité (axe-core)
- [ ] Tests responsive (mobile first)

---

*Document généré par Daniel Wolf - Designer UX/UI*
*Date: 2026-03-15*