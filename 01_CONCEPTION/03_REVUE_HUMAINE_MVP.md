# Dossier d'Arbitrage Humain — MVP MALI RETROUVÉ
## Phase DEFINE — Revue pré-PLAN

---

**Document :** Dossier d'arbitrage humain
**Objectif :** Organiser la revue humaine de la matrice de validation MVP avant passage au PLAN
**Statut :** À VALIDER PAR LE COMMANDITAIRE — aucune décision implicite n'est retenue
**Date :** 2026-09-03

> **IMPORTANT — Classification des statuts** :
> - **VALIDÉ** : Décision déjà prise humainement (identité visuelle, règle absolue, loi)
> - **À VALIDER** : Proposition technique/métier à arbitrer
> - **À REVOIR** : Conflit ou ambiguïté nécessitant clarification
> - **BLOQUANT** : Décision bloquante pour le PLAN
> - **NON DÉCIDÉ** : Non abordé, à prioriser

---

## A. DÉCISIONS DÉJÀ VALIDÉES

> **Aucune de ces décisions ne doit être remise en cause.** Elles sont issue de validations humaines explicites ou d'exigences légales.

| ID | Domaine | Décision | Source |
|---|---|---|---|
| IV-1 | Identité visuelle | Direction 3 — Communautaire modernisée | VALIDÉ (commanditaire, 2026-09-02) |
| IV-2 | Identité visuelle | Logo Proposition A — « Lien » | VALIDÉ (commanditaire, 2026-09-02) |
| IV-3 | Identité visuelle | Vert principal `#1B6E3F` | VALIDÉ (commanditaire, 2026-09-02) |
| IV-4 | Identité visuelle | Terracotta `#CC5500` | VALIDÉ (commanditaire, 2026-09-02) |
| IV-5 | Identité visuelle | Beige `#F5F0E1` | VALIDÉ (commanditaire, 2026-09-02) |
| IV-6 | Identité visuelle | Gris foncé `#333333` | VALIDÉ (commanditaire, 2026-09-02) |
| IV-7 | Identité visuelle | Blanc `#FFFFFF` | VALIDÉ (commanditaire, 2026-09-02) |
| IV-8 | Identité visuelle | Rouge alerte `#E53935` | VALIDÉ (commanditaire, 2026-09-02) |
| IV-9 | Identité visuelle | Slogan : « Ensemble, retrouvons l'essentiel. » | VALIDÉ (commanditaire, 2026-09-02) |
| IV-10 | Identité visuelle | Logo = symbole entrelacé + nom MALI RETROUVÉ | VALIDÉ (commanditaire, 2026-09-02) |
| M-01 | Matching | Rapprochement = AIDE À LA DÉCISION uniquement | VALIDÉ (architect §13.1, §22.3) |
| M-02 | Matching | JAMAIS de score 96% = propriétaire | VALIDÉ (§22.3 — INTERDIT) |
| M-03 | Validation | Validation humaine toujours requise | VALIDÉ (§13.1, §22.3) |
| E-01 | MVP | Pas de Mobile Money dans MVP | VALIDÉ (§22.3, §19.3 D15) |
| E-02 | MVP | Pilote limité à Bamako + 1 région | VALIDÉ (§23.1 Phase 7) |
| L-01 | Réglementaire | Consentement explicite (Loi 2013-015 art. 7) | VALIDÉ (source légale) |
| L-02 | Réglementaire | Registre des traitements (Loi 2013-015 art. 30) | VALIDÉ (source légale) |

**Total décisions VALIDÉES : 17**

---

## B. DÉCISIONS À VALIDER

### 1. Périmètre exact du MVP

| ID | B-VP-01 |
|---|---|
| **Domaine** | Produit — Périmètre MVP |
| **Décision proposée** | MVP = 9 MUST (déclaration, dépôt, matching, validation, restitution, auth, notification, géographie, centres) + 4 SHOULD + exclusions |
| **Contexte** | §22.2 — Dossier de conception. Le périmètre MVP est défini mais certaines fonctionnalités sont marquées SHOULD et pourraient être reportées |
| **Options** | A. Inclure tous SHOULD dès V1 (lourd) / B. Réduire SHOULD à 2 (léger) / C. Inclure WhatsApp (COULD) dès V1 |
| **Recommandation Kilo** | B — MVP strict avec 9 MUST, reporter WhatsApp et tableaux de bord complexes |
| **Conséquence fonctionnelle** | Scope réduit = livraison + rapide |
| **Conséquence sécurité** | Aucun impact |
| **Conséquence UX** | Moins de canaux de notification disponibles au lancement |
| **Impact MVP** | Élevé — définit ce qui est livré |
| **Statut** | À VALIDER |

