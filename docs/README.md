# Documentation - Système de Gestion du Personnel

Bienvenue dans la documentation technique du Système de Gestion du Personnel.

## Structure de la documentation

```
docs/
├── README.md              # Ce fichier - index de la documentation
├── api/
│   └── openapi.yaml       # Spécification OpenAPI 3.0 complète
├── guides/
│   ├── installation.md    # Guide d'installation et configuration
│   └── usage.md           # Guide d'utilisation de l'API
└── adr/
    └── README.md          # Architecture Decision Records
```

## Navigation rapide

### 📖 Guides

| Guide | Description |
|-------|-------------|
| [Installation](./guides/installation.md) | Installation, configuration et démarrage |
| [Utilisation](./guides/usage.md) | Utilisation de l'API REST avec exemples |

### 🔧 API Reference

| Document | Description |
|----------|-------------|
| [OpenAPI Specification](./api/openapi.yaml) | Documentation complète des endpoints |

**Visualiser l'OpenAPI** :
```bash
# Avec Swagger UI (si configuré)
http://localhost:3000/api-docs

# Ou avec un viewer en ligne
https://editor.swagger.io/ (coller openapi.yaml)
```

### 🏗 Architecture

| Document | Description |
|----------|-------------|
| [ADR-001](./adr/README.md#adr-001--choix-de-larchitecture-api-rest) | Architecture API REST |
| [ADR-002](./adr/README.md#adr-002--stockage-en-mémoire-pour-le-développement) | Stockage en mémoire (dev) |
| [ADR-003](./adr/README.md#adr-003--soft-delete-pour-la-suppression-demployés) | Soft delete / archivage |
| [ADR-004](./adr/README.md#adr-004--typescript-pour-le-développement) | Choix de TypeScript |
| [ADR-005](./adr/README.md#adr-005--expressjs-comme-framework-http) | Framework Express.js |
| [ADR-006](./adr/README.md#adr-006--pagination-côté-serveur) | Pagination server-side |

## Quick Start

### 1. Installation

```bash
git clone <repository-url>
cd pi-vs-claude-code
bun install
```

### 2. Configuration

```bash
cp .env.sample .env
# Éditer .env avec vos clés API
```

### 3. Démarrage

```bash
bun run dev
```

### 4. Test de l'API

```bash
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

# Liste des employés
curl http://localhost:3000/api/employees
```

## Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/employees` | Liste tous les employés (paginé) |
| GET | `/employees/{id}` | Récupère un employé par ID |
| POST | `/employees` | Crée un nouvel employé |
| PUT | `/employees/{id}` | Met à jour complètement un employé |
| PATCH | `/employees/{id}` | Met à jour partiellement un employé |
| DELETE | `/employees/{id}` | Supprime définitivement un employé |
| POST | `/employees/{id}/archive` | Archive un employé (soft delete) |

## Modèles de données

### Employee

```typescript
interface Employee {
  id: string;           // UUID
  firstName: string;
  lastName: string;
  email: string;        // Unique
  phone?: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'archived';
}
```

### Champs requis pour création

- `firstName`
- `lastName`
- `email`

## Statuts des employés

| Statut | Description |
|--------|-------------|
| `active` | Employé actif, travaille dans l'entreprise |
| `inactive` | Employé inactif (congés, suspension) |
| `archived` | Employé archivé (soft delete, historique préservé) |

## Ressources additionnelles

- [README principal](../README.md) - Documentation du projet pi-vs-cc
- [Personnel System README](../personnel-system/README.md) - Vue d'ensemble du système
- [OpenAPI Specification](./api/openapi.yaml) - Spécification complète de l'API

## Contribution

Pour contribuer à la documentation :

1. Suivre le format Markdown
2. Ajouter des exemples de code pour les APIs
3. Maintenir les ADRs à jour
4. Tester les exemples de commandes

---

**Dernière mise à jour** : 2026-03-15  
**Auteur** : Équipe Technique  
**Version** : 1.0.0
