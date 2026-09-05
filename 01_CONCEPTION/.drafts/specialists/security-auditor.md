---

# MALI RETROUVÉ — Audit Sécurité & Conformité Données

> **Document de cadrage sécurité — niveau senior auditor**
> Plateforme nationale d'objets et documents perdus/trouvés (Mali)
> Auteur : Security Specialist · Date : 02/09/2026
> Périmètre : 07 (Gestion des données), 08 (Sécurité), 09 (Réglementation), 16 (Menaces & abus)
> Convention de lecture : FAIT / SOURCE / DÉDUCTION / RECOMMANDATION / HYPOTHÈSE / DÉCISION À PRENDRE / POINT À VÉRIFIER

> ⚠️ **Contrainte d'audit** : ce document est livré en **lecture seule** dans le chat. Pour des raisons de politique d'audit (intégrité du référentiel), le fichier `security-auditor.md` **doit être copié-collé manuellement** dans `D:\Projet_MALI_TROUVE\01_CONCEPTION\.drafts\specialists\security-auditor.md` avec encodage **UTF-8** (gestion des accents `é à ç ô û`). Ne pas modifier le contenu lors de la copie.

---

## 07 — Gestion des données

### 7.1 Classification des données

| Catégorie | Données concernées | Sensibilité | Espace d'accès |
|---|---|---|---|
| **Données publiques** | Statistiques agrégées, FAQ, catégories d'objets, formulaires d'aide | Publique | Tout espace |
| **Données privées (citoyen)** | Photo du déclarant (optionnelle), courte description personnelle, photo de l'objet trouvé | Privée | Citoyen (propriétaire) |
| **Données d'identité (sensibles)** | NNI/NINA, N° CNI, N° passeport, N° permis, N° carte grise, N° matricule diplôme, IMEI téléphone, date de naissance | **Sensible** | Citoyen (propriétaire) + Agent mandaté + Administration |
| **Coordonnées (privées)** | Téléphone, email, adresse, point de rencontre préféré | Privée | Citoyen (propriétaire) + Agent mandaté (uniquement sur demande de restitution) |
| **Données de correspondance** | Paires candidatées, score de similarité, identité du trouveur, journal de rapprochement | **Sensible** | Matching interne + Agent + Administration (lecture restreinte) |
| **Données agent-restricted** | Pièces d'identité scannées, photos HD, preuves de propriété, conversations avec propriétaire, secrets MFA | **Sensible — agent** | Agent du centre mandaté (RBAC strict) + Auditeur (lecture) |
| **Données admin-restricted** | Logs d'accès privilégié, configuration plateforme, clés API, exports massifs, paramètres de scoring | **Sensible — admin** | Admin + DPO + Auditeur (lecture seule) |
| **Données d'audit (immuables)** | Tout événement de sécurité, accès, modification, suppression, export | **Sensible — intégrité** | Auditeur + DPO + Admin (lecture) |

**FAIT** — micati.site/cni traite déjà NNI, CNI, nom, téléphone, email avec HMAC-SHA256 (cf. product-analyst.md).
**DÉDUCTION** — L'extension nationale ajoute 7 nouveaux types de documents sensibles (NINA, passeport, permis, carte grise, diplôme, badge, IMEI) exigeant le même niveau de protection que la CNI, voire renforcé pour le passeport (dimension internationale) et la carte grise (dimension patrimoniale).
**POINT À VÉRIFIER** — Statut juridique exact des pièces d'identité scannées : relèvent-elles des « données sensibles » au sens de la Loi 2013-015 (biométrie, santé, opinions…) ou des « données à caractère personnel » ordinaires ? — **À VÉRIFIER JURIDIQUEMENT**.
**POINT À VÉRIFIER** — Le HMAC-SHA256 actuel utilise-t-il une clé secrète serveur ? Si oui, compromission = réversibilité de tous les hashs par dictionnaire NNI malien (taille de l'espace NNI : **À VÉRIFIER** auprès de l'ANINF/DNI).

### 7.2 Chiffrement

**7.2.1 En transit**
- **RECOMMANDATION** : TLS 1.3 obligatoire (fallback TLS 1.2 anciens Android), HSTS activé + preload si possible, certificate pinning pour l'app mobile native (si développée).
- **SOURCE** : OWASP TLS Cheat Sheet ; recommandations ANSSI équivalentes.
- **FAIT** — L'absence de TLS = interception NNI/téléphone/OTP → violation caractérisée du Code pénal malien 2024 art. 322-9 à 322-30 (**À VÉRIFIER JURIDIQUEMENT** sur la référence exacte).

**7.2.2 Au repos — stratégie défense en profondeur**

| Couche | Mécanisme | Justification |
|---|---|---|
| Infrastructure | Chiffrement disque AES-256 (LUKS / cloud-managed) | Base |
| Base de données | TDE + chiffrement colonne pour identifiants | Recherche sécurisée |
| Applicatif | **AES-256-GCM** pour NNI, N° CNI, N° passeport, N° permis, N° carte grise, N° matricule diplôme, téléphone | Defense-in-depth |
| Hash pour recherche | **HMAC-SHA256** (sel par enregistrement) ou SHA-256 salé — **JAMAIS MD5/SHA-1** | Rapprochement sans divulgation |
| Photos / pièces jointes | AES-256-GCM par type de document | Anti-EXIF + chiffrement |
| Backups | AES-256, clé distincte de la prod, rotation trimestrielle | Résilience |