### 2. Catégories de documents et objets

| ID | B-CAT-01 |
|---|---|
| **Domaine** | Données — Catégorisation |
| **Décision proposée** | MVP couvre 3 sous-catégories (Document officiel, Document administratif, Objet personnel). Objets de valeur, animaux, "autre" exclus. |
| **Contexte** | §07.1 — Dossier. 6 niveaux hiérarchiques définis. Confilit avec catégories fonctionnelles du product-analyst (Identité, Voyage, Transport, etc.) |
| **Options** | A. Utiliser 6 niveaux tels quels / B. Regrouper en 3 (Document/Objet/Animal) / C. Utiliser catégories fonctionnelles du PA |
| **Recommandation Kilo** | A — Garder les 3 sous-catégories incluses, marquer le conflit avec PA → À VALIDER |
| **Conséquence fonctionnelle** | Détermine le catalogue de saisie |
| **Conséquence sécurité** | Aucun impact |
| **Conséquence UX** | Impact sur la navigation de catégorisation |
| **Impact MVP** | Élevé — structure les données de base |
| **Statut** | À REVOIR (conflit entre §07.1 et §22.3) |

### 3. Données obligatoires vs facultatives

| ID | B-DAT-01 |
|---|---|
| **Domaine** | Données |
| **Décision proposée** | CNI = obligatoire pour citoyens ; option : CNI pour trouvaille (anonyme possible) |
| **Contexte** | §07.2, §09.2 — Dossier. Le citoyen peut-il déclarer sans CNI ? |
| **Options** | A. CNI obligatoire pour tous / B. Saisie manuelle sans CNI / C. CNI via micati uniquement |
| **Recommandation Kilo** | A — CNI obligatoire pour perte ; anonyme possible pour trouvaille |
| **Conséquence fonctionnelle** | Barrière d'entrée pour les sans CNI (analphabètes) |
| **Conséquence sécurité** | CNI obligatoire = meilleure traçabilité |
| **Conséquence UX** | Ralentit le parcours pour ceux sans CNI |
| **Impact MVP** | Élevé — définit le parcours d'inscription |
| **Statut** | À VALIDER |

### 4. Visibilité publique des informations

| ID | B-PUB-01 |
|---|---|
| **Domaine** | Données — Confidentialité |
| **Décision proposée** | Fiche publique = catégorie + ville + date + ref anonyme. Pas de PII. Personne peut revendiquer la propriété en fournissant des infos confidentielles. |
| **Contexte** | §07.2 — Dossier, §13.5. L'exemple de fiche publique est donné |
| **Options** | A. Catégorie + ville approximative + date + ref / B. Plus de détail (quartier) / C. Rien n'est publié |
| **Recommandation Kilo** | A — Niveau minimal pour maximiser la visibilité |
| **Conséquence fonctionnelle** | Balance transparence vs protection |
| **Conséquence sécurité** | Risque de ciblage si trop de détails |
| **Conséquence UX** | Impact sur la capacité à retrouver objet |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER |

### 5. Authentification citoyenne

| ID | B-AUTH-01 |
|---|---|
| **Domaine** | Sécurité — Authentification |
| **Décision proposée** | SMS/MFA (TOTP) pour citoyens. FIDO2 pour admins. |
| **Contexte** | §08.2, §11.1 — Dossier. TOTP V1, FIDO2 V2 (D8) |
| **Options** | A. SMS uniquement / B. TOTP + SMS / C. FIDO2 dès V1 |
| **Recommandation Kilo** | B — TOTP pour les 2e connexions, SMS pour la première |
| **Conséquence fonctionnelle** | Nécessite téléphone mobile pour le citoyen |
| **Conséquence sécurité** | TOTP plus secure que SMS pur |
| **Conséquence UX** | Courbe d'apprentissage MFA |
| **Impact MVP** | Élevé — sécurité de base |
| **Statut** | À VALIDER (D8) |

### 6. Rôles et permissions (7 rôles)

| ID | B-RÔLE-01 |
|---|---|
| **Domaine** | Sécurité — RBAC |
| **Décision proposée** | 7 rôles : Citoyen, Agent centre, Resp centre, Admin régional, Admin national, Auditeur, Admin technique |
| **Contexte** | §03.6, §18.1 — Dossier |
| **Options** | A. 7 rôles tels définis / B. Regrouper (4 rôles) / C. Plus granulaire (10+) |
| **Recommandation Kilo** | A — 7 rôles offrent un bon équilibre |
| **Conséquence fonctionnelle** | Complexité de gestion des permissions |
| **Conséquence sécurité** | Principe du moindre privilège respecté |
| **Conséquence UX** | Impact minimal |
| **Impact MVP** | Élevé — structure fondamentale |
| **Statut** | RECOMMANDÉ — À VALIDER (§18.1) |

