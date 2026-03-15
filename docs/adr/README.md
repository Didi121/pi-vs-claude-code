# Architecture Decision Records (ADR)

Les Architecture Decision Records documentent les choix techniques importants faits pour le Système de Gestion du Personnel.

## ADR-001 : Choix de l'architecture API REST

**Date** : 2026-03-15  
**Statut** : Accepté  
**Auteur** : Équipe Technique

### Contexte

Le système de gestion du personnel nécessite une API pour :
- Créer, lire, modifier et supprimer des employés (CRUD)
- Supporter une interface web future (React/Vue)
- Permettre l'intégration avec d'autres systèmes RH
- Être maintenable et évolutive

### Décision

Nous avons choisi une **architecture REST** avec les caractéristiques suivantes :

- **Style architectural** : RESTful avec ressources nommées
- **Format de données** : JSON
- **Méthodes HTTP** : GET, POST, PUT, PATCH, DELETE
- **Versioning** : Via URL (`/api/employees`)
- **Stateless** : Chaque requête contient tout le contexte nécessaire

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Pourquoi rejetée |
|-------------|-----------|---------------|------------------|
| GraphQL | Requêtes flexibles, pas de over-fetching | Courbe d'apprentissage, complexité | Overkill pour CRUD simple |
| gRPC | Performance, typage fort | Nécessite protobuf, moins universel | Pas adapté pour API web publique |
| SOAP | Standard enterprise, WSDL | Verbosité XML, complexité | Trop lourd pour notre cas |

### Conséquences

**Positives** :
- Simple à implémenter et tester
- Universellement supporté
- Documentation OpenAPI automatique possible
- Cache HTTP natif

**Négatives** :
- Over-fetching possible (résolu par pagination)
- Multiple round-trips pour données complexes
- Versioning manuel requis

### Status actuel

Cette décision est **active** et guide tous les développements API.

---

## ADR-002 : Stockage en mémoire pour le développement

**Date** : 2026-03-15  
**Statut** : Accepté  
**Auteur** : Équipe Technique

### Contexte

Pour le développement et les tests initiaux, nous avons besoin d'un mécanisme de stockage simple qui permet :
- Démarrage rapide sans configuration de base de données
- Tests isolés et reproductibles
- Prototypage rapide des fonctionnalités

### Décision

Nous utilisons un **stockage en mémoire** (array TypeScript) avec un pattern Repository :

```typescript
const employees: Employee[] = [];

export const employeeStore = {
  findAll(): Employee[] { ... },
  findById(id: string): Employee | undefined { ... },
  create(data: EmployeeCreateInput): Employee { ... },
  update(id: string, data: EmployeeUpdateInput): Employee | undefined { ... },
  delete(id: string): boolean { ... },
  softDelete(id: string): boolean { ... },
};
```

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Pourquoi rejetée |
|-------------|-----------|---------------|------------------|
| SQLite | Persistant, léger | Fichier à gérer, setup requis | Trop pour prototypage |
| PostgreSQL | Production-ready, ACID | Infrastructure requise | Pour phase suivante |
| MongoDB | Schema-less, flexible | Setup complexe | Pas nécessaire pour CRUD |
| In-memory | Instant, zero-config | Non persistant | **Choisi pour dev** |

### Conséquences

**Positives** :
- Zero configuration
- Tests ultra-rapides
- Reset facile entre tests
- Pas de dépendances externes

**Négatives** :
- Données perdues au restart
- Non scalable
- Pas de transactions
- Pas de requêtes complexes

### Migration vers production

Pour la mise en production, nous migrerons vers :
1. **PostgreSQL** avec Prisma ORM
2. **Migrations** versionnées
3. **Transactions** pour l'intégrité
4. **Indexes** pour la performance

Le pattern Repository facilitera cette migration en isolant la couche données.

### Status actuel

Cette décision est **active pour le développement**. Migration requise avant production.

---

## ADR-003 : Soft Delete pour la suppression d'employés

**Date** : 2026-03-15  
**Statut** : Accepté  
**Auteur** : Équipe Technique

### Contexte

La suppression d'employés pose des questions :
- Conservation de l'historique (contrats, évaluations)
- Conformité légale (données RH)
- Relations avec autres entités (projets, tâches)
- Possibilité de réactivation

### Décision

Nous implémentons un **soft delete** (archivage) avec :

- **Statut** : Changement de `active` → `archived`
- **Endpoint dédié** : `POST /employees/{id}/archive`
- **Préservation** : Toutes les données conservées
- **Réversible** : Peut être réactivé par PATCH status

```typescript
softDelete(id: string): boolean {
  const employee = employees.find(emp => emp.id === id);
  if (!employee) return false;
  employee.status = 'archived';
  return true;
}
```

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Pourquoi rejetée |
|-------------|-----------|---------------|------------------|
| Hard delete | Simple, clean | Perte d'historique | Non conforme RH |
| Soft delete | Historique préservé | Données accumulées | **Choisi** |
| Tombstone | Marque de suppression | Complexité ajoutée | Overkill pour MVP |

### Conséquences

**Positives** :
- Historique RH préservé
- Réactivation possible
- Audit trail implicite
- Conformité légale facilitée

**Négatives** :
- Base grossit avec le temps
- Requêtes doivent filtrer par statut
- Confusion possible (existe mais archived)

