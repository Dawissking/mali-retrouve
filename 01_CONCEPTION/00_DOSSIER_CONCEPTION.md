# Dossier de Conception — Phase DISCOVER → DEFINE

# MALI RETROUVÉ
## Plateforme nationale des documents et objets perdus et retrouvés

---

**Projet :** MALI RETROUVÉ
**Phase :** DISCOVER → DEFINE
**Date de rédaction :** 2026-09-02
**Statut :** ARBITRAGES HUMAINS INTÉGRÉS (cf. `04_DOSSIER_ARBITRAGE_MVP.md`) — PLAN DÉBLOQUÉ POUR ENGAGEMENT
**Version :** 1.1

---

## Méta-données du dossier

| Élément | Valeur |
|---|---|
| Référentiel spécialistes | 4 rapports : product-analyst, software-architect, ui-ux-designer, security-auditor |
| Sources primaires | micati.site/cni, Loi malienne 2013-015, APDP, Code pénal 2024, open-admin-data/mali-administrative-divisions |
| Classification | Conception — non exécutable — ne contient aucun code applicatif |

---

# 01 — Vision produit

**RECOMMANDATION.** La vision du produit est formulée comme suit :

> **MALI RETROUVÉ** est une plateforme nationale numérique qui permet aux citoyens, aux centres de dépôt de constater et récupérer leurs documents perdus ou objets trouvés, en s'appuyant sur l'identité numérique nationale (CNI) et la structure administrative malienne (régions, cercles, communes, villages).

**SOURCE.** software-architect.md — Section 1 : "Product vision & success metrics".

**FAIT.** La plateforme vise trois objectifs opérationnels :

| Objectif | Description |
|---|---|
| Sécurité des citoyens | Réduire le risque d'usurpation d'identité lié à la perte de documents |
| Efficacité administrative | Centraliser les procédures de dépôt/retrait actuées localement de façon dispersée |
| Traçabilité | Fournir un journal d'audit complet de toutes les opérations |

**SOURCE.** product-analyst.md — Section 3 : "Objectifs stratégiques".

**DÉCISION À PRENDRE — Validation de la vision produit par le commanditaire.**

---

# 02 — Problème à résoudre

**FAIT.** Au Mali, la perte de documents officiels (CNI, actes de naissance, passeports, certificats) expose les citoyens à des risques de sécurité et rend les procédures de restitution longues et fragmentées.

**SOURCE.** product-analyst.md — Section 2 : "Contexte et problématique".

**FAIT.** Aujourd'hui, le citoyen perdant un document doit se déplacer physiquement dans plusieurs centres (police, préfecture, consulat) sans garantie de récupération ni de traçabilité.

**SOURCE.** product-analyst.md — Section 2.1 : "Diagnostic du problème actuel".

**PROBLÈME :**

1. **Absence de système centralisé** de dépôt/recherche de documents perdus.
2. **Risque d'usurpation** : un document perdu peut être utilisé par un tiers.
3. **Coût humain et administratif** élevé des procédures manuelles.
4. **Manque de traçabilité** dans les échanges entre centres.
5. **Inadéquation partielle** avec le service existant CNI (micati.site/cni).

**SOURCE.** security-auditor.md — Section 04 : "Menaces identifiées" — fausse déclaration, usurpation, exposition de données.

---

## OBSERVATIONS SUR L'EXISTANT — micati.site/cni

**SOURCE.** Analyse du service public en ligne : https://www.micati.site/cni

**FAIT.** Le service micati.site/cni est actuellement dédié exclusivement à la **Carte Nationale d'Identité (CNI)**.

**FAIT.** Le service micati.site/cni utilise **HMAC-SHA256** comme mécanisme de signature des requêtes/API.

**FAIT.** Le service micati.site/cni applique une **rétention de 12 mois** pour les données stockées.

**OBSERVATION.** Le service existant traite uniquement la CNI — il ne couvre pas les autres catégories de documents (actes de naissance, passeports, certificats, objets précieux, animaux).

**OBSERVATION.** Le service existant est un point d'accès citoyen unique, mais ne semble pas intégrer de système de rapprochement entre objets perdus et trouvés.

**OBSERVATION.** Le mécanisme HMAC-SHA256 et la rétention de 12 mois sont des éléments techniques observés. Il n'est pas établi qu'ils constituent l'architecture cible de MALI RETROUVÉ.

| Élément micati | Statut | À conserver pour MALI RETROUVÉ ? |
|---|---|---|
| CNI uniquement | FAIT / OBSERVATION | Non — MALI RETROUVÉ couvre plus de catégories |
| HMAC-SHA256 | FAIT / OBSERVATION | RECOMMANDATION — à étudier comme mécanisme de signature des webhooks notifiant les centres |
| Rétention 12 mois | FAIT / OBSERVATION | POINT À VÉRIFIER — cohérence avec exigences APDP (voir §09) |

**RECOMMANDATION POUR MALI RETROUVÉ.**

> Le système micati.site/cni est une **inspiration technique**, non une architecture cible. MALI RETROUVÉ repart d'une feuille blanche pour couvrir l'ensemble des objets/documents perdus ou trouvés, tout en étudiant les leçons apprises du service CNI existant.

---

# 03 — Utilisateurs et acteurs

**FAIT.** La plateforme implique plusieurs catégories d'utilisateurs, identifiées par le product-analyst et le ui-ux-designer.

### 3.1 — Citoyens

| Persona | Description | Objectif principal |
|---|---|---|
| **Aissata D. (34 ans)** | Residents urbain, travailleuse, perd son portefeuille avec CNI | Déclarer la perte et récupérer son document |
| **Djibril M. (26 ans)** | Étudiant, trouve une CNI sur le trottoir | Déposer l'objet trouvé et être sûr qu'il revient à son propriétaire |

**SOURCE.** ui-ux-designer.md — Section 3.1 : "Personas citoyens".

### 3.2 — Agents de centre

| Persona | Description | Rôle |
|---|---|---|
| **Mariam K. (42 ans)** | Gérante d'un centre de dépôt dans un cercle | Encaisser les dépôts, valider les restitutions, gérer les stocks locaux |

**SOURCE.** ui-ux-designer.md — Section 3.2 : "Personas agents".

### 3.3 — Superviseurs régionaux

**FAIT.** Les superviseurs régionaux supervisent les centres au niveau de la région administrative (20 régions).

**SOURCE.** software-architect.md — Section 18.1 : "Rôles retenus".

### 3.4 — Administrateurs nationaux

**FAIT.** Les administrateurs nationaux gèrent la configuration, les centres, les politiques, les logs.

**SOURCE.** software-architect.md — Section 18.1.

### 3.5 — Auditeurs

**FAIT.** Les auditeurs accèdent en lecture seule à l'ensemble des données pour contrôle et conformité.

**SOURCE.** software-architect.md — Section 18.1.

### 3.6 — Administrateurs techniques

**FAIT.** Les administrateurs techniques gèrent l'infrastructure sans accéder aux données métier.

**SOURCE.** software-architect.md — Section 18.1.

### Matrice des rôles et permissions

| Rôle | Population | Périmètre | Peut déclarer | Peut déposer | Peut restituer | Peut superviser | Peut auditer | Peut configurer |
|---|---|---|---|---|---|---|---|---|
| Citoyen | Usager | Son profil | Oui | Oui | Non | Non | Non | Non |
| Agent de centre | Opérateur terrain | Centre d'affectation | Non | Oui | Oui (sur place) | Non | Non | Non |
| Responsable de centre | Chef de centre | Centre d'affectation | Non | Oui | Oui | Oui (centre) | Non | Non |
| Superviseur régional | Admin déconcentrée | Région d'affectation | Non | Non | Non | Oui (région) | Non | Non |
| Administrateur national | Admin centrale | Pays | Non | Non | Non | Oui (pays) | Oui | Oui |
| Auditeur | Contrôle/conformité | Pays | Non | Non | Non | Non | Oui (lecture) | Non |
| Administrateur technique | Ops/SRE | Infra | Non | Non | Non | Non | Non | Oui (infra) |

**SOURCE.** software-architect.md — Section 18.1. **STATUT : RECOMMANDÉ — à confirmer avec les parties prenantes.**

---

# 04 — Parcours utilisateurs

**SOURCE.** ui-ux-designer.md — Sections 3 et 4 : "Parcours utilisateurs", "Arbitrages".

### 4.1 — Parcours : Déclaration de perte (Citoyen)

```
1. Accueil → "J'ai perdu un document/objet"
2. Scan/entrée CNI (via micati ou saisie manuelle)
3. Saisie des détails de l'objet perdu (catégorie, description, date, lieu)
4. Confirmation du dépôt de déclaration
5. Affichage du numéro de suivi
6. Notification de résultats (mail/SMS quand un correspondance est trouvée)
```

### 4.2 — Parcours : Dépôt d'objet trouvé (Citoyen ou Centre)

```
1. Accueil → "J'ai trouvé un objet/document"
2. Sélection de la catégorie (document officiel, objet personnel, animal, etc.)
3. Saisie des détails (description, lieu, date de trouvaille)
4. Option : téléchargement de photos
5. Confirmation du dépôt
6. Attribution d'un numéro de dépôt
7. Transmission éventuelle au centre concerné
```

### 4.3 — Parcours : Consultation des correspondances (Citoyen)

```
1. Accueil → "Consulter mes déclarations"
2. Sélection d'une déclaration de perte
3. Affichage des correspondances potentielles (score > seuil)
4. Acceptation ou rejet de la correspondance
5. Instructions pour la restitution au centre
```

### 4.4 — Parcours : Gestion d'un centre (Agent/Responsable)

```
1. Authentification (mot de passe + MFA)
2. Tableau de bord centre : dépôts, restitutions, statistiques
3. Consultation des nouveaux dépôts reçus
4. Validation de la restitution (vérification pièce d'identité)
5. Gestion des stock temporaire
6. Rapports d'activité
```

### 4.5 — Parcours : Supervision régionale (Superviseur)

```
1. Authentification (mot de passe + MFA)
2. Sélection de la région
3. Vue cartographique des centres
4. Indicateurs clés (taux de restitution, délais, etc.)
5. Alertes sur anomalies
6. Export de rapports
```

**DÉCISION À PRENDRE — Ces parcours seront-ils disponibles sur mobile uniquement ou également sur web ?**

---

# 05 — Fonctionnalités

### 5.1 — Fonctionnalités par domaine