### 7. États métier (FSM)

| ID | B-ÉTAT-01 |
|---|---|
| **Domaine** | Règles métier — FSM |
| **Décision proposée** | FSM dossier : CRÉÉ → EN_ATTENTE_RAPPROCHEMENT → CORRESPONDANCE_TROUVÉE → [ACCEPTÉE/REJETÉE/...] |
| **Contexte** | §06.1, §06.2 — Dossier. Le commanditaire a proposé 14 états alternatifs (§05.2 matrice) |
| **Options** | A. FSM dossier (7 états) / B. FSM commanditaire (14 états) / C. Nomenclature hybride |
| **Recommandation Kilo** | A — FSM dossier est plus simple ; états commanditaire → mapping → À valider |
| **Conséquence fonctionnelle** | Complexité de l'UI état |
| **Conséquence sécurité** | Impacts audits et traces |
| **Conséquence UX** | Plus ou moins de complexité |
| **Impact MVP** | Élevé — structure centrale |
| **Statut** | À REVOIR (conflit entre 2 modèles) |

### 8. Rapprochement intelligent

| ID | B-RAP-01 |
|---|---|
| **Domaine** | Matching |
| **Décision proposée** | Algorithme : CNI(40%) + nom/prénom(20%) + date naissance(15%) + description(15%) + lieu(5%) + date(5%) |
| **Contexte** | §13.3 — Dossier, §06.3 |
| **Options** | A. Ces critères / B. Ajouter photos similarity / C. Poids différents |
| **Recommandation Kilo** | A — critères équilibrés, validables |
| **Conséquence fonctionnelle** | Qualité des matches |
| **Conséquence sécurité** | Risque de faux positifs/négatifs |
| **Conséquence UX** | Pertinence des notifications |
| **Impact MVP** | Élevé — valeur métier centrale |
| **Statut** | À VALIDER (HYPOTHÈSE) |

### 9. Seuils de rapprochement

| ID | B-SEUIL-01 |
|---|---|
| **Domaine** | Matching — Seuils |
| **Décision proposée** | Score ≥ 80 → correspondance potentielle ; 50-79 → à vérifier ; < 50 → surveillance 12 mois |
| **Contexte** | §06.3, §13.3, §13.4 — Dossier |
| **Options** | A. 80/50 / B. 70/40 / C. 90/60 |
| **Recommandation Kilo** | A — seuils équilibrés (réduit faux positifs tout en gardant sensibilité) |
| **Conséquence fonctionnelle** | Taux de matches détectés |
| **Conséquence sécurité** | Faux positifs = usurpation possible |
| **Conséquence UX** | Trop de faux positifs = perte de confiance |
| **Impact MVP** | Élevé |
| **Statut** | À VALIDER (HYPOTHÈSE) |

### 10. Validation humaine

| ID | B-VAL-01 |
|---|---|
| **Domaine** | Matching — Double validation |
| **Décision proposée** | Double validation pour objets sensibles (match → confirmée par agent + responsable) |
| **Contexte** | §06.4 R8, §15.2, §13.5 — Dossier |
| **Options** | A. Double validation tous les matchs / B. Double validation sensibles seulement / C. Pas de double validation |
| **Recommandation Kilo** | B — équilibre sécurité/fluidité |
| **Conséquence fonctionnelle** | Ralentit certaines restitutions |
| **Conséquence sécurité** | Réduit risque validation erronée |
| **Conséquence UX** | Temps d'attente plus long pour objets sensibles |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (D12) |

### 11. Procédure de restitution

| ID | B-REST-01 |
|---|---|
| **Domaine** | Restitution |
| **Décision proposée** | 1. Vérif pièce identité 2. Comparaison CNI déclarant/objet 3. Confirmation réception |
| **Contexte** | §15.2, §11.2 — Dossier |
| **Options** | A. Pièce + CNI + objet physique / B. Pièce + empreinte digitale / C. Pièce + code SMS |
| **Recommandation Kilo** | A — processus simple, disponible partout |
| **Conséquence fonctionnelle** | Standardisable sur tous centres |
| **Conséquence sécurité** | Empêche restitution à tiers |
| **Conséquence UX** | Processus clair pour citoyen |
| **Impact MVP** | Élevé — finalité métier |
| **Statut** | RECOMMANDÉ — À VALIDER |

### 12. Preuves nécessaires à la restitution