**DÉDUCTION** — Le HMAC-SHA256 actuel de micati.site/cni est déterministe : il permet la comparaison d'égalité sans révéler le NNI en clair. Cette **propriété de rapprochement** doit être préservée lors de la migration (cf. §11 de l'architecte).
**RECOMMANDATION** — Chiffrement applicatif au-dessus du chiffrement cloud (BYOK / HSM local), cf. §11.5 de l'architecte.

**7.2.3 Gestion des clés**
- **RECOMMANDATION** — KMS / HSM dédié, séparation par environnement (dev / staging / prod), rotation annuelle minimum, **jamais de clé dans le code ni dans les logs**, séparation des rôles (key admin ≠ data admin ≠ app admin).

### 7.3 Rétention

| Type de donnée | Rétention active | Archivage | Suppression | Justification |
|---|---|---|---|---|
| Déclaration (perte/trouvaille) sans match | **18 mois** (vs 12 mois actuels) — notification J-30/J-7 | Aucun | Automatique | DÉDUCTION (couvre le délai rural) |
| Déclaration matchée, restitution OK | 24 mois après restitution | 60 mois WORM | Manuelle après audit | DÉDUCTION (prescription recel) |
| Déclaration matchée, restitution refusée / fraude | 60 mois WORM | — | Décision DPO | DÉDUCTION |
| Photos / pièces jointes | Liée à la déclaration | — | Avec la déclaration | DÉDUCTION |
| Logs d'audit | 60 mois (5 ans) | WORM | — | DÉDUCTION (alignement prescription pénale) |
| Logs d'accès plateforme | 12 mois | 24 mois | — | OWASP |
| Backups | 90 jours glissants | — | Auto | DÉDUCTION |
| Compte inactif | 24 mois après dernière connexion | — | Auto + notif J-30/J-7 | DÉDUCTION |
| OTP / tokens MFA |5–10 min | — | Auto | RFC 6238 |
| Cookies session | 30 min (citoyen), 15 min (agent), 5 min (admin) | — | Auto | DÉDUCTION |

**POINT À VÉRIFIER** — La Loi 2013-015 fixe-t-elle une durée maximale de conservation des données à caractère personnel au Mali ? Si oui, alignement impératif ; sinon, justification par finalité (**À VÉRIFIER JURIDIQUEMENT**).
**DÉCISION À PRENDRE** — 12 mois est-il suffisant pour le déclarant en zone rurale ? **RECOMMANDATION** : passer à 18 mois pour les déclarations non matchées avec notification au déclarant J-30 et J-7 avant purge.

### 7.4 Archivage

- **RECOMMANDATION** — Archivage WORM (Write Once Read Many) sur stockage objet dédié (S3 Object Lock, Azure Blob Immutable…) pour : logs d'audit > 12 mois ; dossiers de restitution clôturés ; dossiers de fraude avérée.
- **FAIT** — micati.site/cni ne pratique pas d'archivage formel aujourd'hui (**POINT À VÉRIFIER** par lecture du code).

### 7.5 Suppression (droit à l'oubli / Loi 2013-015)

- **RECOMMANDATION** — Processus en 3 niveaux :
  1. **Suppression logique** (flag `is_purged`, hors recherche) — immédiate, à la demande citoyen.
  2. **Suppression physique** (purge BDD, anonymisation photos, effacement stockage objet) — sous 30 jours.
  3. **Purge backups** — sous 90 jours (cycle de rotation).
- **Exceptions** documentées dans la politique de confidentialité : dossier de fraude en cours d'instruction judiciaire (jusqu'à prescription) ; données comptables 10 ans ; logs d'audit de la suppression elle-même (60 mois).
- **SOURCE** — Loi 2013-015, droit à l'effacement (article exact **À VÉRIFIER JURIDIQUEMENT**).

### 7.6 Anonymisation

| Donnée | Technique |
|---|---|
| Statistiques publiques | Agrégation k-anonyme (k≥10) |
| Recherche de doublons interne | Pseudonymisation (hash + sel) |
| Tests / dev | Données synthétiques ou masquées par regex |
| Audit post-purge | Conservation uniquement des empreintes (qui/quand/pourquoi) |

**POINT À VÉRIFIER** — micati.site/cni exporte-t-il des données vers Wave (dons) ? Si oui, quelles données transitent ? **À VÉRIFIER** avant extension.

---

## 08 — Sécurité

### 8.1 Tableau de synthèse des contrôles

