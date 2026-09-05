# Mali Retrouvé

Plateforme nationale malienne de déclaration et de recherche de documents et objets perdus ou retrouvés.

**Slogan :** Ensemble, retrouvons l'essentiel.

## 🎯 Objectifs

- Réduire le risque d'usurpation d'identité lié à la perte de documents
- Centraliser les procédures de dépôt et de restitution
- Fournir une traçabilité complète des opérations

## 🏗️ Architecture

```
D:\Projet_MALI_TROUVE/
├── backend/          # API Node.js + Express + Prisma
├── webapp/           # Frontend React + Vite + Tailwind
├── deploy/           # Configurations de déploiement
└── 01_CONCEPTION/    # Documents de conception
```

### Portails

| Portail | URL locale | Description |
|---------|-----------|-------------|
| Citoyen | http://localhost:5173 | Déclarations, correspondances, notifications |
| Agent | http://localhost:5174 | Validation, restitutions, file d'attente |
| Admin | http://localhost:5175 | Statistiques, centres, agents, incidents |

## 🚀 Technologies

### Backend
- Node.js 20+ / Express
- TypeScript
- Prisma ORM (PostgreSQL)
- Redis (cache + queues)
- BullMQ (workers asynchrones)
- Argon2 (hash passwords)
- JWT (authentification)

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router 6
- TanStack React Query 5
- Axios

## 📋 Prérequis

- Node.js 20+
- PostgreSQL 16
- Redis 7
- MinIO (stockage fichiers)

## 🔧 Installation locale

### 1. Base de données
```bash
# Créer la base
sudo -u postgres psql
CREATE USER mrt_user WITH PASSWORD 'mrt_password_123';
CREATE DATABASE mrt_dev OWNER mrt_user;
GRANT ALL PRIVILEGES ON DATABASE mrt_dev TO mrt_user;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npx prisma db seed
npm run dev
```

### 3. Frontend
```bash
cd webapp
npm install
npm run dev
```

## 🌐 Déploiement

Voir le guide complet dans [`deploy/DEPLOY_GUIDE.md`](deploy/DEPLOY_GUIDE.md).

### Déploiement rapide
```bash
# Frontend
cd webapp
npm run build
npx vite build --config vite.agent.config.ts
npx vite build --config vite.admin.config.ts

# Backend
cd backend
npm run build
pm2 start pm2.ecosystem.config.js
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── api/v1/          # Routes API
│   ├── middleware/      # Auth, validation
│   ├── lib/            # Prisma, Redis, JWT, storage
│   └── workers/        # Matching, notifications, purge
├── prisma/
│   └── schema.prisma   # Modèle de données
└── package.json

webapp/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Pages par portail
│   ├── contexts/       # Auth, Theme
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Axios, utils
│   └── types/          # TypeScript interfaces
└── package.json
```

## 🔐 Sécurité

- Authentification JWT + refresh tokens
- MFA/TOTP pour agents et admins
- RBAC (Role-Based Access Control)
- Argon2 pour le hashage des mots de passe
- Chiffrement des données sensibles
- Audit logs immutable
- Rate limiting

## 📄 Licence

© 2026 Mali Retrouvé. Tous droits réservés.

## 📞 Contact

- Email : contact@maliretrouve.ml
- DPO : dpo@maliretrouve.ml