| ID | B-PREUV-01 |
|---|---|
| **Domaine** | Restitution — Traçabilité |
| **Décision proposée** | Photo pièce d'identité scannée + signature électronique + photo objet remis |
| **Contexte** | §08.9, §15.2 — Dossier |
| **Options** | A. Photo pièce + signature électronique / B. Photo pièce + code reçu SMS / C. Tous les éléments |
| **Recommandation Kilo** | A — équilibre preuve/protection données |
| **Conséquence fonctionnelle** | Nécessite appareil photo/tablette au centre |
| **Conséquence sécurité** | Trace immuable de la restitution |
| **Conséquence UX** | Citoyen doit comprendre le processus |
| **Impact MVP** | Élevé |
| **Statut** | À VALIDER |

### 13. Notifications

| ID | B-NOTIF-01 |
|---|---|
| **Domaine** | Notifications |
| **Décision proposée** | SMS + email MVP ; WhatsApp COULD ; max 3 notif/jour ; multilingue FR + bambara |
| **Contexte** | §14 — Dossier |
| **Options** | A. SMS + email / B. SMS + email + WhatsApp / C. Email seulement |
| **Recommandation Kilo** | A — SMS + email pour portée maximale |
| **Conséquence fonctionnelle** | Coût opérateurs SMS |
| **Conséquence sécurité** | Limite anti-spam |
| **Conséquence UX** | Couvercle le plus large possible |
| **Impact MVP** | Élevé |
| **Statut** | À VALIDER (D1, D2, D3) |

### 14. Centres de restitution

| ID | B-CENT-01 |
|---|---|
| **Domaine** | Centres |
| **Décision proposée** | Centres créés à partir des 12 712 villages, 1 centre peut couvrir plusieurs villages |
| **Contexte** | §15.1, §07.3 — Dossier |
| **Options** | A. 1 centre/village / B. 1 centre/cercle / C. 1 centre/commune |
| **Recommandation Kilo** | C — évite surpopulation des centres |
| **Conséquence fonctionnelle** | Nombre de centres à créer |
| **Conséquence sécurité** | Accès physique aux objets |
| **Conséquence UX** | Distance de déplacement pour le citoyen |
| **Impact MVP** | Élevé |
| **Statut** | À VALIDER (D11, V9) |

### 15. Structure administrative du pilote

| ID | B-PIL-01 |
|---|---|
| **Domaine** | Périmètre — Pilote |
| **Décision proposée** | Pilote : District de Bamako + 1 région |
| **Contexte** | §23.1 Phase 7 — Dossier |
| **Options** | A. Bamako + Ségou / B. Bamako + Kayes / C. Bamako + Mopti |
| **Recommandation Kilo** | A — Ségou: géographiquement proche, connectivité moyenne |
| **Conséquence fonctionnelle** | Logistique de déploiement |
| **Conséquence sécurité** | Surface d'attaque limitée |
| **Conséquence UX** | Couverture géographique réduite |
| **Impact MVP** | Élevé — définit la phase de test |
| **Statut** | BLOQUANT |

### 16. Conservation et archivage

| ID | B-CONS-01 |
|---|---|
| **Domaine** | Données — Rétention |
| **Décision proposée** | 12 mois actif + 24 mois archivage WORM ; logs 36 mois |
| **Contexte** | §06.5, §08.11 — Dossier |
| **Options** | A. 12 mois + WORM / B. 12 mois + SQL / C. 24 mois directement |
| **Recommandation Kilo** | A — conforme APDP (à valider) |
| **Conséquence fonctionnelle** | Coût de stockage |
| **Conséquence sécurité** | Protection contre suppression |
| **Conséquence UX** | Citoyen peut demander suppression différée |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (V16, D5) |

### 17. Gestion des fraudes

| ID | B-FRAUD-01 |
|---|---|
| **Domaine** | Sécurité — Fraude |
| **Décision proposée** | CAPTCHA adaptatif, rate limiting, hash similarité, signalment citoyen |
| **Contexte** | §08.13, §24.1 — Dossier |
| **Options** | A. Toutes mesures / B. Sélection / C. Plusstrictes |
| **Recommandation Kilo** | A — couverture complète des 14 menaces |
| **Conséquence fonctionnelle** | Friction possible pour citoyens légitimes |
| **Conséquence sécurité** | Réduction des abus |
| **Conséquence UX** | CAPTCHA peut freiner |
| **Impact MVP** | Moyen |
| **Statut** | RECOMMANDÉ — À VALIDER |

### 18. Contestations

