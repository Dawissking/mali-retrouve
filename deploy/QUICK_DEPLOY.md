# Déploiement rapide pour partager la plateforme

## Option 1 : Déploiement gratuit rapide (recommandé pour tests/feedback)

### Frontend — Vercel / Netlify / Cloudflare Pages

1. **Créer un compte** sur https://vercel.com (gratuit)
2. **Installer Vercel CLI** :
   ```bash
   npm install -g vercel
   ```
3. **Déployer le portail citoyen** :
   ```bash
   cd webapp
   vercel --prod
   ```
4. **Déployer le portail agent** :
   ```bash
   vercel --prod --config vite.agent.config.ts
   ```
5. **Déployer le portail admin** :
   ```bash
   vercel --prod --config vite.admin.config.ts
   ```

### Backend — Railway / Render / Fly.io

**Option A : Railway** (https://railway.app)
1. Créer un compte GitHub et pousser le projet sur GitHub
2. Aller sur https://railway.app/new
3. Sélectionner le repo GitHub
4. Choisir le dossier `backend`
5. Ajouter les variables d'environnement depuis `.env.production.example`
6. Déployer

**Option B : Render** (https://render.com)
1. Créer un compte
2. New + > Web Service
3. Connecter le repo GitHub
4. Build command : `npm run build`
5. Start command : `npm run start`
6. Ajouter les variables d'environnement

## Option 2 : VPS classique (pour production)

Voir le guide complet dans `deploy/DEPLOY_GUIDE.md`

## Variables d'environnement requises

Copier `backend/.env.production.example` vers `backend/.env` et remplir :

```env
# Base de données (obtenir chez Neon, Supabase, ou hébergeur)
DATABASE_URL=postgresql://user:password@host:5432/mrt_prod

# Redis (Redis Cloud gratuit : https://redis.com/cloud/)
REDIS_URL=redis://default:password@host:6379

# MinIO / S3 (Wasabi, Backblaze, ou MinIO hébergé)
MINIO_ENDPOINT=s3.example.com
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
MINIO_BUCKET_MRT=mrt-prod

# JWT (générer avec : openssl rand -base64 32)
JWT_SECRET=xxx
JWT_REFRESH_SECRET=xxx
SESSION_SECRET=xxx

# SMS/Email (optionnel pour test)
SMS_PROVIDER=console
EMAIL_PROVIDER=console
```

## URLs après déploiement

- Citoyen : https://maliretrouve.vercel.app (ou votre domaine)
- Agent : https://agent-maliretrouve.vercel.app
- Admin : https://admin-maliretrouve.vercel.app
- API : https://votre-backend.up.railway.app

## Partage pour feedback

Une fois déployé, partagez simplement les URLs avec vos testeurs :
- **Citoyens** : https://maliretrouve.vercel.app
- **Agents** : https://agent-maliretrouve.vercel.app
- **Admins** : https://admin-maliretrouve.vercel.app
