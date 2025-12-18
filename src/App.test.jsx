// ============================================================================
// Tests Unitaires - Composant App
// ============================================================================
// 
// Description:
//   Suite de tests pour le composant principal App.jsx
//   Utilise Vitest comme framework de test et @testing-library/react
//   pour le rendu et les assertions sur les composants React.
//
// Type de tests: Smoke Tests (Tests de fumée)
//   Les smoke tests vérifient que le composant se rend sans erreur
//   et que les éléments principaux sont présents dans le DOM.
//
// Philosophie de test:
//   - Tester le comportement utilisateur, pas l'implémentation
//   - Utiliser des queries accessibles (getByRole, getByText)
//   - Garder les tests simples et maintenables
//
// Documentation:
//   - Vitest: https://vitest.dev/
//   - Testing Library: https://testing-library.com/docs/react-testing-library/intro/
// ============================================================================

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// ===========================================================================
// Suite de Tests: App Component
// ===========================================================================
describe('App Component', () => {

    // -------------------------------------------------------------------------
    // Test 1: Rendu sans Erreur (Smoke Test)
    // -------------------------------------------------------------------------
    // Objectif: Vérifier que le composant App se rend sans crasher
    // Méthode: Recherche le texte "Vite + React" qui doit être présent
    // Importance: Test de base qui détecte les erreurs de syntaxe ou
    //             les problèmes de dépendances
    it('should render without crashing', () => {
        // Arrange & Act: Rendu du composant
        render(<App />)

        // Assert: Vérification de la présence du titre
        // getByText utilise une regex insensible à la casse (/i)
        expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument()
    })

    // -------------------------------------------------------------------------
    // Test 2: Présence du Bouton Compteur
    // -------------------------------------------------------------------------
    // Objectif: Vérifier que l'élément interactif principal est présent
    // Méthode: Recherche par rôle ARIA (meilleure pratique d'accessibilité)
    // Importance: Garantit que l'interface utilisateur de base fonctionne
    it('should display the counter button', () => {
        // Arrange & Act: Rendu du composant
        render(<App />)

        // Assert: Vérification de la présence du bouton
        // getByRole('button') est préféré car il teste l'accessibilité
        expect(screen.getByRole('button', { name: /count is/i })).toBeInTheDocument()
    })
})