| ID | B-CONC-01 |
|---|---|
| **Domaine** | Gestion des litiges |
| **Décision proposée** | Workflow : signalement → investigation → escalade auditeur |
| **Contexte** | §16.3 — Dossier |
| **Options** | A. Workflow simple / B. Workflow complexe avec arbitrage |
| **Recommandation Kilo** | A — workflow linéaire simple |
| **Conséquence fonctionnelle** | Temps de résolution |
| **Conséquence sécurité** | Traçabilité complète |
| **Conséquence UX** | Clarté du processus pour citoyen |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER |

### 19. Langues

| ID | B-LANG-01 |
|---|---|
| **Domaine** | Internationalisation |
| **Décision proposée** | MVP : français + bambara. Extensions V2. |
| **Contexte** | §14.2, §25.5 V12 — Dossier |
| **Options** | A. FR + bambara / B. FR + bambara + peul / C. FR seulement |
| **Recommandation Kilo** | A — couverture 90%+ population |
| **Conséquence fonctionnelle** | Gestion des templates multilingues |
| **Conséquence sécurité** | Aucun impact |
| **Conséquence UX** | Accessibilité maximale au Mali |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (V12) |

### 20. Tableau de bord administratif

| ID | B-DASH-01 |
|---|---|
| **Domaine** | Administration |
| **Décision proposée** | Dashboard V1 en REST + tableaux simples. GraphQL envisagé V2. |
| **Contexte** | §16.2, §08.4 — Dossier |
| **Options** | A. REST + tableaux / B. GraphQL dès V1 / C. REST seulement |
| **Recommandation Kilo** | A — simplicité + extensibilité |
| **Conséquence fonctionnelle** | Moins de drill-down analytique |
| **Conséquence sécurité** | Surface réduite |
| **Conséquence UX** | Moins de flexibilité admin |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (D7) |

### 21. Modèle cloud (déploiement)

| ID | B-CLOUD-01 |
|---|---|
| **Domaine** | Infrastructure |
| **Décision proposée** | Hybride : données sensibles on-prem, scaling cloud public |
| **Contexte** | §11.3, §19.3 D6 — Dossier |
| **Options** | A. On-prem seul / B. Cloud public seul / C. Hybride |
| **Recommandation Kilo** | C — équilibre souveraineté/scalabilité |
| **Conséquence fonctionnelle** | Complexité de gestion accrue |
| **Conséquence sécurité** | Données sensibles locales |
| **Conséquence UX** | Impact latent |
| **Impact MVP** | Élevé — coût infra initial |
| **Statut** | RECOMMANDÉ — À VALIDER (D6) |

### 22. SIEM et WORM

| ID | B-SIEM-01 |
|---|---|
| **Domaine** | Sécurité — Logging |
| **Décision proposée** | Wazuh/Elastic SIEM ; WORM pour logs si APDP exige |
| **Contexte** | §08.11, §08.12, §08.14 — Dossier |
| **Options** | A. WORM dès V1 / B. SQL V1 + WORM V2 / C. WORM optionnel |
| **Recommandation Kilo** | B — SQL V1 (plus simple), WORM si exigé |
| **Conséquence fonctionnelle** | Performance impact WORM |
| **Conséquence sécurité** | WORM = immutabilité forte |
| **Conséquence UX** | Impact latent |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (D5, D14) |

### 23. UEBA (User Behavior Analytics)

| ID | B-UEBA-01 |
|---|---|
| **Domaine** | Sécurité — Détection |
| **Décision proposée** | UEBA intégré pour détecter comportements anormaux |
| **Contexte** | §08.14, D16 — Dossier |
| **Options** | A. UEBA dès V1 / B. UEBA V2 / C. Pas d'UEBA |
| **Recommandation Kilo** | B — UEBA V2 après MVP |
| **Conséquence fonctionnelle** | Complexité supplémentaire V1 |
| **Conséquence sécurité** | Détection avancée retardée |
| **Conséquence UX** | Aucun |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (D16) |

### 24. Opérateurs SMS/Email/WhatsApp

| ID | B-OP-01 |
|---|---|
| **Domaine** | Partenariats |
| **Décision proposé** | Choisir opérateurs SMS, BSP WhatsApp, provider email |
| **Contexte** | §10.3, §14, D1/D2/D3 — Dossier |
| **Options** | A. Multi-opérateur / B. Opérateur unique / C. Mix |
| **Recommandation Kilo** | A — redondance et couverture maximale |
| **Conséquence fonctionnelle** | Coût multi-fourchettes |
| **Conséquence sécurité** | Résilience accrue |
|**Conséquence UX** | Couverture maximale des citoyens |
| **Impact MVP** | Élevé — dépendance critique |
| **Statut** | BLOQUANT |

### 25. Policy engine (OPA/Rego)

