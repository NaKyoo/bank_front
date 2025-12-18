// ============================================================================
// Configuration Vite avec Support des Tests Vitest
// ============================================================================
// 
// Description:
//   Configuration principale de Vite pour le projet React avec support
//   des tests unitaires via Vitest. Inclut également la configuration
//   du proxy API et du plugin TailwindCSS.
//
// Documentation: https://vitejs.dev/config/
// ============================================================================

/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // --------------------------------------------------------------------------
  // Plugins Vite
  // --------------------------------------------------------------------------
  // - react: Support JSX/TSX et Fast Refresh pour React
  // - tailwindcss: Intégration de TailwindCSS v4
  plugins: [react(), tailwindcss()],

  // --------------------------------------------------------------------------
  // Configuration du Serveur de Développement
  // --------------------------------------------------------------------------
  server: {
    // Proxy API: Redirige les requêtes /api vers le backend local
    // Exemple: /api/users -> http://127.0.0.1:8000/users
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // --------------------------------------------------------------------------
  // Configuration Vitest (Tests Unitaires)
  // --------------------------------------------------------------------------
  // Documentation: https://vitest.dev/config/
  test: {
    // globals: Active les fonctions globales (describe, it, expect, etc.)
    // sans avoir besoin de les importer dans chaque fichier de test
    globals: true,

    // environment: Utilise jsdom pour simuler un environnement DOM
    // Nécessaire pour tester les composants React qui manipulent le DOM
    environment: 'jsdom',

    // setupFiles: Fichier exécuté avant chaque suite de tests
    // Utilisé pour importer les matchers @testing-library/jest-dom
    setupFiles: './src/setupTests.js',
  },
})
