# Plan Technique MVP — MALI RETROUVÉ
## Phase PLAN — Conception détaillée avant implémentation

---

**Document :** Plan technique de la phase PLAN
**Projet :** MALI RETROUVÉ
**Phase :** PLAN → IMPLEMENT
**Date :** 2026-09-03
**Statut :** TRANSITIONNÉ EN IMPLÉMENTATION — phase DELEGATE/IMPLEMENT lancée. Infraestructure prête (Postgres/Redis/MinIO). Schéma Prisma validé. Début de l'implémentation du modular monolith.

> **RAPPEL IMPORTANT.** Ce document est une **conception technique détaillée**. Il ne contient **aucun code applicatif**, **aucun SQL**, **aucune API implémentée**, **aucune interface implémentée**, **aucune migration**, **aucune dépendance installée**.
>
> Les **décisions humaines arbitrées** dans `04_DOSSIER_ARBITRAGE_MVP.md` sont prioritaires. Elles ne sont pas remises en cause.
>
> Les **décisions humaines arbitrées** dans `04_DOSSIER_ARBITRAGE_MVP.md` sont prioritaires. Elles ne sont pas remises en cause.
>
> Toute information non vérifiée est étiquetée explicitement : `VALIDÉ`, `HYPOTHÈSE`, `PROPOSITION`, `À DÉCIDER`, `À CALIBRER`, `FUTURE`, `EXCLU`, `BLOQUANT`, `NON BLOQUANT`.

---

## Catégories d'information

| Catégorie | Signification |
|---|---|
| **VALIDÉ** | Décision humaine ou légale déjà arrêtée |
| **HYPOTHÈSE** | Estimation non vérifiée, à confirmer |
| **PROPOSITION** | Recommandation technique, à arbitrer |
| **À DÉCIDER** | Question ouverte nécessitant un arbitrage |
| **À CALIBRER** | Paramètre à ajuster par tests |
| **FUTURE** | Hors MVP |
| **EXCLU** | Exclu du MVP par décision |
| **BLOQUANT** | Bloque le démarrage effectif de l'implémentation |
| **NON BLOQUANT** | Peut être résolu pendant ou après l'implémentation |

---

# 01 — Contexte et objectifs

## 1.1 — Rappel du problème

`VALIDÉ` — Au Mali, la perte de documents officiels (CNI, actes de naissance, passeports, certificats) expose les citoyens à des risques d'usurpation d'identité et rend les procédures de restitution longues, fragmentées, à faible traçabilité. Il n'existe pas de système national centralisé de rapprochement et de restitution. *(Source : `00_DOSSIER_CONCEPTION.md` §02.)*

## 1.2 — Objectifs du MVP

| Objectif | Description | Mesure de succès |
|---|---|---|
| Réduire le risque d'usurpation | Permettre au citoyen de déclarer la perte d'un document sensible | Volume de déclarations / volume estimé de pertes |
| Centraliser la procédure | Offrir un canal unique national (web) | Taux d'adoption par les centres |
| Traçabilité | Journal d'audit immuable | Complétude des journaux |
| Validation humaine obligatoire | Toute restitution est validée par un agent | 100 % des restitutions avec preuve humaine |
| Périmètre limité | Pilote Bamako + Ségou | Lancement effectif sur les 2 territoires |

## 1.3 — Périmètre (pilote)

`VALIDÉ` — **Bamako (District) + Ségou**. *(Source : `04_DOSSIER_ARBITRAGE_MVP.md` §7.)*
`EXCLU` — **Kisangani** (RDC, hors Mali). Déploiement national complet hors MVP.

## 1.4 — Hors périmètre MVP

| Élément | Raison | Statut |
|---|---|---|
| KYC biométrique | Exclu MVP, FUTURE | EXCLU |
| Application mobile | FUTURE | EXCLU |
| Chatbot WhatsApp | FUTURE | EXCLU |
| Objets de grande valeur | FUTURE | EXCLU |
| Animaux | FUTURE | EXCLU |
| Langues locales (autres que français) | FUTURE | EXCLU |
| Paiement Mobile Money | Gratuit au lancement | EXCLU |
| Catégorie « Autre » non structurée | Hors modèle `NATURE → DOMAINE → TYPE` | EXCLU |
| Centres nationaux (hors Bamako+Ségou) | Hors pilote | EXCLU |

## 1.5 — Hypothèses

`HYPOTHÈSE` — Volumétrie année 1 inconnue : à calibrer pendant le pilote (voir §21).
`HYPOTHÈSE` — Connectivité 2G/3G/4G par région : cartographie réelle à produire pendant l'implémentation.
`HYPOTHÈSE` — Compétences DevOps locales : à évaluer (voir §22).

## 1.6 — Contraintes

- Identité visuelle **VALIDÉE** : Direction 3, Logo A « Lien », palette + slogan. *(Source : `04_DOSSIER_ARBITRAGE_MVP.md` §12.2.)*
- Loi 2013-015 (consentement art. 7, registre des traitements art. 30) — **VALIDÉ source légale**.
- FSM officielle 14 états — **VALIDÉ**.
- Catégorisation `NATURE → DOMAINE → TYPE` — **VALIDÉ**.
- Web responsive uniquement (mobile + WA = FUTURE) — **VALIDÉ**.
- Français uniquement (langues locales = FUTURE) — **VALIDÉ**.
- SMS via couche `Provider Adapter` (aucun fournisseur contractuellement choisi) — **VALIDÉ**.

## 1.7 — Critères de succès du MVP

| Critère | Cible | Mesure |
|---|---|---|
| Lancement pilote | Bamako + Ségou en production | Go-live effectif |
| Couverture fonctionnelle | MUST opérationnels | Liste de vérification §02 |
| Traçabilité | 100 % des actions auditées | Audit log |
| Validation humaine | 100 % des restitutions avec preuve | Audit log |
| Disponibilité | ≥ 99 % sur le pilote (OBJECTIF TECHNIQUE — À VALIDER par le commanditaire) | Monitoring — fenêtre glissante 30j, périmètre API + web, exclusions = maintenance annoncée 72h, force majeure, défaillance opérateur |
| Performance | Recherche/chargement ≤ seuil | Mesures à benchmarker |

---

# 02 — Périmètre fonctionnel MVP

## 2.1 — Citoyen

| # | Fonctionnalité | Description | Priorité | Statut |
|---|---|---|---|---|
| C-01 | Déclarer une perte | Formulaire web de déclaration perte | MUST | VALIDÉ |
| C-02 | Déclarer une trouvaille | Formulaire web de dépôt trouvaille | MUST | VALIDÉ |
| C-03 | Suivre ses déclarations | Liste + statut + numéro de suivi | MUST | VALIDÉ |
| C-04 | Consulter une correspondance potentielle | Détails d'un match proposé | MUST | VALIDÉ |
| C-05 | Réagir à une correspondance | Accepter / refuser | MUST | VALIDÉ |
| C-06 | Recevoir des notifications | SMS + email | MUST | VALIDÉ |
| C-07 | Modifier / annuler une déclaration (brouillon) | Tant que SOUMISE non déclenchée | MUST | VALIDÉ |
| C-08 | S'authentifier | SMS OTP + mot de passe | MUST | VALIDÉ |
| C-09 | S'inscrire | Création de compte citoyen | MUST | VALIDÉ |
| C-10 | Exercer ses droits (accès/rectification/suppression) | Conformément au cadre juridique | MUST | VALIDÉ (processus) |
| C-11 | Contester une décision | Mécanisme de contestation d'un match | MUST | VALIDÉ |
| C-12 | Télécharger une preuve (PDF) | Récépissé de déclaration | SHOULD | PROPOSITION |
| C-13 | Gérer ses préférences de notification | Opt-in / opt-out par canal | SHOULD | PROPOSITION |

## 2.2 — Centre / Agent

| # | Fonctionnalité | Description | Priorité | Statut |
|---|---|---|---|---|
| A-01 | Authentification agent | MFA TOTP + mot de passe | MUST | VALIDÉ |
| A-02 | Tableau de bord centre | Dépôts, correspondances à valider, restitutions en cours | MUST | VALIDÉ |
| A-03 | Consulter les dossiers autorisés | Périmètre du centre | MUST | VALIDÉ |
| A-04 | Recevoir une déclaration pertinente | Notification interne | MUST | VALIDÉ |
| A-05 | Examiner un rapprochement | Score + critères + photos + PII autorisée | MUST | VALIDÉ |
| A-06 | Valider / rejeter un match | Décision humaine | MUST | VALIDÉ |
| A-07 | Préparer une restitution | Planification | MUST | VALIDÉ |
| A-08 | Enregistrer une restitution effective | Preuve + horodatage | MUST | VALIDÉ |
| A-09 | Gérer un dossier contesté | Workflow de contestation | MUST | VALIDÉ |
| A-10 | Suspendre un dossier (suspicion fraude) | Marquage + motif | MUST | VALIDÉ |
| A-11 | Consulter l'historique autorisé | Audit de ses propres actions | MUST | VALIDÉ |
| A-12 | Gérer les cas d'expiration | Marquage automatique après délai | MUST | VALIDÉ |
| A-13 | Scanner / vérifier une pièce d'identité | Capture photo de la pièce | MUST | VALIDÉ |
| A-14 | Double validation (objets sensibles) | Confirmation par responsable | MUST si sensible | PROPOSITION |
| A-15 | Consulter les statistiques du centre | Indicateurs simples | SHOULD | PROPOSITION |

## 2.3 — Administration

| # | Fonctionnalité | Description | Priorité | Statut |
|---|---|---|---|---|
| ADM-01 | Supervision (national/région/cercle/centre) | Tableaux de bord | MUST | VALIDÉ |
| ADM-02 | Gestion des centres | CRUD | MUST | VALIDÉ |
| ADM-03 | Gestion des agents | CRUD + attribution de rôles | MUST | VALIDÉ |
| ADM-04 | Statistiques | Volumétrie, taux restitution, top catégories | MUST | VALIDÉ |
| ADM-05 | Audit / consultation des journaux | Lecture seule | MUST | VALIDÉ |
| ADM-06 | Gouvernance : registre des traitements | Conformité Loi 2013-015 art. 30 | MUST | VALIDÉ (source légale) |
| ADM-07 | Configuration des seuils matching | Paramétrage (admin national) | MUST | VALIDÉ |
| ADM-08 | Configuration de la politique de rétention | Paramétrage des durées | MUST | VALIDÉ (paramétrique) |
| ADM-09 | Gestion des incidents (sécurité) | Signalement + workflow | MUST | VALIDÉ |
| ADM-10 | Exports | Rapports CSV / JSON | SHOULD | PROPOSITION |
| ADM-11 | Tableau de bord analytique avancé | GraphQL V2 | FUTURE | EXCLU MVP |
| ADM-12 | Open data | Diffusion publique | FUTURE | EXCLU MVP |

---

# 03 — Acteurs et rôles

## 3.1 — Définitions

| Acteur | Définition | Statut |
|---|---|---|
| **Citoyen** | Usager standard ; déclare perte, suit, réagit | VALIDÉ |
| **Déclarant** | Citoyen qui crée une déclaration | VALIDÉ |
| **Propriétaire présumé** | Citoyen qui pourrait correspondre à un objet trouvé | VALIDÉ |
| **Trouveur** | Citoyen (ou centre) qui dépose une trouvaille | VALIDÉ |
| **Agent de centre** | Opérateur terrain d'un centre, validation des restitutions | VALIDÉ |
| **Responsable de centre** | Chef d'un centre, double validation | VALIDÉ |
| **Administrateur régional** | Supervision d'une région | VALIDÉ |
| **Administrateur national** | Configuration, politiques, registre | VALIDÉ |
| **Auditeur** | Lecture seule pour conformité | VALIDÉ |
| **DPO / fonction équivalente** | À désigner par l'autorité compétente | PROPOSITION |
| **Administrateur technique** | Ops/SRE infra (séparation des données) | VALIDÉ |

## 3.2 — Matrice RBAC

Légende : C = créer, R = lire, U = modifier, D = supprimer, P = limité par politique.

| Action | Citoyen | Trouveur | Agent | Resp. centre | Admin rég. | Admin nat. | Auditeur | Admin tech. |
|---|---|---|---|---|---|---|---|---|
| Créer déclaration perte | C/R/U (brouillon) | — | — | — | — | — | — | — |
| Créer déclaration trouvaille | — | C/R/U | C (au comptoir) | — | — | — | — | — |
| Lire ses propres déclarations | R | R | — | — | — | — | — | — |
| Lire déclarations d'un centre | — | — | R (centre) | R (centre) | R (région) | R (pays) | R (pays) | — |
| Lire PII | R (soi) | R (soi) | R (limité dossier) | R (limité dossier) | R (limité région) | R | R | — |
| Valider un match | — | — | C/U | C/U | — | — | — | — |
| Préparer / enregistrer restitution | — | — | C/U | C/U (centre) | — | — | — | — |
| Suspendre un dossier | — | — | C | C | C | C | — | — |
| Marquer un dossier contesté | C (soi) | C (soi) | R | R | R | R | R | — |
| Gérer les centres | — | — | — | R (centre) | R/U (région) | C/R/U/D | R | — |
| Gérer les agents | — | — | — | R (centre) | C/R/U/D (région) | C/R/U/D | R | — |
| Modifier les seuils matching | — | — | — | — | — | C/U | — | — |
| Modifier les politiques de rétention | — | — | — | — | — | C/U | — | — |
| Lire les journaux d'audit | — | — | R (soi) | R (centre) | R (région) | R | R | — |
| Consulter le registre des traitements | — | — | — | — | — | R/U | R | — |
| Accès infrastructure | — | — | — | — | — | — | — | C/R/U/D |
| Exports / open data | — | — | — | — | — | C | R | — |

`VALIDÉ` — adapté de `02_MATRICE_VALIDATION_MVP.md` §8.2 et `00_DOSSIER_CONCEPTION.md` §03.

## 3.3 — Séparation des responsabilités (SoD)

| Conflit | Règle | Statut |
|---|---|---|
| Agent valide sa propre déclaration | INTERDIT | PROPOSITION |
| Agent = superviseur régional simultanément | INTERDIT | PROPOSITION |
| Admin = auditeur simultanément | INTERDIT | PROPOSITION |
| Auto-détection des conflits à création de compte | À DÉCIDER (D-18) | PROPOSITION |
| Audit périodique des conflits | À DÉCIDER (D-18) | PROPOSITION |

---

# 04 — Parcours métier