| ID | B-POL-01 |
|---|---|
| **Domaine** | Sécurité — Politique |
| **Décision proposée** | OPA avec Rego pour politiques ABAC |
| **Contexte** | §08.4, D17 — Dossier |
| **Options** | A. OPA / B. Cedar / C. DSL interne |
| **Recommandation Kilo** | A — OPA mature, coverage 90% test |
| **Conséquence fonctionnelle** | Apprentissage équipe |
| **Conséquence sécurité** | Politiques déclaratives, auditables |
| **Conséquence UX** | Impact latent |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (D17) |

### 26. SoD (Séparation des responsabilités)

| ID | B-SOD-01 |
|---|---|
| **Domaine** | Sécurité — Governance |
| **Décision proposée** | Détection automatique des conflits de rôles à création de compte |
| **Contexte** | §08.15, D18 — Dossier |
| **Options** | A. Auto-détection / B. Manuel / C. Audit périodique |
| **Recommandation Kilo** | A — prévention proactive |
| **Conséquence fonctionnelle** | Complexité de règles |
| **Conséquence sécurité** | Réduction conflits rôle |
| **Conséquence UX** | Impact minimal |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER (D18) |

### 27. KYC biométrique

| ID | B-KYC-01 |
|---|---|
| **Domaine** | Sécurité — Authentification |
| **Décision proposée** | KYC biométrique (intégration micati) pour admins/sensibles |
| **Contexte** | §09.3, §08.2, §10.3, D4 — Dossier |
| **Options** | A. Oui (KYC) / B. Non (TOTP seulement) / C. Scope limité |
| **Recommandation Kilo** | B — TOTP suffisant pour MVP, KYC V2 |
| **Conséquence fonctionnelle** | Coût matériel + formation |
| **Conséquence sécurité** | Renforcement identité |
| **Conséquence UX** | Friction supplémentaire |
| **Impact MVP** | Moyen (reporté à FUTURE) |
| **Statut** | À VALIDER (D4) |

### 28. Typographies définitive

| ID | B-TYP-01 |
|---|---|
| **Domaine** | Design system |
| **Décision proposée** | Poppins (titres) + Nunito (corps) pour Direction 3 |
| **Contexte** | §17.2, §18 — Dossier |
| **Options** | A. Poppins/Nunito / B. Lato unique / C. Montserrat/Open Sans |
| **Recommandation Kilo** | A — cohérente avec Direction 3 |
| **Conséquence fonctionnelle** | Chargement webfonts |
| **Conséquence sécurité** | Aucun |
| **Conséquence UX** | Lisibilité sur mobile |
| **Impact MVP** | Moyen |
| **Statut** | À VALIDER |

---