| Domaine | Fonctionnalité | Priorité MVP | Source |
|---|---|---|---|
| **Identity (CNI)** | Vérification identité via CNI | MUST | architect, ui-ux |
| **Déclaration** | Déclarer un objet/document perdu | MUST | architect |
| **Dépot** | Déposer un objet trouvé | MUST | architect |
| **Rapprochement** | Correspondance automatique perte↔trouvaille | MUST | architect |
| **Restitution** | Gérer la restitution au centre | MUST | architect |
| **Centres** | Gérer centres, agents, stocks | MUST | architect |
| **Notifications** | SMS, WhatsApp, email | MUST | architect |
| **Suivi** | Suivi de statut en temps réel | SHOULD | ui-ux |
| **Auditeur** | Consultation journal d'audit | SHOULD | architect |
| **Géographie** | Recherche par région/cercle/commune | MUST | architect |
| **Administration** | Gestion des rôles, centre, politiques | MUST | architect |
| **Signalement abus** | Signalement des abus | SHOULD | security-auditor |

**SOURCE.** product-analyst.md — Section 5 : "Fonctionnalités".
**SOURCE.** software-architect.md — Section 4 : "Domaines et services".

### 5.2 — Matrice MUST/SHOULD/COULD/FUTURE (MVP — Voir §22)

| Catégorie | MUST HAVE | SHOULD HAVE | COULD HAVE | FUTURE |
|---|---|---|---|---|
| Déclaration/Recherche | Déclarer perte/objet, recherche par CNI | Notifications en temps réel | Favoris, alertes personnalisées | IA prédictive |
| Rapprochement | Score de similarité, seuil configurable | Règles métier éditables | Apprentissage ML | — |
| Restitution | Validation par agent centre | Photo pièce identité | Signature biométrique | — |
| Centres | Gestion centres/agents | Statistiques détaillées | Prédictions de flux | — |
| Notifications | SMS/email de base | WhatsApp, push mobile | Multicanal avancé | — |
| Sécurité | MFA, RBAC | UEBA, OPA | Zero-trust avancé | — |

---

# 06 — Règles métier

**SOURCE.** software-architect.md — Section 6 : "Règles métier".

### 6.1 — Cycle de vie d'une déclaration de perte (FSM officielle — 14 états)

> **DÉCISION : VALIDÉE.** La FSM principale comporte 14 états (cf. `04_DOSSIER_ARBITRAGE_MVP.md` §4.4) :
> 1. BROUILLON — 2. SOUMISE — 3. EN_ATTENTE_RAPPROCHEMENT — 4. CORRESPONDANCE_TROUVÉE — 5. EN_VALIDATION_HUMAINE — 6. VALIDÉE — 7. RESTITUTION_PLANIFIÉE — 8. RESTITUÉE — 9. CLÔTURÉE — 10. REJETÉE — 11. ARCHIVÉE — 12. EXPIRÉE — 13. SUSPENDUE — 14. CONTESTÉE.
>
> **ANNULÉE n'est PAS un 15e état principal.** L'annulation d'un brouillon avant soumission est modélisée comme événement / statut technique du brouillon.
>
> **Chemin normal unique de restitution :**
> `VALIDÉE → RESTITUTION_PLANIFIÉE → RESTITUÉE → CLÔTURÉE`.
>
> La transition `CORRESPONDANCE_TROUVÉE → NON_RAPPROCHÉE` est **INTERDITE**. NON_RAPPROCHÉE ne provient que d'états où aucune correspondance valide n'a été trouvée.

### 6.2 — Cycle de vie d'un dépôt de trouvaille

> Même FSM officielle que §6.1. Le dépôt de trouvaille partage les 14 états principaux. NON_RAPPROCHÉE peut être modélisé comme résultat métier ou état dérivé issu de `EN_ATTENTE_RAPPROCHEMENT`, **jamais** d'une correspondance déjà trouvée.

### 6.3 — Règles de rapprochement

> **RÉSERVE.** Les seuils (80/50) sont des **valeurs proposées non validées**. Le seuil de matching n'est PAS figé comme vérité universelle (cf. D-03 dans `04_DOSSIER_ARBITRAGE_MVP.md`). Il sera calibré et validé à partir de tests et de données appropriées.

| Règle | Condition | Action |
|---|---|---|
| R1 | Score ≥ 80 | Correspondance forte — proposition automatique (HYPOTHÈSE) |
| R2 | Score 50-79 | Correspondance possible — revue manuelle requise (HYPOTHÈSE) |
| R3 | Score < 50 | Pas de correspondance — reste en surveillance 12 mois (HYPOTHÈSE) |
| R4 | Doublon détecté | Rejet automatique de la nouvelle déclaration |

**HYPOTHÈSE.** Les seuils (80/50) et la durée (12 mois) sont des propositions. Ils n'ont pas été validés par un test statistique sur des données réelles.

### 6.4 — Règles de restitution

| Règle | Description |
|---|---|
| R5 | Restitution uniquement au centre de dépôt ou centre désigné |
| R6 | Vérification pièce d'identité obligatoire |
| R7 | Refus possible si justificatifs insuffisants |
| R8 | Délai légal de garde : 6 mois maximum au centre |

**POINT À VÉRIFIER — VALIDATION JURIDIQUE NÉCESSAIRE** : Le délai légal de conservation des objets trouvés au Mali (référence légale non citée dans les rapports).

### 6.5 — Règles de rétention des données

> **RÉSERVE JURIDIQUE.** Les durées ci-dessous sont des **HYPOTHÈSES DE DIMENSIONNEMENT NON VALIDÉES JURIDIQUEMENT**. La durée définitive sera fixée après validation juridique / DPO / APDP (cf. J-04 dans `04_DOSSIER_ARBITRAGE_MVP.md`).

| Type de donnée | Rétention | Statut |
|---|---|---|
| Déclarations perte | 12 mois | **HYPOTHÈSE** — inspirée de micati.site, à valider APDP |
| Dépôts trouvaille | 12 mois | **HYPOTHÈSE** — à valider APDP |
| Photos biométriques | jusqu'à restitution + 3 mois | **HYPOTHÈSE PROVISOIRE** — à valider APDP |
| Logs d'audit | 36 mois | **HYPOTHÈSE** — à valider APDP |

**POINT À VÉRIFIER — VALIDATION JURIDIQUE NÉCESSAIRE** : Cohérence entre ces hypothèses et les exigences APDP.

---

# 07 — Gestion des données

**SOURCE.** software-architect.md — Section 7 : "Modèle conceptuel de données".
**SOURCE.** product-analyst.md — Section 4 : "Catégorisation des objets".

### 7.1 — Catégorisation officielle : `NATURE → DOMAINE → TYPE`

> **DÉCISION : VALIDÉE** (cf. `04_DOSSIER_ARBITRAGE_MVP.md` §5).
> L'ancienne formulation « 6 catégories → 4 catégories » n'est **plus** utilisée comme décision.
> Modèle officiel retenu : **`NATURE` (primaire) → `DOMAINE` → `TYPE`**.

| Axe | Niveau | Valeurs |
|---|---|---|
| **NATURE** | 1 | `Document`, `Objet` |
| **DOMAINE** | 2 | `Identité`, `Voyage`, `Transport`, `Éducation`, `Professionnel`, `Santé/Assurance`, `Administratif`, `Personnel` |
| **TYPE** | 3 | CNI, passeport, diplôme, téléphone, clés, etc. |

### Exemples

| NATURE | DOMAINE | TYPE |
|---|---|---|
| Document | Identité | CNI |
| Document | Voyage | Passeport |
| Document | Voyage | Visa |
| Document | Transport | Permis de conduire, carte grise |
| Document | Éducation | Diplôme, certificat scolaire |
| Document | Professionnel | Carte professionnelle, badge entreprise |
| Document | Santé/Assurance | Carte d'assurance, carte de santé |
| Document | Administratif | Acte de naissance, facture, courrier |
| Objet | Personnel | Téléphone, clés, montre |

### Périmètre MVP / FUTURE / EXCLU

| Périmètre | Éléments |
|---|---|
| **MVP** | Documents officiels, documents administratifs prioritaires, objets personnels |
| **FUTURE** | Objets de grande valeur, animaux |
| **EXCLU MVP** | Catégorie « Autre » non structurée |

### Référence historique (ancien modèle — non décision)

| Niveau | Catégorie | Exemples | Incluse MVP (historique) |
|---|---|---|---|
| 1 | Document officiel | CNI, passeport, acte naissance | ✅ |
| 2 | Document administratif | Facture, courrier | ✅ |
| 3 | Objet personnel | Téléphone, montre, clés | ✅ |
| 4 | Objet de valeur | Bijou, œuvre d'art | ❌ |
| 5 | Animal | Chien, chat | ❌ |
| 6 | Autre | Non classé | ❌ |

> Cette classification historique est **remplacée** par le modèle `NATURE → DOMAINE → TYPE`. Elle est conservée uniquement comme référence pour traçabilité.

### 7.2 — Métadonnées requises

| Type d'objet | Métadonnées |
|---|---|
| Perte | Date, lieu, catégorie, description texte, photo(s), CNI du déclarant, numéro de suivi |
| Trouvaille | Date, lieu, catégorie, description texte, photo(s), option : CNI du déclarant ou anonyme |

**SOURCE.** product-analyst.md — Section 4.1 : "Schéma des métadonnées".

### 7.3 — Source de la structure administrative

**SOURCE.** open-admin-data/mali-administrative-divisions — données publiques extraites de sources officielles maliennes.

| Niveau administratif | Comptage | Statut |
|---|---|---|
| Régions | 20 régions | **SOURCE** — Données administratives officielles |
| Cercles | 159 cercles | **SOURCE** — Données administratives officielles |
| Communes | 815 communes | **SOURCE** — Données administratives officielles |
| Villages/localités | 12 712 villages | **SOURCE** — Données administratives officielles |

**POINT À VÉRIFIER — VALIDATION INSTITUTIONNELLE NÉCESSAIRE** : Ces chiffres constituent une extraction open data. Leur utilisation comme référentiel opérationnel de production nécessite validation par l'administration compétente (Ministère de l'Intérieur ou équivalent).

### 7.4 — Modèle géographique hiérarchique (cible MALI RETROUVÉ)

```
RÉGION (20)
  └─ CERCLE (159)
       └─ COMMUNE (815)
            └─ LOCALITÉ / VILLAGE (12 712)
                 └─ CENTRE (à créer/rattacher)
```

**DÉCISION À PRENDRE** : Le lien entre le village et le centre de dépôt n'est pas 1:1. Un centre peut couvrir plusieurs villages.

---

# 08 — Sécurité

**SOURCE.** security-auditor.md — 447 lignes, sections 01-16.
**SOURCE.** software-architect.md — Section 17 : "Sécurité applicative".

### 8.1 — Principes fondamentaux (CIA)

| Principe | Application |
|---|---|
| **Confidentialité** | Données sensibles chiffrées, accès restreint par RBAC |
| **Intégrité** | HMAC-SHA256 sur les payloads, journal d'audit immuable |
| **Disponibilité** | Haute disponibilité multi-zone, PRA documenté |

### 8.2 — Authentification

