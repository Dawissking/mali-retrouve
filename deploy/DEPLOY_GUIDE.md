# Mali Retrouvé — Guide de déploiement Option A (sans Docker)

## 1. Prérequis sur le serveur

- Ubuntu 22.04 / 24.04 LTS (ou Debian équivalent)
- Accès SSH avec droits `sudo`
- Domaine `maliretrouve.ml` + sous-domaines `agent.` et `admin.` pointant vers le serveur
- Ports 80, 443 ouverts

Installer les dépendances système :

```bash
sudo apt update
sudo apt install -y nodejs20 npm redis-server postgresql-16 nginx certbot python3-certbot-nginx ufw
```

## 2. Base de données PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER mrt_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE_FORT';
CREATE DATABASE mrt_prod OWNER mrt_user;
GRANT ALL PRIVILEGES ON DATABASE mrt_prod TO mrt_user;
\q
```

## 3. Redis

```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl status redis-server
```

## 4. MinIO (stockage fichiers)

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Créer le dossier de stockage
sudo mkdir -p /opt/minio/data
sudo useradd -r -s /bin/false minio
sudo chown minio:minio /opt/minio/data

# Service systemd
sudo tee /etc/systemd/system/minio.service > /dev/null <<EOF
[Unit]
Description=MinIO Object Storage
After=network.target

[Service]
Type=simple
User=minio
Group=minio
ExecStart=/usr/local/bin/minio server /opt/minio/data --console-address ":9001"
Environment=MINIO_ROOT_USER=mrt_minio_root
Environment=MINIO_ROOT_PASSWORD=VOTRE_MINIO_PASSWORD_FORT
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio
```

Créer le bucket :
```bash
mc alias set local http://localhost:9000 mrt_minio_root VOTRE_MINIO_PASSWORD_FORT
mc mb local/mrt-prod
```

## 5. Déploiement du backend

```bash
# Cloner le dépôt
sudo mkdir -p /var/www/maliretrouve
sudo chown $USER:$USER /var/www/maliretrouve
git clone https://github.com/VOTRE_ORG/mali-retrouve.git /var/www/maliretrouve
cd /var/www/maliretrouve/backend

# Installer les dépendances
npm ci --production=false

# Build
npm run build

# Configuration de production
cp .env.production.example .env
nano .env  # Remplir toutes les variables

# Migrations + seed
npx prisma db push
npx prisma db seed

# Installer PM2
sudo npm install -g pm2

# Démarrer les processus
pm2 start pm2.ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Build du frontend

```bash
cd /var/www/maliretrouve/webapp

# Installer les dépendances
npm ci

# Build citoyen
npm run build

# Build agent
npx vite build --config vite.agent.config.ts

# Build admin
npx vite build --config vite.admin.config.ts
```

Copier les dossiers buildés :
```bash
sudo mkdir -p /var/www/maliretrouve/dist /var/www/maliretrouve/dist-agent /var/www/maliretrouve/dist-admin
sudo cp -r dist/* /var/www/maliretrouve/dist/
sudo cp -r dist-agent/* /var/www/maliretrouve/dist-agent/
sudo cp -r dist-admin/* /var/www/maliretrouve/dist-admin/
sudo chown -R www-data:www-data /var/www/maliretrouve/dist*
```

## 7. Nginx + SSL

```bash
# Copier la config Nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/maliretrouve.conf
sudo ln -s /etc/nginx/sites-available/maliretrouve.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # supprimer la config par défaut

# Tester la config
sudo nginx -t

# Obtenir les certificats SSL
sudo certbot --nginx -d maliretrouve.ml -d www.maliretrouve.ml
sudo certbot --nginx -d agent.maliretrouve.ml
sudo certbot --nginx -d admin.maliretrouve.ml

# Recharger Nginx
sudo systemctl reload nginx
```

## 8. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 9. Vérification

```bash
# Backend
curl https://maliretrouve.ml/api/v1/health

# Frontends
curl https://maliretrouve.ml
curl https://agent.maliretrouve.ml
curl https://admin.maliretrouve.ml
```

## 10. Maintenance

```bash
# Voir les logs PM2
pm2 logs mrt-api
pm2 logs mrt-worker-matching

# Redémarrer
pm2 restart all

# Mettre à jour
cd /var/www/maliretrouve
git pull
cd backend && npm ci && npm run build && pm2 restart all
cd webapp && npm ci && npm run build && npx vite build --config vite.agent.config.ts && npx vite build --config vite.admin.config.ts
sudo cp -r dist/* /var/www/maliretrouve/dist/
sudo systemctl reload nginx
```

## 11. Monitoring recommandé

- **Uptime** : UptimeRobot ou Healthchecks.io sur `/api/v1/health`
- **Logs** : PM2 + `pm2-logrotate`
- **Backups** : `pg_dump` quotidien + upload vers stockage externe
- **Alertes** : email/SMS si backend down > 5 min