```

---

## C. QUESTIONS À TRANCHER

**SOURCE.** §25 — Dossier de conception.

| ID | Question | Domaine | Priorité |
|---|---|---|---|
| Q-P1 | Inclure "objet non catalogué" dans le MVP ou V2 ? | Produit | Moyenne |
| Q-P2 | Notifications push mobile : priorité V1 ou V2 ? | Produit | Moyenne |
| Q-M1 | Qui valide la liste officielle des types de centre ? | Métier/Juridique | Haute |
| Q-M2 | Double validation nécessaire pour tous les matches ou seulement sensibles ? | Sécurité | Haute |
| Q-M3 | Politique tarification frais restitution ? | Juridique | Basse |
| Q-S1 | MFA : TOTP V1, FIDO2 V2 — confirmation ? | Sécurité | Haute |
| Q-S2 | Règles vs ML pour fraude ? | Sécurité | Moyenne |
| Q-S3 | UEBA : intégrer dès V1 ? | Sécurité | Moyenne |
| Q-S4 | OPA vs Cedar vs DSL ? | Sécurité | Haute |
| Q-S5 | WORM si APDP l'exige ? | Données | Haute |
| Q-S6 | SoD automatique : comment détecter conflits ? | Sécurité | Moyenne |
| Q-J1 | Exigences APDP hébergement biométrie | Juridique | CRITIQUE |
| Q-J2 | Délai APDP droits citoyens | Juridique | CRITIQUE |
| Q-J3 | Notification violation — format/délai | Juridique | CRITIQUE |
| Q-J4 | Cadre juridique responsabilité centres | Juridique | CRITIQUE |
| Q-J5 | Conservation photos post-restitution | Juridique | CRITIQUE |
| Q-J6 | Notifications nuit — acceptabilité | Culturel | Moyenne |
| Q-J7 | Cohérence rétention 12 mois vs APDP | Juridique | CRITIQUE |
| Q-T1 | Cloud souverain local certifié APDP ? | Infrastructure | CRITIQUE |
| Q-T2 | Compétences DevOps disponibles au Mali ? | Infrastructure | CRITIQUE |
| Q-T3 | Cartographie connectivité 2G/3G/4G par région | Technique | CRITIQUE |
| Q-T4 | Volumétrie cible année 1 | Exploitation | Haute |
| Q-T5 | Langues nationales à traduire | Produit | Moyenne |
| Q-T6 | Procédure double validation matches sensibles | Sécurité | Haute |
| Q-E1 | Comment mesurer taux faux positifs ? | Exploitation | Moyenne |
| Q-E2 | Procédure test restauration backup | Exploitation | Moyenne |
| Q-G1 | Qui est le DPO/Responsable ? | Gouvernance | CRITIQUE |
| Q-G2 | Qui valide modifications seuils matching ? | Gouvernance | Haute |
| Q-G3 | Procédure mise à jour politiques sécurité | Gouvernance | Haute |

**Total questions : 28**

---

## D. POINTS BLOQUANTS

### D.1 — Juridiques (CRITIQUE — blocage PLAN)

| Point | Décision bloquante | Impact |
|---|---|---|
| J-01 | Hébergement données biométriques (KYC) | Détermine architecture sécurité (§09.3, §08.2) |
| J-02 | Notification violation APDP (délai/format) | Plan d'incident, interface admin |
| J-03 | Responsabilité des centres partenaires | Contrat cadre, processus restitution |
| J-04 | Cohérence rétention 12 mois vs APDP | Architecture WORM/SQL, archivage |
| J-05 | Designation DPO / Responsable traitement | Gouvernance, RBAC, contact juridique |
| J-06 | Conservation photos post-restitution | Politique de suppression, archivage |

### D.2 — Opérationnels (CRITIQUE — blocage PLAN)

| Point | Décision bloquante | Impact |
|---|---|---|
| O-01 | Quelle opérateur SMS ? (D1) | Budget, architecture notification |
| O-02 | Deuxième région du pilote ? (M-10) | Logistique déploiement, tests terrain |
| O-03 | Compétences DevOps disponibles ? (V8) | Choix on-prem vs externalisé |
| O-04 | Connectivité 2G/3G/4G par région (V7) | Architecture mobile, fallback |

### D.3 — Techniques critiques (ÉLEVÉ — impact fort)

| Point | Décision | Impact |
|---|---|---|
| T-01 | Modèle cloud on-prem/hybride (D6) | Coût infra, architecture |
| T-02 | Cloud souverain local disponible (V13) | Souveraineté données |
| T-03 | FIDO2 pour admins (D8) | Architecture MFA |

---

# TABLEAU FINAL DE VALIDATION DU COMMANDITAIRE

> Toutes les décisions nécessitent une validation humaine avant le passage au PLAN.

## A. DÉCISIONS DÉJÀ VALIDÉES

| ID | Décision | Choix du commanditaire | Statut | Commentaire |
|---|---|---|---|---|
| IV-1 | Direction artistique | Direction 3 — Communautaire modernisée | VALIDÉ | 2026-09-02 |
| IV-2 | Logo | Proposition A — Lien | VALIDÉ | 2026-09-02 |
| IV-3 | Vert principal | `#1B6E3F` | VALIDÉ | 2026-09-02 |
| IV-4 | Terracotta | `#CC5500` | VALIDÉ | 2026-09-02 |
| IV-5 | Beige | `#F5F0E1` | VALIDÉ | 2026-09-02 |
| IV-6 | Gris texte | `#333333` | VALIDÉ | 2026-09-02 |
| IV-7 | Blanc | `#FFFFFF` | VALIDÉ | 2026-09-02 |
| IV-8 | Rouge alerte | `#E53935` | VALIDÉ | 2026-09-02 |
| IV-9 | Slogan | « Ensemble, retrouvons l'essentiel. » | VALIDÉ | 2026-09-02 |
| IV-10 | Slogan alternatif | « Chaque document a son propriétaire... » | VALIDÉ (institutionnel) | 2026-09-02 |
| M-01 | Matching = aide décision | Oui | VALIDÉ | Règle absolue |
| M-02 | Score 96% = propriétaire | INTERDIT | VALIDÉ | Règle absolue |
| M-03 | Validation humaine | Toujours requise | VALIDÉ | Règle absolue |
| E-01 | Mobile Money MVP | Exclu | VALIDÉ | §22.3 |
| E-02 | Pilote régionnel | Bamako + 1 région | VALIDÉ | §23.1 |
| L-01 | Consentement APDP | Case à cocher | VALIDÉ | Loi 2013-015 art. 7 |
| L-02 | Registre traitements | Module admin | VALIDÉ | Loi 2013-015 art. 30 |