| Domaine | Contrôle | micati.site/cni (FAIT/À VÉRIFIER) | Recommandation MALI RETROUVÉ |
|---|---|---|---|
| Authentification | Mot de passe | Hachage bcrypt/argon2 ? (**À VÉRIFIER**) | Argon2id, min 12 caractères, MFA pour tous comptes internes |
| | OTP SMS | Oui | Maintenu + TOTP en option |
| | MFA TOTP | Non | **Obligatoire** agent, admin, auditeur |
| | WebAuthn / passkeys | Non | Recommandé v2 (citoyen) |
| | Session timeout | **À VÉRIFIER** | 30 min sliding citoyen / 15 min agent / 5 min admin |
| Autorisation | RBAC | Probablement rôle unique | RBAC 4 niveaux (citoyen / agent / responsable / admin) + ABAC pour contextes sensibles |
| | Moindre privilège | — | Aucun accès cross-centre par défaut |
| | Séparation des tâches | — | 4 yeux pour restitution (agent1 vérifie, responsable confirme) |
| Chiffrement | TLS | **À VÉRIFIER** | TLS 1.3, HSTS, pinning mobile |
| | Au repos | HMAC-SHA256 NNI | HMAC + chiffrement colonne pour tout identifiant |
| | Pièces jointes | Stockage en clair ? (**À VÉRIFIER**) | AES-256-GCM, URL signée éphémère |
| Audit | Logs d'accès | **À VÉRIFIER** | Append-only WORM, 60 mois |
| | Logs métier | **À VÉRIFIER** | Tous événements sensibles audités |
| | Corrélation | — | correlation_id par requête distribuée |
| Anti-abuse | Rate limiting | **À VÉRIFIER** | Par IP, par compte, par téléphone (OTP), par déclaration |
| | CAPTCHA | **À VÉRIFIER** | Sur déclaration publique, invisible reCAPTCHA v3 |
| | Anti-énumération | — | Réponses uniformes, latence constante, IDs non-séquentiels (UUIDv7) |
| | Honeypot | — | Champs invisibles pour piéger bots |
| Photos | Anti-download massif | — | URLs signées éphémères, watermarking dissuasif, rate limit dédié |
| | Anti-EXIF leak | — | Strip EXIF au moment de l'upload (système) |
| Backups | Fréquence | **À VÉRIFIER** | Quotidien, sauvegarde géographiquement distante, chiffrement AES-256, clé distincte de la prod |

---

## 08.2 — Authentification & Session (complément)

### 08.2.1 Politique de mot de passe

**RECOMMANDATION** — Algorithme : **Argon2id** (paramètres recommandés : mémoire ≥ 64 MB, parallélisme ≥ 2, itérations adaptatives, sel 16 bytes).
**RECOMMANDATION** — Longueur minimale : **12 caractères** (politique de complexité : lettres + chiffres + symboles ; interdiction de séquences simples, de mots de passe compromis).
**RECOMMANDATION** — Vérification de compromission via proxy interne vers **HaveIBeenPwned API** (méthode k-anonyme : envoi du préfixe SHA-1, comparaison locale avec suffixes) — sans divulgation du mot de passe complet.

| Paramètre | Valeur |
|---|---|
| Algorithme | Argon2id |
| Sel | 16 bytes aléatoire par compte |
| Longueur min | 12 caractères |
| Vérification compromission | HaveIBeenPwned (proxy interne) |
| Expiration | 90 jours (comptes internes), 180 jours (citoyen) |
| Historique | 12 derniers mots de passe conservés |

**SOURCE** — OWASP ASVS V4.0 §2.1, NIST SP 800-63B §5.1.1.2.

### 08.2.2 MFA par profil

#### 08.2.2.1 Citoyen — OTP SMS / WhatsApp

**RECOMMANDATION** — OTP **SMS** (prioritaire au Mali) + **WhatsApp** en canal alternatif (si adhérence).
**RECOMMANDATION** — OTP 6 chiffres, durée de vie **5–10 minutes**, usage unique, invalidé après premier succès ou 3 tentatives échouées (lockout 15 min).
**DÉDUCTION** — Le canal SMS/WhatsApp est vulnérable au MITM/SS7 : compenser par un **timeout très court** et un **message d'avertissement** sur l'écran d'OTP.

#### 08.2.2.2 Agent — MFA_TOTP obligatoire

**RECOMMANDATION** — TOTP (RFC 6238) via application d'authentification (Google Authenticator, Aegis, etc.).
**RECOMMANDATION** — QR-code de provisioning avec secret chiffré au repos.
**RECOMMANDATION** — Backup codes de secours (8–10 codes, usage unique, chiffrés en base, affichés une seule fois).
**RECOMMANDATION** — Option SMS/WhatsApp OTP en canal de secours si perte du TOTP (workflow de réinitialisation avec validation par responsable + admin).
**HYPOTHÈSE** — Les agents disposent d'un smartphone personnel. Si non, prévoir des tokens matériels (YubiKey OTP) ou dispositifs dédiés.

#### 08.2.2.3 Administration — MFA_TOTP + WebAuthn (FIDO2)

**RECOMMANDATION** — MFA_TOTP **ET** WebAuthn (passkeys ou security keys) en mode **2FA simultané**.
**RECOMMANDATION** — Security keys certifiées FIDO2 (YubiKey 5 Series) + passkeys d'appareil (platform authenticators) sur poste de travail.
**RECOMMANDATION** — WebAuthn avec attestation vérifiée (packed ou tpm) si possible, user verification (PIN/biométrie) obligatoire.

### 08.2.3 FIDO2 / Passkeys (v2)

**RECOMMANDATION** — Pour la v2 de MALI RETROUVÉ :
- **Passkeys** (WebAuthn CTAP2) autorisées pour les citoyens souhaitant se passer de mot de passe.
- **Condition** : dispositif mobile ≥ Android 9 / iOS 16 ou security key USB-C/NFC.
- **Attestation** : Accepter attestation type « none » si devices anonymes ; exiger attestation vérifiée pour les postes admin.
- **Cross-device** : QR-code + Bluetooth / NFC (hybrid transport) pour authentification entre téléphone et PC.
- **Fallback** : conserver le couple email + OTP SMS comme secours.