### Bonnes pratiques

1. **Toujours utiliser archive()** avant delete()
2. **Filtrer par défaut** : `?status=active` dans les listes
3. **Loguer l'archivage** : Qui, quand, pourquoi
4. **Retention policy** : Archive > N années → purger

### Status actuel

Cette décision est **active** et appliquée à toutes les entités.

---

## ADR-004 : TypeScript pour le développement

**Date** : 2026-03-15  
**Statut** : Accepté  
**Avecur** : Équipe Technique

### Contexte

Le système nécessite :
- Typage fort pour la qualité du code
- Maintenance à long terme
- Documentation inline des types
- Détection d'erreurs à la compilation

### Décision

Nous utilisons **TypeScript** avec :

- **Strict mode** : `strict: true` dans tsconfig
- **Types d'interface** : Pour les modèles de données
- **Types utilitaires** : `Omit`, `Partial`, `Pick`
- **ES modules** : `import/export` natifs

```typescript
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // ...
}

export type EmployeeCreateInput = Omit<Employee, 'id'>;
export type EmployeeUpdateInput = Partial<EmployeeCreateInput>;
```

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Pourquoi rejetée |
|-------------|-----------|---------------|------------------|
| JavaScript | Simple, flexible | Pas de typage, erreurs runtime | Risque trop élevé |
| TypeScript | Typage, tooling | Compilation requise | **Choisi** |
| Reason/OCaml | Typage fort, functional | Écosystème limité | Pas adapté Node.js |

### Conséquences

**Positives** :
- Erreurs détectées à la compilation
- Auto-completion IDE
- Refactoring sécurisé
- Documentation via types

**Négatives** :
- Build step requis
- Courbe d'apprentissage
- Verbosité des types

### Status actuel

Cette décision est **active** et mandatory pour tout le code.

---

## ADR-005 : Express.js comme framework HTTP

**Date** : 2026-03-15  
**Statut** : Accepté  
**Auteur** : Équipe Technique

### Contexte

Nous avons besoin d'un framework HTTP pour :
- Routing des requêtes
- Middleware pipeline
- Gestion des erreurs
- Serialisation JSON
- Écosystème mature

### Décision

Nous utilisons **Express.js** avec :

- **Router modulaire** : Routes par entité
- **Middleware** : `express.json()` pour parsing
- **Controllers** : Logique par endpoint
- **Error handling** : Centralisé

```typescript
import express from 'express';
import employeeRoutes from './routes/employees.js';

const app = express();
app.use(express.json());
app.use('/api/employees', employeeRoutes);
```

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Pourquoi rejetée |
|-------------|-----------|---------------|------------------|
| Express | Mature, écosystème, simple | Ancien design, callbacks | **Choisi** |
| Fastify | Performance, schema validation | Écosystème plus petit | Pour phase 2 |
| Koa | Moderne, async/await | Écosystème limité | Trop nouveau |
| NestJS | Architecture opinionée | Complexité, learning curve | Overkill pour MVP |

### Conséquences

**Positives** :
- Documentation abondante
- Middleware ecosystem riche
- Simple à déboguer
- Hiring facile (développeurs connus)

**Négatives** :
- Callbacks vs async/await (Express 4)
- Performance inférieure à Fastify
- Architecture non opinionée (peut mener à inconsistency)

### Status actuel

Cette décision est **active**. Migration vers Fastify possible pour la phase 2 (performance).

---

## ADR-006 : Pagination côté serveur

**Date** : 2026-03-15  
**Statut** : Accepté  
**Auteur** : Équipe Technique

### Contexte

Avec un nombre croissant d'employés :
- Performance des requêtes
- Limitation de la réponse payload
- UX pour les listes longues
- API rate limiting

### Décision

Nous implémentons une **pagination offset-based** :

- **Paramètres** : `page` (1-indexed), `limit` (default 10)
- **Response** : `data`, `total`, `page`, `limit`
- **Server-side** : `slice(startIndex, endIndex)`

```typescript
const pageNum = parseInt(page as string) || 1;
const limitNum = parseInt(limit as string) || 10;
const startIndex = (pageNum - 1) * limitNum;
const endIndex = startIndex + limitNum;
const paginatedEmployees = employees.slice(startIndex, endIndex);

res.json({
  data: paginatedEmployees,
  total: employees.length,
  page: pageNum,
  limit: limitNum,
});
```

### Alternatives considérées

| Alternative | Avantages | Inconvénients | Pourquoi rejetée |
|-------------|-----------|---------------|------------------|
| Offset-based | Simple, universel | Performance sur grandes tables | **Choisi pour MVP** |
| Cursor-based | Performance, stable | Complexité, stateful | Pour phase 2 (scale) |
| No pagination | Simple | Payload massif, lent | Non viable |

### Conséquences

**Positives** :
- Simple à implémenter
- Compréhensible par les clients
- Contrôle du payload size
- Compatible avec filtrage

**Négatives** :
- Offset lent sur grandes tables (O(n))
- Page jumping inefficace
- Inconsistent si données changent

### Migration future

Pour le scale (10k+ employés) :
- Migrer vers **cursor-based pagination**
- Utiliser `id` ou `createdAt` comme cursor
- Implementer `first`, `last`, `before`, `after`

### Status actuel

Cette décision est **active** pour le MVP.
