# Guide d'Utilisation - API de Gestion du Personnel

Ce guide décrit comment utiliser l'API REST pour gérer les employés.

## Base URL

Tous les endpoints sont accessibles sous :
```
http://localhost:3000/api
```

## Authentification

> **Note** : La version actuelle utilise une authentification simplifiée pour le développement. En production, implémentez l'authentification JWT avec RBAC.

## Endpoints

### 1. Liste des employés

**Endpoint** : `GET /employees`

Récupère une liste paginée d'employés avec support de filtrage.

**Paramètres de requête** :

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| search | string | Recherche par nom, prénom ou email | `?search=dupont` |
| department | string | Filtrer par département | `?department=Engineering` |
| status | string | Filtrer par statut | `?status=active` |
| page | integer | Numéro de page (défaut: 1) | `?page=2` |
| limit | integer | Éléments par page (défaut: 10) | `?limit=20` |

**Exemple** :
```bash
curl "http://localhost:3000/api/employees?department=Engineering&limit=5"
```

**Réponse** :
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com",
      "position": "Développeur Senior",
      "department": "Engineering",
      "hireDate": "2023-01-15",
      "salary": 55000,
      "status": "active"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5
}
```

---

### 2. Récupérer un employé par ID

**Endpoint** : `GET /employees/{id}`

**Exemple** :
```bash
curl http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000
```

**Réponse** :
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33 1 23 45 67 89",
  "position": "Développeur Senior",
  "department": "Engineering",
  "hireDate": "2023-01-15",
  "salary": 55000,
  "status": "active"
}
```

---

### 3. Créer un employé

**Endpoint** : `POST /employees`

**Champs requis** : `firstName`, `lastName`, `email`

**Exemple** :
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Martin",
    "email": "marie.martin@example.com",
    "phone": "+33 1 98 76 54 32",
    "position": "Chef de Projet",
    "department": "Management",
    "hireDate": "2024-03-01",
    "salary": 65000,
    "status": "active"
  }'
```

**Réponse** (201 Created) :
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie.martin@example.com",
  "phone": "+33 1 98 76 54 32",
  "position": "Chef de Projet",
  "department": "Management",
  "hireDate": "2024-03-01",
  "salary": 65000,
  "status": "active"
}
```

**Erreurs possibles** :
- `400 Bad Request` : Champs requis manquants
- `409 Conflict` : Email déjà existant

---

### 4. Mettre à jour un employé (PUT)

**Endpoint** : `PUT /employees/{id}`

Remplace **toutes** les propriétés de l'employé.

**Exemple** :
```bash
curl -X PUT http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33 1 23 45 67 89",
    "position": "Tech Lead",
    "department": "Engineering",
    "hireDate": "2023-01-15",
    "salary": 65000,
    "status": "active"
  }'
```

---

### 5. Mettre à jour partiellement un employé (PATCH)

**Endpoint** : `PATCH /employees/{id}`

Met à jour **uniquement** les propriétés fournies.

**Exemple** - Changer le poste :
```bash
curl -X PATCH http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Tech Lead",
    "salary": 65000
  }'
```

**Exemple** - Changer le département :
```bash
curl -X PATCH http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Research"
  }'
```

---

### 6. Supprimer un employé

**Endpoint** : `DELETE /employees/{id}`

Supprime **définitivement** l'employé de la base de données.

**Exemple** :
```bash
curl -X DELETE http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000
```

**Réponse** (200 OK) :
```json
{
  "message": "Employee deleted"
}
```

---

### 7. Archiver un employé (Soft Delete)

**Endpoint** : `POST /employees/{id}/archive`

Marque l'employé comme archivé sans le supprimer. Réversible.

**Exemple** :
```bash
curl -X POST http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000/archive
```

**Réponse** (200 OK) :
```json
{
  "message": "Employee soft-deleted (archived)"
}
```

**Note** : L'employé aura son statut changé à `archived` et peut être filtré avec `?status=archived`.

---

## Codes de statut HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Authentification requise |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (ex: email dupliqué) |
| 500 | Internal Server Error | Erreur serveur |

---

## Exemples de cas d'usage courants

### Recherche d'un employé par email

```bash
curl "http://localhost:3000/api/employees?search=jean.dupont@example.com"
```

### Liste des employés actifs dans un département

```bash
curl "http://localhost:3000/api/employees?department=Engineering&status=active"
```

### Pagination - Page 2 avec 20 résultats

```bash
curl "http://localhost:3000/api/employees?page=2&limit=20"
```

### Mise à jour en cascade après promotion

```bash
# Changer le poste et le salaire
curl -X PATCH http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Senior Developer",
    "salary": 70000
  }'
```

### Archivage avant suppression définitive

```bash
# D'abord archiver
curl -X POST http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000/archive

# Vérifier le statut
curl http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000 | jq .status

# Puis supprimer si nécessaire
curl -X DELETE http://localhost:3000/api/employees/550e8400-e29b-41d4-a716-446655440000
```

---

## Validation des données

L'API valide les données suivantes :

- **Email** : Doit être unique dans le système
- **Champs requis** : `firstName`, `lastName`, `email` sont obligatoires
- **Status** : Doit être l'un de `active`, `inactive`, `archived`
- **HireDate** : Doit être un format de date valide (YYYY-MM-DD)

---

## Bonnes pratiques

1. **Toujours utiliser PATCH** pour les mises à jour partielles
2. **Préférer archive()** à delete() pour conserver l'historique
3. **Implémenter la pagination** pour les grandes listes
4. **Valider les emails** côté client avant l'envoi
5. **Gérer les erreurs 409** pour les doublons d'email
