# MALI RETROUVÉ — Guide de démarrage sans Docker

## Prérequis

Installer les outils suivants sur Windows :

1. **Node.js 20+** — https://nodejs.org/
2. **PostgreSQL 16** — https://www.postgresql.org/download/windows/
3. **Redis 7** — https://redis.io/download/
4. **MinIO** — https://min.io/download (optionnel, voir alternative ci-dessous)

## 1. Base de données PostgreSQL

Se connecter à PostgreSQL (en tant que superutilisateur `postgres`) et exécuter :

```sql
CREATE USER mrt_user WITH PASSWORD 'mrt_password_123';
CREATE DATABASE mrt_dev OWNER mrt_user;
GRANT ALL PRIVILEGES ON DATABASE mrt_dev TO mrt_user;
```

Puis, depuis le dossier `backend/` :

```bash
cd backend
npx prisma db push
npx prisma db seed
```

## 2. Redis

Démarrer Redis en local :

```bash
redis-server
```

Vérifier : `redis-cli ping` doit retourner `PONG`.

## 3. MinIO (stockage fichiers)

### Option A : MinIO local (recommandé)

Télécharger et démarrer MinIO :

```bash
minio server C:\minio --console-address ":9001"
```

Identifiants par défaut :
- Access key : `mrt_minio_root`
- Secret key : `mrt_minio_password_123`

Créer le bucket `mrt-dev` via la console web http://localhost:9001 ou avec `mc` :

```bash
mc alias set local http://localhost:9000 mrt_minio_root mrt_minio_password_123
mc mb local/mrt-dev
```

### Option B : Système de fichiers local (sans MinIO)

Si vous ne pouvez pas installer MinIO, modifier `backend/src/lib/storage.ts` pour utiliser le système de fichiers local à la place de S3. Créer un dossier `backend/storage` et adapter le module `storage`.

## 4. Variables d'environnement

Le fichier `backend/.env` est déjà configuré pour un environnement local sans Docker. Vérifier qu'il contient bien :

```
DATABASE_URL=postgresql://mrt_user:mrt_password_123@localhost:5432/mrt_dev?schema=public
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost
```

## 5. Démarrer le backend

```bash
cd backend
npm run dev
```

Le serveur API démarre sur http://localhost:3000

**Note** : Les workers asynchrones (matching, notifications, purge, expiration) doivent être démarrés séparément :

```bash
npm run dev:workers:matching
npm run dev:workers:notification
npm run dev:workers:purge
npm run dev:workers:expiration
```

Pour le développement, le worker principal peut être lancé avec :

```bash
npm run dev:worker
```

## 6. Démarrer le frontend

### Portail Citoyen (port 5173)

```bash
cd webapp
npm run dev
```

### Portail Agent (port 5174)

```bash
cd webapp
npm run dev:agent
```

### Portail Admin (port 5175)

```bash
cd webapp
npm run dev:admin
```

## 7. Vérifier que tout fonctionne

- Backend health : http://localhost:3000/health → `{"status":"ok"}`
- Citoyen : http://localhost:5173
- Agent : http://localhost:5174
- Admin : http://localhost:5175

## 8. Comptes de test

### Citoyen
1. Aller sur http://localhost:5173/register
2. Entrer un numéro de téléphone (ex: +22370000000)
3. Le code OTP s'affiche dans le terminal du backend (console)
4. Compléter l'inscription

### Agent / Admin
Des comptes agents doivent être créés manuellement en base ou via le endpoint admin `/api/v1/centers/{id}/agents` avec un mot de passe. Le TOTP est généré automatiquement.

## 9. Dépannage

### Le code OTP n'arrive pas
En mode développement (`SMS_PROVIDER=console`), le code OTP est **loggé dans le terminal du backend**. Chercher la ligne contenant `DEV OTP` dans la sortie du serveur backend.

### Erreur de connexion à la base de données
Vérifier que PostgreSQL est démarré et que l'utilisateur `mrt_user` existe avec la base `mrt_dev`.

### Erreur de connexion à Redis
Vérifier que Redis est démarré : `redis-cli ping`

### Erreur de connexion à MinIO
Vérifier que MinIO est démarré et que le bucket `mrt-dev` existe.

### Port 3000 déjà utilisé
Trouver le processus : `netstat -ano | findstr :3000`
Arrêter le processus ou modifier `PORT` dans `.env`.