**RECOMMANDATION.** (architect §17.2)

| Mécanisme | Usage | Niveau de sécurité |
|---|---|---|
| Mot de passe + MFA (TOTP) | Citoyens et agents | Moyen |
| FIDO2 (clé USB/security key) | Administrateurs et rôles sensibles | Élevé |
| Auth. forte par CNI biométrique | Optionnel, intégré à micati | Élevé |

**DÉCISION À PRENDRE — MFA** : TOTP au lancement. FIDO2 en V2.

### 8.3 — Sessions et jetons

**RECOMMANDATION.** (architect §17.3)

| Élément | Configuration |
|---|---|
| Cookies | Secure, HttpOnly, SameSite=Strict |
| Jeton d'accès | Court (15 min) |
| Jeton de rafraîchissement | 8 h |
| Jeton d'appareil (mobile) | Persistant + biométrie locale |

### 8.4 — RBAC / ABAC

**RECOMMANDATION.** (architect §18)

- **RBAC au cœur** : 7 rôles définis (voir §03.6).
- **ABAC léger** : scope géographique, propriété de ressource, état du match, contrainte temporelle.
- **Policies** : Rego (Open Policy Agent) ou DSL interne — **DÉCISION À PRENDRE**.

### 8.8 — Protection des données sensibles

| Donnée | Protection |
|---|---|
| Documents photos (recto/verso) | Chiffrement AES-256 au repos |
| Photos biométriques (si KYC) | Chiffrement applicatif + clé distincte |
| Logs d'audit | Hash immuable (merkle log) |
| Historique des matches | Traçabilité complète (qui a vu quoi, quand) |

**RECOMMANDATION.** (security-auditor §08) — Chiffrement des champs PII sensibles avec clés gérées par une KMS (AWS KMS / Azure Key Vault / HashiCorp Vault selon cloud).

### 8.9 — Journalisation et audit

| Événement | Journalisé | Rétention log |
|---|---|---|
| Authentifications | Oui (succès + échecs) | 36 mois |
| Déclarations perte | Oui (complète) | 36 mois |
| Correspondances matchées | Oui (score + règles) | 36 mois |
| Restitutions | Oui (pièce vérifiée) | 36 mois |
| Accès aux données | Oui (PII anonymisé) | 36 mois |

**RECOMMANDATION.** (architect §17.1) — Logs sans PII directement ; secrets jamais loggués.

### 8.10 — Sauvegardes et reprise