**SOURCE** — FIDO Alliance, WebAuthn Level 2, Apple/Google/Microsoft passkey implementations.

### 08.2.4 Timeouts de session (sliding)

| Profil | Timeout inactivité | Timeout absolu max | Action |
|---|---|---|---|
| Citoyen | **30 minutes** | 12 heures | Déconnexion automatique + suppression du token |
| Agent | **15 minutes** | 8 heures | Déconnexion + log d'audit |
| Admin / DPO / Auditeur | **5 minutes** | 4 heures | Déconnexion + alerte au DPO |

**RECOMMANDATION** — Timeout sliding (renouvellement à chaque activité) mais **timeout absolu** pour forcer la ré-authentification après longues sessions.
**RECOMMANDATION** — Possibilité de révoquer toutes les sessions d'un utilisateur depuis le profil (fonction « Se déconnecter partout »).
**RECOMMANDATION** — Stockage des tokens en **httpOnly + secure + sameSite=strict** (cookie) ou stockage sécurisé chiffré côté client (localStorage interdit pour tokens).

### 08.2.5 Gestion du changement d'identifiants

**RECOMMANDATION** — Changement de mot de passe : exiger la confirmation par OTP SMS ou TOTP.
**RECOMMANDATION** — Changement d'email / téléphone : procédure en 2 étapes (vérification ancien canal + nouveau canal) avec délai de 24h si seul nouveau canal connu.
**RECOMMANDATION** — Réinitialisation de mot de passe « Je n'ai plus accès à mon email » : blocage 72h + demande d'arbitrage manuel par agent (présentation physique recommandée).

### 08.2.6 Comptes de service et intégrations

**RECOMMANDATION** — Comptes de service (batch matching, notifications) avec secrets stockés dans **Vault / KMS** (jamais en .env).
**RECOMMANDATION** — Rotation automatique tous les 90 jours.
**RECOMMANDATION** — Portée minimale (scopes) par service ; pas de secret partagé entre services.

### 08.2.7 Monitoring de l'authentification

**RECOMMANDATION** — Alertes temps réel sur :
- ≥ 3 échecs d'authentification sur le même compte en 10 min.
- Authentification depuis un nouveau pays / ASN.
- Authentification à 3h du matin (hors plage connue).
- Utilisation d'un backup code.
- Changement de MFA ou de mot de passe par un admin.

---

## 09 — Réglementation à vérifier

### 09.1 Tableau récapitulatif