## B. DÉCISIONS À VALIDER

| ID | Décision | Proposition | Choix du commanditaire | Statut | Commentaire |
|---|---|---|---|---|---|
| B-VP-01 | Périmètre MVP | 9 MUST + 4 SHOULD |  | À VALIDER | |
| B-CAT-01 | Catégories d'objets | 3 sous-catégories MVP (1-3) |  | À REVOIR | Conflit §07.1 vs §22.3 |
| B-DAT-01 | CNI obligatoire | Oui pour perte, anonyme trouvaille |  | À VALIDER | |
| B-PUB-01 | Fiche publique | Catégorie + ville + date + ref |  | À VALIDER | |
| B-AUTH-01 | MFA citoyens | TOTP + SMS |  | À VALIDER | D8 |
| B-RÔLE-01 | 7 rôles RBAC | Tel que défini §03.6 |  | RECOMMANDÉ | À valider parties prenantes |
| B-ÉTAT-01 | FSM 7 états vs 14 | FSM dossier (7) |  | À REVOIR | Conflit FSM |
| B-RAP-01 | Algorithme matching | CNI(40)+nom(20)+dob(15)+desc(15)+lieu(5)+date(5) |  | À VALIDER | HYPOTHÈSE |
| B-SEUIL-01 | Seuils 80/50 | 80/50 |  | À VALIDER | HYPOTHÈSE |
| B-VAL-01 | Double validation | Sensibles seulement |  | À VALIDER | D12 |
| B-REST-01 | Procédure restitution | Pièce + CNI + objet |  | À VALIDER | |
| B-PREUV-01 | Preuves restitution | Photo pièce + signature électronique |  | À VALIDER | |
| B-NOTIF-01 | Canaux notification | SMS + email MVP |  | À VALIDER | D1/D2/D3 |
| B-CENT-01 | Structure centres | 1 centre/commune |  | À VALIDER | D11/V9 |
| B-PIL-01 | Deuxième région pilote | Bamako + Ségou |  | À VALIDER | Bloquant |
| B-CONS-01 | Rétention/archivage | 12 mois + WORM 24 mois |  | À VALIDER | V16/D5 |
| B-FRAUD-01 | Gestion fraudes | CAPTCHA + rate limiting + hash |  | RECOMMANDÉ | |
| B-CONC-01 | Contestations | Workflow ticket linéaire |  | À VALIDER | |
| B-LANG-01 | Langues | FR + bambara |  | À VALIDER | V12 |
| B-DASH-01 | Dashboard | REST + tableaux |  | À VALIDER | D7 |
| B-CLOUD-01 | Modèle cloud | Hybride |  | RECOMMANDÉ | D6 |
| B-SIEM-01 | WORM/SIEM | SQL V1, WORM V2 si APDP |  | À VALIDER | D5/D14 |
| B-UEBA-01 | UEBA | V2 |  | À VALIDER | D16 |
| B-OP-01 | Opérateurs SMS/WA/email | Multi-opérateurs |  | BLOQUANT | D1/D2/D3 |
| B-POL-01 | Policy engine | OPA (Rego) |  | À VALIDER | D17 |
| B-SOD-01 | SoD automatique | Auto-détection conflits |  | À VALIDER | D18 |
| B-KYC-01 | KYC biométrique | Non MVP, V2 |  | À VALIDER | D4 |
| B-TYP-01 | Typographies | Poppins/Nunito (Direction 3) |  | À VALIDER | |

## C. POINTS BLOQUANTS (blocage PLAN)

| ID | Point bloquant | Choix du commanditaire | Statut |
|---|---|---|---|
| J-B-01 | Hébergement données biométriques |  | BLOQUANT |
| J-B-02 | Notification violation APDP |  | BLOQUANT |
| J-B-03 | Responsabilité centres |  | BLOQUANT |
| J-B-04 | Cohérence rétention 12 mois vs APDP |  | BLOQUANT |
| J-B-05 | Délégation DPO |  | BLOQUANT |
| O-B-01 | Opérateur SMS |  | BLOQUANT |
| O-B-02 | Deuxième région pilote |  | BLOCKANT |
| O-B-03 | Compétences DevOps |  | BLOQUANT |
| O-B-04 | Cloud souverain local |  | BLOQUANT |

---

**Fin du dossier d'arbitrage — Phase DEFINE**

> Ce document est un **instrument de revue humaine**. Il ne constitue ni une spécification de développement, ni une décision finale. Toute case vide dans la colonne "Choix du commanditaire" signifie que la décision reste **NON DÉCIDÉE** et doit être validée avant le passage au PLAN.