| Élément | Stratégie |
|---|---|
| Base de données | Backup quotidien incrémental + hebdomadaire complet |
| Stock d'objets (photos) | Réplication multi-zone |
| Tests de restauration | Mensuels |
| PRA (Plan de Reprise d'Activité) | À produire en parall (architect §21.2) |
| RTO | < 4 h |
| RPO | < 1 h |

### 8.11 — Rétention et archivage

| Donnée | Rétention active | Rétention archivée | Mode archivage |
|---|---|---|---|
| Déclarations | 12 mois | 24 mois supplémentaires | WORM (Write Once Read Many) recommandé |
| Dépôts | 12 mois | 24 mois supplémentaires | WORM |
| Photos | 12 mois (ou jusqu'à restitution) | 24 mois | WORM chiffré |
| Logs | 36 mois | 5 ans | SIEM (Elastic/Wazuh) |

**DÉCISION À PRENDRE (architect §17.2 / D5)** : Audit WORM vs SQL standard. WORM recommandé si APDP l'exige.

### 8.12 — Suppression

**RECOMMANDATION.** (security-auditor §08) — Suppression logique → période de grâce 30 jours → purge physique irréversible. Toute suppression est journalisée et non réversible.

### 8.13 — Protection contre les abus

| Menace | Mesure de protection |
|---|---|
| Énumération d'identifiants | Rate limiting + message générique "identifiants inconnus ou erronés" |
| Scraping massif | CAPTCHA adaptatif + rate limiting par IP |
| Doublon de masse | Hash de similarité sur les descriptions |
| Déclarations abusives | Modération automatique + signalement citoyen |
| Agent malveillant | Contrôle d'accès + journal d'audit + Séparation des rôles (SoD) |
| Téléchargement abusif | Quota quotidien + logs |

**SOURCE.** architect §17.11 : Anti-énumération sur APIs identité ; anti-bot sur déclarations publiques.

### 8.14 — Gestion des incidents

**RECOMMANDATION.** (security-auditor §08 + architect §17.12)

- **SIEM interne** (Wazuh / Elastic SIEM) — **DÉCISION À PRENDRE**.
- **Alertes critiques** : échecs MFA répétés, exports massifs, accès hors périmètre géographique.
- **UEBA** (User & Entity Behavior Analytics) — **DÉCISION À PRENDRE** (architect §17.12).
- **Plan d'intervention** : détection → analyse → confinement → remédiation → rapport APDP (délai légal — **POINT À VÉRIFIER**).

**POINT À VÉRIFIER — VALIDATION JURIDIQUE NÉCESSAIRE** : Délai de notification de violation de données à l'APDP et au citoyen (Loi 2013-015 + Code pénal 2024).

### 8.15 — Séparation des responsabilités (SoD)

| Contrôle | Règle |
|---|---|
| Conflit rôle | Un agent de saisie ne peut pas valider sa propre déclaration |
| Conflit rôle | Un agent ne peut pas être superviseur régional simultanément |
| Vérification | Détection automatique des conflits à création de compte |

**DÉCISION À PRENDRE (architect D18)** : Vérification automatique des conflits SoD.

---

# 09 — Réglementation à vérifier

**SOURCES.** Loi malienne n° 2013-015 ; APDP ; Code pénal malien 2024 (art. 322-9 à 322-30).

### 9.1 — Référentiel identifié

| Référence | Statut | Pertinence |
|---|---|---|
| Loi malienne n° 2013-015 | **SOURCE** | Protection des données à caractère personnel |
| APDP (Autorité de Protection des Données) | **SOURCE** | Autorité de régulation |
| Code pénal malien 2024 — art. 322-9 à 322-30 | **SOURCE** | Infractions liées à la manipulation de données, usurpation |

**SOURCE.** architect §21.3 — Références normatives.

### 9.2 — Obligations identifiées

| Obligation | Interprétation | Conséquence pour MALI RETROUVÉ | Niveau de certitude |
|---|---|---|---|
| Conservation minimale des données | Les données doivent être conservées le temps nécessaire uniquement | Rétention configurable ; 12 mois = **HYPOTHÈSE NON VALIDÉE JURIDIQUEMENT** | **HYPOTHÈSE** — à valider par APDP |
| Consentement explicite | Le citoyen doit donner son consentement pour traiter ses données | Case à cocher obligatoire à la déclaration | **SOURCE** — Loi 2013-015 art. 7 |
| Droit d'accès, rectification, suppression | Le citoyen peut exercer ses droits | API "Mes données" + procédure de suppression | **HYPOTHÈSE** — DPO non détaillé |
| Notification de violation | Obligation de notifier la violation à l'APDP | Procédure de notification dans le plan incidents (processus **VALIDÉ**) | **PROCESSUS VALIDÉ** — délai 72 h = **HYPOTHÈSE NON VÉRIFIÉE** |
| Registre des traitements | Obligation de tenir un registre des traitements | Module d'administration pour le DPO | **SOURCE** — Loi 2013-015 art. 30 |
| Nomination du DPO/Responsable de traitement | Obligatoire pour traitement sensible | **Principe VALIDÉ** — titulaire à désigner par autorité compétente | **HYPOTHÈSE** — à confirmer |

### 9.3 — Traitement des données biométriques

**DÉCISION : VALIDÉE — KYC biométrique EXCLU du MVP, FUTURE.**

Toute intégration biométrique ultérieure devra faire l'objet, avant mise en œuvre, d'une analyse dédiée (juridique, réglementaire, sécurité, architecture, protection des données).

**POINT À VÉRIFIER — VALIDATION JURIDIQUE NÉCESSAIRE** : Si réintroduction envisagée : exigences APDP précises sur l'hébergement des données biométriques.

### 9.4 — Responsabilité des centres

**DÉCISION : VALIDÉE sur le principe.** La répartition des responsabilités entre MALI RETROUVÉ et les centres partenaires sera définie juridiquement et contractuellement avant leur mise en production opérationnelle. Aucune désignation a priori.

### 9.5 — Politique de tarification

**POINT À VÉRIFIER — VALIDATION JURIDIQUE NÉCESSAIRE** : Politique de tarification des frais de restitution.

---

# 10 — Architecture fonctionnelle

**SOURCE.** software-architect.md — Section 3 : "Architecture fonctionnelle & contexte".

### 10.1 — Domaines et services (Bounded Contexts)

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATEFORME MALI RETROUVÉ                  │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │ IDENTITY    │ │ DECLARATION │ │ MATCHING    │ │ CENTER  │ │
│ │ (CNI, MFA)  │ │ (perte &    │ │ (scoring,   │ │ (gestion│ │
│ │             │ │  trouvaille)│ │  FSM)       │ │ centre) │ │
│ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └────┬────┘ │
│        │                              │               │     │
│ ┌──────▼──────┐ ┌──────┬──────┐ ┌──────▼──────┐ ┌────▼────┐ │
│ │ NOTIFICATION│ │ STORAGE │... │ │ RESTITUTION │ │ AUDIT   │ │
│ │ (SMS/WA/email│ │ (photos,  │   │ (validation,│ │ (logs,  │ │
│ │ )           │ │ docs)     │   │  pièce)    │ │  registre)│ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 — Services

| Service | Domaine | Responsabilité |
|---|---|---|
| **identity-svc** | Identity | Authentification, MFA, gestion CNI |
| **declaration-svc** | Déclaration | Création/consultation des déclarations perte & dépôts |
| **matching-svc** | Matching | Calcul de similarité, scoring, FSM |
| **catalog-svc** | Catalogue | Catégories, types, géographie administrative |
| **storage-svc** | Stockage | Photos, documents (S3-compatible) |
| **center-svc** | Centres | Gestion centres, agents, stocks locaux |
| **restitution-svc** | Restitution | Validation, suivi restitution |
| **notification-svc** | Notifications | SMS, WhatsApp, email, templates |
| **audit-svc** | Audit | Journal d'audit, logs immuables, registre des traitements |

**SOURCE.** architect §05 : "Microservice Architecture".
**STATUT : RECOMMANDÉ — à confirmer avec l'équipe technique.**

### 10.3 — Acteurs externes

| Acteur externe | Intégration |
|---|---|
| **micati.site/CNI** | Vérification d'identité (observation) — **HYPOTHÈSE** d'intégration |
| **Opérateurs SMS** | **AUCUN fournisseur contractuellement désigné.** Architecture multi-opérateur avec couche d'abstraction (Notification Service → SMS Service → Provider Adapter → Fournisseur SMS réel). Coût modélisé sous forme paramétrique. |
| **WhatsApp Business API** | Envoi de notifications (FUTURE) |
| **Fournisseur email** | Envoi d'emails transactionnels (D3 à décider) |
| **Cloud provider** | Hébergement (hybride recommandé) |

---

# 11 — Architecture technique recommandée

**SOURCE.** software-architect.md — Section 8-16.

### 11.1 — Stack recommandée

| Couche | Technologie | Justification |
|---|---|---|
| API Gateway | NGINX + rate limiting | Entrée unique, TLS termination, authn initiale |
| Authn | Keycloak (OIDC) | OIDC standard, MFA, intégration FIDO2 |
| Services | Go (microservices) + gRPC/REST | Performance, concurrence, faible memory |
| Orchestration | Kubernetes | Portabilité, autoscalling, gestion des versions |
| DB principale | PostgreSQL (13+) | Transactions ACID, support JSON, matures |
| DB audit/WORM | PostgreSQL + append-only tables OR Cassandra | Immutabilité des logs |
| Stockage | S3-compatible (MinIO/MinIO Enterprise) | Photos, documents, versioning |
| Cache | Redis | Sessions, cache de catalogue |
| Fil d'attente | RabbitMQ/Kafka (selon débit) | Asynchrone: notifications, matching |
| Recherche | Elasticsearch | Recherche full-text + géographique |
| SIEM | Wazuh / Elastic SIEM | Corrélation et alertes — **D16 à décider** |
| Policy engine | Open Policy Agent (OPA) | Règles ABAC déclaratives — **D17 à décider** |
| CI/CD | GitHub Actions/GitLab CI | Pipelines automatisés |

**STATUT : RECOMMANDÉ — à valider contre l'inventaire technologique autorisé.**

### 11.2 — Topologie

```
Zone publique (Internet)
   │
   ▼
[WAF + CDN (Cloudflare ou Akamai)]
   │
   ▼
[API Gateway / Ingress Controller]
   │
   ├── [Services applicatifs (K8s pods)]
   │      │
   │      ├── identity-svc
   │      ├── declaration-svc
   │      ├── matching-svc
   │      ├── center-svc
   │      ├── notification-svc
   │      ├── storage-svc
   │      ├── audit-svc
   │      └── ...
   │
   ├── [Redis (cache/session)]
   ├── [RabbitMQ/Kafka (messages)]
   ├── [PostgreSQL cluster (primary + replica)]
   ├── [MinIO (S3-compatible storage)]
   └── [Elasticsearch (recherche)]

Zone privée (réseau interne)
   │
   ├── [SIEM (Wazuh/Elastic)]
   ├── [OPA (policy engine)]
   └── [Vault (secrets management)]

Backup zone (air-gapped / WORM)
```

### 11.3 — Souveraineté et cloud

| Option | Avantages | Inconvénients |
|---|---|---|
| **On-Prem Mali** | Souveraineté totale, pas de transfert cross-border | Coût infra initial élevé, compétences DevOps limitées (V8) |
| **Cloud public international (AWS/Azure/GCP)** | Scalabilité, maturité, services managés | Souveraineté des données, V13 |
| **Cloud souverain local (si disponible)** | Souveraineté + scalabilité | **POINT À VÉRIFIER — VALIDATION INSTITUTIONNELLE** : Existence d'un cloud local certifié APDP (V13 architect) |
| **Hybride (recommandé)** | Flexibilité, données sensibles on-prem, scaling burstable cloud | Complexité de gestion |

**DÉCISION À PRENDRE (architect D6)** : Modèle de déploiement — on-prem, cloud, ou hybride.

### 11.4 — Disponibilité et résilience

| Niveau | SLA cible | Mesures |
|---|---|---|
| Production | 99.9% | Multi-zone K8s, DB répliqué |
| RTO (reprise) | < 4 h | Plan de secours documenté |
| RPO (pertes) | < 1 h | Backups incrémentaux + journal WAL |

---

# 12 — Modèle conceptuel de données

**SOURCE.** software-architect.md — Section 7 : "MCD".

### 12.1 — Entités principales (extraits)

| Entité | Attributs clés | Relation |
|---|---|---|
| **Citoyen** | id, CNI, nom, prénom, date_naissance, email, téléphone, hash_mot_de_passe | 1:N Déclaration |
| **DéclarationPerte** | id, citoyen_id, type, description, photo_url, date_perte, lieu, statut, score_match | 1:N Photo |
| **DepotTrouvaille** | id, citoyen_id (optionnel), type, description, photo_url, date_trouvaille, lieu, statut | 1:N Photo |
| **Match** | id, declaration_perte_id, depot_trouvaille_id, score, état (candidat/vérif/confirmée/rejetée), date_calcul | N:1 Déclaration, N:1 Depot |
| **Centre** | id, nom, adresse, région_id, cercle_id, latitude, longitude | N:1 Commune |
| **CentreAgent** | id, centre_id, citoyen_id, rôle, actif | N:1 Centre, N:1 Citoyen |
| **Région** | id, nom, code | 1:N Cercle |
| **Cercle** | id, nom, région_id | 1:N Commune |
| **Commune** | id, nom, cercle_id | 1:N Village |
| **Village** | id, nom, commune_id, lat, long | N:1 Commune |
| **AuditLog** | id, acteur_id, action, entité_type, entité_id, timestamp, ip, hash_chaine | — |

### 12.2 — Diagramme relationnel (texte)

```
Citoyen 1 ──< DéclarationPerte
Citoyen 1 ──< DepotTrouvaille (optionnel : peut être anonyme)
DéclarationPerte 1 ──< Photo (0..N)
DepotTrouvaille 1 ──< Photo (0..N)
Match }o── DéclarationPerte
Match }o── DepotTrouvaille
Centre }o── Région (N:1)
Centre }o── Cercle (N:1)
Centre }o── Commune (N:1)
CentreAgent }o── Centre (N:1)
CentreAgent }o── Citoyen (N:1)
AuditLog }o── Citoyen (N:1 acteur)
```

### 12.3 — Contraintes d'intégrité

| Type | Contrôle |
|---|---|
| Unicité | CNI unique dans Citoyen |
| Référentiel | Toutes les clés étrangères validées |
| Historisation | Versions des déclarations conservées |
| Immuabilité | Les logs d'audit sont append-only (hash chaîné) |

**SOURCE.** architect §07.5 : "Contraintes d'intégrité".

---

# 13 — Système de rapprochement

**SOURCE.** software-architect.md — Section 9 : "Matching engine".

### 13.1 — Principe fondamental

**RECOMMANDATION.** Le système de rapprochement est une **aide à la décision**. Il ne produit jamais de correspondance automatique définitive. Toute restitution nécessite une **validation humaine**.

### 13.2 — États du rapprochement

| État | Description |
|---|---|
| **candidat** | Nouvelle déclaration ou dépôt en attente de correspondance |
| **correspondance potentielle** | Un depot_trouvaille ou déclaration_perte a un score > seuil |
| **à vérifier** | Un agent homme peut examiner la correspondance proposée |
| **confirmée** | L'agent valide la correspondance → restitution autorisée |
| **rejetée** | L'agent rejette la correspondance → reste en surveillance |
| **clôturée/restituée** | La restitution est effectuée → case cochée |

### 13.3 — Algorithme de scoring (HYPOTHÈSE)

| Critère comparé | Poids | Score max |
|---|---|---|
| CNI (numéro exact) | 40% | 40 |
| Nom + prénom (similarité) | 20% | 20 |
| Date de naissance | 15% | 15 |
| Description objet | 15% | 15 |
| Lieu (proximité géographique) | 5% | 5 |
| Date (proximité temporelle) | 5% | 5 |
| **Total** | 100% | **100** |

**HYPOTHÈSE.** Les pondérations ci-dessus sont des propositions. **D7 (architect)** marque une divergence entre "pondérations publiques" et "formule interne" — à décider.

### 13.4 — Fonctionnement

```
1. Nouvelle DéclarationPerte créée
   │
   ├─► matching-svc lance un scan sur DepotTrouvaille existants
   │      (même catégorie, même région, dates proches)
   │
   ├─► Pour chaque dépôt potentiel, calcul du score
   │
   ├─► Score ≥ 80 → "correspondance potentielle" → notifié au citoyen
   │
   ├─► Score 50-79 → "à vérifier" → proposition à l'agent centre
   │
   └─► Score < 50 → surveillance 12 mois, puis archivage
```

### 13.5 — Faux positifs / Faux négatifs

| Type | Cause | Mitigation |
|---|---|---|
| Faux positif | Homonyme + même CNI (vol) | Vérification pièce + empreintes (si KYC) |
| Faux négatif | Description vague | Agent peut forcer une correspondance manuelle |
| Homonyme | Noms communs (Sékou, Moussa) | Score réduit, exigence d'autres critères |
| Informations manquantes | Pas de CNI (anonyme) | Score 0 — exclusion du matching |

**HYPOTHÈSE.** Le taux de faux positifs estimé est de 5-10% (à valider par test sur données historiques — **POINT À VÉRIFIER**).

### 13.6 — Traçabilité

**RECOMMANDATION.** Toute décision du matching (automatique ou humaine) est immuablement journalisée :

- Score calculé
- Critères retenus
- Identité de l'agent validateur
- Timestamp
- IP

---

# 14 — Notifications

**SOURCE.** software-architect.md — Section 10 : "Notifications et communication".
**SOURCE.** ui-ux-designer.md — Section 5.2 : "Stratégie de communication".

### 14.1 — Canaux

| Canal | Usage | Statut |
|---|---|---|
| **SMS** | Résultats de matching, restitution, rappels | RECOMMANDÉ |
| **WhatsApp** | Messages riches (photos, PDF), conversations | RECOMMANDÉ (avec BSP — **D2 à décider**) |
| **Email** | Confirmations, rapports administratifs | RECOMMANDÉ (**D3 à décider**) |
| **Push mobile** | Notifications en temps réel | COULD (V2) |

**SOURCE.** architect §12 : "Stratégie multi-canal".

### 14.2 — Templates & langues

> **DÉCISION : VALIDÉE.** **Langue principale du MVP = FRANÇAIS.** L'architecture et l'UX doivent rester localisables. Les langues locales sont prévues pour une phase ultérieure, après étude UX et sélection de la ou des langues prioritaires.

**RECOMMANDATION.** (ui-ux-designer §5.2)

- Templates multilingues : **français** au lancement. Extension à d'autres langues nationales en FUTURE.
- Templates personnalisables par canal.
- Règle anti-spam : max 3 notifications/jour/citoyen.

### 14.3 — Gestion de la disponibilité des canaux

**FAIT.** Le Mali a une couverture variable de 2G/3G/4G selon les régions.

**POINT À VÉRIFIER (architect V7)** : Cartographie détaillée de la connectivité par région/cercle.

### 14.4 — Idempotence et fiabilité

**RECOMMANDATION.** (architect §17.5)

- Chaque notification a un **Idempotency-Key** (UUID client).
- Retries exponentiels avec file d'attente (DLQ).
- **D13 (architect)** : Pondération DLQ/retry pour notifications — à décider.

---

# 15 — Centres partenaires

**SOURCE.** software-architect.md — Section 11 : "Gestion des centres".

### 15.1 — Structure

```
RÉGION (20)
  └─ CERCLE (159)
       └─ COMMUNE (815)
            └─ VILLAGE (12 712)
                 └─ CENTRE (nombre à déterminer)
```

**POINT À VÉRIFIER (architect V9)** : Capacité physique des centres (taille, sécurité, accès).

### 15.2 — Processus d'accueil au centre

```
1. Citoyen présente sa déclaration (numéro de suivi ou CNI)
2. Agent centre vérifie la pièce d'identité
3. Affichage des correspondances (score ≥ seuil)
4. Citoyen confirme ou infirme la correspondance
5. Agent effectue la vérification approfondie
6. Restitution du document/objet
7. Journalisation de l'opération
8. Notification au déclarant du dépôt (trouvaille)
```

### 15.3 — Limitations des centres

| Type | Limite |
|---|---|
| Nombre d'objets physiques | **POINT À VÉRIFIER** : capacité de stockage physique (architect V9) |
| Durée de conservation | 6 mois max (règle métier R8 — **POINT À VÉRIFIER juridique**) |
| Type d'objets | Certains objets (animaux, lingots) nécessitent des modalités spéciales |

**DÉCISION À PRENDRE.** Confirmation de la liste officielle des types de centre (architect D11).

---

# 16 — Administration

**SOURCE.** software-architect.md — Section 14 : "Administration et reporting".

### 16.1 — Fonctionnalités administratives

| Fonction | Description |
|---|---|
| Gestion des centres | Création, mise à jour, désactivation |
| Gestion des agents | Attribution/révocation de rôles |
| Gestion des politiques | Modification des seuils, règles, templates |
| Gestion des catégories | Ajout/modification des types d'objets |
| Reporting | Statistiques par région, centre, période |
| Audit | Consultation complète du journal d'audit |
| Registre des traitements | Conformité Loi 2013-015 art. 30 |

### 16.2 — Tableau de bord administratif

| Niveau | Métriques clés |
|---|---|
| **National** | Total déclarations, taux restitution, taux match, top catégories |
| **Régional** | Par région : centres actifs, temps moyen restitution, anomalies |
| **Centre** | Dépôts du jour, stock, restitutions, signalements |

**HYPOTHÈSE.** Le tableau de bord V1 est en REST + rendu simple (tableaux + filtres). Un module analytique plus avancé (GraphQL) pourrait être envisagé en V2 — **D17 à décider** (architect §17.4).

### 16.3 — Gestion des conflits / signalements

**RECOMMANDATION.** (security-auditor §10)

- Signalement d'abus par les citoyens (fausse déclaration, comportement agent).
- Workflow interne : ticket → assignation → résolution → clôture.
- Audit trail complet.

---

# 17 — Design system

**SOURCE.** ui-ux-designer.md — Section 7 : "Design system".

### 17.1 — Palette de référence (VALIDÉE — Direction 3 + Logo A)

| Usage | Couleur | Code HEX |
|---|---|---|
| Primaire | Vert | `#1B6E3F` |
| Accent | Terre cuite | `#CC5500` |
| Fond chaud | Beige | `#F5F0E1` |
| Texte | Gris foncé | `#333333` |
| Fond | Blanc | `#FFFFFF` |
| Alertes/erreur | Rouge | `#E53935` |

**VALIDÉ — Palette de référence de marque** (commanditaire, 2026-09-02) : Direction 3 — Communautaire modernisée + Logo A — Lien.

→ Vert `#1B6E3F` retenu comme teinte principale définitive.
→ Slogan validé : « Ensemble, retrouvons l'essentiel. »

Le respect des contrastes et les règles d'utilisation détaillées restent soumis aux règles d'accessibilité du design system. Règles complètes à définir.

### 17.2 — Typographie

| Usage | Police | Justification |
|---|---|---|
| Titres | Montserrat / Arial fallback | Moderne, lisible |
| Corps | Open Sans / système fallback | Lisible sur mobile |
| Code | Monospace système | Interface admin |

### 17.3 — Icônes et imagery

**RECOMMANDATION.** (ui-ux-designer §7)

- Bibliothèque d'icônes cohérente (style outline/linear).
- Illustrations légères, neutres, non-genrées.
- Images de référence (photos produits) uniquement si nécessaires — **HYPOTHÈSE** : à limiter pour réduire le poids mobile.

### 17.4 — Accessibilité

**RECOMMANDATION.** (ui-ux-designer §7 + accessibility skill)

- Contraste ≥ 4.5:1 pour tous les textes.
- Navigation clavier complète.
- Labels ARIA sur tous les contrôles.
- Taille de police minimum 14px (corps), 16px sur mobile.
- Compatibilité lecteurs d'écran (NVDA, JAWS, VoiceOver).
→ Vert `#1B6E3F` : conformité contraste ≥ 4.5:1 sur fond blanc — à valider dans les règles du design system.

---

# 18 — Direction artistique

**SOURCE.** ui-ux-designer.md — Section 8 : "Direction artistique".

**OBJET.** Cette section présente **3 propositions de direction artistique**. **Direction 3 — Communautaire modernisée** a été **VALIDÉE** comme direction artistique officielle de MALI RETROUVÉ par le commanditaire le **2026-09-02**.

Les propositions 1 (Institutionnel moderne) et 2 (Éthique minimaliste) sont rejetées mais conservées comme alternatives pour des usages spécifiques (supports institutionnels, interfaces admin).

### Proposition 1 — Institutionnel moderne

| Attribut | Valeur |
|---|---|
| Positionnement | Modernité au service de l'institution |
| Palette | Bleu `#003366` + gris `#666666` + blanc |
| Typographie | Montserrat (titres) + Open Sans (corps) |
| Style | Géométrique, ordonné, sobre |
| Avantages | Sémantique forte (bleu = confiance, autorité), adaptable aux supports officiels |
| Limites | Peut sembler trop "corporatif", moins humain |
| Pertinence institutionnelle | Très forte — ressemble à un organisme public |
| Pertinence numérique | Forte — design system éprouvé |

### Proposition 2 — Éthique minimaliste

| Attribut | Valeur |
|---|---|
| Positionnement | Simplicité et sobriété au service de l'égalité |
| Palette | Gris anthracite `#2C2C2C` + blanc + une couleur d'accent (vert ou bleu clair) |
| Typographie | Lato (titres) + Lato (corps) — police unique |
| Style | Ultra-minimal, beaucoup d'air, peu de décorations |
| Avantages | Inclusif, neutre, très lisible sur mobile, faible empreinte |
| Limites | Peut manquer d'identité visuelle forte |
| Pertinence institutionnelle | Moyenne — manque de reconnaissance visuelle |
| Pertinence numérique | Très forte — idéal pour faible connexion |

### Proposition 3 — Communautaire

| Attribut | Valeur |
|---|---|
| Positionnement | Lié au tissu local, chaleureux, accessible |
| Palette | Vert `#2E8B57` + terre cuite `#CC5500` + beige `#F5F0E1` |
| Typographie | Poppins (titres) + Nunito (corps) — ronde, amicale |
| Style | Courbé, illustrations légères de personnes, chaleur humaine |
| Avantages | Forte adéquation culturelle, rassurant pour les citoyens peu lettrés |
| Limites | Risque de sembler "trop jeune" ou informel pour administration |
| Pertinence institutionnelle | Moyenne — à nuancer selon public cible |
| Pertinence numérique | Forte — mais plus lourde en assets graphiques |

| Critère | Direction 1 | Direction 2 | Direction 3 |
|---|---|---|---|
| Sérieux institutionnel | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Confiance utilisateur | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Accessibilité (faible connexion) | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Coût de production | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Adaptabilité multi-canal | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**VALIDÉ — Identité de marque complète** (commanditaire, 2026-09-02) :

| Élément | Valeur | Statut |
|---|---|---|
| Direction artistique | Direction 3 — Communautaire modernisée | VALIDÉ |
| Logo | Proposition A — « Lien » | VALIDÉ |
| Vert principal | `#1B6E3F` | VALIDÉ |
| Terre cuite | `#CC5500` | VALIDÉ |
| Beige | `#F5F0E1` | VALIDÉ |
| Texte | `#333333` | VALIDÉ |
| Blanc | `#FFFFFF` | VALIDÉ |
| Rouge alerte | `#E53935` | VALIDÉ |
| Slogan | « Ensemble, retrouvons l'essentiel. » | VALIDÉ |
| Slogan alternatif | « Chaque document a son propriétaire. Chaque objet peut être retrouvé. » | VALIDÉ (usage institutionnel) |

**À définir dans le design system :** Règles complètes d'utilisation (contrastes détaillés, espacements, graisses, modes d'emploi).

---

# 19 — Propositions de logos

**SOURCE.** ui-ux-designer.md — Section 9 : "Propositions de logos".

### Proposition A — Logo "Lien"

```
Concept : Deux formes entrelacées symbolisant perte et trouvaille
          ┌─────────┐     ┌─────────┐
          │    ○    │     │    ○    │
          │   / \   │  ↔  │   / \   │
          └─────────┘     └─────────┘
```

| Attribut | Valeur |
|---|---|
| Description | Deux cercles entrelacés = connexion |
| Couleurs | Bleu `#003366` (proposition 1) |
| Usage | Application, vêtements, supports imprimés |
| Avantages | Évocateur de la connexion, mémorable |
| Limites | Détails fins peuvent se perdre en petit format |
| Pertinence institutionnelle | ⭐⭐⭐ |
| Pertinence numérique | ⭐⭐⭐⭐ (favicon lisible) |

### Proposition B — Logo "Colibri"

```
Concept : Oiseau qui ramène un objet = restitution
          >•]  (oiseau)
         /
        ◯  (objet)
```

| Attribut | Valeur |
|---|---|
| Description | Colibri portant un objet |
| Couleurs | Vert `#2E8B57` + terre cuite (proposition 3) |
| Usage | Application, supports culturels |
| Avantages | Chaleureux, culturellement ancré (colibri = rapide, efficace) |
| Limites | Peut complexifier l'iconographie pour très jeunes/analphabètes |
| Pertinence institutionnelle | ⭐⭐ |
| Pertinence numérique | ⭐⭐⭐ |

### Proposition C — Logo "Clef"

```
Concept : Clef stylisée = accès rendu
          ⏚
          |  (clef)
```

| Attribut | Valeur |
|---|---|
| Description | Clef abstraite stylisée |
| Couleurs | Gris anthracite (proposition 2) |
| Usage | Application, supports techniques/administration |
| Avantages | Simple, évocateur d'accès, polyvalent |
| Limites | Peut sembler trop "technique", moins humain |
| Pertinence institutionnelle | ⭐⭐⭐ |
| Pertinence numérique | ⭐⭐⭐⭐⭐ |

| Critère | Proposition A | Proposition B | Proposition C |
|---|---|---|---|
| Mémorabilité | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Lisibilité (16px) | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Neutralité culturelle | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Évocateur de mission | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Facilité de gravure | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

**VALIDÉ — Logo retenu : Proposition A — « Lien »** (commanditaire, 2026-09-02).

→ Couleur principale : `#1B6E3F` (vert Direction 3)
→ Couleur secondaire : `#CC5500` (terre cuite)
→ Slogan associé : « Ensemble, retrouvons l'essentiel. »

---

# 20 — Palettes de couleurs

**SOURCE.** ui-ux-designer.md — Section 10 : "Palettes de couleurs".

### Palette 1 — Institutionnel (associée à direction artistique 1)

| Couleur | Usage | Code |
|---|---|---|
| `#003366` | Primaire, header, boutons | Bleu Marine |
| `#005599` | Hover boutons | Bleu moyen |
| `#666666` | Texte secondaire | Gris |
| `#F5F5F5` | Fonds, sections | Gris clair |
| `#FFFFFF` | Fonds principaux | Blanc |

- Accessibilité : 4.5:1 minimum ✓ (texte bleu/foncé sur blanc)
- Usage recommandé : Interfaces administratives, supports officiels

### Palette 2 — Éthique (associée à direction artistique 2)

| Couleur | Usage | Code |
|---|---|---|
| `#2C2C2C` | Primaire, textes | Anthracite |
| `#E0E0E0` | Bordures, fonds | Gris très clair |
| `#4CAF50` | Accent succès | Vert |
| `#F5F5F5` | Fonds | Gris clair |
| `#FFFFFF` | Fonds | Blanc |

- Accessibilité : 4.5:1 ✓ | Usage : Interface ultra-minimaliste, mobile-first

### Palette 3 — Communautaire (associée à direction artistique 3)

| Couleur | Usage | Code |
|---|---|---|
| `#1B6E3F` | Primaire | Vert |
| `#CC5500` | Accent action | Terre cuite |
| `#F5F0E1` | Fonds | Beige |
| `#333333` | Textes | Gris foncé |
| `#FFFFFF` | Fonds | Blanc |

- Accessibilité : 4.5:1 ✓ | Usage : Interface chaude, orientation citoyenne (Direction 3 — VALIDÉE)
- **Vert principal définitif** : `#1B6E3F` (commanditaire, 2026-09-02)
- Rouge d'alerte : `#E53935` (ajouté — VALIDÉ)

---

# 21 — Architecture UX/UI

**SOURCE.** ui-ux-designer.md — Section 5 : "Proposition d'architecture UX".

### 21.1 — Principe directeur

> **Mobile-first, simple, accessible — 3 clics maximum pour déclarer ou déposer.**

**SOURCE.** ui-ux-designer.md — Section 5.1 : "Principe directeur".

### 21.2 — Hiérarchie des écrans

| Niveau | Écrans | Description |
|---|---|---|
| **0** | Splash, onboarding | 2 écrans max, pas de formulaire obligatoire |
| **1** | Accueil, connexion | Bouton "J'ai perdu" / "J'ai trouvé" |
| **2** | Formulaire déclaration | CNI (scan ou saisie), catégorie, description, photo |
| **3** | Confirmation + suivi | Numéro de suivi, bouton "Consulter mes déclarations" |
| **4** | Détail correspondance | Score, photos, bouton "Accepter"/"Refuser" |
| **5** | Instructions restitution | Centre le plus proche, horaires |

### 21.3 — Parcours mobile — Déclaration de perte

```
Écran 1 : Accueil
   ├── "J'ai perdu un document/objet" → Écran 2
   └── "J'ai trouvé un objet" → (parcours dépôt)

Écran 2 : Vérification CNI
   ├── Scan CNI (caméra)
   └── Saisie manuelle (fallback)

Écran 3 : Type d'objet perdu
   ├── Document officiel
   ├── Document administratif
   ├── Objet personnel
   └── Animal

Écran 4 : Description
   ├── Champ texte libre (placeholder: "Décrivez le plus précisément possible")
   ├── Ajout photo (1-5 photos)
   └── Localisation (GPS ou sélection manuelle)

Écran 5 : Confirmation
   ├── Récapitulatif
   ├── Case à cocher : "J'accepte les conditions et la politique de confidentialité"
   └── Bouton "Déclarer"

Écran 6 : Suivi
   ├── Numéro de suivi affiché
   ├── "Activer les notifications"
   └── Bouton "Retour à l'accueil"
```

### 21.4 — Parcours agent centre

```
Écran 1 : Connexion (mot de passe + MFA)
Écran 2 : Tableau de bord centre
   ├── Nouveaux dépôts (badge)
   ├── Restitutions du jour (badge)
   └── Signalements (badge)
Écran 3 : Détail d'un dépôt/déclaration
Écran 4 : Calcul matching (score, critères)
Écran 5 : Validation manuelle
Écran 6 : Confirmation restitution (pièce d'identité vérifiée)
Écran 7 : Journalisation + notification au citoyen
```

### 21.5 — États vides, erreurs, chargement

**RECOMMANDATION.** (ui-ux-designer §5.3)

- **État vide** : Illustration + message clair + appel à l'action.
- **État erreur** : Message humain expliquant le problème + solution proposée.
- **État chargement** : Spinner + message "Nous cherchons une correspondance…".
- **État succès** : Confirmation verte + numéro de suivi + bouton partage.

### 21.6 — Accessibilité UX

**RECOMMANDATION.** (ui-ux-designer §6)

- Labels associés à tous les champs de formulaire.
- Contraste ≥ 4.5:1.
- Navigation clavier complète.
- Taille cible minimum 44px (mobile).
- Support des lecteurs d'écran via ARIA.

---

# 22 — MVP

**SOURCE.** software-architect.md — Section 15 : "MVP et périmètre".
**SOURCE.** ui-ux-designer.md — Section 12 : "MVP & roadmap".

### 22.1 — Critères de priorité

| Niveau | Critère |
|---|---|
| **MUST HAVE** | Fonctionnalité indispensable au fonctionnement minimal viable |
| **SHOULD HAVE** | Fonctionnalité fortement souhaitée mais pas bloquante |
| **COULD HAVE** | Fonctionnalité nice-to-have pour améliorer l'expérience |
| **FUTURE** | Fonctionnalité reportée à une version ultérieure |

### 22.2 — Périmètre du MVP

> **DÉCISIONS INTÉGRÉES** (cf. `04_DOSSIER_ARBITRAGE_MVP.md`) :
> - Catégorisation officielle = `NATURE → DOMAINE → TYPE`.
> - Périmètre pilote = **Bamako + Ségou** (Ségou retenue comme 2e région pilote ; Kisangani définitivement exclue).
> - Interface MVP = **Web responsive** (mobile / WhatsApp = FUTURE).
> - Langue MVP = **Français** (langues locales = FUTURE).
> - Architecture SMS = **multi-opérateur** ; aucun fournisseur contractuel désigné.
> - KYC biométrique = **EXCLU MVP, FUTURE**.

| Fonctionnalité | Priorité | Justification |
|---|---|---|
| Déclaration perte (citoyen) | MUST | Coeur du produit |
| Dépôt trouvaille (citoyen) | MUST | Coeur du produit |
| Rapprochement automatique | MUST | Valeur métier centrale |
| Validation manuelle par agent | MUST | Exigence réglementaire |
| Restitution au centre | MUST | Finalité métier |
| Authentification citoyen (SMS/MFA) | MUST | Sécurité minimale |
| Notifications SMS/email | MUST | Communication essentielle |
| Géographie (région/cercle/commune) | MUST | Contexte local |
| Gestion centres + agents | MUST | Opération locale |
| Administration nationale | SHOULD | Reporting et configuration |
| Tableaux de bord | SHOULD | Suivi opérationnel |
| Multilingue (français) | SHOULD | Français au lancement — localisable |
| WhatsApp Business | COULD | FUTURE |
| Audit/SIEM | SHOULD | Conformité sécurité |
| WORM pour logs | COULD | Conformité archivage (selon APDP) |
| FIDO2 pour admins | FUTURE | Durcissement V2 |
| KYC biométrique | FUTURE | EXCLU MVP — analyse dédiée préalable si réintroduction |
| Push mobile | FUTURE | Amélioration expérience |
| IA prédictive matching | FUTURE | V2+ |

### 22.3 — Ce qui n'est PAS dans le MVP

| Exclus | Justification |
|---|---|
| Matching automatique sans validation humaine | JAMAIS — toujours validation humaine (cf. §13.1 et D-03 arbitrage) |
| Catégorie « Autre » non structurée | EXCLUE — pas dans la modélisation `NATURE → DOMAINE → TYPE` |
| Objet de grande valeur, animaux | FUTURE — hors MVP |
| Centres sur tout le territoire | Pilote Bamako + Ségou uniquement (déploiement national hors MVP) |
| Application mobile, WhatsApp bot | FUTURE — Web responsive au MVP |
| Langues locales | FUTURE — Français au lancement |
| KYC biométrique | EXCLU MVP — FUTURE avec analyse dédiée préalable |
| Paiement Mobile Money | Gratuit au lancement (architect §19.3 D15) |
| Kisangani | EXCLUE DÉFINITIVEMENT (ville RDC, hors Mali) |

---

# 23 — Roadmap

**SOURCE.** software-architect.md — Section 16 : "Roadmap d'implémentation".

### 23.1 — Phasage

| Phase | Durée estimée | Scope | Décrites dans |
|---|---|---|---|
| **Phase 0** | 4-6 semaines | Fondations : cadrage juridique, CI/CD, monorepo, choix opérateurs | architect §16.20 |
| **Phase 1** | 6-8 semaines | identity-svc, MFA, audit-svc, politiques de base (OPA) | architect §16.21 |
| **Phase 2** | 6-8 semaines | declaration-svc, catalog-svc, storage-svc, ingestion photos, API citoyen | architect §16.22 |
| **Phase 3** | 6-8 semaines | matching-svc, scoring V1, seuils, FSM | architect §16.23 |
| **Phase 4** | 8-10 semaines | center-svc, restitution-svc, agents, RBAC, double validation | architect §16.24 |
| **Phase 5** | 4-6 semaines | notification-svc, templates, dashboard admin V1 | architect §16.25 |
| **Phase 6** | 4 semaines | Durcissement : pentests, bug bounty, PRA, formation | architect §16.26 |
| **Phase 7** | 8 semaines | Pilote : District Bamako + 1 région | architect §16.27 |
| **Phase 8** | 6 mois | Généralisation région par région | architect §16.28 |

### 23.2 — Diagramme de dépendances

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
   (CJP)  (Identité) (Données) (Rappro.) (Centres)  (Notif.)  (Sécurité) (Pilote)   (Roll-out)
```

**DÉCISION À PRENDRE (architect D6)** : Le phasage dépend du choix de l'opérateur SMS, du modèle cloud (on-prem/cloud/hybride), et de l'approbation juridique.

### 23.3 — Prérequis critiques

| Phase | Prérequis | Statut |
|---|---|---|
| 0 | Validation juridique (Loi 2013-015, APDP) | **À DÉCIDER** |
| 0 | Choix opérateurs SMS/WhatsApp (D1, D2) | **À DÉCIDER** |
| 0 | Choix email transactionnel (D3) | **À DÉCIDER** |
| 1 | Décision RBAC/ABAC (7 rôles) | **À DÉCIDER** |
| 3 | Validation seuils matching | **À DÉCIDER** |
| 4 | Validation processus double validation (D12) | **À DÉCIDER** |

---

# 24 — Risques

**SOURCE.** security-auditor.md — Sections 04, 14, 16.

### 24.1 — Matrice des risques

| Risque | Impact | Probabilité | Prévention | Détection | Correction |
|---|---|---|---|---|---|
| Fausse déclaration de perte | Moyen | Élevée | CAPTCHA adaptatif, rate limiting, hash similarité | Audit logs | Refus de restitution, signalement agent |
| Fausse trouvaille | Moyen | Élevée | Vérification pièce d'identité centre | Audit logs | Refus restitution |
| Usurpation d'identité | Élevé | Moyenne | MFA, vérification CNI, empreintes optionnelles | SIEM alertes connexions suspectes | Verrouillage compte, investigation |
| Exposition de données | Critique | Basse | Chiffrement AES-256, RBAC strict, logs anonymisés | Audit de sécurité, scans vuln | Correctif + notification APDP |
| Scraping massif | Moyen | Élevée | Rate limiting IP, CAPTCHA | Logs volume requêtes | Blocage + CAPTCHA durci |
| Énumération d'identifiants | Basse | Élevée | Messages génériques, rate limiting | Logs erreurs auth | Throttling + blocage |
| Manipulation du matching | Critique | Basse | Validation humaine obligatoire | Audit logs matching | Audit trail + correction |
| Agent malveillant | Critique | Moyenne | SoD, MFA, journalisation complète | UEBA (D16) | Révocation rôle + investigation |
| Privilèges excessifs | Critique | Moyenne | RBAC/ABAC, revue périodique | Access logs | Révocation immédiate |
| FRAUDE INTERNE | Critique | Basse | SoD, journalisation, UEBA | SIEM | Investigation + mesures disciplinaires |
| Téléchargement abusif | Moyen | Moyenne | Quotas, logs, alertes | Logs volume export | Limitation quotas |
| Spam/notifications | Basse | Élevée | Limite 3 notif/jour, feedback anti-spam | Logs | Ajustement templates |
| Compromise de compte | Élevé | Moyenne | MFA, révocation tokens | Logs connexion | Réinitialisation + MFA reset |
| Panne centrale | Critique | Basse | Multi-zone, PRA, backups | Monitoring uptime | Fail-over automatique |

**NOTE :** "Critique" → impact = perte de confiance publique / violation légale / exposition massive.

### 24.2 — Risques techniques

| Risque | Mitigation |
|---|---|
| Latence du matching > 1s | Cache Redis, matching asynchrone |
| Défaillance du SMS provider | Fallback email + affichage dans l'app |
| Saturation des centres | Rate limiting + file d'attente |
| Saturation de la base | Partitionnement par région, indexation |

### 24.3 — Risques réglementaires

| Risque | Mitigation |
|---|---|
| Non-conformité APDP | AIPD (analyse impact) — **POINT À VÉRIFIER** à produire en V1 |
| Délai notification violation > 72h (loi 2013-015 art. 33) | Plan d'intervention + test incident |

---

# 25 — Questions ouvertes

**SOURCE.** architect §19.2 (V1-V16) + D1-D18.

### 25.1 — Produit

| ID | Question | Statut |
|---|---|---|
| Q-P1 | Inclure "objet non catalogué" dans le MVP ou V2 ? | **À DÉCIDER** |
| Q-P2 | Notifications push mobile : priorité V1 ou V2 ? | **À DÉCIDER** |

### 25.2 — Métier

| ID | Question | Statut |
|---|---|---|
| Q-M1 | Liste officielle des types de centre — qui valide ? | **À DÉCIDER (D11)** |
| Q-M2 | Workflow de double validation des matches — nécessaire pour tous ? | **À DÉCIDER (D12)** |
| Q-M3 | Politique de tarification des frais de restitution | **À VÉRIFIER (V15)** |

### 25.3 — Sécurité

| ID | Question | Statut |
|---|---|---|
| Q-S1 | MFA : TOTP au lancement, FIDO2 en V2 ? | **À DÉCIDER (D8)** |
| Q-S2 | Engine de règles vs ML pour détection fraude | **À DÉCIDER (D15)** |
| Q-S3 | UEBA : intégrer dès V1 ? | **À DÉCIDER (D16)** |
| Q-S4 | OPA vs Cedar vs DSL interne pour policies | **À DÉCIDER (D17)** |
| Q-S5 | WORM pour logs — nécessaire si APDP l'exige ? | **À DÉCIDER (D5)** |
| Q-S6 | SoD automatique : comment détecter les conflits ? | **À DÉCIDER (D18)** |

### 25.4 — Juridique

| ID | Question | Statut |
|---|---|---|
| Q-J1 | Exigences APDP sur hébergement des données biométriques | **EXCLU MVP** (J-01) — à considérer uniquement si réintroduction FUTURE |
| Q-J2 | Délai APDP pour exercice des droits (accès, suppression) | **À VÉRIFIER (V2)** — **VALIDATION JURIDIQUE NÉCESSAIRE** |
| Q-J3 | Notification de violation — format et délai | **PROCESSUS VALIDÉ** — délai 72 h = **HYPOTHÈSE NON VÉRIFIÉE** |
| Q-J4 | Cadre juridique de la responsabilité des centres | **À DÉFINIR contractuellement** (J-03) |
| Q-J5 | Politique de conservation des photos après restitution | **PROCESSUS VALIDÉ** — 3 mois = **HYPOTHÈSE PROVISOIRE** |
| Q-J6 | Acceptabilité des notifications de nuit (contexte socioculturel) | **À VÉRIFIER (V6)** — **VALIDATION CULTURELLE** |
| Q-J7 | Cohérence rétention 12 mois vs obligation APDP | **HYPOTHÈSE DE DIMENSIONNEMENT NON VALIDÉE JURIDIQUEMENT** — 12 mois + 24 mois WORM |

### 25.5 — Technique

| ID | Question | Statut |
|---|---|---|
| Q-T1 | Cloud souverain local disponible et certifié APDP ? | **À VÉRIFIER (V13)** |
| Q-T2 | Compétences DevOps cloud disponibles au Mali | **À VÉRIFIER (V8)** |
| Q-T3 | Connectivité réelle par région/cercle | **À VÉRIFIER (V7)** |
| Q-T4 | Volumétrie cible année 1 | **À VÉRIFIER (V10)** |
| Q-T5 | Multilingue : quelles langues nationales ? | **À VÉRIFIER (V12)** |
| Q-T6 | Procédure de double validation des matches sensibles | **À VÉRIFIER (V14)** |

### 25.6 — UX/UI

| ID | Question | Statut |
|---|---|---|
| Q-U1 | Direction artistique retenue : quelle option ? | **À DÉCIDER** |
| Q-U2 | Logo retenu : quelle proposition ? | **À DÉCIDER** |
| Q-U3 | Palette de couleurs définitive | **À DÉCIDER** |

### 25.7 — Exploitation

| ID | Question | Statut |
|---|---|---|
| Q-E1 | Comment mesurer le taux de faux positifs du matching ? | **À VÉRIFIER (V10)** |
| Q-E2 | Procédure de test de restauration des backups | **À DÉFINIR** |

### 25.8 — Partenariats

| ID | Question | Statut |
|---|---|---|
| Q-P1 | Quel(s) opérateur(s) SMS ? (Celtel, Orange, Malitel) | **NON DÉCIDÉ** — architecture multi-opérateur avec couche d'abstraction ; sélection après comparaison des offres |
| Q-P2 | WhatsApp Business : BSP local ou international ? | **FUTURE** — hors MVP |
| Q-P3 | Email transactionnel : cloud ou souverain ? | **À DÉCIDER (D3)** |
| Q-P4 | Liste des catégories prioritaires au lancement | **VALIDÉE** — Documents officiels + documents administratifs prioritaires + objets personnels |

### 25.9 — Gouvernance

| ID | Question | Statut |
|---|---|---|
| Q-G1 | Qui est désigné comme Responsable de traitement (DPO) ? | **À DÉSIGNER** par l'autorité compétente — Administrateur national n'est **pas** automatiquement DPO |
| Q-G2 | Qui valide les modifications de seuils de matching ? | **À DÉFINIR** |
| Q-G3 | Procédure de mise à jour des politiques de sécurité | **À DÉFINIR** |

---

# 26 — Critères d'acceptation

**SOURCE.** architect §19.2 + ui-ux-designer §13 + security-auditor §08.

### 26.1 — Périmètre

| Critère | Acceptation |
|---|---|
| ✅ | Le MVP est clairement défini (§22.2) |
| ✅ | Les features MUST/SHOULD/COULD/FUTURE sont catégorisées |
| ⬜ | **À valider** : liste officielle des types de centre (Q-M1) |

### 26.2 — Acteurs

| Critère | Acceptation |
|---|---|
| ✅ | Les 7 rôles sont définis avec périmètre (§03.6) |
| ✅ | RBAC/ABAC modélisé (§08.4) |
| ⬜ | **À valider** : confirmation des rôles par les parties prenantes (architect D décision §18.1) |

### 26.3 — Parcours

| Critère | Acceptation |
|---|---|
| ✅ | 5 parcours utilisateurs documentés (§04) |
| ✅ | Parcours mobile décrite étape par étape (§21.3) |
| ✅ | États vides/erreurs/chargement décrits (§21.5) |

### 26.4 — Fonctionnalités

| Critère | Acceptation |
|---|---|
| ✅ | Catalogue fonctionnalité par domaine (§05) |
| ✅ | Priorisation MVP (§22.2) |

### 26.5 — Règles métier

| Critère | Acceptation |
|---|---|
| ✅ | FSM principale (14 états) **VALIDÉE** (§06.1, `04_DOSSIER_ARBITRAGE_MVP.md` §4.4) |
| ✅ | Catégorisation `NATURE → DOMAINE → TYPE` **VALIDÉE** |
| ✅ | Règles de matching (§06.3) — seuils à calibrer |
| ✅ | Règles de restitution (§06.4) |
| ⬜ | **À valider** : durée définitive de conservation centre (Q-J, arbitrage J-04 en attente APDP) |

### 26.6 — Sécurité

| Critère | Acceptance |
|---|---|
| ✅ | CIA triad défini (§08.1) |
| ✅ | MFA recommandé (§08.2) |
| ✅ | RBAC/ABAC modélisé (§08.4) |
| ✅ | Chiffrement des PII (§08.8) |
| ✅ | Journalisation (§08.9) |
| ✅ | Sauvegardes PRA (§08.10) |
| ✅ | Rétention/archivage (§08.11) |
| ✅ | Suppression (§08.12) |
| ✅ | Anti-abus (§08.13) |
| ✅ | Incidents (§08.14) |
| ✅ | SoD (§08.15) |
| ⬜ | **À valider** : Décisions D8, D15, D16, D17, D18 |

### 26.7 — Réglementaire

| Critère | Acceptation |
|---|---|
| ✅ | Référentiel identifié (§09.1) |
| ✅ | Obligations listées (§09.2) — niveaux de certitude révisés |
| ✅ | 6 points juridiques **ARBITRÉS** avec réserves (cf. `04_DOSSIER_ARBITRAGE_MVP.md` §3) |
| ⬜ | **À valider en exploitation** : confirmation APDP / DPO / conseil juridique (durées, DPO, délai notification, responsabilité contractuelle centres) |

### 26.8 — Architecture

| Critère | Acceptation |
|---|---|
| ✅ | 9 services micro-service identifiés (§10.2) |
| ✅ | Topologie réseau décrite (§11.2) |
| ✅ | Stack technologique recommandée (§11.1) |
| ✅ | Modèle déploiement hybride (§11.3) — **à valider D6** |

### 26.9 — Données

| Critère | Acceptation |
|---|---|
| ✅ | MCD avec 11 entités principales (§12.1) |
| ✅ | Hiérarchie administrative (§07.4) |
| ✅ | Catégories d'objets (§07.1) |
| ⬜ | **À valider** : liste officielle des 12 712 villages (V13 → Q-T1) |

### 26.10 — Rapprochement

| Critère | Acceptation |
|---|---|
| ✅ | États du FSM (candidat → confirmée → restituée) |
| ✅ | Score 0-100, seuils 80/50 |
| ✅ | Validation humaine toujours requise |
| ✅ | Faux positifs/négatifs documentés |
| ✅ | Traçabilité immuable |
| ⬜ | **À valider** : pondérations exactes (§13.3 HYPOTHÈSE) |

### 26.11 — Notifications

| Critère | Acceptation |
|---|---|
| ✅ | 4 canaux (SMS, WA, email, push) |
| ✅ | Multilingue — **Français au MVP** (langues locales en FUTURE) |
| ✅ | Idempotence + retry |
| ✅ | Architecture SMS multi-opérateur avec couche d'abstraction — **VALIDÉE** |
| ⬜ | **À sélectionner en PLAN** : fournisseur SMS réel (D1 — NON DÉCIDÉ) |
| ⬜ | **À sélectionner** : WhatsApp (FUTURE), email (D3) |

### 26.12 — Centres

| Critère | Acceptation |
|---|---|
| ✅ | Structure hiérarchique R→C→Com→Vil→Centre (§15.1) |
| ✅ | Processus d'accueil (§15.2) |
| ⬜ | **À valider** : capacité physique centres (V9) |

### 26.13 — Administration

| Critère | Acceptation |
|---|---|
| ✅ | Fonctionnalités admin (§16.1) |
| ✅ | Tableaux de bord (§16.2) |
| ✅ | Signalements abus (§16.3) |

### 26.14 — Identité visuelle

| Critère | Acceptation |
|---|---|
| ✅ | 3 directions artistiques proposées (§18) |
| ✅ | 3 concepts de logo (§19) |
| ✅ | 3 palettes (§20) |
| ✅ | Typographies (§17.2) |
| ✅ | Accessibilité (§17.4) |
| ⬜ | **À valider** : direction, logo, palette par comité de pilotage |

### 26.15 — UX/UI

| Critère | Acceptation |
|---|---|
| ✅ | Mobile-first, 3 clics max |
| ✅ | Architecture écran par écran (§21.2) |
| ✅ | États vides/erreurs/chargement (§21.5) |
| ✅ | Accessibilité (§21.6) |

### 26.16 — MVP

| Critère | Acceptation |
|---|---|
| ✅ | MUST/SHOULD/COULD/FUTURE définis (§22.2) |
| ✅ | Matching automatique sans validation humaine explicitement EXCLU (D-03 — aide à décision uniquement) |
| ✅ | Catégorisation officielle `NATURE → DOMAINE → TYPE` |
| ✅ | Périmètre pilote = Bamako + Ségou |
| ✅ | Interface = Web responsive |
| ✅ | Langue = Français |

### 26.17 — Roadmap

| Critère | Acceptation |
|---|---|
| ✅ | 9 phases + durées (§23.1) |
| ✅ | Diagramme dépendances (§23.2) |
| ✅ | Prérequis critiques (§23.3) |

### 26.18 — Risques

| Critère | Acceptation |
|---|---|
| ✅ | Matrice 14 risques couvrant menaces + techniques + réglementaires (§24) |

### 26.19 — Questions ouvertes

| Critère | Acceptation |
|---|---|
| ✅ | 24 questions classées par 9 catégories (§25) |

---

# Matrice des décisions

**SOURCE.** software-architect.md — Section 19.1 (D1-D18) + Section 19.2 (V1-V16).

| ID | Décision | Options | Recommandation | Statut |
|---|---|---|---|---|
| **D1** | Choix opérateurs SMS | Celtel, Orange, Malitel, multi | **À DÉCIDER** | À DÉCIDER |
| **D2** | WhatsApp Business BSP | Local, International | **À DÉCIDER** | À DÉCIDER |
| **D3** | Email transactionnel | Cloud, Souverain | **À DÉCIDER** | À DÉCIDER |
| **D4** | KYC biométrique | Oui, Non, Scope limité | **À DÉCIDER** | À DÉCIDER |
| **D5** | Audit DB (WORM vs SQL) | WORM, SQL | SQL au lancement; WORM si APDP exige | À DÉCIDER |
| **D6** | Stratégie migration site existant | Big-bang, Progressif | Progressif | RECOMMANDÉ |
| **D7** | Pondérations matching publiques | Publiques, Opaques | Publiques, formule interne | À DÉCIDER |
| **D8** | FIDO2 rôles privilégiés | Oui, Non | TOTP V1; FIDO2 V2 | À DÉCIDER |
| **D9** | Open data | Oui, Non, Scope | **À DÉCIDER** | À DÉCIDER |
| **D10** | Assurance centres | Oui, Non | **À DÉCIDER** | À DÉCIDER |
| **D11** | Types de centre officiel | **À VALIDER** | **À DÉCIDER** | À DÉCIDER |
| **D12** | Double validation match | Oui partout, Auto faible risque | Oui pour sensible | À DÉCIDER |
| **D13** | DLQ/retry notif | Standard, Ajusté | **À DÉFINIR** | À DÉCIDER |
| **D14** | Mode archivage WORM | WORM, SQL | SQL lancement; WORM si APDP | À DÉCIDER |
| **D15** | Engine règles vs ML fraude | Rules, ML | Rules V1 | À DÉCIDER |
| **D16** | UEBA | Oui, Non | **À DÉCIDER** | À DÉCIDER |
| **D17** | OPA/Cedar/DSL policies | OPA, Cedar, DSL | OPA (90% coverage) | À DÉCIDER |
| **D18** | SoD automatique | Oui, Non | Oui (conflicts auto-détectés) | À DÉCIDER |

| **V1** | Exigences APDP hébergement biométrie | **POINT À VÉRIFIER — VALIDATION JURIDIQUE** | À VÉRIFIER |
| **V2** | Délai APDP pour droits citoyens | **POINT À VÉRIFIER — VALIDATION JURIDIQUE** | À VÉRIFIER |
| **V3** | Notification violation — délai/format | **POINT À VÉRIFIER — VALIDATION JURIDIQUE** | À VÉRIFIER |
| **V4** | Cadre juridique responsabilité centres | **POINT À VÉRIFIER — VALIDATION JURIDIQUE** | À VÉRIFIER |
| **V5** | Conservation photos après restitution | **POINT À VÉRIFIER — VALIDATION JURIDIQUE** | À VÉRIFIER |
| **V6** | Notifications nuit — acceptabilité culturelle | **POINT À VÉRIFIER — VALIDATION CULTURELLE** | À VÉRIFIER |
| **V7** | Connectivité par région/cercle | Cartographie | À VÉRIFIER |
| **V8** | Compétences DevOps Mali | **À ÉVALUER** | À VÉRIFIER |
| **V9** | Capacité physique centres | **À VALIDER** | À VÉRIFIER |
| **V10** | Volumétrie cible année 1 | **À CALIBRER** | À VÉRIFIER |
| **V11** | Catégories prioritaires lancement | **À VALIDER** | À VÉRIFIER |
| **V12** | Politique traduction (langues nationales) | **À DÉFINIR** | À VÉRIFIER |
| **V13** | Cloud local certifié APDP | **RECHERCHE** | À VÉRIFIER |
| **V14** | Procédure double validation matches sensibles | **À DÉFINIR** | À VÉRIFIER |
| **V15** | Tarification frais restitution | **À VALIDER** | À VÉRIFIER |
| **V16** | Cohérence rétention 12 mois vs APDP | **POINT À VÉRIFIER — VALIDATION JURIDIQUE** | À VÉRIFIER |

---

**Fin du dossier de conception — Phase DISCOVER → DEFINE**

> **Arbitrages humains intégrés** (cf. `04_DOSSIER_ARBITRAGE_MVP.md`).
> **Statut global : ARBITRAGES INTÉGRÉS — PLAN DÉBLOQUÉ POUR ENGAGEMENT.**
> Les réserves juridiques (J-02 délai, J-04 rétention, J-05 DPO, J-06 purge) restent à confirmer par DPO / APDP / conseil juridique avant exploitation opérationnelle.
>
> **Aucun code applicatif n'a été produit dans ce dossier.** Ce document contient exclusivement du contenu de conception, des recommandations et des décisions arbitrées par le commanditaire.

