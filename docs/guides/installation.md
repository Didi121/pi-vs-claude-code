# Guide d'Installation - Système de Gestion du Personnel

Ce guide décrit les étapes pour installer et configurer le système de gestion du personnel sur votre environnement local.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés :

| Outil | Version minimale | Description |
|-------|------------------|-------------|
| Node.js | 18.x | Runtime JavaScript |
| npm ou bun | 9.x / 1.3.x | Gestionnaire de paquets |
| Git | 2.x | Système de contrôle de version |

### Vérification des prérequis

```bash
node --version    # Doit afficher v18.x ou supérieur
npm --version     # Doit afficher 9.x ou supérieur
git --version     # Doit afficher 2.x ou supérieur
```

## Clonage du projet

```bash
git clone <repository-url>
cd pi-vs-claude-code
```

## Installation des dépendances

### Option A : Avec npm

```bash
npm install
```

### Option B : Avec bun (recommandé)

```bash
bun install
```

## Configuration de l'environnement

1. Copiez le fichier d'exemple d'environnement :

```bash
cp .env.sample .env
```

2. Éditez le fichier `.env` avec vos clés API :

```bash
# Ouvrez le fichier dans votre éditeur
nano .env
# ou
code .env
```

## Démarrage du serveur

### Mode développement

```bash
npm run dev
# ou
bun run dev
```

Le serveur démarre sur `http://localhost:3000` par défaut.

### Mode production

```bash
npm run build
npm run start
```

## Vérification de l'installation

Testez l'API avec curl :

```bash
# Liste des employés (vide initialement)
curl http://localhost:3000/api/employees

# Créer un employé
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "position": "Développeur",
    "department": "Engineering",
    "hireDate": "2024-01-15",
    "salary": 55000
  }'
```

## Structure du projet

```
pi-vs-claude-code/
├── src/
│   ├── app.ts              # Point d'entrée de l'application
│   ├── server.ts           # Configuration du serveur
│   ├── controllers/        # Gestion des requêtes HTTP
│   ├── models/             # Définition des types et stockage
│   └── routes/             # Définition des endpoints API
├── docs/                   # Documentation
├── personnel-system/       # Documentation du système
└── package.json            # Configuration du projet
```

## Résolution des problèmes

### Port déjà utilisé

Si le port 3000 est déjà utilisé, modifiez le port dans `src/server.ts` :

```typescript
const PORT = process.env.PORT || 3001; // Changez la valeur
```

### Erreur de dépendances

Supprimez le dossier node_modules et réinstallez :

```bash
rm -rf node_modules
npm install
# ou
bun install
```

## Prochaines étapes

- Consultez le [Guide d'Utilisation](./usage.md) pour apprendre à utiliser l'API
- Consultez la [Documentation API](../api/openapi.yaml) pour les endpoints disponibles
- Consultez les [Architecture Decision Records](../adr/) pour les choix techniques
