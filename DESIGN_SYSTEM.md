# 🎨 Design System - Bank Front

## 🎯 Palette de couleurs

### Couleurs principales
```css
--primary: #FF8B8F;        /* Rose principal - Boutons, accents */
--primary-light: #FFB4B7;  /* Rose clair - Hover, liens */
--primary-dark: #D96A6E;   /* Rose foncé - Active states */
```

**Usage** :
- ✅ Boutons d'action principale
- ✅ Titres de comptes
- ✅ Liens importants
- ✅ États hover/focus

---

### Couleurs neutres
```css
--background: #0F0F0F;      /* Fond général de l'app */
--background-light: #1A1A1A; /* Variante légèrement plus claire */
--surface: #232323;         /* Cartes, modales, surfaces */
--surface-light: #2F2F2F;   /* Boutons secondaires, inputs */
```

**Usage** :
- ✅ `background` → Body, zones principales
- ✅ `surface` → Cards de comptes, modales
- ✅ `surface-light` → Inputs, boutons secondaires

---

### Texte
```css
--text: #FFFFFF;           /* Texte principal */
--text-muted: #C5C5C5;     /* Texte secondaire, labels */
--text-inverse: #0F0F0F;   /* Texte sur fond clair (boutons) */
```

**Usage** :
- ✅ `text` → Titres, contenu principal
- ✅ `text-muted` → Descriptions, numéros de compte
- ✅ `text-inverse` → Texte des boutons primaires

---

### États
```css
--success: #60D394;  /* Solde positif, succès */
--warning: #F2A65A;  /* Avertissements */
--error: #FF6B6B;    /* Erreurs, solde négatif */
```

**Usage** :
- ✅ `success` → Solde des comptes, confirmations
- ✅ `warning` → Alertes non critiques
- ✅ `error` → Messages d'erreur, validations

---

### Bordures & Ombres
```css
--border: #3A3A3A;
--shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
```

**Usage** :
- ✅ `border` → Contours de cards, inputs
- ✅ `shadow` → Élévation des cartes

---

## 📐 Espacements

```css
--space-xs: 4px;   /* Très petit espacement */
--space-sm: 8px;   /* Petit espacement */
--space-md: 16px;  /* Espacement moyen */
--space-lg: 24px;  /* Grand espacement */
--space-xl: 40px;  /* Très grand espacement */
```

**Usage recommandé** :
- `xs` → Espacement entre label et texte
- `sm` → Gap entre boutons
- `md` → Padding de cards, margin entre sections
- `lg` → Padding de containers, gap de grilles
- `xl` → Padding de pages principales

---

## 🔘 Border Radius

```css
--radius-sm: 6px;   /* Petits éléments (badges, chips) */
--radius-md: 10px;  /* Éléments moyens (boutons, inputs) */
--radius-lg: 18px;  /* Grandes surfaces (cards, modales) */
```

---

## 🎨 Composants du Dashboard

### Header
```css
.dashboard-header {
  border-bottom: 2px solid var(--border);
  padding-bottom: var(--space-lg);
}

.dashboard-header h1 {
  color: var(--text);
}

.user-email {
  color: var(--text-muted);
}
```

---

### Cards de comptes
```css
.account-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.account-card:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 20px rgba(255, 139, 143, 0.15);
}

.account-type {
  color: var(--primary); /* Type en rose */
}

.account-balance {
  color: var(--success); /* Solde en vert */
}
```

---

### Boutons

#### Primaire (Action principale)
```css
.btn-primary {
  background-color: var(--primary);
  color: var(--text-inverse);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: 0 4px 12px rgba(255, 139, 143, 0.4);
}
```

#### Secondaire (Actions alternatives)
```css
.btn-secondary {
  background-color: var(--surface-light);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}
```

---

## 🌈 Exemples d'utilisation

### ✅ Bon usage
```css
/* Card avec hover effet */
.my-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.my-card:hover {
  border-color: var(--primary);
}
```

### ❌ Mauvais usage
```css
/* N'utilise PAS de valeurs en dur */
.my-card {
  background-color: #232323; /* ❌ */
  padding: 24px; /* ❌ */
}

/* Utilise les variables ! */
.my-card {
  background-color: var(--surface); /* ✅ */
  padding: var(--space-lg); /* ✅ */
}
```

---

## 📱 Responsive

Les espacements s'adaptent automatiquement :
- **Desktop** : Espacement normal
- **Tablet** : Réduction légère
- **Mobile** : Espacement compact

```css
@media (max-width: 768px) {
  .dashboard-container {
    padding: var(--space-lg); /* Au lieu de xl */
  }
}
```

---

## 🎯 Accessibilité

### Contraste
- Texte blanc (`#FFFFFF`) sur fond sombre (`#0F0F0F`) = ✅ WCAG AAA
- Rose principal (`#FF8B8F`) sur fond sombre = ✅ Bon contraste
- Vert succès (`#60D394`) sur fond sombre = ✅ Lisible

### États interactifs
Tous les éléments cliquables ont :
- ✅ `cursor: pointer`
- ✅ Transition `0.2s ease`
- ✅ Effet hover visible
- ✅ État focus accessible

---

## 🚀 Comment utiliser

### Dans un nouveau composant CSS
```css
/* 1. Utilise les variables existantes */
.my-component {
  background-color: var(--surface);
  color: var(--text);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

/* 2. Ajoute des états hover cohérents */
.my-component:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}
```

### Dans un composant React
```jsx
// Les variables CSS sont déjà disponibles
<div className="account-card">
  <h3 className="account-type">Compte Courant</h3>
  <p className="account-balance">1 234,56 €</p>
</div>
```

---

## 📝 Notes importantes

1. **Cohérence** : Utilise TOUJOURS les variables, jamais de valeurs en dur
2. **Dark mode** : Le design est déjà en mode sombre par défaut
3. **Évolutivité** : Pour changer une couleur, modifie uniquement `:root`
4. **Performance** : Les transitions sont limitées à 0.2-0.3s pour rester fluides

---

## 🎨 Preview rapide

```
┌─────────────────────────────────────┐
│ 🎨 Dashboard (fond #0F0F0F)        │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Compte Courant (#FF8B8F)     │  │ ← Card (#232323)
│  │ N° 12345 (#C5C5C5)           │  │
│  │ 1 234,56 € (#60D394)         │  │
│  │                              │  │
│  │ [Détails] [Historique]       │  │ ← Boutons secondaires
│  └──────────────────────────────┘  │
│                                     │
│  [+ Nouveau compte] ← Bouton #FF8B8F│
└─────────────────────────────────────┘
```

---

**Design System créé pour l'app bancaire - Novembre 2025** 🏦
