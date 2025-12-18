// ============================================================================
// Configuration Globale des Tests - Setup File
// ============================================================================
// 
// Description:
//   Ce fichier est exécuté automatiquement avant chaque suite de tests
//   par Vitest (configuré dans vite.config.js).
//   
//   Il importe les matchers personnalisés de @testing-library/jest-dom
//   qui ajoutent des assertions spécifiques au DOM pour faciliter les tests.
//
// Matchers ajoutés (exemples):
//   - toBeInTheDocument(): Vérifie qu'un élément est présent dans le DOM
//   - toHaveTextContent(): Vérifie le contenu textuel d'un élément
//   - toBeVisible(): Vérifie qu'un élément est visible
//   - toBeDisabled(): Vérifie qu'un élément est désactivé
//   - Et bien d'autres...
//
// Documentation: https://github.com/testing-library/jest-dom
// ============================================================================

import '@testing-library/jest-dom'