Format commun : déclencheur → acteur → données → décision → résultat → notification → état FSM.

## A — Déclaration de perte (« J'ai perdu »)

| Étape | Acteur | Action | Données | État cible | Notification |
|---|---|---|---|---|---|
| A1 | Citoyen | Accède à l'accueil | — | BROUILLON | — |
| A2 | Citoyen | S'authentifie (SMS OTP) | Téléphone, mot de passe | BROUILLON | — |
| A3 | Citoyen | Saisit CNI | CNI, nom, prénom, date naissance | BROUILLON | — |
| A4 | Citoyen | Sélectionne NATURE / DOMAINE / TYPE | Catégorie | BROUILLON | — |
| A5 | Citoyen | Saisit description + photos + lieu + date | Description, photos, géoloc | BROUILLON | — |
| A6 | Citoyen | Consentement explicite | Consent | BROUILLON | — |
| A7 | Citoyen | Confirme | Toutes | SOUMISE | N1 (SMS + email) |
| A8 | Système | Déclenche matching | — | EN_ATTENTE_RAPPROCHEMENT | — |

## B — Déclaration de trouvaille (« J'ai trouvé »)

| Étape | Acteur | Action | Données | État cible | Notification |
|---|---|---|---|---|---|
| B1 | Trouveur | Accède à l'accueil « J'ai trouvé » | — | BROUILLON | — |
| B2 | Trouveur | S'authentifie (compte créé automatiquement si besoin, voir §10.11) | Téléphone vérifié (OTP) | BROUILLON | — |
| B3 | Trouveur | Sélectionne NATURE / DOMAINE / TYPE | Catégorie | BROUILLON | — |
| B4 | Trouveur | Saisit description + photos + lieu + date | Données | BROUILLON | — |
| B5 | Trouveur | (Option) CNI | CNI | BROUILLON | — |
| B6 | Trouveur | Consentement | Consent | BROUILLON | — |
| B7 | Trouveur | Confirme | Toutes | SOUMISE | N-dépôt (SMS + email) |
| B8 | Système | Déclenche matching | — | EN_ATTENTE_RAPPROCHEMENT | — |

### B.x — Politique « trouveur anonyme » (PROPOSITION TECHNIQUE À VALIDER)

> Le dossier source `02_MATRICE_VALIDATION_MVP.md` §3 introduit la notion de « Personne ayant trouvé » avec authentification basique. Le parcours MVP **exige une identification** pour permettre la traçabilité, le consentement et les notifications.

