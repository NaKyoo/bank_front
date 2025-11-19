# 📡 Services API - Documentation

## 🔧 Configuration

**Backend**: `http://127.0.0.1:8000`  
**Proxy Vite**: `/api` → redirige vers le backend  
**Format**: Toutes les requêtes utilisent `/api/...`

---

## 🔐 Authentification

### `authService.js`

#### `signupRequest(credentials)`
- **Endpoint**: `POST /api/users/register`
- **Paramètres**: 
  ```js
  {
    name: string,
    email: string,
    password: string
  }
  ```
- **Retour**: Données utilisateur + compte bancaire principal créé

#### `loginRequest(credentials)`
- **Endpoint**: `POST /api/users/login`
- **Paramètres**: 
  ```js
  {
    email: string,
    password: string
  }
  ```
- **Retour**: 
  ```js
  {
    access_token: string,
    token_type: "bearer",
    user: { ... }
  }
  ```

---

## 👤 Utilisateurs

### `accountService.js`

#### `getUserInfo(token)`
- **Endpoint**: `GET /api/users/me`
- **Headers**: `Authorization: Bearer ${token}`
- **Retour**: 
  ```js
  {
    user_id: number,
    name: string,
    email: string,
    created_at: string
  }
  ```

#### `getUserAccounts(token)`
- **Endpoint**: `GET /api/users/me/accounts`
- **Headers**: `Authorization: Bearer ${token}`
- **Retour**: Array de comptes
  ```js
  [
    {
      account_number: string,
      balance: number,
      account_type: string,
      is_active: boolean,
      created_at: string,
      parent_account_number: string | null
    }
  ]
  ```

---

## 📋 Autres endpoints disponibles (à implémenter)

### 💰 Comptes
- `GET /api/accounts/{account_number}` - Détails d'un compte
- `POST /api/accounts/open` - Ouvrir un compte secondaire
- `POST /api/accounts/{account_number}/close` - Clôturer un compte
- `POST /api/accounts/{account_number}/archive` - Archiver un compte
- `GET /api/accounts/{account_number}/transactions` - Transactions d'un compte

### 📤 Transferts
- `POST /api/transfer` - Effectuer un transfert
- `POST /api/transfer/{transaction_id}/cancel` - Annuler un transfert

### 💵 Dépôts
- `POST /api/deposit` - Effectuer un dépôt

### 👥 Bénéficiaires
- `POST /api/accounts/{owner_account_number}/beneficiaries` - Ajouter un bénéficiaire
- `GET /api/accounts/{owner_account_number}/beneficiaries` - Liste des bénéficiaires

### 📊 Transactions
- `GET /api/users/me/transactions` - Toutes les transactions de l'utilisateur
- `GET /api/transactions/{user_account_number}/{transaction_id}` - Détails d'une transaction

---

## 🎯 Exemple d'utilisation dans un composant

```javascript
import { getUserInfo, getUserAccounts } from '../api/accountService';
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo(user.token);
        const accounts = await getUserAccounts(user.token);
        
        console.log(userInfo, accounts);
      } catch (error) {
        console.error(error.message);
      }
    };
    
    fetchData();
  }, [user.token]);
};
```

---

## ⚠️ Gestion des erreurs

Toutes les fonctions throwent une `Error` avec un message :
- `data.detail` (format FastAPI)
- `data.message` (format custom)
- Message par défaut

```javascript
try {
  await getUserInfo(token);
} catch (error) {
  console.error(error.message); // Affiche le message d'erreur
}
```