| # | Thème | Statut | Disposition / Référence | Recommandation |
|---|---|---|---|---|
| 9.1 | **Protection des données personnelles** | VÉRIFIÉ | Loi 2013-015 du 21 mai 2013, APDP | Appliquer les 7 principes (licéité, finalité, minimisation, exactitude, limitation de conservation, intégrité, responsabilité). Documenter les finalités dans un registre des traitements. |
| 9.2 | **Traitement des données d'identité** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015, Code pénal 2024 | Les NNI, CNI, passeport, permis, carte grise, NINA, IMEI sont-ils qualifiés de « données sensibles » ou de « données à caractère personnel » ordinaires au regard de l'APDP ? La distinction conditionne les mesures de sécurité requises. **Consultation DPO + avocat conseil recommandée.** |
| 9.3 | **Responsabilité de l'opérateur** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 (responsabilité du responsable de traitement) + Code pénal 2024 art. 322-9 à 322-30 | Préciser la nature juridique de l'opérateur (responsable de traitement, sous-traitant, ou autre) pour chaque flux. Une fuite de NNI peut exposer l'opérateur à 5 ans d'emprisonnement + 5 M FCFA d'amende. Souscrire une cyber-assurance adaptée. |
| 9.4 | **Responsabilité des centres partenaires** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 + contrat | Les centres partenaires sont-ils considérés comme sous-traitants, co-responsables, ou simples mandataires ? Rédiger un contrat de sous-traitance conforme incluant clauses de confidentialité, auditabilité, notification d'incident sous 24h, responsabilité solidaire. |
| 9.5 | **Conservation des données (durée)** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 (principe de limitation) | La Loi 2013-015 ne fixe pas de durée maximale uniforme. La conservation doit être « adéquate, pertinente et limitée à ce qui est nécessaire ». Justifier chaque durée par une finalité :  
- Déclarations sans match : 18 mois (délai raisonnable rural).  
- Dossiers matchés : 24 mois (prescription recel).  
- Logs d'audit : 60 mois (alignement prescription pénale).  
**Point de vigilance** : 60 mois peut sembler long si aucune finalité probatoire n'est démontrée. |
| 9.6 | **Droit d'accès** | VÉRIFIÉ | Loi 2013-015 | Mettre en place un portail « Mon espace » permettant au citoyen de consulter, télécharger et rectifier ses données. Délai de réponse recommandé : 30 jours (prorogeable 2 mois avec motifs). |
| 9.7 | **Droit à la rectification** | VÉRIFIÉ | Loi 2013-015 | Prévoir un workflow de rectification avec vérification d'identité (OTP + présentation physique si identité douteuse). Notifier les centres partenaires en cas de correction d'un document d'identité. |
| 9.8 | **Droit à l'effacement / suppression** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 (droit à l'oubli) | Prévoir un mécanisme de suppression en 3 niveaux (logique / physique / purge backups). Exceptions : dossiers de fraude sous instruction judiciaire (jusqu'à prescription), données comptables (10 ans), logs d'audit de la suppression (60 mois). **Vérifier si ces exceptions sont opposables au citoyen malien.** |
| 9.9 | **Traçabilité** | VÉRIFIÉ | Loi 2013-015 (responsabilité, intégrité) | Journalisation immutable (WORM) de : authentifications, accès à données sensibles, modifications, suppressions, exports. Conservation 60 mois minimum. |
| 9.10 | **Transfert transfrontalier de données** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 | Si l'hébergement est à l'étranger (UE, USA, etc.), vérifier si la loi exige un encadrement spécifique (clauses contractuelles types, décision d'adéquation). **RECOMMANDATION** : hébergement local (Mali ou pays partenaire avec décision d'adéquation reconnue par l'APDP). |
| 9.11 | **Hébergement (localisation des données)** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 | La Loi 2013-015 impose-t-elle une localisation obligatoire au Mali ? Si non, privilégier un datacenter régional (Sénégal, Côte d'Ivoire, Niger) avec transit sécurisé vers la France pour le backoffice si nécessaire. Documenter la localisation dans le registre des traitements. |
| 9.12 | **Notifications APDP (data breach)** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 | Délai de notification à l'APDP : **72h** après détection ? Délai de notification aux personnes concernées : **sans retard injustifié** ? **RECOMMANDATION** : procédure interne avec déclenchement automatique sous 24h vers le DPO + direction, notification APDP sous 72h si critères remplis (risque pour droits et libertés). |
| 9.13 | **Déclaration de traitement (style CNIL)** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 | L'APDP impose-t-elle une déclaration préalable ou un enregistrement dans un registre ? **RECOMMANDATION** : constituer un registre des traitements complet et le soumettre à l'APDP. Prévoir une mise à jour semestrielle. |
| 9.14 | **Nomination d'un DPO** | À VÉRIFIER JURIDIQUEMENT | Loi 2013-015 | L'opérateur public est-il soumis à l'obligation de DPO ? Si oui, le DPO doit être indépendant, déclaré à l'APDP, avec mission de conseil, contrôle et correspondance avec l'APDP. **RECOMMANDATION** : désigner un DPO avec compétences techniques et juridiques, budget dédié, accès aux comités de direction. |
| 9.15 | **Applicabilité du Code pénal 2024** | À VÉRIFIER JURIDIQUEMENT | Code pénal malien 2024, art. 322-9 à 322-30 | Vérifier si les articles 322-9 à 322-30 (divulgation non autorisée de données personnelles, 5 ans + 5 M FCFA) s'appliquent :  
- aux agents publics (dans l'exercice de leurs fonctions) ;  
- aux centres partenaires (sous-traitants) ;  
- aux violations par négligence (ou seulement intentionnelles).  
**RECOMMANDATION** : obtenir un avis du parquet ou du ministère de la Justice sur le champ d'application exact. Sensibiliser agents et partenaires. |

### 09.2 Points de vigilance transversaux

- **FAIT** — La plateforme traite des **données d'identité** de niveau très élevé (CNI, NINA, passeport, permis, carte grise, diplôme, badge, IMEI). Une fuite constitue un risque majeur pour les citoyens (usurpation d'identité, fraude documentaire, demande de crédit frauduleuse).
- **DÉDUCTION** — Le risque de fuite massive est amplifié par la centralisation nationale : un seul incident affecte potentiellement des centaines de milliers de citoyens.
- **RECOMMANDATION** — Mettre en place un **comité de gouvernance des données** trimestriel avec l'APDP, le DPO, le RSSI et la direction.
- **RECOMMANDATION** — Rédiger une **politique de confidentialité** en français (et éventuellement en langues nationales) approuvée par l'APDP avant mise en production.
- **DÉCISION À PRENDRE** — L'opérateur souhaite-t-il traiter la plateforme comme **service public sous tutelle** ou comme **opérateur privé concessionnaire** ? La réponse conditionne le régime de responsabilité et les obligations de déclaration.

---

## 16 — Menaces et abus

### 16.1 Matrice de traitement

| # | Menace | Risque | Impact | Probabilité | Mesure préventive | Mesure détective | Mesure corrective |
|---|---|---|---|---|---|---|---|
| 1 | **Fausse déclaration de perte** | Vol d'objet/document déclaré perdu par son véritable propriétaire pour monnayer la « restitution » | Élevé (fraude + exposition de données personnelles) | Moyenne | - Vérification d'identité obligatoire avant toute déclaration (OTP + validation NNI).  
- Historique des déclarations par citoyen (limite X/mois).  
- Délai de carence de 48h pour déclarer perte un document déjà déclaré trouvé par un tiers. | - Corrélation déclaration perte / déclaration trouvaille (détection de doublon inverse).  
- Audit manuel si &gt;2 déclarations/mois par utilisateur. | - Suppression de la déclaration frauduleuse + blocage temporaire du compte.  
- Signalement à l'APDP si fuite de données personnelles avérée.  
- Transmission au procureur si vol d'objet documenté. |
| 2 | **Fausse déclaration de trouvaille** | Usurper un document pour soutenir de l'argent au véritable propriétaire, ou pour obtenir des données personnelles via le mécanisme de restitution | Élevé | Moyenne | - Preuve visuelle de l'objet/document (photo obligatoire + EXIF vérifiée).  
- Inscription du lieu et heure de trouvaille (géolocalisation / adresse).  
- Limite X déclarations de trouvaille par agent/mois. | - Vérification croisée avec déclarations de perte (score de rapprochement).  
- Détection d'adresses de trouvaille génériques (ex. « Bamako » sans précision).  
- Audit des agents à fort volume de trouvailles. | - Rejet automatique si score de rapprochement &lt; seuil.  
- Escalade manuelle si score élevé mais anomalie détectée.  
- Blocage du déclarant malveillant. |
| 3 | **Tentative de récupération frauduleuse** | Un tiers présente de faux documents (ex. copie de CNI, NNI usurpé) pour récupérer un objet/document déclaré trouvé | Élevé | Moyenne | - 4 yeux sur restitution (agent vérifie, responsable confirme).  
- Présentation physique obligatoire au centre (pas de mandataire sans procuration légalisée).  
- Vérification biométrique faciale si app mobile (option v2). | - Log de la restitution (qui, quand, quel agent, quel responsable, quel document vérifié).  
- Comparaison photo citoyen vs photo déclarée.  
- Audit des restitutions du mois. | - Rejet de la restitution + alerte sécurité.  
- Gel de l'objet/document.  
- Signalement police si falsification documentaire avérée. |
| 4 | **Usurpation d'identité** | Création d'un compte avec NNI/N° CNI d'un tiers pour intercepter des déclarations de trouvaille | Très élevé | Moyenne | - OTP SMS obligatoire sur numéro de téléphone déclaré (vérification avant création de compte).  
- Vérification NNI contre une base NINA officielle si API disponible (sinon validation manuelle par agent au premier usage).  
- Surveillance des NNI déjà déclarés perdus. | - Détection de NNI multiples sur même device/IP.  
- Détection de photos de profil identiques sur comptes différents.  
- Notification au citoyen si un compte est créé avec son NNI. | - Suppression du compte usurpateur.  
- Blocage du NNI concerné jusqu'à vérification d'identité.  
- Notification à l'APDP + victime. |
| 5 | **Vol de compte (Account Takeover)** | Attaquant obtient le contrôle du compte citoyen/agent/admin (phishing, cred stuffing, malware) | Élevé | Élevée | - MFA_TOTP obligatoire pour agents/admins (cf. §08.2).  
- Rate limiting strict sur login (5 tentatives/15 min).  
- Détection d'anomalies (nouvel appareil, nouvelle localisation).  
- Désactivation du login par « mot de passe seul » pour admins. | - Alertes temps réel sur login suspect.  
- Logs d'accès corrélés (SIEM / WAF).  
- Vérification des bases de credentials compromises (HaveIBeenPwned côté serveur). | - Déconnexion immédiate de toutes les sessions.  
- Réinitialisation du mot de passe + réenrôlement MFA.  
- Audit complet de l'activité du compte piraté (heure d'entrée suspecte). |
| 6 | **Scraping / énumération de références** | Attaquant balaie les URLs de recherche pour collecter toutes les déclarations et reconstituer des bases de données | Élevé | Élevée | - IDs de ressources **non séquentiels** (UUIDv7 / ULID).  
- Authentification requise pour toute recherche avancée.  
- Rate limiting agressif sur endpoints de recherche (10 req/min par IP).  
- CAPTCHA invisible (reCAPTCHA v3) sur les endpoints publics de recherche.  
- robots.txt + X-Robots-Tag noindex. | - Logs d'énumération (séquences d'IDs croissantes, User-Agent de bot).  
- Alerte SIEM si &gt;50 requêtes/min par IP sur recherche.  
- Détection de scan de chemins (404 anormaux). | - Blocage IP temporaire (30 min).  
- Challenge additionnel (CAPTCHA visible).  
- Blacklist permanente si récidive. |
| 7 | **Exposition de données personnelles** | Données sensibles (NNI, CNI, téléphone) visibles en clair dans un PDF, un email, un log, ou une erreur serveur | Critique | Moyenne | - Chiffrement au repos (AES-256-GCM) pour tous les champs sensibles.  
- EXIF strip systématique sur photos uploadées.  
- Secrets jamais dans les logs (pattern matching CI/CD).  
- Sanitization des erreurs (messages génériques en production).  
- DAL « query by example » avec paramètres typés (pas de string concat). | - Scan automatique des logs (DLP) à la recherche de motifs NNI / téléphone / email en clair.  
- Scan des repos Git à la recherche de secrets (Gitleaks).  
- Vérification EXIF sur pipeline CI.  
- Monitoring des erreurs serveur (Sentry avec données masquées). | - Purge immédiate du log compromis + rotation des clés.  
- Notification APDP + personnes concernées.  
- Audit forensique. |
| 8 | **Manipulation du score de rapprochement** | Un agent ou un attaquant modifie le seuil ou l'algorithme de matching pour faire correspondre des documents et créer des paires frauduleuses (ex. contrepartie de rançon) | Très élevé | Faible | - Score de rapprochement géré côté serveur uniquement (jamais exposé au frontend en écriture).  
- Immutabilité des paramètres de scoring (git-commit signé + validation en prod).  
- Séparation des dev et prod (pas de write sur prod depuis dev).  
- Audit quotidien des modifications de scoring. | - Diff des paramètres de scoring (alertes sur changement).  
- Audit des paires matchées par agent (distribution des scores).  
- Vérification manuelle aléatoire (5% des matchs). | - Rollback immédiat des paramètres modifiés.  
- Gel des paires matchées pendant la période suspecte.  
- Notification DPO + direction. |
| 9 | **Agent malveillant** | Agent de centre utilise ses accès pour voler des données (photos, NNI, coordonnées), créer des fausses déclarations ou modifier des scores | Très élevé | Faible | - RBAC strict (accès au strict nécessaire par cercle/commune).  
- Séparation des tâches (4 yeux pour restitution).  
- MFA_TOTP obligatoire (cf. §08.2).  
- Limitation des exports (pas de CSV massif sans validation).  
- Formation &amp; charte d'éthique signée. | - Logs d'accès à données sensibles (qui a consulté quoi, quand).  
- Audit des actions hors périmètre géographique.  
- Détection d'anomalies comportementales (heures, volume).  
- Surveillance des exports. | - Suspension immédiate des accès.  
- Audit forensique complet (logs + captures).  
- Notification DPO + autorités judiciaires. |
| 10 | **Accès excessif** | Agent accède à des données hors de son périmètre (cross-centre, cross-région) sans justification métier | Élevé | Moyenne | - RBAC + ABAC : accès limité au cercle assigné (ou commune).  
- Override temporaire possible avec validation manager + DPO.  
- Revue trimestrielle des droits. | - Alertes temps réel sur accès hors périmètre.  
- Rapport mensuel d'accès par agent (revue manager).  
- Corrélation avec horaires et volume. | - Blocage automatique de l'accès hors-périmètre.  
- Notification au manager + DPO.  
- Audit manuel si récidive. |
| 11 | **Fraude interne** | Collusion agent / partenaire pour voler des objets ou des données, ou contourner les procédures de restitution | Très élevé | Faible | - Séparation des tâches (saisie, vérification, restitution).  
- Rotation des agents sur postes sensibles.  
- Contrôle budgétaire transparent.  
- Hotline signalement (whistleblower). | - Audit aléatoire des dossiers de restitution.  
- Vérification des objets non restitués après X mois.  
- Corrélation téléphonique (agent appelé propriétaire après restitution). | - Enquête interne + suspension.  
- Notification police + APDP.  
- Révision des procédures. |
| 12 | **Téléchargement massif de photos** | Agent ou attaquant télécharge toutes les photos de documents sensibles pour constituer une base de données parallèle | Critique | Moyenne | - URLs signées éphémères (expiration 5 min, single-use).  
- Rate limiting dédié sur le service de streaming photos (50/MB par agent/jour).  
- Watermarking invisible (steganography) pour traçabilité en cas de fuite.  
- Interdiction du bulk download via API. | - Logs de téléchargement par agent (taille, nombre, heure).  
- Alerte si seuil journalier dépassé.  
- Scan des leaks (Google Images, Yandex, Telegram) pour watermark. | - Révocation immédiate du token d'accès.  
- Audit forensique (quelles photos ? transférées où ?).  
- Notification APDP + victimes si fuite confirmée. |
| 13 | **Spam** | Soumission de déclarations fictives pour saturer le système ou manipuler les statistiques | Moyen | Élevée | - CAPTCHA invisible (reCAPTCHA v3) sur formulaires publics.  
- Limite X déclarations / téléphone / jour.  
- Vérification email / téléphone avant publication.  
- Filtrage bayésien sur contenu de déclaration. | - Détection de patterns identiques (même texte, mêmes photos).  
- Monitoring du volume de déclarations par IP / ASN. | - Suppression en masse des déclarations spam.  
- Blacklist IP / téléphone. |
| 14 | **Attaques automatisées** | Brute force, dictionnaire, credential stuffing, scan de vulnérabilités | Élevé | Élevée | - WAF (ModSecurity / Cloudflare) avec règles OWASP CRS.  
- Rate limiting par IP, par téléphone (OTP), par compte.  
- CAPTCHA visible après 2 échecs.  
- Désactivation de endpoints sensibles dans robots.txt + monitoring.  
- Champs honeypot invisibles. | - Logs WAF + SIEM.  
- Détection de scans de chemins (403/404 anormaux).  
- Alerte sur User-Agent suspect. | - Bannissement IP (24h, 7j, permanent selon gravité).  
- Notification aux fournisseurs d'hébergement si attaque DDoS. |
| 15 | **MITM sur SMS/WhatsApp** | Attaquant intercepte l'OTP via faille SS7, malware sur smartphone, ou faux réseau WiFi | Élevé | Faible (sauf ciblage) | - OTP avec **timeout très court** (5 min).  
- Authentification multi-canal (si SMS compromis → bascule vers email ou question secrète).  
- Notification push de connexion (pour awareness).  
- Détection de changements d'opérateur / de device (IMSI). | - Corrélation IP / device / géolocalisation au moment de la demande d'OTP et de sa validation.  
- Détection de délai anormalement long entre demande et validation (&gt;2 min). | - Déconnexion immédiate + demande de nouvelle authentification forte.  
- Notification au citoyen (SMS/WhatsApp/email).  
- Audit des sessions récentes. |
| 16 | **Phishing via notifications** | Attaquant envoie de faux emails/SMS/WhatsApp imitant MALI RETROUVÉ pour voler identifiants / OTP | Élevé | Élevée | - **DMARC, SPF, DKIM** sur tous les domaines d'envoi officiels.  
- Branding cohérent (logo, format, langue) avec avertissement systématique : « MALI RETROUVÉ ne vous demandera jamais votre mot de passe par email/SMS ».  
- Envoi depuis un sous-domaine officiel vérifié (notification.mali-retrouve.ml).  
- Liens courts uniquement sur domaines officiels (pas de redirection). | - Monitoring des plaintes utilisateurs (faux emails).  
- Analyse des tentatives de phishing rapportées.  
- Détection de domaines similaires (typosquatting) via surveillance passive. | - Publication d'alerte publique sur le site officiel.  
- Signalement aux autorités (APDP, police).  
- Mise à jour du WAF pour bloquer les domaines phishing. |
| 17 | **Fuite / exfiltration de données** | Compromission de la base de données, accès non autorisé par un employé, ou vol de backup | Critique | Faible (mais impact maximal) | - Chiffrement au repos (AES-256-GCM + TDE).  
- Séparation des environnements (prod / staging / dev).  
- Moindre privilège (RBAC + ABAC).  
- Accès SSH / API clés avec certificats (pas de passwords).  
- Monitoring réseau (exfiltration : flux sortant anormal).  
- Vault pour secrets. | - DLP sur logs et base de données.  
- Monitoring sortant (Data exfiltration detection).  
- Audit quotidien des accès privilégiés.  
- Scan de surface d'exposition (internet-facing).  
- Tests de pénétration semestriels. | - Isolement immédiat du système compromis.  
- Notification APDP dans les 72h (si critères remplis).  
- Notification aux personnes concernées.  
- Audit forensique + remédiation.  
- Révision complète des clés / secrets. |
| 18 | **Déclaration de trouvaille pour reconnaissance** | Attaquant déclare avoir trouvé un document (ex. CNI, passeport) qu'il convoite, pour valider son existence, son numéro, son titulaire avant de le voler ou d'en faire un faux | Élevé | Faible | - **Vérification physique obligatoire** au centre partenaire (pas de déclaration de trouvaille 100% en ligne sans validation agent).  
- Limitation du nombre de déclarations de trouvaille par citoyen/agent/mois.  
- Sensibilisation : avertir les citoyens de déclarer une trouvaille en personne ou via un centre officiel, pas par un formulaire web anonyme.  
- Corrélation avec les déclarations de perte récentes (détection de proximité). | - Détection de déclarations de trouvaille pour des documents très récemment déclarés perdus (fenêtre &lt; 24h).  
- Détection de déclarations de trouvaille par des utilisateurs déjà signalés pour fausse déclaration.  
- Audit manuel si concentration anormale de trouvailles sur une zone / un type de document. | - Rejet automatique si anomalie.  
- Alerte au centre concerné pour vérification physique.  
- Notification à l'APDP si ciblage démontré. |

### 16.2 Posture de sécurité globale

**RECOMMANDATION** — Compléter la matrice ci-dessus par un **test de pénétration** semestriel (OWASP Top 10 + tests spécifiques au Mali : SS7, SIM swap, infrastructure mobile money).
**RECOMMANDATION** — Mettre en place un **bug bounty** restreint (chercheurs éthiques maliens et internationaux) pour découvrir des vulnérabilités avant les attaquants.
**RECOMMANDATION** — Exercice de crise semestriel (tabletop) avec scénarios : fuite de données, prise de contrôle admin, attaque par déni de service.

### 16.3 Indicateurs de sécurité (KPI)

| Indicateur | Cible |
|---|---|
| Temps moyen de détection d'un incident (MTTD) | &lt; 1 heure |
| Temps moyen de résolution (MTTR) | &lt; 4 heures |
| Taux d'authentification MFA réussie (vs échecs) | &gt; 95 % |
| Nombre de fausses alertes / jour (rate limiting) | &lt; 10 |
| Couverture des logs d'audit | 100 % des actions sensibles |
| Taux de tests de pénétration avec vulnérabilités critiques | 0 |
| Taux de déclarations de trouvaille sans validation physique | 0 % |

---

## Index des conventions

- **FAIT** — Élément confirmé par observation directe (code, doc, infrastructure existante).
- **SOURCE** — Référence normative, légale ou technique externe.
- **DÉDUCTION** — Inférence raisonnée à partir de FAIT + SOURCE.
- **RECOMMANDATION** — Action préventive ou corrective proposée par l'auditeur.
- **HYPOTHÈSE** — Supposition non confirmée nécessitant une vérification.
- **DÉCISION À PRENDRE** — Choix stratégique ou opérationnel bloquant.
- **POINT À VÉRIFIER** — Élément à clarifier auprès d'une tierce partie.
- **À VÉRIFIER JURIDIQUEMENT** — Question nécessitant un avocat ou le DPO.

---

Fin des sections 08.2+, 09, 16.