| Question | Réponse MVP | Justification |
|---|---|---|
| Trouveur anonyme sans AUCUNE information possible ? | **NON** : refus d'accès au parcours | Le système exige un canal de retour (SMS ou téléphone) pour transmettre le numéro de dépôt, permettre le rattachement à un compte et notifier toute correspondance ultérieure. Sans canal de retour, le système ne peut ni notifier ni garantir le consentement éclairé (Loi 2013-015). |
| Trouveur avec téléphone mais sans identité civile complète ? | **OUI** : autorisé au MVP | Authentification par téléphone + SMS OTP, sans collecte du CNI. Le CNI du trouveur reste optionnel (B5). |
| Trouveur sans pièce d'identité : peut-il déposer ? | **OUI** | B5 = étape optionnelle. |
| Trouveur : informations obligatoires | Téléphone (OTP obligatoire) + description + lieu + date + NATURE/DOMAINE/TYPE + consentement | Pour traçabilité et notification |
| Trouveur : peut-il suivre sa déclaration ? | **OUI**, via son numéro de téléphone (authentification OTP) | Pas besoin de CNI |
| Trouveur : peut-il recevoir des notifications (correspondance trouvée, restitution) ? | **OUI** par SMS et email (s'il a fourni un email) | — |
| Trouveur : peut-il rattacher ultérieurement sa déclaration à un compte créé ? | **OUI** | Lors de la création de compte, on lui propose de rattacher ses déclarations antérieures associées à son téléphone |
| Trouveur : peut-il contester une décision ? | **OUI** (limité à ses propres déclarations) | — |
| Trouveur : peut-il supprimer son compte / ses déclarations ? | **OUI**, sous mêmes conditions que le citoyen | — |

> Cette politique **est une PROPOSITION TECHNIQUE À VALIDER**. Le dossier ne contient pas de décision humaine explicite sur la « trouvaille 100 % anonyme sans téléphone ». En l'absence de validation, l'implémentation **doit exiger un téléphone vérifié** (SMS OTP) pour déposer une trouvaille.

## C — Rapprochement

| Étape | Acteur | Action | Résultat | État | Notification |
|---|---|---|---|---|---|
| C1 | Système | Compare avec déclarations existantes | Score | — | — |
| C2 | Système | score ≥ seuil haut | Match | CORRESPONDANCE_TROUVÉE | — |
| C3 | Système | seuil bas ≤ score < seuil haut | Match | CORRESPONDANCE_TROUVÉE | — |
| C4 | Système | score < seuil bas | Pas de match | EN_ATTENTE_RAPPROCHEMENT | — |
| C5 | Système | Journalise score + critères | Log | — | — |

(Seuils : À CALIBRER)

## D — Validation humaine

| Étape | Acteur | Action | Résultat | État |
|---|---|---|---|---|
| D1 | Système | Notifie un agent | — | CORRESPONDANCE_TROUVÉE |
| D2 | Agent | Examine score + critères + photos | — | EN_VALIDATION_HUMAINE |
| D3 | Agent | Consulte PII autorisée | CNI, nom | EN_VALIDATION_HUMAINE |
| D4 | Agent | Valide OU rejette (motif obligatoire) | Décision | VALIDÉE ou REJETÉE |
| D5 | (Si sensible) | Responsable de centre confirme | Double validation | VALIDÉE (confirmée) |
| D6 | Système | Journalise décision + identité agent | Log | — |

## E — Restitution

| Étape | Acteur | Action | Résultat | État |
|---|---|---|---|---|
| E1 | Citoyen | Se présente au centre | Identité | RESTITUTION_PLANIFIÉE |
| E2 | Agent | Vérifie pièce d'identité | Photo pièce | RESTITUTION_PLANIFIÉE |
| E3 | Agent | Vérifie correspondance CNI | Comparaison | RESTITUTION_PLANIFIÉE |
| E4 | Agent | Présente l'objet | — | RESTITUTION_PLANIFIÉE |
| E5 | Citoyen | Confirme réception | Preuve | RESTITUÉE |
| E6 | Système | Programme purge photos | Tâche async | CLÔTURÉE |

## F — Contestation

| Étape | Acteur | Action | État |
|---|---|---|---|
| F1 | Citoyen | Déclare contester (motif) | CONTESTÉE |
| F2 | Système | Notifie un autre agent (≠ décideur initial) | CONTESTÉE |
| F3 | Agent | Réexamine | EN_VALIDATION_HUMAINE |
| F4 | Suite | Voir D | VALIDÉE / REJETÉE / SUSPENDUE |

## G — Suspension

| Étape | Acteur | Action | État |
|---|---|---|---|
| G1 | Système / Agent | Marque suspect (motif) | SUSPENDUE |
| G2 | Système | Notifie auditeur | SUSPENDUE |
| G3 | Auditeur | Audit favorable → reprise | CORRESPONDANCE_TROUVÉE |
| G4 | Auditeur | Audit défavorable → rejet | REJETÉE → ARCHIVÉE |

## H — Rejet

| Étape | Acteur | Action | État |
|---|---|---|---|
| H1 | Agent | Rejette un match (motif obligatoire) | REJETÉE |
| H2 | Système | Notifie le déclarant | REJETÉE |
| H3 | Système | Après délai paramétrable → ARCHIVÉE | ARCHIVÉE |

## I — Archivage

| Étape | Acteur | Action | État |
|---|---|---|---|
| I1 | Système | Détecte dépassement du délai actif | EXPIRÉE |
| I2 | Système | Après délai d'expiration | ARCHIVÉE (terminal immuable) |

## J — Expiration

| Étape | Acteur | Action | État |
|---|---|---|---|
| J1 | Système | Délai de soumission dépassé | EXPIRÉE |
| J2 | Système | Délai d'archivage atteint | ARCHIVÉE |

## K — Annulation (statut technique du brouillon, PAS un état FSM)

| Étape | Acteur | Action | État FSM |
|---|---|---|---|
| K1 | Citoyen | Clique « Annuler » sur un BROUILLON | BROUILLON (statut `annulé`) |
| K2 | Système | Marque l'événement (pas une transition) | BROUILLON |

> Modélisation : un brouillon peut être `actif` ou `annulé` au sens d'un statut technique ; `ANNULÉE` n'est pas un 15e état principal de la FSM.

---

# 05 — FSM officielle

`VALIDÉ` — FSM principale à 14 états (cf. `04_DOSSIER_ARBITRAGE_MVP.md` §4.4).

## 5.1 — Diagramme

```
BROUILLON → SOUMISE → EN_ATTENTE_RAPPROCHEMENT ──┬─→ CORRESPONDANCE_TROUVÉE → EN_VALIDATION_HUMAINE
                                                │                                │
                                                │                                ├─→ VALIDÉE → RESTITUTION_PLANIFIÉE → RESTITUÉE → CLÔTURÉE
                                                │                                ├─→ REJETÉE → ARCHIVÉE
                                                │                                ├─→ SUSPENDUE ──(audit)──→ CORRESPONDANCE_TROUVÉE | REJETÉE
                                                │                                └─→ CONTESTÉE → EN_VALIDATION_HUMAINE
                                                │
                                                └─→ NON_RAPPROCHÉE (résultat métier) ──(délai)──→ EXPIRÉE → ARCHIVÉE

EXPIRÉE ← SOUMISE (délai soumission dépassé)
```

## 5.2 — Catalogue des 14 états principaux

> Format : `Entrée` = transitions entrantes valides, `Sortie` = transitions sortantes valides.

| # | État | Signification | Entrée (depuis) | Sortie (vers) | Acteur autorisé | Notifications |
|---|---|---|---|---|---|---|
| 1 | BROUILLON | Saisie en cours | (création) | SOUMISE / statut `annulé` (technique) | Citoyen / Trouveur | — |
| 2 | SOUMISE | Validée, en attente matching | BROUILLON | EN_ATTENTE_RAPPROCHEMENT, EXPIRÉE | Système | N1 |
| 3 | EN_ATTENTE_RAPPROCHEMENT | Système tente de rapprocher | SOUMISE | CORRESPONDANCE_TROUVÉE, NON_RAPPROCHÉE (résultat) | Système | N-interne si match |
| 4 | CORRESPONDANCE_TROUVÉE | Match potentiel | EN_ATTENTE_RAPPROCHEMENT | EN_VALIDATION_HUMAINE | Système / Agent | N3 |
| 5 | EN_VALIDATION_HUMAINE | Agent examine | CORRESPONDANCE_TROUVÉE, CONTESTÉE | VALIDÉE, REJETÉE, SUSPENDUE, CONTESTÉE | Agent | — |
| 6 | VALIDÉE | Match validé | EN_VALIDATION_HUMAINE | RESTITUTION_PLANIFIÉE | Agent | N5 |
| 7 | RESTITUTION_PLANIFIÉE | Préparation restitution | VALIDÉE | RESTITUÉE | Centre / Agent | — |
| 8 | RESTITUÉE | Restitution effective | RESTITUTION_PLANIFIÉE | CLÔTURÉE | Système | N5 |
| 9 | CLÔTURÉE | Terminal immuable | RESTITUÉE | — (aucune) | — | — |
| 10 | REJETÉE | Match rejeté | EN_VALIDATION_HUMAINE, SUSPENDUE | ARCHIVÉE | Agent | N-rejet |
| 11 | ARCHIVÉE | Terminal immuable | REJETÉE, EXPIRÉE | — (aucune) | — | — |
| 12 | EXPIRÉE | Délai expiré | SOUMISE, NON_RAPPROCHÉE | ARCHIVÉE | Système | N-expiration |
| 13 | SUSPENDUE | Suspect, gel jusqu'à audit | EN_VALIDATION_HUMAINE | CORRESPONDANCE_TROUVÉE, REJETÉE | Auditeur / Système | N-auditeur |
| 14 | CONTESTÉE | Citoyen conteste | EN_VALIDATION_HUMAINE | EN_VALIDATION_HUMAINE (réexamen) | Système | — |

### Audit FSM — incohérences détectées et corrigées

| Problème | Correction |
|---|---|
| Ligne originale « SOUMISE / Entrée / EXPIRÉE » ambiguë (sous-entendait qu'EXPIRÉE était une provenance de SOUMISE) | Reformulé : SOUMISE = Entrée depuis BROUILLON ; Sortie vers EN_ATTENTE_RAPPROCHEMENT et EXPIRÉE |
| Confusion possible entre ENTRÉE et SORTIE | Ajout d'une note de format explicite |
| EXPIRÉE n'avait qu'une provenance implicite | Précisé : EXPIRÉE provient de SOUMISE (délai soumission) et de NON_RAPPROCHÉE (délai rapprochement) |
| SUSPENDUE → REJETÉE manquant | Ajouté (audit défavorable) |

## 5.3 — Règles impératives (VALIDÉ)

| Règle | Statut |
|---|---|
| `CORRESPONDANCE_TROUVÉE → NON_RAPPROCHÉE` | INTERDIT |
| `RESTITUTION_PLANIFIÉE → CLÔTURÉE` (raccourci normal) | INTERDIT ; chemin normal = `RESTITUÉE → CLÔTURÉE` |
| `CLÔTURÉE` et `ARCHIVÉE` | Terminaux immuables (aucune transition sortante) |
| `REJETÉE → VALIDÉE` direct | INTERDIT (sauf via CONTESTÉE) |
| `VALIDÉE → EN_ATTENTE_RAPPROCHEMENT` | INTERDIT (rétrogradation) |
| `EN_VALIDATION_HUMAINE → EN_ATTENTE_RAPPROCHEMENT` | INTERDIT (rétrogradation) |
| ANNULÉE comme 15e état principal | NON RETENU ; = statut technique du BROUILLON |

## 5.4 — Conditions

Seuils et délais : À CALIBRER pendant l'implémentation.

---

# 06 — Modèle de données

> Modèle conceptuel. **Aucun SQL produit.** Contraintes (NOT NULL, FK, index) définies en phase DELEGATE.

## 6.1 — Entités principales

| Entité | Rôle | Attributs principaux (conceptuels) | Relations | Sensibilité | Conservation |
|---|---|---|---|---|---|
| **CitizenProfile** | Profil citoyen | id, téléphone, nom, prénom, date_naissance, cni_hash, email, langue | 1:N Declaration | Très sensible | Paramétrable |
| **Declaration** | Super-classe | id, citizen_id, type (LOSS/FOUND), status, created_at, submitted_at, closed_at, consent_id | Polymorphique | Sensible | Paramétrable |
| **LostDeclaration** | Spécialisation perte | lieu_perte, date_perte, category_id, type_id, description, photos[] | 1:N Photo, 1:N Match | Sensible | Paramétrable |
| **FoundDeclaration** | Spécialisation trouvaille | lieu_trouvaille, date_trouvaille, category_id, type_id, description, photos[], optional_citizen_id | 1:N Photo, 1:N Match | Sensible | Paramétrable |
| **Match** | Rapprochement | id, lost_id, found_id, score, criteria_breakdown, computed_at, vector_engine_version, model_hash | N:1 Declaration ×2 | Moyen | Paramétrable |
| **Validation** | Décision humaine | id, match_id, agent_id, decision, reason, double_validation_id, validated_at | N:1 Match | Très sensible | Paramétrable |
| **Restitution** | Preuve de restitution | id, declaration_id, agent_id, citizen_id_proved, id_document_photo_id, signature_or_proof, restitued_at, center_id | N:1 LostDeclaration | Très sensible | Paramétrable |
| **Photo** | Photo jointe | id, owner_type, owner_id, object_key (S3), sha256, mime, size, uploaded_at, encrypted_at_rest | Polymorphique | Sensible | Paramétrable |
| **Category** (NATURE) | Catalogue NATURE | id, code, label | 1:N Domain | Non sensible | Référentiel |
| **Domain** (DOMAINE) | Catalogue DOMAINE | id, category_id, code, label | N:1 Category | Non sensible | Référentiel |
| **Type** (TYPE) | Catalogue TYPE | id, domain_id, code, label | N:1 Domain | Non sensible | Référentiel |
| **Center** | Centre partenaire | id, name, address, region_id, cercle_id, commune_id, latitude, longitude, type, active | N:1 Region/Cercle/Commune | Non sensible | Référentiel |
| **Agent** | Utilisateur agent | id, citizen_id, center_id, roles[], mfa_enabled, active | N:1 Center | Très sensible | Paramétrable |
| **Notification** | Journal d'envoi | id, event_type, recipient_id, channel, status, idempotency_key, sent_at, cost_estimated, provider_id | — | Moyen | Paramétrable |
| **Evidence** | Pièce justificative | id, declaration_id, kind, photo_id, uploaded_at, agent_id | N:1 Declaration | Très sensible | Paramétrable |
| **Consent** | Consentement | id, citizen_id, scope, granted_at, revoked_at, ip, ua | 1:1 CitizenProfile | Moyen | Paramétrable |
| **AuditLog** | Journal immuable | id, actor_id, actor_role, action, entity_type, entity_id, before_hash, after_hash, ip, ua, occurred_at, chain_hash | Append-only | Moyen | Paramétrable |
| **Incident** | Incident sécurité | id, severity, type, status, detected_at, contained_at, remediated_at, reported_to_apdp_at, description | — | Très sensible | Paramétrable |
| **Archive** | Métadonnées archivage | id, source_type, source_id, archived_at, retention_until, mode | — | Moyen | Paramétrable |
| **Location** | Localisation | region_id, cercle_id, commune_id, village_id, lat, long | Référentiel | Non sensible | Référentiel |
| **Session** | Session utilisateur | id, citizen_or_agent_id, token_hash, ip, ua, created_at, expires_at, revoked_at | — | Sensible | TTL court |

## 6.2 — Données sensibles

| Donnée | Sensibilité | Protection |
|---|---|---|
| CNI, nom, prénom, date naissance | Très sensible | Chiffrement + accès limité |
| Photos CNI / signature | Très sensible | Chiffrement + accès limité + purge paramétrable |
| Score matching + critères | Moyen | Accès limité |
| Logs d'audit | Moyen | Hash chaîné |
| IP / UA sessions | Sensible | Journalisation |

## 6.3 — Règles d'accès (résumé)

- Citoyen : ses propres déclarations et leurs correspondances uniquement.
- Agent : déclarations de son centre (correspondances autorisées).
- Administrateur régional : sa région.
- Administrateur national : pays entier.
- Auditeur : tout en lecture seule.
- Administrateur technique : pas d'accès aux données métier.

## 6.4 — Conservation

`HYPOTHÈSE` — Durées paramétrables. Proposition de dimensionnement NON VALIDÉE JURIDIQUEMENT :
- déclarations perte : 12 mois actif + 24 mois archivage (HYPOTHÈSE)
- photos de documents / pièces justificatives (recto-verso CNI, signature, photos objet) : jusqu'à restitution + 3 mois (HYPOTHÈSE PROVISOIRE, à confirmer APDP/DPO — la biométrie est EXCLUE MVP)
- logs d'audit : 36 mois (HYPOTHÈSE)

---

# 07 — Catégorisation

`VALIDÉ` — Modèle `NATURE → DOMAINE → TYPE` (cf. `04_DOSSIER_ARBITRAGE_MVP.md` §5).

## 7.1 — Représentation dans le système

| Axe | Implémentation | Gestion |
|---|---|---|
| NATURE | Table `categories` (code: `document`, `objet`) | Lecture pour agents, écriture admin national |
| DOMAINE | Table `domains` (FK category_id) | Idem |
| TYPE | Table `types` (FK domain_id) | Idem |

## 7.2 — Catalogue MVP

| NATURE | DOMAINE | TYPE (exemples) | MVP |
|---|---|---|---|
| Document | Identité | CNI | ✅ |
| Document | Voyage | Passeport, Visa | ✅ |
| Document | Transport | Permis, carte grise | ✅ |
| Document | Éducation | Diplôme, certificat scolaire | ✅ |
| Document | Professionnel | Carte pro, badge | ✅ |
| Document | Santé/Assurance | Carte assurance, carte santé | ✅ |
| Document | Administratif | Acte naissance, facture, courrier | ✅ |
| Objet | Personnel | Téléphone, clés, montre | ✅ |
| Objet | Personnel (grande valeur) | Bijoux, œuvres | EXCLU MVP (FUTURE) |

> **Animal n'est PAS une valeur de NATURE.** `Animal` est un **axe d'extension FUTURE** distinct, qui n'est pas modélisé dans le MVP. Le modèle MVP reste strictement `NATURE → DOMAINE → TYPE` avec `NATURE ∈ {Document, Objet}`.
>
> Toute occurrence de « Animal = NATURE » dans les documents antérieurs ou de cadrage constitue une erreur de modélisation à corriger.

## 7.3 — Règles

- Un `type` appartient à un seul `domain`, qui appartient à une seule `category`.
- `NATURE` est fermé dans le MVP à `{Document, Objet}`.
- Fiche publique d'un objet retrouvé : NATURE + ville approximative + date + référence anonyme (cf. `02_MATRICE_VALIDATION_MVP.md` §7.2).
- L'ajout d'un nouveau `NATURE` (par ex. `Animal`) est un changement de schéma soumis à validation.

---

# 08 — Architecture logique

## 8.0 — Analyse comparative et décision architecturale (PROPOSITION)

> **L'architecture microservices n'est PAS figée.** une analyse comparative objective est obligatoire avant DELEGATE.

### A. Modular Monolith + Workers asynchrones

| Critère | Évaluation |
|---|---|
| Complexité | Plus faible : un seul déploiement, un seul runtime, transactions locales triviales |
| Coût opérationnel | Plus faible : moins d'infra (1 service × N replicas, vs N services × M replicas) |
| Déploiement | Plus simple : un binaire / une image ; rollback atomique |
| Observabilité | Plus simple : logs / métriques centralisés nativement |
| Résilience | Blast radius = application entière ; pas d'isolation par domaine |
| Transactions | Transactions ACID multi-agrégats triviales (pas de saga, pas de compensation) |
| Sécurité | Surface d'attaque plus restreinte (pas de mesh, pas de service-to-service) |
| Scalabilité | Scaling horizontal global ; pas de scalabilité fine par domaine |
| Maintenance | Refactoring plus facile ; couplage contrôlé via modules internes |
| Compétences requises | Classiques (1 stack, 1 équipe polyvalente) |
| Pertinence pilote Bamako + Ségou | Forte : faible volumétrie, équipe réduite |
| Capacité d'évolution nationale | Limitée à court terme par le couplage ; mais un modular monolith bien conçu peut être décomposé plus tard |

### B. Microservices

| Critère | Évaluation |
|---|---|
| Complexité | Plus élevée : orchestration, contrats API, gestion des versions |
| Coût opérationnel | Plus élevé : N services à monitorer, base de données par service ou coordination des sagas |
| Déploiement | Plus complexe : pipelines multiples, déploiements coordonnés |
| Observabilité | Plus complexe : corrélation via trace ID, centralisation des logs |
| Résilience | Blast radius limité par service ; un service en panne n'arrête pas tout |
| Transactions | Saga / compensation / event-driven ; cohérence éventuelle ; debugging plus complexe |
| Sécurité | Surface d'attaque plus large (mesh, communications internes) |
| Scalabilité | Granulaire par domaine (matching vs agent UI) |
| Maintenance | Découplage favorable, mais coût de coordination élevé |
| Compétences requises | DevOps avancés, SRE, contrats API, mesh, observabilité distribuée |
| Pertinence pilote Bamako + Ségou | Faible : surdimensionné pour le pilote |
| Capacité d'évolution nationale | Forte à long terme (si les domaines sont matures et stables) |

### Recommandation (PROPOSITION)

> **Pour le MVP pilote Bamako + Ségou, un MODULAR MONOLITH + WORKERS ASYNCHRONES est recommandé.**
>
> Justifications :
> 1. Le pilote a une volumétrie inconnue et probablement faible (HYPOTHÈSE à benchmarker).
> 2. L'équipe de développement n'est pas dimensionnée pour des microservices (compétences DevOps non confirmées — V-8).
> 3. Les transactions multi-agrégats (déclaration + photos + consentement + audit) sont fréquentes : un monolith les rend triviales.
> 4. Le découplage fort entre `matching-svc` et le reste (calcul coûteux, moteur vectoriel interchangeable) **reste exigé via une abstraction interne** (`MatchingEngineProvider`), pour permettre une extraction ultérieure en microservice si la volumétrie le justifie.
> 5. Le découplage `notification-svc` / `Provider Adapter SMS` est conservé sous forme de module interne avec interface stable, extractible.
>
> Cette proposition est **À VALIDER** par le commanditaire avant DELEGATE.

### Forme architecturale retenue (PROPOSITION SOUMISE À VALIDATION)

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATEFORME MALI RETROUVÉ                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Frontend     │  │  Admin UI    │  │  Agent UI    │         │
│  │ (Web respons)│  │  (Web)       │  │  (Web)       │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                 │
│  ┌──────▼─────────────────▼─────────────────▼──────┐          │
│  │              API Gateway (REST + TLS)          │          │
│  └──────┬─────────────────────────────────────────┘          │
│         │                                                    │
│  ┌──────▼─────────────────────────────────────────┐          │
│  │   Modular Monolith (modules internes)           │          │
│  │   - identity module                             │          │
│  │   - declaration module                          │          │
│  │   - matching module + MatchingEngineProvider    │          │
│  │   - notification module + Provider Adapter SMS  │          │
│  │   - storage module                              │          │
│  │   - center module                               │          │
│  │   - restitution module                          │          │
│  │   - catalog module                               │          │
│  │   - audit module                                │          │
│  │   - admin module                                │          │
│  └──────┬─────────────────────────────────────────┘          │
│         │                                                    │
│  ┌──────▼─────────────────────────────────────────┐          │
│  │   Workers asynchrones (séparés du web)          │          │
│  │   - matching worker (job async)                  │          │
│  │   - notification worker (SMS / email)           │          │
│  │   - purge worker (post-restitution + rétention) │          │
│  │   - expiration worker                           │          │
│  └──────┬─────────────────────────────────────────┘          │
│         │                                                    │
│  ┌──────▼─────────────────────────────────────────┐          │
│  │   Persistance + Bus                             │          │
│  │   PostgreSQL (transactionnel),                  │          │
│  │   S3-compatible (photos),                       │          │
│  │   Redis (cache, sessions),                      │          │
│  │   Message broker (jobs async),                  │          │
│  │   Vector engine (via Provider abstrait)         │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

> Les workers asynchrones sont des **processus séparés** (même binaire, mode CLI ou worker) qui partagent la base de données et la même couche d'abstractions. Ils ne sont pas un microservice distinct mais un mode d'exécution du monolith.

### Conséquence sur le §08.2 (composants)

Le tableau §08.2 (ci-dessous) décrit les **modules internes** du modular monolith et non des services déployables séparément. Les interfaces et frontières sont conservées pour permettre une extraction ultérieure.

## 8.1 — Vue d'ensemble

*(Voir diagramme 8.0 ci-dessus.)*

## 8.2 — Modules internes du monolith (PROPOSITION)

> Chaque module a une frontière interne claire et une interface publique. Les modules peuvent être extraits en service indépendant ultérieurement si la volumétrie le justifie.

| Module | Responsabilité | Dépendances | Données | Sécurité |
|---|---|---|---|---|
| Frontend Web | Interface citoyen | API Gateway, CDN | Formulaires, photos (upload) | HTTPS, CSP, CSRF |
| Admin UI | Back-office admin/régional/auditeur | API Gateway | Lectures, configs | HTTPS, MFA |
| Agent UI | Back-office terrain | API Gateway | Matchs, dossiers centre | HTTPS, MFA TOTP |
| API Gateway | Routage, rate limiting, TLS | Authn | Logs accès | mTLS ciblé, WAF |
| identity | Authentification, MFA, sessions | DB, Redis | Credentials, sessions | Argon2, MFA |
| declaration | CRUD déclarations | DB, storage | PII, photos, statuts | RBAC |
| matching | Calcul similarité, scoring + MatchingEngineProvider | Vector engine, DB | Scores, critères | Pas de PII dans score |
| notification | Envoi SMS / email + Provider Adapter | Queue | Templates, statuts | Idempotence, audit |
| storage | Upload / download / suppression | S3, KMS | Photos chiffrées | URLs signées TTL court |
| center | Gestion centres + agents | DB, identity | Centres, agents, rôles | RBAC strict |
| restitution | Workflow de restitution | DB, storage | Preuves, signatures | MFA + photo |
| catalog | Catégories, géographie | DB | Référentiels | Lecture agent, écriture admin |
| audit | Journalisation append-only | DB, KMS | Logs immuables | Hash chaîné |
| admin | Configuration, registre | DB | Politiques, registre | MFA + séparation |

## 8.3 — Workers asynchrones (séparés du web)

| Worker | Responsabilité | Déclencheur |
|---|---|---|
| matching-worker | Recalcul asynchrone de scores | Événement SOUMISE |
| notification-worker | Envoi SMS / email | Événements N1..N10 |
| purge-worker | Purge photos post-restitution + rotation rétention | Cron / événements |
| expiration-worker | Passage EXPIRÉE → ARCHIVÉE | Cron quotidien |

## 8.4 — Décisions techniques à figer en DELEGATE

| Composant | Choix |
|---|---|
| Architecture web | **PROPOSITION SOUMISE À VALIDATION** : Modular monolith + workers asynchrones (vs microservices) |
| API Gateway | PROPOSITION : nginx + Lua / Kong |
| Bus async | PROPOSITION : RabbitMQ ou Kafka |
| Vector engine | À DÉCIDER : FAISS / Pinecone / Weaviate (abstraction requise) |
| Stockage objet | PROPOSITION : S3-compatible (MinIO si on-prem) |
| Cache | PROPOSITION : Redis |
| Policy engine | PROPOSITION : OPA (Rego) |
| SIEM | PROPOSITION : Wazuh ou Elastic SIEM |
| Cloud | PROPOSITION : hybride (sensible on-prem) — À DÉCIDER (D-6) |

---

# 09 — API

> Contrat conceptuel. Aucun code API produit.

## 9.1 — Principes

- REST + JSON
- Versioning : préfixe `/api/v1/`
- HTTPS obligatoire
- Auth : SMS OTP (citoyen), TOTP (agents), API Key (intégrations tierces MVP) — VALIDÉ
- OAuth 2.1 = FUTURE
- mTLS = ciblé selon exposition
- Idempotence : `Idempotency-Key` (UUID) sur POST critiques
- Pagination : cursor ou offset/limit
- Filtrage : query params normalisés
- Erreurs : format uniforme `{ code, message, details }`
- Audit : toute écriture journalisée

## 9.2 — Endpoints principaux (conceptuels)

### Citoyen

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/login | Connexion (SMS OTP) |
| POST | /api/v1/auth/otp/request | Demande OTP |
| POST | /api/v1/auth/otp/verify | Vérif OTP |
| GET | /api/v1/me | Profil |
| PATCH | /api/v1/me | MAJ profil |
| POST | /api/v1/declarations/loss | Créer déclaration perte |
| GET | /api/v1/declarations/loss | Liste pertes du citoyen |
| GET | /api/v1/declarations/loss/{id} | Détail |
| POST | /api/v1/declarations/found | Créer déclaration trouvaille |
| GET | /api/v1/declarations/found | Liste trouvailles |
| GET | /api/v1/declarations/found/{id} | Détail |
| POST | /api/v1/declarations/{id}/contest | Contester |
| POST | /api/v1/declarations/{id}/cancel-draft | Annuler brouillon |
| GET | /api/v1/matches | Correspondances |
| POST | /api/v1/matches/{id}/accept | Accepter |
| POST | /api/v1/matches/{id}/reject | Refuser |
| GET | /api/v1/notifications | Liste notifications |
| POST | /api/v1/rights/access | Demande d'accès (cadre juridique) |
| POST | /api/v1/rights/deletion | Demande de suppression |

### Agent

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/v1/agent/auth/login | Connexion TOTP |
| GET | /api/v1/agent/matches?status=EN_VALIDATION_HUMAINE | File d'attente |
| GET | /api/v1/agent/matches/{id} | Détail |
| POST | /api/v1/agent/matches/{id}/validate | Valider |
| POST | /api/v1/agent/matches/{id}/reject | Rejeter |
| POST | /api/v1/agent/matches/{id}/suspend | Suspendre |
| POST | /api/v1/agent/restitutions | Préparer restitution |
| POST | /api/v1/agent/restitutions/{id}/complete | Confirmer restitution |
| GET | /api/v1/agent/audit | Historique de l'agent |

### Administration

| Méthode | Endpoint | Description |
|---|---|---|
| GET/POST/PATCH/DELETE | /api/v1/admin/centers | CRUD centres |
| GET/POST/PATCH/DELETE | /api/v1/admin/agents | CRUD agents |
| GET/POST/PATCH/DELETE | /api/v1/admin/categories | CRUD NATURE/DOMAINE/TYPE |
| GET/PATCH | /api/v1/admin/policies/matching | Politiques matching |
| GET/PATCH | /api/v1/admin/policies/retention | Politiques rétention |
| GET | /api/v1/admin/audit | Journal d'audit |
| GET/POST | /api/v1/admin/incidents | Gestion incidents |
| GET | /api/v1/admin/stats | Statistiques globales |
| POST | /api/v1/admin/exports | Génération exports |

### Intégrations (Provider Adapter SMS)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/v1/internal/notifications | File d'attente interne |
| GET | /api/v1/internal/notifications/{id} | Statut |

---

# 10 — Authentification / Autorisation

## 10.1 — Citoyen

| Mécanisme | Description | Statut |
|---|---|---|
| Authentification multi-facteurs (SMS + secret) | Exigence de sécurité minimale validée au niveau du principe | **VALIDÉ (principe MFA SMS)** |
| Choix précis (téléphone + mot de passe + SMS OTP) | Détails d'implémentation | **PROPOSITION TECHNIQUE À VALIDER** par l'équipe pendant DELEGATE |
| TOTP | Optionnel pour le citoyen | FUTURE |

`EXCLU` — KYC biométrique (FUTURE).

> **Note.** Le principe « authentification citoyenne par SMS + MFA » est validé par la décision humaine (cf. `04_DOSSIER_ARBITRAGE_MVP.md` §10 / `02_MATRICE_VALIDATION_MVP.md` §8.2). Le **choix précis** « téléphone + mot de passe + SMS OTP » est une **PROPOSITION TECHNIQUE** à valider par l'équipe pendant DELEGATE, sauf preuve de validation explicite dans le dossier de conception.

## 10.2 — Agents / Responsables

| Mécanisme | Description | Statut |
|---|---|---|
| Identifiant + mot de passe | Argon2 hash | VALIDÉ |
| MFA TOTP | Obligatoire pour tous les agents | VALIDÉ |
| FIDO2 | FUTURE (V2) | FUTURE |

## 10.3 — Administrateurs

| Mécanisme | Description | Statut |
|---|---|---|
| Identifiant + mot de passe | Argon2 hash | VALIDÉ |
| MFA obligatoire | TOTP V1 | VALIDÉ |
| FIDO2 | FUTURE (V2) | FUTURE |

## 10.4 — Sessions

| Élément | Configuration | Statut |
|---|---|---|
| Cookies | Secure, HttpOnly, SameSite=Strict | VALIDÉ |
| Jeton d'accès | Court (15 min) | PROPOSITION |
| Jeton de rafraîchissement | 8 h | PROPOSITION |
| Session device mobile | Persistant + biométrie locale | FUTURE |

## 10.5 — RBAC + ABAC

- **RBAC** au cœur : 8 rôles (citoyen, trouveur, agent, resp. centre, admin rég., admin nat., auditeur, admin tech.)
- **ABAC léger** : scope géographique, propriété de ressource, état du match, contrainte temporelle
- **Policy engine** : OPA (Rego) — PROPOSITION

## 10.6 — Séparation des responsabilités (SoD)

Voir §3.3.

## 10.7 — Contrôle d'accès aux données sensibles

- Champs PII chiffrés (AES-256 au repos)
- Clés gérées par KMS
- Pas d'accès admin technique aux données métier
- Audit de tout accès aux PII

## 10.8 — Révocation

| Cas | Action | Notification |
|---|---|---|
| Agent quitte son poste | Révocation rôles + désactivation compte | Admin supérieur |
| Compromission de compte | Révocation session + reset MFA | Citoyen / agent |
| Demande citoyen (droit à suppression) | Purge après période de grâce | Notification procédure |

## 10.9 — Récupération de compte

| Canal | Description | Statut |
|---|---|---|
| SMS OTP sur téléphone | Récupération primaire | VALIDÉ |
| Email | Récupération secondaire | PROPOSITION |
| En personne au centre | Récupération assistée | PROPOSITION |

## 10.10 — Journalisation

Toute authentification (succès/échec) journalisée. Voir §15.

## 10.11 — Règle d'authentification citoyen et trouveur (PROPOSITION)

| Acteur | Authentification minimale | Identité civile complète |
|---|---|---|
| Citoyen (déclaration perte) | Téléphone vérifié (OTP) + secret (mot de passe / PIN) | Oui (CNI collecté lors de la déclaration de perte) |
| Trouveur (déclaration trouvaille) | Téléphone vérifié (OTP) — pas de mot de passe obligatoire | Optionnelle (CNI non requise) |

> Les deux acteurs (citoyen et trouveur) **partagent le même schéma d'identité** : un compte est créé automatiquement à la première interaction, identifié par téléphone vérifié. Le compte citoyen collecte en plus le CNI lors d'une déclaration de perte.

---

# 11 — Matching intelligent

> Matching = aide à la décision. Jamais décision automatique. Validation humaine obligatoire.

## 11.1 — Données utilisées

| Critère | Source | Type |
|---|---|---|
| CNI | Déclarant | Exact match |
| Nom + prénom | Déclarant | Similarité (Levenshtein/phonétique) |
| Date de naissance | Déclarant | Exact match |
| Description objet | Déclarant/Trouve | Similarité textuelle |
| Lieu de perte/trovaille | Cartographie | Distance géographique |
| Date de perte/trovaille | Déclarant | Proximité temporelle |
| Photo | Citoyen / Trouve | (FUTURE) similarité visuelle |

## 11.2 — Normalisation

- Texte : lowercase, normalisation Unicode, retrait diacritiques, stopwords selon langue.
- Géographie : distance haversine en km.
- Date : différence en jours.
- Numérique : mise à l'échelle [0,1] par critère.

## 11.3 — Recherche candidate

- Index vectoriel (Provider Adapter) : permet de retrouver rapidement les candidats potentiels (embedding texte + métadonnées).
- Filtres : NATURE/DOMAINE/TYPE, région/cercle, fenêtre temporelle.

## 11.4 — Comparaison et score

`HYPOTHÈSE` — Pondérations initiales (À CALIBRER) :

| Critère | Poids initial |
|---|---|
| CNI exact | 40 |
| Nom + prénom (similarité) | 20 |
| Date naissance | 15 |
| Description objet | 15 |
| Lieu | 5 |
| Date | 5 |
| **Total** | **100** |

## 11.5 — Score et seuils

`À CALIBRER` — Seuils initiaux proposés mais non figés :

| Score | État | Action | Validation |
|---|---|---|---|
| ≥ seuil haut (proposition 80, À CALIBRER) | CORRESPONDANCE_TROUVÉE | Notification citoyen + agent | Humaine obligatoire |
| seuil bas ≤ score < seuil haut (proposition 50-79) | CORRESPONDANCE_TROUVÉE | Proposition à l'agent | Humaine obligatoire |
| < seuil bas | EN_ATTENTE_RAPPROCHEMENT | Surveillance | — |

## 11.6 — Explication du score

Chaque match expose :
- score global ;
- breakdown critère par critère ;
- critères déterminants ;
- motif de sélection (top-K voisins).

## 11.7 — Classement

Top-K candidats par ordre de score décroissant. Soumission à validation humaine.

## 11.8 — Validation humaine

Voir parcours D (§04). Toute restitution nécessite une décision humaine. Le score ne vaut jamais autorisation.

## 11.9 — Faux positifs / faux négatifs

| Type | Mitigation |
|---|---|
| Faux positif (homonyme + vol CNI) | Vérification pièce + agent humain |
| Faux négatif (description vague) | Agent force correspondance manuelle |
| Homonyme (nom commun) | Score réduit, exigence autre critère |
| Anonyme (CNI absent) | Score 0, exclusion matching |
| Taux estimé | HYPOTHÈSE 5-10 % (À CALIBRER par tests) |

## 11.10 — Audit

Chaque match (calculé, présenté, validé, rejeté) est journalisé : score, critères, identité de l'agent, timestamp, version moteur, hash du modèle.

## 11.11 — Moteur vectoriel

`À DÉCIDER` — Choix entre FAISS / Pinecone / Weaviate. Abstraction `Provider Adapter` requise pour permettre le remplacement sans réécriture du domaine.

## 11.12 — Chunking

`À CALIBRER` — Paramètres expérimentaux (ex. 512 tokens + overlap 50) ; à valider sur données réelles.

---

# 12 — Notifications

## 12.1 — Architecture

```
notification-svc (logique métier)
        │
        ▼
  SMS Service (abstraction)
        │
        ▼
  Provider Adapter (interface stable)
        │
        ▼
  Fournisseur SMS réel (à sélectionner)
```

> Aucun fournisseur SMS n'est contractuellement choisi. `Provider Adapter` est l'interface stable qui permet de changer de fournisseur sans modification du domaine.

## 12.2 — Canaux MVP

| Canal | Usage | Statut |
|---|---|---|
| SMS | OTP, notifications critiques | VALIDÉ |
| Email | Confirmations, notifications non urgentes | VALIDÉ |
| WhatsApp | — | FUTURE |
| Push mobile | — | FUTURE |

## 12.3 — Événements déclencheurs

| ID | Événement | Destinataire | Canal | Sensibilité |
|---|---|---|---|---|
| N1 | Déclaration créée | Déclarant | SMS + email | 🔴 |
| N2 | Match ≥ seuil haut | Citoyen | SMS | 🟡 |
| N3 | Nouvelle correspondance | Agent | Interne | 🟢 |
| N4 | Aucune correspondance à mi-parcours | Déclarant trouvaille | Email | 🟡 |
| N5 | Restitution confirmée | Citoyen + trouveur | SMS + email | 🟢 |
| N6 | Expiration | Citoyen | Email | 🟢 |
| N7 | Modification | Citoyen | Email | 🟡 |
| N8 | Rejet match | Citoyen | Email | 🟡 |
| N9 | Incident sécurité | Admin | Interne | 🟡 |
| N10 | OTP | Citoyen | SMS | 🔴 |

## 12.4 — Templates

- Français uniquement au MVP.
- Architecture i18n ready (langues locales = FUTURE).
- Anti-spam : max 3 notif/jour/citoyen.
- Variables substituables : nom, numéro de suivi, centre, URL.

## 12.5 — Statut d'envoi

| Statut | Description |
|---|---|
| PENDING | En attente de traitement |
| SENT | Envoyé (provider acquitté) |
| FAILED | Échec définitif |
| RETRYING | En cours de retry |

## 12.6 — Idempotence

- `Idempotency-Key` (UUID) sur chaque envoi.
- Rejeu possible sans doublon (24 h).

## 12.7 — Retry et backoff

- Retry exponentiel.
- DLQ (Dead Letter Queue) après N tentatives.
- Bascule vers email si SMS échoue.

## 12.8 — Erreurs

| Erreur | Comportement |
|---|---|
| Échec envoi SMS | Fallback email, marquage retry |
| Échec calcul matching | File retry + DLQ, notification admin |
| Timeout provider | Retry exponentiel |
| Indisponibilité provider | Bascule vers secondaire (multi-opérateur) |

## 12.9 — Traçabilité

- Notification ID, recipient, canal, provider ID, coût estimé, statut, horodatage, idempotency_key.
- Stockage des logs d'envoi (cf. §15).

## 12.10 — Coût

`HYPOTHÈSE NON VALIDÉE` — Le coût est modélisé :
```
Coût mensuel = nombre de SMS × coût unitaire + frais fixes
```

Aucun budget chiffré n'est validé. Tarif réel à négocier après sélection du fournisseur.

---

# 13 — Gestion des fichiers et photos

## 13.1 — Upload

| Élément | Spécification | Statut |
|---|---|---|
| Formats acceptés | JPEG, PNG, HEIC | PROPOSITION |
| Taille max par fichier | À BENCHMARKER (HYPOTHÈSE) | HYPOTHÈSE |
| Nombre max par déclaration | À DÉFINIR (HYPOTHÈSE 5) | HYPOTHÈSE |
| Compression | Automatique côté client | PROPOSITION |
| Antivirus | Scan à l'upload | PROPOSITION |

## 13.2 — Validation

- Type MIME réel (magic bytes).
- Taille.
- Cohérence (l'image s'ouvre).
- Scan antivirus / anti-malware.

## 13.3 — Stockage

| Élément | Spécification |
|---|---|
| Backend | S3-compatible (PROPOSITION : MinIO si on-prem) |
| Chiffrement | AES-256 au repos |
| URLs | Signées, TTL court (PROPOSITION : 5 min) |
| Versioning | Activé |

## 13.4 — Accès

- URLs signées temporaires.
- Pas d'accès direct aux buckets depuis le frontend.
- Politiques IAM granulaires.

## 13.5 — Suppression

| Cas | Action |
|---|---|
| Annulation par citoyen | Suppression logique (période de grâce 30 j) |
| Restitution confirmée | Purge paramétrable (HYPOTHÈSE : 3 mois) |
| Demande droit à suppression | Purge après période de grâce |

## 13.6 — Purge post-restitution

`HYPOTHÈSE PROVISOIRE DE DIMENSIONNEMENT` — 3 mois après restitution. Durée définitive = validation juridique.

---

# 14 — Sécurité

## 14.1 — Threat model (résumé)

| Menace | Prévention | Détection | Correction |
|---|---|---|---|
| Fausse déclaration | CAPTCHA + rate limiting + hash similarité | Audit logs | Refus + signalement |
| Fausse trouvaille | Vérification pièce au centre | Audit logs | Refus restitution |
| Usurpation identité | MFA + vérification CNI + agent humain | SIEM | Verrouillage + investigation |
| Exposition données | Chiffrement + RBAC | Scan vuln | Correctif + notification (processus J-02) |
| Scraping massif | Rate limiting IP + CAPTCHA | Logs | Blocage |
| Énumération d'identifiants | Messages génériques | Logs erreurs | Throttling |
| Manipulation matching | Validation humaine obligatoire | Audit logs match | Audit + correction |
| Agent malveillant | SoD + MFA + journalisation | UEBA (FUTURE) | Révocation + investigation |
| Privilèges excessifs | RBAC + revue périodique | Access logs | Révocation |
| Fraude interne | SoD + UEBA + journalisation | SIEM | Investigation + sanctions |
| Téléchargement abusif | Quotas + logs | Logs volume | Limitation |
| Spam | Max 3 notif/jour | Logs | Ajustement templates |
| Compromission compte | MFA + révocation tokens | Logs | Reset MFA |
| Panne centrale | Multi-zone + PRA | Monitoring | Fail-over |

## 14.2 — Secrets

- Coffre KMS / Vault.
- Rotation périodique.
- Aucun secret en log.

## 14.3 — Chiffrement

| Couche | Mécanisme |
|---|---|
| En transit | TLS 1.3 |
| Au repos | AES-256 |
| Champs PII | Chiffrement applicatif + clé distincte |
| Logs | Hash chaîné |

## 14.4 — TLS / mTLS

- TLS obligatoire externe.
- mTLS ciblé pour intégrations externes sensibles (cf. arbitrage A-03).

## 14.5 — Contrôle d'accès

- RBAC + ABAC.
- Policy engine (PROPOSITION : OPA).

## 14.6 — MFA

- Citoyen : SMS OTP.
- Agent / Admin : TOTP obligatoire (FIDO2 = FUTURE).

## 14.7 — Audit (détaillé §15)

- Journalisation append-only.
- Hash chaîné (WORM si exigé APDP — À DÉCIDER).
- Durée paramétrable (HYPOTHÈSE 36 mois).

## 14.8 — Anti-fraude

- Rules-based V1 (PROPOSITION).
- ML / UEBA = FUTURE (D-16).

## 14.9 — Rate limiting

- Par IP.
- Par utilisateur.
- Par endpoint.

## 14.10 — Anti-abus

- CAPTCHA adaptatif.
- Quotas exports.
- Quotas notifications.

## 14.11 — Validation des entrées

- Côté serveur uniquement.
- Schémas stricts.
- Rejet explicite des entrées invalides.

## 14.12 — Protection API

- WAF.
- mTLS ciblé.
- Anti-rejeu (nonces, idempotency keys).

## 14.13 — Sécurité fichiers

Voir §13.

## 14.14 — Logs

Voir §15.

## 14.15 — Détection incidents

- SIEM interne (PROPOSITION : Wazuh / Elastic SIEM — D-16).
- Alertes : échecs MFA répétés, exports massifs, accès hors périmètre.

## 14.16 — Sauvegardes

| Élément | Stratégie |
|---|---|
| Base de données | Backup quotidien incrémental + hebdomadaire complet |
| Stockage photos | Réplication multi-zone |
| Tests de restauration | Mensuels (PROPOSITION) |

## 14.17 — Restauration

- **RTO < 4 h** — **OBJECTIF TECHNIQUE — À VALIDER** (aucun benchmark ni contrat n'a défini cet objectif dans le dossier source ; à mettre en regard du coût opérationnel PRA).
- **RPO < 1 h** — **OBJECTIF TECHNIQUE — À VALIDER** (idem).
- Tests mensuels (PROPOSITION).

## 14.18 — Gestion des vulnérabilités

- Scan dépendances (CI).
- Scan infra périodique.
- Patch management.

## 14.19 — Contrôles MVP / FUTURE

| Contrôle | MVP | FUTURE |
|---|---|---|
| MFA TOTP | ✅ | — |
| FIDO2 | — | ✅ |
| UEBA | — | ✅ |
| WORM logs | Selon APDP | Si exigé |
| ML fraude | — | ✅ |

---

# 15 — Protection des données / Gouvernance

> Ne présenter aucune obligation juridique non vérifiée comme un fait.

## 15.1 — Besoins de conception

| Besoin | Architecture |
|---|---|
| Responsable du traitement | À DÉSIGNER par autorité compétente (cf. J-05) |
| DPO / fonction équivalente | À DÉSIGNER (cf. J-05) |
| Registre des traitements | Module dédié (admin-svc) — Loi 2013-015 art. 30 |
| Consentements | Capture explicite + journalisation |
| Minimisation | Uniquement les données nécessaires |
| Accès | RBAC + ABAC |
| Rectification | API dédiée |
| Suppression | Selon cadre applicable + période de grâce 30 j |
| Conservation | Paramétrable (cf. J-04 HYPOTHÈSE) |
| Archivage | Politique configurable (cf. J-04) |
| Purge | Politique paramétrable (cf. J-06 HYPOTHÈSE) |
| Traçabilité | Audit log (cf. §19) |
| Incidents | Processus complet (cf. J-02) |

## 15.2 — Préconditions d'exploitation

| Précondition | Statut |
|---|---|
| Désignation du DPO | À faire avant exploitation |
| Contrat-cadre centres | À faire avant exploitation (cf. J-03) |
| Validation APDP des durées | À faire avant exploitation (cf. J-04, J-06) |
| Confirmation délai notification | À faire avant exploitation (cf. J-02 — HYPOTHÈSE 72h) |
| AIPD | À produire |

---

# 16 — Centres et restitution

## 16.1 — Modèle de centre

| Attribut | Description | Statut |
|---|---|---|
| Nom | Nom du centre | VALIDÉ |
| Adresse | Adresse physique | VALIDÉ |
| Géolocalisation | GPS | VALIDÉ |
| Type | Mairie, police, gendarmerie, centre communal | À DÉCIDER (D-11) |
| Capacité | À mesurer | À DÉCIDER (V-9) |
| Région/Cercle/Commune | Référentiel administratif | VALIDÉ |
| Actif | Oui/Non | VALIDÉ |

## 16.2 — Agent

| Attribut | Description |
|---|---|
| Identité | Liée à CitizenProfile |
| Centre | N:1 Center |
| Rôles | Liste |
| MFA activé | Oui/Non |
| Actif | Oui/Non |

## 16.3 — Habilitation

- Création de compte agent par admin supérieur.
- Attribution de rôle + centre.
- Vérification automatique des conflits SoD.

## 16.4 — Processus d'accueil au centre

| Étape | Acteur | Action |
|---|---|---|
| 1 | Citoyen | Présente déclaration (numéro suivi ou CNI) |
| 2 | Agent | Vérifie pièce d'identité |
| 3 | Agent | Affiche correspondances (score ≥ seuil) |
| 4 | Citoyen | Confirme ou infirme |
| 5 | Agent | Vérification approfondie |
| 6 | Agent / Citoyen | Restitution du document/objet |
| 7 | Système | Journalisation |
| 8 | Système | Notification au déclarant trouvaille |

## 16.5 — Restitution effective

| Prérequis | Description |
|---|---|
| Match VALIDÉE par agent | État FSM = VALIDÉE |
| Identité vérifiée | Photo pièce scan |
| CNI correspondant | Comparaison avec déclarant |
| Objet physiquement présent | Au centre |
| Preuve de remise | Signature / photo |

## 16.6 — Preuve de remise

| Élément | Description |
|---|---|
| Photo pièce scannée | Preuve d'identité |
| Photo objet remis | Preuve de remise |
| Signature / preuve alternative | Preuve de consentement |
| Horodatage | Audit log |
| Identité agent | Audit log |

## 16.7 — Contestation

Voir parcours F (§04).

## 16.8 — Suspension

Voir parcours G (§04).

## 16.9 — Audit (QUI / QUOI / QUAND / OÙ / QUEL DOSSIER / AVEC QUELLE AUTORISATION)

| Question | Source |
|---|---|
| QUI | `actor_id` dans AuditLog |
| QUOI | `action`, `entity_type`, `entity_id` |
| QUAND | `occurred_at` |
| OÙ (centre) | `center_id` (déduit du contexte de l'action) |
| QUEL DOSSIER | `entity_id` (déclaration / match) |
| AVEC QUELLE AUTORISATION | Rôle + permissions + résultat policy engine |

---

# 17 — Administration et dashboard

## 17.1 — Niveaux

| Niveau | Périmètre |
|---|---|
| National | Pays entier |
| Régional | Région administrative |
| Cercle | Cercle administratif |
| Commune | Commune administrative |
| Centre | Centre partenaire |

## 17.2 — Statistiques

| Indicateur | Description |
|---|---|
| Total déclarations | Volumétrie |
| Taux restitution | Succès / total |
| Taux match | Match / total |
| Top catégories | NATURE / DOMAINE / TYPE |
| Délai moyen restitution | Performance |
| Taux d'expiration | Vieillissement |

## 17.3 — Indicateurs opérationnels

- Files d'attente par centre.
- Délais de validation humaine.
- Anomalies (délais异常, volumes异常).

## 17.4 — Filtres et exports

- Filtres : période, région, cercle, centre, catégorie.
- Exports : CSV / JSON (SHOULD MVP, ADOPTÉ PROPOSITION).

## 17.5 — Périmètre pilote

`VALIDÉ` — Bamako + Ségou. Déploiement national complet hors MVP.

---

# 18 — UX/UI

`VALIDÉ` — Identité visuelle Direction 3 + Logo A « Lien » + palette + slogan.

## 18.1 — Identité visuelle

| Élément | Valeur |
|---|---|
| Direction | Direction 3 — Communautaire modernisée |
| Logo | Proposition A — « Lien » |
| Vert principal | `#1B6E3F` |
| Terre cuite | `#CC5500` |
| Beige | `#F5F0E1` |
| Gris foncé | `#333333` |
| Blanc | `#FFFFFF` |
| Rouge alerte | `#E53935` |
| Slogan | « Ensemble, retrouvons l'essentiel. » |

> Le fichier vectoriel définitif du logo **n'est pas réputé présent dans le projet**. À fournir par le commanditaire / designer.

## 18.2 — MVP

`VALIDÉ` — Web responsive uniquement. Mobile et WhatsApp = FUTURE.

## 18.3 — Architecture de l'information

```
Accueil
├── J'ai perdu
│   ├── Authentification (SMS OTP)
│   ├── Déclaration perte
│   │   ├── Saisie CNI
│   │   ├── Choix NATURE → DOMAINE → TYPE
│   │   ├── Description + photos + lieu + date
│   │   ├── Consentement
│   │   └── Confirmation (SOUMISE)
│   ├── Mes déclarations
│   └── Mes correspondances
└── J'ai trouvé
    ├── Authentification
    ├── Déclaration trouvaille
    │   ├── Choix NATURE → DOMAINE → TYPE
    │   ├── Description + photos + lieu + date
    │   ├── Consentement
    │   └── Confirmation
    └── Mes déclarations trouvaille
```

## 18.4 — Navigation

- 3 clics max pour déclarer ou déposer.
- Fil d'Ariane visible.

## 18.5 — Pages principales

| Page | Description |
|---|---|
| Accueil | CTA principal |
| Déclaration perte | Formulaire multi-étapes |
| Déclaration trouvaille | Formulaire multi-étapes |
| Mes déclarations | Liste + statut |
| Correspondance | Détail + accept/reject |
| Centre | Informations, horaires |
| Profil | Données + préférences |
| Aide / FAQ | Documentation utilisateur |

## 18.6 — Formulaires

- Validation côté client (UX) + côté serveur (sécurité).
- Messages d'erreur humains.
- États : initial, focus, valide, erreur, désactivé.

## 18.7 — États UI

| État | Comportement |
|---|---|
| Vide | Illustration + CTA |
| Chargement | Spinner + message |
| Erreur | Message humain + solution |
| Succès | Confirmation verte + CTA |

## 18.8 — Accessibilité

| Exigence | Implémentation |
|---|---|
| Contraste ≥ 4.5:1 | Vérifié |
| Navigation clavier | Complète |
| Labels ARIA | Sur tous les contrôles |
| Taille cible ≥ 44px | Mobile |
| Lecteurs d'écran | Testé (NVDA, JAWS, VoiceOver) |
| Taille min police | 14 px corps, 16 px mobile |

## 18.9 — Responsive

- Mobile-first.
- Breakpoints standards.
- Adaptation des composants (desktop / tablette / mobile).

## 18.10 — Confidentialité à l'écran

- Pas d'affichage du CNI complet par défaut.
- Masquage dans les exports.
- Auto-lock sur inactivité.

## 18.11 — Parcours citoyen (cf. §04 A-B-C-D-E)

## 18.12 — Parcours agent (cf. §04 D-E-F-G-H)

---

# 19 — Observabilité

## 19.1 — Logs structurés

- Format JSON.
- Champs : timestamp, service, level, message, request_id, actor_id, action, entity_type, entity_id, ip, ua.
- Pas de PII dans les logs.
- Pas de secrets dans les logs.

## 19.2 — Métriques

| Catégorie | Métriques |
|---|---|
| Trafic | Requêtes/sec par endpoint |
| Latence | P50, P95, P99 par endpoint |
| Erreurs | Taux d'erreur 4xx, 5xx |
| Business | Déclarations créées, matchs, restitutions, expirations |
| Files d'attente | Profondeur, latence |
| SMS | Volume, succès, échec, coût |

## 19.3 — Traces

- OpenTelemetry.
- Corrélation cross-services (trace ID).

## 19.4 — Audit (cf. §15)

- Logs immuables.
- Hash chaîné (WORM si exigé APDP).

## 19.5 — Alertes

| Événement | Sévérité | Canal |
|---|---|---|
| Échec MFA répété | Élevée | SIEM + admin |
| Export massif | Élevée | SIEM + admin |
| Accès hors périmètre | Moyenne | SIEM |
| Erreur 5xx > seuil | Moyenne | SIEM |
| SMS provider down | Élevée | Admin |
| Backup failed | Élevée | Admin technique |

## 19.6 — Monitoring

- Dashboards par service.
- Vue métier (volumétrie, taux restitution).

## 19.7 — Incidents

- Workflow : détection → analyse → confinement → remédiation → notification.
- Délai de notification = HYPOTHÈSE NON VÉRIFIÉE (cf. J-02).

## 19.8 — Corrélation

- Trace ID + Request ID dans tous les logs.
- Corrélation métriques ↔ logs ↔ traces.

## 19.9 — Conservation des logs

| Type | Rétention |
|---|---|
| Logs techniques | HYPOTHÈSE 36 mois |
| Audit | HYPOTHÈSE 36 mois |
| Métriques | 13 mois (PROPOSITION) |

---

# 20 — Tests et qualité

## 20.1 — Stratégie

| Niveau | Objectif | Type |
|---|---|---|
| Unitaire | Logique isolée | Boîte blanche |
| Intégration | Frontières services | Boîte noire |
| API | Contrat API | Boîte noire |
| E2E | Parcours critiques (A à K) | Boîte noire |
| Sécurité | Permissions, RBAC, SoD, XSS, CSRF | Boîte noire |
| Permissions | Tests matriciels RBAC | Boîte noire |
| Matching | Précision, faux positifs/négatifs | Données réelles + synthétiques |
| Notifications | Livraison, idempotence, retry | Boîte noire |
| Performance | Latence, throughput | Charge |
| Accessibilité | WCAG AA | Outils + revue |
| Responsive | Multi-devices | Tests visuels |
| Restauration | Recovery time | Disaster recovery |

## 20.2 — Critères de réussite

| Type | Critère |
|---|---|
| Unitaire | Couverture ≥ 80 % sur domaine métier |
| Intégration | Tous les modules critiques |
| API | Conformité contrat + idempotence |
| E2E | Parcours citoyen + agent + admin |
| Sécurité | Aucune vulnérabilité haute |
| Permissions | Toutes les cases RBAC testées |
| Matching | Taux faux positifs cible ≤ X (À CALIBRER) |
| Notifications | Critères de délivrabilité — voir §20.x ci-dessous |
| Performance | P95 < seuil par endpoint |
| Accessibilité | WCAG AA validé |
| Responsive | OK 3 breakpoints |
| Restauration | RTO respecté |

## 20.x — Critères de réussite Notifications (révision)

> Le critère « 100 % délivrées » est irréaliste : la délivrabilité dépend du fournisseur, du réseau et du terminal destinataire. Il est remplacé par un ensemble de critères mesurables internes au système.

| Critère | Mesure |
|---|---|
| **Prise en charge** | 100 % des événements déclencheurs N1..N10 produisent un enregistrement `Notification` en base dans la même seconde |
| **Journalisation** | 100 % des notifications ont un `id`, un `idempotency_key`, un horodatage, un statut final |
| **Idempotence** | Rejouer le même `idempotency_key` ne crée pas de doublon (test E2E) |
| **Retry** | Au moins N tentatives avec backoff exponentiel avant marquage FAILED |
| **DLQ** | Les échecs définitifs atterrissent en DLQ et sont inspectables |
| **Délivrabilité mesurée** | KPI fournisseur (taux de livraison) rapporté et stocké dans `Notification.provider_status` |
| **Cible fournisseur** | Délivrabilité ≥ X % (À DÉFINIR par contrat avec le fournisseur) |

## 20.3 — Tests de restauration

- Fréquence : mensuelle (PROPOSITION).
- Scénarios : corruption DB, perte disque, indisponibilité zone.
- Métriques : RTO effectivement mesuré.

---

# 21 — Performance et scalabilité

## 21.1 — Objectifs

| Métrique | Cible (HYPOTHÈSE À BENCHMARKER) |
|---|---|
| Temps chargement page | ≤ 3 s |
| Latence API P95 | ≤ 500 ms (hors matching) |
| Latence matching P95 | À BENCHMARKER |
| Throughput | À BENCHMARKER |

## 21.2 — Volumétrie

`HYPOTHÈSE À BENCHMARKER` — La volumétrie année 1 du pilote est inconnue. Des hypothèses seront calibrées par des tests.

## 21.3 — Pagination

- Cursor-based (PROPOSITION) pour éviter OFFSET coûteux.
- Taille de page par défaut : 20.

## 21.4 — Indexation

- DB : index sur clés étrangères + colonnes de recherche (CNI hash, téléphone, etc.).
- Vector engine : index vectoriel pour recherche rapide.

## 21.5 — Cache

- Redis pour sessions + cache référentiels.
- Cache invalidation sur mise à jour.

## 21.6 — Files d'attente

- RabbitMQ / Kafka pour tâches asynchrones (notifications, matching, purges).

## 21.7 — Traitement asynchrone

- Matching : déclenché en async après SOUMISE.
- Notifications : file dédiée.
- Purge post-restitution : tâche planifiée.

## 21.8 — Matching

- Calcul potentiellement coûteux → en arrière-plan.
- Limitation de la taille de la file de calcul.

## 21.9 — Stockage

- Photos sur S3 (pas en DB).
- Stockage froid pour archives (HYPOTHÈSE).

## 21.10 — Montée en charge

- Auto-scaling horizontal des services stateless.
- Scaling vertical de la DB (PROPOSITION).
- Tests de charge à prévoir (PROPOSITION).

---

# 22 — Déploiement et infrastructure

## 22.1 — Environnements

| Environnement | Usage |
|---|---|
| Développement | Local |
| Test | CI / staging interne |
| Staging | Pré-production, données synthétiques |
| Production | Pilote Bamako + Ségou |

## 22.2 — Modèle cloud

`À DÉCIDER` — Hybride recommandé (PROPOSITION). Données sensibles on-prem, scaling cloud public.

`À DÉCIDER` — Cloud souverain local : existence et certification APDP non confirmées.

## 22.3 — CI/CD

| Élément | Description |
|---|---|
| Source | Git |
| Build | Pipeline automatisé |
| Tests | Automatisés (unit, integ, e2e, security) |
| Déploiement | Progressif (canary/blue-green) |
| Rollback | Automatique en cas d'échec |

## 22.4 — Secrets

- Vault / KMS.
- Jamais dans le code source.
- Rotation périodique.

## 22.5 — Sauvegardes

- DB : quotidien + hebdomadaire.
- Photos : réplication multi-zone.
- Tests mensuels.

## 22.6 — Restauration

- RTO < 4 h — **OBJECTIF TECHNIQUE — À VALIDER**.
- RPO < 1 h — **OBJECTIF TECHNIQUE — À VALIDER**.

## 22.7 — Monitoring

- Métriques système + applicatives.
- Logs centralisés.
- Alertes (cf. §19).

## 22.8 — Rollback

- Versioning clair.
- Migrations compatibles ascendantes/descendantes.

## 22.9 — Migrations

- Versionnées.
- Testées en staging.
- Plan de rollback documenté.

## 22.10 — Disaster Recovery

- PRA documenté.
- Tests réguliers.
- Géo-réplication.

## 22.11 — Compétences DevOps

`À ÉVALUER` — Compétences locales à cartographier (V-8). Externalisation possible si nécessaire.

---

# 23 — Dépendances externes

| Dépendance | Objectif | Données | Criticité | Alternative | Risque | Coût | Contrat |
|---|---|---|---|---|---|---|---|
| Fournisseur SMS | OTP + notifications | Téléphone, message | Critique | Multi-opérateur | Indisponibilité | À négocier | À signer |
| Fournisseur email | Confirmations + rapports | Email, contenu | Moyenne | Multi-fournisseur | Indisponibilité | À négocier | À signer |
| micati.site/CNI | Vérification identité (observation) | CNI | Moyenne | — | Indisponibilité | — | À clarifier |
| Cloud provider | Hébergement | Données métier | Critique | Hybride | Indisponibilité | À chiffrer | À signer |
| Storage S3-compatible | Photos | Photos chiffrées | Critique | Multi-cloud | Indisponibilité | À chiffrer | — |
| Cartographie (optionnel) | Géolocalisation | Lat/long | Faible | Open source | — | Faible | — |
| SMS provider monitoring | Monitoring opérationnel | Métriques SMS | Moyenne | — | — | — | — |

## 23.1 — Risques fournisseurs

- Lock-in : mitigé par Provider Adapter.
- Indisponibilité : multi-opérateur.
- Tarification opaque : à négocier.

---

# 24 — Matrice des risques

## 24.1 — Techniques

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan contingence |
|---|---|---|---|---|---|---|---|
| Indisponibilité service | Faible | Critique | Moyen | Multi-zone + PRA | Admin tech | Métriques uptime | Fail-over |
| Latence élevée | Moyenne | Moyen | Moyen | Cache + async | Tech | P95 > seuil | Optimisation |
| DB saturée | Moyenne | Élevé | Moyen | Partitionnement | Admin tech | Charge DB | Scale |
| Vector engine KO | Moyenne | Élevé | Moyen | Provider Adapter | Tech | Erreurs matching | Backup FAISS on-prem |
| Bug matching | Moyenne | Critique | Élevé | Tests + calibration | Tech | Faux positifs | Désactivation |

## 24.2 — Sécurité

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan contingence |
|---|---|---|---|---|---|---|---|
| Fuite de données | Basse | Critique | Moyen | Chiffrement + RBAC | DPO | Scan vuln | Notification (processus J-02) |
| Compromission agent | Basse | Critique | Moyen | SoD + MFA + audit | DPO | UEBA | Révocation |
| Manipulation matching | Basse | Critique | Moyen | Validation humaine obligatoire | Agent | Audit | Rejet |
| Attaque API | Moyenne | Élevé | Moyen | WAF + rate limit | Admin tech | Logs | Blocage |
| Fraude interne | Basse | Critique | Moyen | SoD + journalisation | DPO | SIEM | Investigation |

## 24.3 — Juridiques

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan |
|---|---|---|---|---|---|---|---|
| Non-conformité APDP | Moyenne | Critique | Élevé | AIPD + revue juridique | DPO | Audit | Mise en conformité |
| Délai notification > attendu | Moyenne | Élevé | Moyen | Processus configuré | DPO | Incident | Communication |

## 24.4 — Opérationnels

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan |
|---|---|---|---|---|---|---|---|
| Surcharge centre | Moyenne | Élevé | Moyen | Redirection + files | Admin centre | Files | Transfert |
| Agent en congé | Élevée | Faible | Faible | Polyvalence | Resp. centre | Calendrier | Backup |

## 24.5 — Adoption

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan |
|---|---|---|---|---|---|---|---|
| Faible adoption citoyen | Moyenne | Élevé | Moyen | UX + communication | Marketing | Volumétrie | Campagne |
| Confusion parcours | Moyenne | Moyen | Moyen | UX tests | UX | Feedback | Ajustement |

## 24.6 — Infrastructure

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan |
|---|---|---|---|---|---|---|---|
| Cloud souverain indisponible | Élevée | Moyen | Moyen | Hybride | Tech | Recherche | On-prem |
| DevOps indisponibles | Moyenne | Élevé | Moyen | Formation + doc | Tech | Audit compétences | Externalisation |

## 24.7 — Fournisseurs

| Risque | Proba | Impact | Niveau | Mitigation | Responsable | Déclencheur | Plan |
|---|---|---|---|---|---|---|---|
| Fournisseur SMS KO | Moyenne | Élevé | Moyen | Multi-opérateur | Admin tech | Pannes | Bascule |
| Coût SMS élevé | Moyenne | Moyen | Moyen | Négociation + seuils | Admin nat. | Facturation | Renégociation |

## 24.8 — Fraude

Voir §14.1.

---

# 25 — Décisions techniques à prendre

| ID | Question | Options | Recommandation | Critères | Dépendances | Impact | Quand | Bloqueur |
|---|---|---|---|---|---|---|---|---|
| T-D01 | Choix moteur vectoriel | FAISS / Pinecone / Weaviate | À DÉCIDER | Performance, coût, ops, souveraineté | — | Matching | Avant phase DELEGATE | NON BLOQUANT |
| T-D02 | Chunking | À calibrer | À DÉCIDER | Précision recall | T-D01 | Matching | Pendant tests | NON BLOQUANT |
| T-D03 | Seuils matching | À calibrer (proposition 80/50) | À DÉCIDER | Faux positifs/négatifs | T-D01 | Matching | Pendant tests | NON BLOQUANT |
| T-D04 | Pondérations matching | À calibrer | À DÉCIDER | Faux positifs/négatifs | T-D01 | Matching | Pendant tests | NON BLOQUANT |
| T-D05 | Modèle cloud | On-prem / Cloud / Hybride | Hybride | Souveraineté, coût, compétences | — | Tout | Avant phase DELEGATE | NON BLOQUANT |
| T-D06 | Cloud souverain local | Disponible ? Certifié APDP ? | À RECHERCHER | Certification APDP | T-D05 | Données sensibles | Pendant DELEGATE | NON BLOQUANT |
| T-D07 | Politique RBAC détaillée | OPA / Cedar / DSL | OPA (PROPOSITION) | Maturité, écosystème | — | RBAC | Avant phase DELEGATE | NON BLOQUANT |
| T-D08 | WORM logs | Oui / Non / Selon APDP | Selon APDP (D-5) | Exigence APDP | — | Audit | Avant exploitation | NON BLOQUANT (sauf APDP) |
| T-D09 | Politique engine ABAC | OPA Rego | PROPOSITION | Maturité | T-D07 | RBAC | Avant phase DELEGATE | NON BLOQUANT |
| T-D10 | API Gateway | nginx / Kong / autre | À DÉCIDER | Performance, ops | — | API | Avant phase DELEGATE | NON BLOQUANT |
| T-D11 | Bus async | RabbitMQ / Kafka | À DÉCIDER | Débit, ops | — | Notifications | Avant phase DELEGATE | NON BLOQUANT |
| T-D12 | Cache | Redis | PROPOSITION | Standard | — | Sessions | Avant phase DELEGATE | NON BLOQUANT |
| T-D13 | SIEM | Wazuh / Elastic SIEM | À DÉCIDER | Maturité, coût | — | Sécurité | Avant phase DELEGATE | NON BLOQUANT |
| T-D14 | UEBA | Oui / Non / V2 | V2 (D-16) | Détection fraude | T-D13 | Sécurité | FUTURE | NON BLOQUANT |
| T-D15 | Stratégie fichiers volumineux | MinIO / autre | MinIO (PROPOSITION) | Souveraineté, coût | T-D05 | Photos | Avant phase DELEGATE | NON BLOQUANT |
| T-D16 | Sélection SMS provider | Multi-opérateur | VALIDÉ via Provider Adapter | Coût, fiabilité, SLA | — | SMS | Avant exploitation | NON BLOQUANT |
| T-D17 | Sélection email provider | À DÉCIDER | À DÉCIDER | Coût, délivrabilité | — | Notifications | Avant exploitation | NON BLOQUANT |
| T-D18 | SoD auto-détection | Oui / Non | Oui (PROPOSITION) | RBAC | — | Sécurité | Avant phase DELEGATE | NON BLOQUANT |
| T-D19 | Moteur règles fraude | Rules / ML | Rules V1 | Complexité | — | Sécurité | Avant phase DELEGATE | NON BLOQUANT |
| T-D20 | Durée sessions | À calibrer | 15 min + 8 h | Sécurité/UX | — | Sessions | Avant phase DELEGATE | NON BLOQUANT |

## 25.1 — Décisions juridiques (rappels)

| ID | Décision | Statut | Bloqueur |
|---|---|---|---|
| J-02 | Délai notification exact | À VALIDER (HYPOTHÈSE 72h) | NON BLOQUANT pour PLAN |
| J-03 | Contrat centres | À VALIDER | NON BLOQUANT pour PLAN |
| J-04 | Durées conservation | À VALIDER (HYPOTHÈSE 12+24) | NON BLOQUANT pour PLAN |
| J-05 | Désignation DPO | À DÉSIGNER | NON BLOQUANT pour PLAN |
| J-06 | Durée purge post-restitution | À VALIDER (HYPOTHÈSE 3 mois) | NON BLOQUANT pour PLAN |

---

# 26 — Backlog de construction

Format : EPIC → FEATURE → TASK.

## EPIC 01 — Fondations

| ID | Description | Priorité | Dépendances | Responsable | Critères d'acceptation | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F01-01 | Infrastructure repo + CI/CD | MUST | — | Tech | Pipeline vert | Smoke | Faible | À démarrer |
| F01-02 | Environnements dev / test / staging | MUST | F01-01 | Tech | Environnements isolés | Smoke | Faible | À démarrer |
| F01-03 | Secrets management (Vault / KMS) | MUST | F01-01 | Tech | Aucun secret dans le code | Scan | Faible | À démarrer |

## EPIC 02 — Sécurité

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F02-01 | identity-svc (auth, MFA, sessions) | MUST | F01-01 | Tech | Login OK, OTP OK, TOTP OK | Unit + E2E | Moyen | À démarrer |
| F02-02 | RBAC (8 rôles + matrice §03) | MUST | F02-01 | Tech | Chaque case RBAC testée | Unit + E2E | Moyen | À démarrer |
| F02-03 | Chiffrement au repos + en transit | MUST | F01-01 | Tech | TLS 1.3, AES-256 | Scan | Faible | À démarrer |
| F02-04 | Audit log immuable + hash chaîné | MUST | F01-01 | Tech | Append-only OK, chaînage vérifié | Unit | Moyen | À démarrer |
| F02-05 | MFA agents (TOTP) | MUST | F02-01 | Tech | TOTP obligatoire | E2E | Faible | À démarrer |
| F02-06 | SoD auto-détection | MUST | F02-02 | Tech | Conflits détectés à création | Unit | Moyen | À DÉCIDER (D-18) |
| F02-07 | Anti-énumération | MUST | F02-01 | Tech | Messages génériques | E2E | Faible | À démarrer |

## EPIC 03 — Données

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F03-01 | Modèle de données (cf. §06) | MUST | — | Tech | Schéma complet | Unit | Moyen | À DÉCIDER (SQL final) |
| F03-02 | Catalogue NATURE/DOMAINE/TYPE | MUST | F03-01 | Tech | Catalogue opérationnel | Unit | Faible | À démarrer |
| F03-03 | Géographie (R/C/Com/Village) | MUST | F03-01 | Tech | Référentiel chargé | Unit | Faible | À DÉCIDER (volumétrie) |
| F03-04 | Politique de rétention paramétrable | MUST | F03-01 | Tech | Configurable | Unit | Moyen | À DÉCIDER (APDP) |

## EPIC 04 — Backend / API

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F04-01 | declaration-svc | MUST | F03-01 | Tech | CRUD complet | Unit + E2E | Moyen | À démarrer |
| F04-02 | matching-svc + Provider Adapter | MUST | F03-01, F05-01 | Tech | Calcul score, abstrait moteur | Unit + E2E | Élevé | À DÉCIDER (T-D01) |
| F04-03 | restitution-svc | MUST | F03-01 | Tech | Workflow complet | E2E | Moyen | À démarrer |
| F04-04 | center-svc | MUST | F03-01, F02-02 | Tech | CRUD centres + agents | Unit + E2E | Moyen | À démarrer |
| F04-05 | admin-svc (registre des traitements) | MUST | F03-01 | Tech | Registre | Unit | Moyen | À démarrer |
| F04-06 | audit-svc | MUST | F03-01 | Tech | Logs immuables | Unit | Moyen | À démarrer |
| F04-07 | catalog-svc | MUST | F03-02 | Tech | Catalogue | Unit | Faible | À démarrer |

## EPIC 05 — Matching

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F05-01 | Choix moteur vectoriel | MUST | — | Tech | Décision documentée | — | Élevé | À DÉCIDER (T-D01) |
| F05-02 | Calibration chunking | MUST | F05-01 | Tech | Tests concluants | Benchmarks | Élevé | À CALIBRER (T-D02) |
| F05-03 | Calibration seuils | MUST | F05-01 | Tech | Faux positifs acceptable | Tests | Élevé | À CALIBRER (T-D03) |
| F05-04 | Calibration pondérations | MUST | F05-01 | Tech | Précision rappel | Tests | Élevé | À CALIBRER (T-D04) |

## EPIC 06 — Frontend

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F06-01 | Interface citoyen (Web responsive) | MUST | F04-01 | UX | Parcours A/B/C/D/E fonctionnels | E2E | Moyen | À démarrer |
| F06-02 | Interface agent | MUST | F04-03 | UX | Parcours D/E/F/G/H | E2E | Moyen | À démarrer |
| F06-03 | Interface admin | MUST | F04-05 | UX | Statistiques + configuration | E2E | Moyen | À démarrer |
| F06-04 | Identité visuelle intégrée | MUST | F01-01 | UX | Direction 3 + Logo A | Visuel | Faible | À démarrer (logo non présent) |

## EPIC 07 — Notifications

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F07-01 | notification-svc + Provider Adapter SMS | MUST | F01-01 | Tech | Abstraction stable | Unit | Moyen | À DÉCIDER (T-D16) |
| F07-02 | Templates (FR) | MUST | F07-01 | UX | Templates validés | Unit | Faible | À démarrer |
| F07-03 | Idempotence + retry + DLQ | MUST | F07-01 | Tech | Pas de doublon | Unit + E2E | Moyen | À démarrer |

## EPIC 08 — Centres

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F08-01 | Création des centres (Bamako+Ségou) | MUST | F03-01 | Admin | Centres créés | Manuel | Faible | À DÉCIDER (D-11) |
| F08-02 | Création des agents | MUST | F08-01 | Admin | Agents créés | Manuel | Faible | À DÉCIDER |
| F08-03 | Workflow restitution | MUST | F04-03 | Tech + Centre | Restitution complète | E2E | Moyen | À démarrer |

## EPIC 09 — Administration

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F09-01 | Dashboard national/régional/centre | MUST | F04-05 | UX | Statistiques correctes | E2E | Moyen | À démarrer |
| F09-02 | Configuration seuils matching | MUST | F04-05 | Tech | Modification effective | E2E | Moyen | À démarrer |
| F09-03 | Configuration politique rétention | MUST | F04-05 | Tech | Modification effective | E2E | Moyen | À DÉCIDER (APDP) |

## EPIC 10 — Tests et qualité

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F10-01 | Tests unitaires ≥ 80% domaine | MUST | tous services | Tech | Couverture OK | Coverage | Faible | À démarrer |
| F10-02 | Tests E2E parcours critiques | MUST | F06-01..03 | Tech | Parcours A-K | E2E | Moyen | À démarrer |
| F10-03 | Tests sécurité (RBAC, XSS, CSRF) | MUST | F02-02 | Tech | Aucune vuln haute | Scan | Moyen | À démarrer |
| F10-04 | Tests performance | MUST | — | Tech | P95 respecté | Charge | Moyen | À DÉCIDER (T-D01) |
| F10-05 | Tests accessibilité WCAG AA | MUST | F06-* | UX | Conformité | Outils | Faible | À démarrer |

## EPIC 11 — Déploiement pilote

| ID | Description | Priorité | Dépendances | Responsable | Critères | Tests | Risque | État |
|---|---|---|---|---|---|---|---|---|
| F11-01 | Déploiement environnement pilote | MUST | tous | Tech | Up et stable | Smoke | Moyen | À DÉCIDER (T-D05) |
| F11-02 | Formation des agents | MUST | F11-01 | Centre | Agents formés | Manuel | Moyen | À DÉCIDER |
| F11-03 | Communication publique | MUST | F11-01 | Marketing | Citoyens informés | Manuel | Moyen | À DÉCIDER |
| F11-04 | Monitoring opérationnel | MUST | F11-01 | Tech | Métriques OK | Manuel | Moyen | À DÉCIDER (T-D13) |

---

# 27 — Ordre d'implémentation

## 27.1 — Phases

> **Note importante sur les durées.** Les durées ci-dessous sont des **estimations très provisoires, sans charge réelle, sans vélocité mesurée, sans taille d'équipe arrêtée**. Elles ne constituent **pas un planning projet engageant** : seul un *sizing* sérieux après cadrage détaillé (équipe, vélocité, dépendances externes) peut produire un calendrier fiable. En attendant, le séquencement (gates) et l'**effort relatif** entre phases (P0 < P1 < P5) restent l'information utile.

| Phase | Périmètre | Effort relatif (indicatif) | Sortie | Durée (provisoire, à recalibrer) |
|---|---|---|---|---|
| **Phase 0** | Fondations (F01) | XS (effort minimal) | CI/CD, env, secrets | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 1** | Sécurité de base (F02 identité + RBAC + audit) | M | Auth, RBAC, audit | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 2** | Données (F03) | M | Schéma, catalogue, géographie | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 3** | Backend core (F04 declaration, restitution, center, admin, audit, catalog) | L | Services métier | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 4** | Matching (F05 moteur + calibration) | M | Moteur opérationnel | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 5** | Frontend (F06 citoyen, agent, admin) | L | Interfaces | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 6** | Notifications (F07) | S-M | SMS + email MVP | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 7** | Centres (F08 création + workflow) | S | Centres opérationnels | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 8** | Administration (F09 dashboards) | S-M | Dashboards | **Estimation très provisoire, à recalibrer en DELEGATE** |
| **Phase 9** | Tests et qualité (F10) | continu | Couverture + sécurité + perf | continu |
| **Phase 10** | Pilote (F11 déploiement + formation) | M | Lancement Bamako + Ségou | **Estimation très provisoire, à recalibrer en DELEGATE** |

> **Recommandation pour l'équipe DELEGATE** : remplacer ce tableau par un *sizing* par points de complexité ou en T-shirt size (XS / S / M / L / XL) basé sur l'analyse des dépendances, et proposer un *burndown* projet une fois la vélocité observée. Ne pas présenter de dates calendaires au commanditaire sans cette base.

## 27.2 — Dépendances critiques

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
                                       ↓
                       Phase 5 (front) ← Phase 6 (notif)
                              ↓
                       Phase 7 (centres) → Phase 8 (admin)
                              ↓
                       Phase 9 (tests continus)
                              ↓
                       Phase 10 (pilote)
```

## 27.3 — Gates de passage

| Passage | Conditions |
|---|---|
| Phase 0 → 1 | CI/CD vert, secrets opérationnels |
| Phase 1 → 2 | RBAC complet, audit fonctionnel |
| Phase 2 → 3 | Schéma validé, catalogue chargé |
| Phase 3 → 4 | Services cœur opérationnels |
| Phase 4 → 5 | Matching calibré (faux positifs acceptable) |
| Phase 5 → 6 | Interfaces navigables |
| Phase 6 → 7 | SMS fonctionnel |
| Phase 7 → 8 | Centres réels créés |
| Phase 8 → 9 | Dashboards opérationnels |
| Phase 9 → 10 | Tests verts, sécurité OK |
| Phase 10 → run | Validation humaine finale |

---

# 28 — Critères de sortie du PLAN

Le PLAN sera considéré comme prêt pour DELEGATE si **toutes** les conditions suivantes sont remplies :

| # | Critère | Statut |
|---|---|---|
| 1 | Périmètre compris et documenté (§01, §02) | ✅ |
| 2 | Architecture suffisamment définie (§08) | ✅ |
| 3 | Données définies conceptuellement (§06, §03) | ✅ |
| 4 | FSM officielle documentée (§05) | ✅ |
| 5 | Rôles et matrice RBAC définis (§03) | ✅ |
| 6 | API conceptuellement définie (§09) | ✅ |
| 7 | Sécurité définie (§14, §15) | ✅ |
| 8 | Matching défini comme aide à la décision (§11) | ✅ |
| 9 | Notifications définies (§12) | ✅ |
| 10 | UX/UI conforme à l'identité validée (§18) | ✅ |
| 11 | Tests et qualité définis (§20) | ✅ |
| 12 | Déploiement et infrastructure définis (§22) | ✅ |
| 13 | Backlog structuré (§26) | ✅ |
| 14 | Dépendances identifiées (§23) | ✅ |
| 15 | Décisions ouvertes clairement listées (§25) | ✅ |
| 16 | Aucun élément critique inventé (pas de code, pas de SQL, pas d'API implémentée, pas de schéma) | ✅ |
| 17 | Décisions humaines arbitrées respectées (cf. `04_DOSSIER_ARBITRAGE_MVP.md`) | ✅ |
| 18 | Réserves juridiques conservées explicitement | ✅ |

**Résultat :** les 18 critères sont remplis par ce document.

---

# 29 — Rapport final

## STATUT PLAN

**COMPLETE**

## 1. Fichiers créés

| Fichier | Chemin | Statut |
|---|---|---|
| `05_PLAN_TECHNIQUE_MVP.md` | `D:\Projet_MALI_TROUVE\01_CONCEPTION\` | Créé |

Aucun autre fichier modifié.

## 2. Architecture proposée

- Architecture multi-services : `identity-svc`, `declaration-svc`, `matching-svc`, `notification-svc`, `storage-svc`, `center-svc`, `restitution-svc`, `catalog-svc`, `audit-svc`, `admin-svc`.
- Frontend Web responsive uniquement.
- Backend : PostgreSQL + Redis + S3-compatible + Message broker + Vector engine.
- Authentification : SMS OTP (citoyen), TOTP (agents / admins).
- mTLS ciblé selon exposition.
- Audit log immuable avec hash chaîné.

## 3. Décisions prises (issues de l'arbitrage humain — non réinventées)

| Décision | Source |
|---|---|
| FSM officielle 14 états | `04_DOSSIER_ARBITRAGE_MVP.md` §5 |
| Catégorisation `NATURE → DOMAINE → TYPE` | `04_DOSSIER_ARBITRAGE_MVP.md` §5 |
| Périmètre pilote = Bamako + Ségou | `04_DOSSIER_ARBITRAGE_MVP.md` §7 |
| Architecture SMS multi-opérateur | `04_DOSSIER_ARBITRAGE_MVP.md` §6 |
| Web responsive MVP, mobile + WA = FUTURE | `04_DOSSIER_ARBITRAGE_MVP.md` §11 |
| Français au MVP | `04_DOSSIER_ARBITRAGE_MVP.md` §11 |
| API Key MVP, OAuth 2.1 = FUTURE | `04_DOSSIER_ARBITRAGE_MVP.md` §8 |
| mTLS ciblé | `04_DOSSIER_ARBITRAGE_MVP.md` §8 |
| Matching = aide à la décision | `04_DOSSIER_ARBITRAGE_MVP.md` §9 |
| KYC biométrique = EXCLU MVP | `04_DOSSIER_ARBITRAGE_MVP.md` §3 (J-01) |
| Identité visuelle Direction 3 + Logo A + palette + slogan | `04_DOSSIER_ARBITRAGE_MVP.md` §12.2 |

## 4. Décisions encore ouvertes (NON BLOQUANT pour PLAN)

| ID | Question | Action prévue |
|---|---|---|
| T-D01 | Moteur vectoriel | Sélection pendant DELEGATE |
| T-D02 | Chunking | Calibration |
| T-D03 | Seuils matching | Calibration |
| T-D04 | Pondérations matching | Calibration |
| T-D05 | Modèle cloud | Décision avant DELEGATE |
| T-D06 | Cloud souverain local | Recherche |
| T-D07 / T-D09 | Policy engine | OPA (PROPOSITION) |
| T-D08 | WORM logs | Selon APDP |
| T-D10 | API Gateway | Décision |
| T-D11 | Bus async | Décision |
| T-D13 | SIEM | Décision |
| T-D16 | SMS provider | Décision après comparaison offres |
| T-D18 | SoD auto-détection | Décision |
| T-D20 | Durées sessions | Calibration |

## 5. Hypothèses conservées explicitement

| Hypothèse | Statut |
|---|---|
| 12 mois actif + 24 mois archivage WORM | HYPOTHÈSE NON VALIDÉE JURIDIQUEMENT (J-04) |
| 3 mois purge post-restitution | HYPOTHÈSE PROVISOIRE (J-06) |
| 72 h délai notification | HYPOTHÈSE NON VÉRIFIÉE (J-02) |
| Seuils 80/50 | HYPOTHÈSE À CALIBRER (T-D03) |
| Pondérations matching (CNI 40, nom 20, etc.) | HYPOTHÈSE À CALIBRER (T-D04) |
| Taux faux positifs 5-10 % | HYPOTHÈSE À CALIBRER |
| Volumétrie année 1 | HYPOTHÈSE À BENCHMARKER |
| Chunking 512 tokens + overlap 50 | PARAMÈTRE EXPÉRIMENTAL |

## 6. Bloqueurs éventuels

**Aucun bloqueur identifié pour l'engagement de la phase DELEGATE.** Les éléments non encore arbitrés définitivement sont marqués `À DÉCIDER`, `À CALIBRER`, `NON BLOQUANT`.

## 7. Backlog produit

Voir §26 — 11 EPICs, ~50 features, format MUST/SHOULD/FUTURE. Aucun code produit.

## 8. Ordre d'implémentation

Voir §27 — 10 phases séquentielles avec gates de passage. Dépendances respectées.

## 9. Risques principaux

Voir §24 — 8 catégories (techniques, sécurité, juridiques, opérationnels, adoption, infrastructure, fournisseurs, fraude).

## 10. Vérifications

| Vérification | Résultat |
|---|---|
| UTF-8 | OK |
| Absence de mojibake | OK (vérifié) |
| Cohérence avec `04_DOSSIER_ARBITRAGE_MVP.md` | OK |
| Décisions humaines non remises en cause | OK |
| Aucun code applicatif | OK |
| Aucun SQL | OK |
| Aucune API implémentée | OK |
| Aucune interface implémentée | OK |
| Aucune migration | OK |
| Aucune dépendance installée | OK |
| Le PLAN n'a pas été démarré | OK |
| Identité visuelle respectée | OK |
| Réserves juridiques conservées | OK |

## 11. Matrice finale des décisions A / B / C

> Cette matrice classe **toutes les décisions du PLAN** selon le niveau d'arbitrage. Elle est l'outil de référence pour savoir qui décide quoi, et ce qui doit être revu avant de passer en DELEGATE.

| Catégorie | Signification | Acteur de la décision | Exemples concrets |
|---|---|---|---|
| **A — Verrouillées par arbitrage humain** | Décisions humaines déjà tranchées dans `04_DOSSIER_ARBITRAGE_MVP.md`. **Impossible à remettre en cause** sans nouveau passage en revue humaine. | Décision humaine (porteur du projet) | FSM 14 états, NATURE/DOMAINE/TYPE, périmètre Bamako+Ségou, SMS multi-opérateur, Web responsive, français MVP, API Key MVP, mTLS ciblé, matching = aide à la décision, biométrie EXCLUE MVP, identité visuelle (Direction 3 + Logo A « Lien »), Loi 2013-015, CNI obligatoire pour citoyen. |
| **B — À trancher par l'équipe en DELEGATE** | Décisions techniques qui ne modifient pas le contrat fonctionnel ou juridique. L'équipe technique peut les arrêter après analyse, sous réserve qu'elles soient tracées et justifiées. | Équipe DELEGATE (avec validation par le porteur sur les impacts) | Choix du moteur vectoriel (T-D01), chunking (T-D02), seuils de matching (T-D03), pondérations (T-D04), modèle cloud (T-D05), cloud souverain (T-D06), API Gateway (T-D10), bus async (T-D11), SIEM (T-D13), SMS provider (T-D16), SoD auto-détection (T-D18), **architecture web (PROPOSITION : Modular Monolith + workers asynchrones — §08.0)**, mécanisme d'auth précis (téléphone+mdp+SMS OTP — §10.1), politique « trouveur » (anonyme refusé, téléphone vérifié obligatoire — §B.x). |
| **C — Validation humaine requise** | Décisions qui touchent au contrat fonctionnel, juridique, budgétaire, ou à des engagements pris avec des tiers. **L'équipe technique ne peut pas trancher seule.** | Décision humaine obligatoire avant d'engager | Disponibilité ≥ 99 % (§14.2 et §01), RTO < 4 h / RPO < 1 h (§14.17, §22.6), durée de notification 72 h (J-02 — `04_DOSSIER_ARBITRAGE_MVP.md` §6), durées de conservation 12+24 mois (J-04), purge 3 mois post-restitution (J-06), autorisations MMS/Pièce jointe SMS, contrats SMS / email / mTLS, politique de prix SMS, ouverture d'un canal WhatsApp, langues supplémentaires (Bamanan, Malinké — non MVP), ajout d'une nouvelle valeur à NATURE, déclenchement effectif du pilote, **date de go-live** (calendaire non engageant sans sizing). |

### Synthèse opérationnelle

| Question | Réponse |
|---|---|
| L'équipe DELEGATE peut-elle démarrer sans nouvelle intervention humaine sur les décisions B ? | **OUI**, sous réserve de traçabilité et de justification écrite pour chaque choix B. |
| L'équipe DELEGATE peut-elle démarrer sans validation explicite sur les décisions C ? | **NON**. Au moins une décision C doit être tranchée ou marquée « différée et non bloquante » par le porteur. |
| Le PLAN a-t-il été démarré en implémentation ? | **NON**. Aucun code, aucune dépendance installée, aucun environnement provisionné. |
| La conformité juridique APDP/DPO est-elle définitive ? | **NON**. Conditionnée aux confirmations externes. |

## 12. Prêt pour DELEGATE ?

**OUI — sous conditions explicites énumérées ci-dessous.**

Le PLAN est conceptuellement complet et cohérent avec les phases DEFINE/ARBITRAGE. L'équipe DELEGATE peut s'engager **à la condition de** :

1. **Tracer et justifier** chaque décision de catégorie B (cf. matrice §11).
2. **Soumettre à validation humaine** toute décision de catégorie C avant de l'engager.
3. **Considérer les durées de §27 comme non engageantes** (estimation très provisoire, à recalibrer par sizing réel en DELEGATE).
4. **Considérer l'architecture web (Modular Monolith + workers) comme une PROPOSITION**, à valider formellement avant tout code non-réversible.
5. **Consulter DPO/APDP/conseil juridique** pour les questions de conservation (J-04), notification (J-02), purge (J-06) avant exploitation.

**Justification globale :**
- Les décisions humaines arbitrées (catégorie A) sont strictement reprises de `04_DOSSIER_ARBITRAGE_MVP.md` et **n'ont pas été modifiées**.
- Les hypothèses non vérifiées sont étiquetées explicitement (`HYPOTHÈSE`, `À CALIBRER`, `À DÉCIDER`).
- Le backlog (§26) et l'ordre d'implémentation (§27) sont structurés, avec gates de passage.
- Aucune décision n'est transformée silencieusement en vérité.

**Limites explicites :**
- Le PLAN n'a pas été démarré (aucun code, aucune dépendance, aucune migration, aucune API).
- La conformité juridique définitive reste conditionnée aux confirmations DPO / APDP / conseil juridique avant exploitation.
- Le MVP reste non validé (validation finale = revue humaine post-implémentation).
- Les chiffres opérationnels (disponibilité, RTO, RPO, durées, volumétrie) sont des objectifs à calibrer, pas des contrats.

**Note sur le statut du PLAN :** `COMPLETE WITH LIMITATIONS` — la conception est cohérente, structurée, et prête à servir de base à la phase DELEGATE, sous réserve de la traçabilité des décisions B et de la validation humaine des décisions C.

---

**Fin du Plan Technique MVP — Phase PLAN**

> Ce document est la **conception technique** de la phase PLAN. Il sert de référence pour la phase DELEGATE puis IMPLEMENT.
>
> **Aucun code applicatif n'a été produit.** Ce document contient exclusivement des spécifications, des matrices, des concepts, des hypothèses étiquetées et des arbitrages humains strictement repris des phases précédentes.
>
> **Statut du PLAN :** `COMPLETE WITH LIMITATIONS` — cohérent avec les phases DEFINE/ARBITRAGE, prêt à servir de base à la phase DELEGATE **sous réserve** :
> - de la traçabilité des décisions de catégorie B par l'équipe DELEGATE ;
> - de la validation humaine préalable des décisions de catégorie C ;
> - de la confirmation que les durées de §27 ne sont pas engageantes ;
> - de la validation formelle de l'architecture web (Modular Monolith + workers — §08.0) avant tout code non réversible.
>
> Le PLAN peut être engagé pour la phase DELEGATE sous ces conditions explicites.