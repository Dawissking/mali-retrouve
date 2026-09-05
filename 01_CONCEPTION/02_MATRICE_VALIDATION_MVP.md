# Matrice de Validation MVP
## MALI RETROUVÉ — Phase DEFINE

---

**Document :** Matrice de validation métier du MVP
**Statut :** À VALIDER PAR LE COMMANDITAIRE — ne constitue pas une spécification finale
**Date de rédaction :** 2026-09-03
**Base du dossier :** 00_DOSSIER_CONCEPTION.md (sections 01-26)

> Cette matrice synthétise toutes les règles métier, parcours, états, rôles, données, rapprochement, restitution, notifications, sécurité et traçabilité nécessaires au MVP. Elle sert d'outil de validation humaine avant la phase PLAN.
>
> **Aucun code n'est produit dans ce document.** Il contient exclusivement des règles métier, des matrices de décision et des traçabilités d'actions.

---

# 1. Objet du document

**RÉSUMÉ.** Cette matrice formalise les règles métier, les parcours, les états, les rôles, les permissions et les contrôles de sécurité du MVP de MALI RETROUVÉ, pour validation par le commanditaire avant passage à la phase PLAN.

**CHAMP D'APPLICATION.** Plateforme nationale malienne de déclaration, rapprochement et restitution de documents et objets perdus ou trouvés.

**CYCLE MÉTIER CENTRAL :**

```
PERDRE → DÉCLARER → RAPPROCHER → VÉRIFIER → RESTITUER → CLÔTURER
```

---

# 2. Périmètre MVP

**SOURCE.** §22 — MVP du dossier de conception.

### 2.1 — Classification des exigences

| Priorité | Statut |
|---|---|
| MUST HAVE | À VALIDER — périmètre non finalisé |
| SHOULD HAVE | À VALIDER — périmètre non finalisé |
| COULD HAVE | À VALIDER — périmètre non finalisé |
| FUTURE | Exclu du MVP |

### 2.2 — Exigences MUST HAVE

| Fonctionnalité | Description | Statut |
|---|---|---|
| Déclaration de perte | Citoyen déclare document/objet perdu | À VALIDER |
| Déclaration de trouvaille | Citoyen/centre dépose objet trouvé | À VALIDER |
| Rapprochement intelligent | Score de similarité + seuils | À VALIDER (seuils) |
| Validation humaine | Agent homme valide tout match | VALIDÉ — RÈGLE ABSOLUE |
| Restitution au centre | Agent centre gère restitution | À VALIDER |
| Authentification citoyenne | SMS/MFA obligatoire | À VALIDER |
| Notifications | SMS + email de base | À VALIDER |
| Gestion centres | CRUD centres | À VALIDER |
| Gestion agents | CRUD agents + rôles | À VALIDER |
| Contrôle RBAC | 7 rôles définis | RECOMMANDÉ |
| Traçabilité | Journal immuable des actions | RECOMMANDÉ |

### 2.3 — Exigences SHOULD HAVE

| Fonctionnalité | Statut |
|---|---|
| Administration nationale | À VALIDER |
| Tableaux de bord | À VALIDER |
| Statistiques | À VALIDER |
| Multilingue (FR + bambara) | À VALIDER |
| Audit/SIEM | À VALIDER |

### 2.4 — Exigences FUTURE (hors MVP)

| Fonctionnalité | Statut |
|---|---|
| FIDO2 | FUTURE |
| KYC biométrique | FUTURE |
| Notifications push | FUTURE |
| IA prédictive avancée | FUTURE |

### 2.5 — Exclusions du MVP

| Exclusion | Justification |
|---|---|
| Matching automatique (score 96% = propriétaire) | **VALIDÉ — INTERDIT** : jamais de décision automatique |
| Restitution sans validation humaine | **VALIDÉ — INTERDIT** |
| Mobile Money | Gratuit au lancement |
| Centres dans tous les villages | Pilote : Bamako + 1 région seulement |
| Objets non catalogués comme catégorie libre | **À VALIDER — STRUCTURATION DES CATÉGORIES MVP** (§07.2 du dossier) |

---

# 3. Acteurs

**SOURCE.** §03, §18.1 — Dossier de conception.

| # | Acteur | Rôle | Niveau de confiance |
|---|---|---|---|
| 1 | **Citoyen / déclarant** | Usager du service | Basique — MFA SMS |
| 2 | **Personne ayant trouvé** | Déclarant trouvaille | Basique — MFA SMS |
| 3 | **Agent de centre** | Opérateur terrain, validation | Élevé — MFA obligatoire |
| 4 | **Responsable de centre** | Supervision locale | Élevé — MFA + FIDO2 V2 |
| 5 | **Administrateur territorial** | Supervision région | Élevé — MFA + FIDO2 V2 |
| 6 | **Administrateur national** | Configuration, politiques | Très élevé — MFA + FIDO2 V2 |
| 7 | **Auditeur** | Contrôle/conformité | Très élevé — MFA + FIDO2 V2 |

### 3.1 — Matrice des permissions par acteur

| Action | Citoyen | Personne trouv | Agent centre | Resp. centre | Admin terri. | Admin nat. | Auditeur |
|---|---|---|---|---|---|---|---|
| Déclarer perte | ✅ | — | — | — | — | — | — |
| Déposer trouvaille | — | ✅ | — | — | — | — | — |
| Voir mes déclarations | ✅ | ✅ | — | — | — | — | — |
| Voir correspondances propres | ✅ | — | — | — | — | — | — |
| Accepter/rejeter match | ✅ | — | — | — | — | — | — |
| Voir matchs centre | — | — | ✅ | ✅ | — | — | — |
| Valider restitution | — | — | ✅ | ✅ | — | — | — |
| Gérer centres | — | — | — | ✅ | ✅ | ✅ | lecture |
| Gérer agents | — | — | — | ✅ | ✅ | ✅ | lecture |
| Voir tous les matchs | — | — | — | — | ✅ | ✅ | ✅ |
| Modifier seuils matching | — | — | — | — | — | ✅ | — |
| Voir logs d'audit | — | — | — | — | — | ✅ | ✅ |
| Modifier rôles | — | — | — | — | — | ✅ | — |
| Voir données PII | — | — | Limité | Limité | Limité | Oui | Oui |

---

# 4. Parcours métier

**SOURCE.** §04 — Parcours utilisateurs du dossier.

## A. J'A.I PERDU

| Étape | Acteur | Action | Données impliquées | État cible | Audit |
|---|---|---|---|---|---|
| A1 | Citoyen | Accède à l'accueil | Aucune | BROUILLON | Non |
| A2 | Citoyen | Saisit CNI (scan ou manuel) | CNI, nom | BROUILLON | Non |
| A3 | Citoyen | Sélectionne catégorie objet | Catégorie, description | BROUILLON | Non |
| A4 | Citoyen | Saisit description + photo | Description, photo | BROUILLON | Non |
| A5 | Citoyen | Confirme + accepte CGU | Toutes | SOUMISE | ✅ |
| A6 | Système | Attribution numéro suivi | Numéro de suivi | SOUMISE | ✅ |
| A7 | Système | Déclenche matching | Toutes les données | EN_ATTENTE_RAPPROCHEMENT | ✅ |

## B. J'AI TROUVÉ

| Étape | Acteur | Action | Données impliquées | État cible | Audit |
|---|---|---|---|---|---|
| B1 | Trouvaille | Accède à l'accueil | Aucune | BROUILLON | Non |
| B2 | Trouvaille | Saisit détails objet | Catégorie, description | BROUILLON | Non |
| B3 | Trouvaille | Option : saisit CNI | CNI (optionnel) | BROUILLON | Non |
| B4 | Trouvaille | Télécharge photo | Photo | BROUILLON | Non |
| B5 | Trouvaille | Confirme dépôt | Toutes | SOUMISE | ✅ |
| B6 | Système | Attribution numéro dépôt | Numéro | SOUMISE | ✅ |
| B7 | Système | Déclenche matching | Toutes | EN_ATTENTE_RAPPROCHEMENT | ✅ |
| B8 | Système | Transmet au centre géographique | Toutes | ASSIGNÉE_AU_CENTRE | ✅ |

## C. RAPPROCHEMENT

| Étape | Acteur | Action | Décision | État cible | Audit |
|---|---|---|---|---|---|
| C1 | matching-svc | Scanne dépôts/trouvaille existants | Algorithme | — | ✅ |
| C2 | matching-svc | Calcule score (0-100) | Score + critères | — | ✅ |
| C3 | Système | Score ≥ 80 → "correspondance potentielle" | Seuil | CORRESPONDANCE_TROUVÉE | ✅ |
| C4 | Système | Score 50-79 → "à vérifier" | Seuil | EN_VALIDATION_HUMAINE | ✅ |
| C5 | Système | Score < 50 → surveillance 12 mois | Seuil | EN_ATTENTE_RAPPROCHEMENT | ✅ |
| C6 | matching-svc | Envoi notification au citoyen | Score ≥ 80 | — | ✅ |

## D. VALIDATION HUMAINE

| Étape | Acteur | Action | Décision | État cible | Audit |
|---|---|---|---|---|---|
| D1 | Agent centre | Reçoit notification correspondance | — | À_TRAITER | ✅ |
| D2 | Agent centre | Consulte score + critères + photos | — | — | ✅ (visualisation) |
| D3 | Agent centre | Valide ou rejette le match | Choix humain | VALIDÉE / REJETÉE | ✅ |
| D4 | Agent centre | Vérifie pièce d'identité | Vérif | — | ✅ |
| D5 | Système | Double validation pour objets sensibles | Règle | — | ✅ (si applicable) |

## E. CONTACT / NOTIFICATION

| Événement | Destinataire | Canal | Contenu | Journal |
|---|---|---|---|---|
| E1 | Match validé | SMS + email | Numéro de suivi + centre à contacter | ✅ |
| E2 | Déclaration sans correspondance (12 mois) | Email | Aucune correspondance trouvée | ✅ |
| E3 | Restitution effectuée | SMS + email | Confirmation restitution | ✅ |
| E4 | Déclaration modifiée | Email | Notification modification | ✅ |

## F. RESTITUTION

| Étape | Acteur | Action | Preuve | État cible | Audit |
|---|---|---|---|---|---|
| F1 | Citoyen | Présente déclaration (numéro ou CNI) | Numéro suivi/CNI | RESTITUTION_PLANIFIÉE | ✅ |
| F2 | Agent centre | Vérifie pièce d'identité | Pièce scannée | — | ✅ |
| F3 | Agent centre | Vérifie objet identique | Description/photo | — | ✅ |
| F4 | Agent centre | Citoyen confirme réception | Signature électronique | RESTITUÉE | ✅ |
| F5 | Système | Notifie déclarant trouvaille | Numéro suivi | CLÔTURÉE | ✅ |

## G. CLÔTURE

| Étape | Acteur | Condition | État final | Audit |
|---|---|---|---|---|
| G1 | Système | Restitution confirmée | CLÔTURÉE | ✅ |
| G2 | Agent | Rejet match (faux positif) | REJETÉE | ✅ |
| G3 | Citoyen | Annulation déclaration (brouillon) | ANNULÉE | ✅ |

## H. DÉCLARATION SANS CORRESPONDANCE

| Condition | Action | Notification | Archivage |
|---|---|---|---|
| Score < 50 pendant 12 mois | Surveillance passive | Email relance à 6 mois | Archivage après 12 mois → ARCHIVÉE |

## I. CORRESPONDANCE CONTESTÉE

| Étape | Acteur | Action | Résolution |
|---|---|---|---|
| I1 | Citoyen | Contestation match | Signalement |
| I2 | Agent centre | Investigation | Rejet ou confirmation |
| I3 | Auditeur | Audit si litige persistant | Décision finale |

## J. SUSPICION DE FRAUDE

| Signale | Détecte | Action | Audit |
|---|---|---|---|
| Anti-énumération | Rate limiting | Blocage IP | ✅ |
| Déclaration abus | CAPTCHA + hash similarité | Modération | ✅ |
| Doublon | Hash description | Rejet | ✅ |
| Agent malveillant | UEBA (D16) | Révocation + investigation | ✅ |

## K. DÉCLARATION MODIFIÉE

| Action | Permis | Interdit | Conditions | Audit |
|---|---|---|---|---|
| Modifier description | BROUILLON uniquement | Après SOUMISE | Aucun | ✅ |
| Modifier photo | BROUILLON uniquement | Après SOUMISE | Aucun | ✅ |
| Modifier CNI | Jamais | Toujours | — | ✅ |

## L. DÉCLARATION ANNULÉE

| Action | Permis | Motif requis | Audit |
|---|---|---|---|
| Annuler brouillon | Citoyen | Aucun | — |
| Annuler dépôt | Responsable centre | Motif | ✅ |

## M. EXPIRATION / ARCHIVAGE

| Condition | Action | Statut |
|---|---|---|
| 12 mois sans restitution | Passage à ARCHIVÉE | RECOMMANDÉ |
| 12 mois sans correspondance | Passage à ARCHIVÉE | À VALIDER (V16) |

---

# 5. États métier

**SOURCE.** §06 — Règles métier du dossier.

### 5.1 — États définis dans le dossier (FSM)

**SOURCE.** §06.1, §06.2, §13.2

```
DéclarationPerte :
CRÉÉ → EN_ATTENTE_RAPPROCHEMENT → CORRESPONDANCE_TROUVÉE → [ACCEPTÉE → RESTITUTION_EN_COURS → RÉGLÉE]
                                                           → [REJETÉE]
                                                           → [EXPIRÉE]

DepotTrouvaille :
CRÉÉ → EN_ATTENTE_RAPPROCHEMENT → CORRESPONDANCE_TROUVÉE → [ASSIGNÉE_AU_CENTRE → RESTITUÉE]
                                                           → [NON_RAPPROCHÉE → ARCHIVÉE]
```

### 5.2 — États supplémentaires proposés (À VALIDER)

**SOURCE.** Proposition du commanditaire

| État proposé | Mapping dossier | Commentaire | Statut |
|---|---|---|---|
| BROUILLON | CRÉÉ | Sous-état de CRÉÉ | À VALIDER |
| SOUMISE | CRÉÉ → EN_ATTENTE_RAPPROCHEMENT | Transition explicite | À VALIDER |
| EN VÉRIFICATION | EN_ATTENTE_RAPPROCHEMENT | Synonyme possible | À VALIDER |
| ACTIVE | CORRESPONDANCE_TROUVÉE | Synonyme possible | À VALIDER |
| RAPPROCHEMENT_POTENTIEL | CORRESPONDANCE_TROUVÉE | Synonyme possible | À VALIDER |
| EN_VALIDATION_HUMAINE | CORRESPONDANCE_TROUVÉE | Synonyme possible | À VALIDER |
| VALIDÉE | ACCEPTÉE | Synonyme possible | À VALIDER |
| RESTITUTION_PLANIFIÉE | RESTITUTION_EN_COURS | Synonyme possible | À VALIDER |
| RESTITUÉE | RÉGLÉE / RESTITUÉE | Synonyme possible | À VALIDER |
| CLÔTURÉE | RÉGLÉE | Synonyme possible | À VALIDER |
| REJETÉE | REJETÉE | Conforme | À VALIDER |
| ANNULÉE | — | Nouvel état | À VALIDER |
| ARCHIVÉE | EXPIRÉE / ARCHIVÉE | Synonyme possible | À VALIDER |
| SUSPENDUE | — | Nouvel état | À VALIDER |

### 5.3 — Matrice de transition (FSM)

**SOURCE.** §06.1, §06.2

| De | Vers | Acteur | Condition | Audit |
|---|---|---|---|---|
| CRÉÉ | EN_ATTENTE_RAPPROCHEMENT | Système | Déclenchement matching | ✅ |
| EN_ATTENTE_RAPPROCHEMENT | CORRESPONDANCE_TROUVÉE | Système | Score ≥ seuil | ✅ |
| CORRESPONDANCE_TROUVÉE | ACCEPTÉE | Agent | Validation humaine | ✅ |
| ACCEPTÉE | RESTITUTION_EN_COURS | Agent | Vérif pièce + objet | ✅ |
| RESTITUTION_EN_COURS | RÉGLÉE | Système | Confirmation réception | ✅ |
| CORRESPONDANCE_TROUVÉE | REJETÉE | Agent | Rejet manuel | ✅ |
| CORRESPONDANCE_TROUVÉE | NON_RAPPROCHÉE | Système | 12 mois sans match | ✅ |
| NON_RAPPROCHÉE | ARCHIVÉE | Système | Expiration 12 mois | ✅ |

**CONFLICT.** La proposition de 14 états du commanditaire n'est pas directement mappée sur la FSM du dossier (7 états principaux). **À VALIDER** — harmonisation des deux modèles d'états.

---

# 6. Matrice des fonctionnalités

**SOURCE.** §05 — Fonctionnalités du dossier.

| Fonctionnalité | Module | MVP | Priorité | Statut |
|---|---|---|---|---|
| Déclaration perte | declaration-svc | MUST | Haute | À VALIDER |
| Dépôt trouvaille | declaration-svc | MUST | Haute | À VALIDER |
| Rapprochement | matching-svc | MUST | Haute | RECOMMANDÉ |
| Validation humaine | restitution-svc | MUST | Haute | VALIDÉ |
| Restitution | restitution-svc | MUST | Haute | À VALIDER |
| Gestion centres | center-svc | MUST | Haute | À VALIDER |
| Gestion agents | center-svc | MUST | Haute | À VALIDER |
| RBAC | identity-svc | MUST | Haute | RECOMMANDÉ |
| Notifications | notification-svc | MUST | Haute | À VALIDER |
| Géographie | catalog-svc | MUST | Haute | À VALIDER |
| Audit | audit-svc | MUST | Haute | RECOMMANDÉ |
| Administration | admin-svc | SHOULD | Moyenne | À VALIDER |
| Tableaux de bord | admin-svc | SHOULD | Moyenne | À VALIDER |
| Multilingue | i18n | SHOULD | Moyenne | À VALIDER |

---

# 7. Matrice des données

**SOURCE.** §07, §12 — Dossier de conception.

### 7.1 — Classification sensibilité des données

| Donnée | Niveau de sensibilité | Public lisible | Justification |
|---|---|---|---|
| Numéro de CNI | 🔴 Très sensible | Citoyen + agent centre + admin national | Identifier personne |
| Nom + prénom | 🔴 Très sensible | Citoyen + agent centre | PII |
| Date de naissance | 🔴 Très sensible | Citoyen + agent centre | PII |
| Photo CNI (recto/verso) | 🔴 Très sensible | Citoyen + agent centre | Document d'identité |
| Description objet | 🟡 Moyennement sensible | Citoyen, agent centre, admin (anonci) | Données de localisation |
| Photo objet | 🟡 Moyennement sensible | Citoyen, agent centre | Localisation |
| Score de matching | 🟢 Publique | Agent centre, admin | Statistique |
| Historique des actions | 🟢 Publique | Auditeur, admin | Audit |
| IP / UA session | 🔴 Très sensible | Admin sécurité uniquement | Investigation |
| Clé de session | 🔴 Très sensible | Système uniquement | Auth |

### 7.2 — Fiche publique d'objet retrouvé (exemple)

**SOURCE.** §13.2 — Dossier.

> « Document/CNI retrouvée — Bamako, Commune VI — le [date] — Référence MR-[CNI]-45872 »

La fiche publique ne contient :
- ✅ Catégorie de l'objet
- ✅ Ville/commune approximative (pas de localisation exacte)
- ✅ Date de dépôt (pas d'heure exacte)
- ✅ Référence anonyme

La fiche publique n'expose :
- ❌ Aucun PII du déclarant
- ❌ Aucun PII du trouve

### 7.3 — Catégories d'objets (À VALIDER)

**SOURCE.** §07.1 — Dossier.

| Catégorie haut niveau | Sous-catégorie | Type | MVP | Statut |
|---|---|---|---|---|
| Document | Document officiel | CNI, passeport, acte naissance | ✅ | À VALIDER — STRUCTURATION |
| Document | Document administratif | Facture, courrier | ✅ | À VALIDER — STRUCTURATION |
| Objet | Objet personnel | Téléphone, montre, clés | ✅ | À VALIDER — STRUCTURATION |
| Objet | Objet de valeur | Bijou, œuvre d'art | ❌ | À VALIDER — STRUCTURATION |
| Animal | Animal | Chien, chat | ❌ | À VALIDER — STRUCTURATION |
| Autre | Non classé | — | ❌ | À VALIDER — STRUCTURATION |

---

# 8. Matrice des rôles et permissions

**SOURCE.** §03.6, §08.4 — Dossier.

### 8.1 — Rôles (7)

| Rôle | Population | Périmètre | MFA requis |
|---|---|---|---|
| Citoyen | Usager | Son profil | SMS/MFA |
| Agent centre | Opérateur terrain | Centre d'affectation | TOTP |
| Responsable centre | Chef de centre | Centre d'affectation | TOTP + FIDO2 V2 |
| Administrateur régional | Admin déconcentrée | Région | TOTP + FIDO2 V2 |
| Administrateur national | Admin centrale | Pays | TOTP + FIDO2 V2 |
| Auditeur | Contrôle/conformité | Pays | TOTP + FIDO2 V2 |
| Administrateur technique | Ops/SRE | Infra | TOTP + FIDO2 V2 |

### 8.2 — Matrice RBAC complète

| Permission | Citoyen | Agent | Resp | Admin rég. | Admin nat. | Auditeur | Admin tech |
|---|---|---|---|---|---|---|---|
| Déclarer perte | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Déposer trouvaille | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Voir mes données | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Accepter match | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Voir matchs centre | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Valider restitution | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gérer centres | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Gérer agents | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Modifier seuils | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Voir tous les matchs | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Voir logs audit | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Gérer politiques | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Gérer infrastructure | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 8.3 — Contrôle SoD (Ségrégation des responsabilités)

| Conflit | Règle | Statut |
|---|---|---|
| Un agent ne peut pas valider sa propre déclaration | ✅ Interdit | RECOMMANDÉ |
| Un agent ≠ superviseur régional | ✅ Séparé | RECOMMANDÉ |
| Un admin ≠ auditeur | ✅ Séparé | RECOMMANDÉ |
| Vérification automatique des conflits | À activer | À VALIDER (D18) |

---

# 9. Matrice du rapprochement

**SOURCE.** §13 — Dossier de conception.

### 9.1 — Données comparées

| Critère | Source | Type |
|---|---|---|
| CNI | Déclarant | Exact match |
| Nom + prénom | Déclarant | Similarité (Levenshtein/phonétique) |
| Date de naissance | Déclarant | Exact match |
| Description objet | Déclarant/Trouve | Similarité textuelle |
| Lieu de perte/trovaille | Cartographie | Distance géographique |
| Date de perte/trovaille | Déclarant | Proximité temporelle |

### 9.2 — Score de similarité (À VALIDER)

| Critère | Poids | Score max |
|---|---|---|
| CNI (numéro exact) | 40% | 40 |
| Nom + prénom (similarité) | 20% | 20 |
| Date de naissance | 15% | 15 |
| Description objet | 15% | 15 |
| Lieu (proximité géographique) | 5% | 5 |
| Date (proximité temporelle) | 5% | 5 |
| **Total** | 100% | **100** |

### 9.3 — Seuils de décision (À VALIDER)

| Score | État | Action | Validé par |
|---|---|---|---|
| ≥ 80 | CORRESPONDANCE_TROUVÉE | Notification citoyen → VALIDÉE par agent | Humain (obligatoire) |
| 50-79 | EN_VALIDATION_HUMAINE | Proposition à agent centre | Humain (obligatoire) |
| < 50 | EN_ATTENTE_RAPPROCHEMENT | Surveillance 12 mois | — |
| 100 (CNI exact + nom + date) | CORRESPONDANCE_TROUVÉE | Priorité maximale | Humain (obligatoire) |

### 9.4 — Règles de matching

| Règle | Condition | Action |
|---|---|---|
| R1 | Score ≥ 80 | Proposer correspondance au citoyen |
| R2 | Score 50-79 | Proposer correspondance à l'agent |
| R3 | Score < 50 | Pas de correspondance — surveillance |
| R4 | Doublon détecté | Rejet automatique |
| R5 | Homonyme (nom commun) | Score réduit + exigence autre critère |
| R6 | CNI absent (anonyme) | Score 0 — exclusion matching |

### 9.5 — Faux positifs / négatifs

| Type | Cause | Mitigation |
|---|---|---|
| Faux positif | Homonyme + même CNI (vol) | Vérification pièce + empreintes |
| Faux négatif | Description vague | Agent force correspondance manuelle |
| Taux estimé | — | 5-10% (HYPOTHÈSE — À VALIDER) |

---

# 10. Matrice de validation humaine

**SOURCE.** §13.1 — Dossier (RÈGLE ABSOLUE).

### 10.1 — Décisions réservées à l'humain

| ID | Décision | Qui | Procédure | Statut |
|---|---|---|---|---|
| VH-01 | Confirmer un match | Agent centre | Vérifier CNI + pièce + objet | VALIDÉ |
| VH-02 | Refuser un match | Agent centre | Motif requis | VALIDÉ |
| VH-03 | Forcer un match faible score | Agent center | Justification | RECOMMANDÉ |
| VH-04 | Override règle matching | Admin national | Motivation | À VALIDER |
| VH-05 | Clôturer sans restitution | Responsable centre | Motif | À VALIDER |
| VH-06 | Bloquer une déclaration | Admin national | Investigation | À VALIDER |

### 10.2 — Workflow validation

```
1. Agent reçoit notification correspondance
2. Agent consulte score, critères, photos, CNI du déclarant
3. Agent vérifie pièce d'identité du réclamant en présentiel
4. Agent compare objet physique avec description/photo
5. Agent valide ou rejette (motif si rejet)
6. Si objet sensible : double validation (responsable centre)
7. Système notifie le trouve et le perdant
```

---

# 11. Matrice de restitution

**SOURCE.** §06.4, §15.2 — Dossier.

### 11.1 — Conditions de restitution

| Condition | Exigence |
|---|---|
| Identité du réclamant | Pièce d'identité vérifiée + CNI correspondant |
| Objet | Physiquement présent au centre |
| Autorisation | Match VALIDÉE par agent |

### 11.2 — Procédure pas à pas

| Étape | Acteur | Action | Preuve | Audit |
|---|---|---|---|---|
| R1 | Citoyen | Présente référence suivi ou CNI | Numéro suivi | ✅ |
| R2 | Agent | Vérifie pièce d'identité | Photo pièce scannée | ✅ |
| R3 | Agent | Vérifie CNI correspond au déclarant | Comparaison CNI | ✅ |
| R4 | Agent | Présente l'objet | Photo objet | ✅ |
| R5 | Agent | Citoyen confirme réception | Signature électronique | ✅ |
| R6 | Système | Met à jour état | — | ✅ |
| R7 | Système | Notifie le trouve | Numéro suivi | ✅ |

### 11.3 — Refus de restitution

| Motif | Action | Notification | Audit |
|---|---|---|---|
| Pièce invalide | Refus | Citoyen informed | ✅ |
| CNI ne correspond pas | Refus | Citoyen informed | ✅ |
| Objet non identique | Refus | Citoyen informed | ✅ |
| Contestation | Escalade | Agent → Responsable | ✅ |

---

# 12. Matrice des notifications

**SOURCE.** §14 — Dossier.

### 12.1 — Événements déclencheurs

| Événement | Destinataire | Canal | Contenu | Sensibilité |
|---|---|---|---|---|
| N1 | Déclarant perte | SMS + email | Numéro suivi créé | 🔴 |
| N2 | Citoyen (match ≥80) | SMS | Correspondance potentielle | 🟡 |
| N3 | Agent centre | Push interne | Nouvelle correspondance | 🟢 |
| N4 | Déclarant trouvaille | Email | Aucune correspondance (6 mois) | 🟡 |
| N5 | Citoyen (restitution) | SMS + email | Confirmation restitution | 🟢 |
| N6 | Citoyen (expiré) | Email | Archivage (12 mois) | 🟢 |
| N7 | Citoyen (modifié) | Email | Notification modification | 🟡 |
| N8 | Admin | Slack/Teams | Exception système | 🟡 |

### 12.2 — Règles d'envoi

| Règle | Détails |
|---|---|
| Idempotence | Idempotency-Key UUID (24h) |
| Rate limit | Max 3 notif/jour/citoyen |
| Retry | Exponentiel + DLQ |
| Fallback | SMS → email si échec |
| Multilingue | FR + bambara (À VALIDER: autres langues V12) |

---

# 13. Matrice des centres

**SOURCE.** §15 — Dossier.

### 13.1 — Création d'un centre

| Élément | Source | Statut |
|---|---|---|
| Nom | Administration | À VALIDER (D11) |
| Adresse | Administration | À VALIDER |
| Géolocalisation | GPS ou adresse | À VALIDER |
| Type | Mairie, police, gendarmerie, centre communal | À VALIDER (D11) |
| Capacité (nb objets) | Administration | À VALIDER (V9) |
| Horaires | Centre | À VALIDER |

### 13.2 — Gestion des agents

| Action | Responsable | Audit |
|---|---|---|
| Attribution rôle | Responsable supérieur | ✅ |
| Révocation rôle | Responsable supérieur | ✅ |
| Désactivation | Responsable supérieur | ✅ |

### 13.3 — Transferts entre centres

| Condition | Action | Audit |
|---|---|---|
| Centre saturé | Transférer à centre voisin | ✅ |
| Fermeture centre | Reassigner tous les objets | ✅ |

---

# 14. Matrice sécurité / lutte contre la fraude

**SOURCE.** §08, §24 — Dossier.

### 14.1 — Menaces et contrôles

| Menace | Prévention | Détection | Correction |
|---|---|---|---|
| Fausse déclaration | CAPTCHA adaptatif, rate limiting | Audit logs | Refus + signalement |
| Fausse trouvaille | Vérification pièce au centre | Audit logs | Refus restitution |
| Usurpation identité | MFA, vérification CNI | SIEM alertes | Verrouillage + investigation |
| Exposition données | Chiffrement AES-256, RBAC | Scan vulnérabilité | Correctif + notification APDP |
| Scraping massif | Rate limiting IP + CAPTCHA | Logs volume | Blocage |
| Énumèreration | Messages génériques | Logs erreurs auth | Throttling |
| Manipulation matching | Validation humaine OBLI GATOIRE | Audit logs match | Audit trail + correction |
| Agent malveillant | SoD, MFA, journalisation | UEBA (D16) | Révocation + investigation |
| Privilèges excès | RBAC/ABAC revues périodiques | Access logs | Révocation immédiate |
| FRAUDE INTERNE | SoD + UEBA + journalisation | SIEM | Investigation + sanctions |
| Téléchargement abusif | Quotas + logs | Logs volume | Limitation |
| Spam/notifications | Max 3 notif/jour | Logs | Ajustement templates |
| Compromission compte | MFA + révocation tokens | Logs connexion | Reset MFA |
| Panne centrale | Multi-zone + PRA | Monitoring | Fail-over automatique |

**SOURCE.** §24.1 — Matrice des risques.

### 14.2 — Contrôles d'authentification

| Niveau | Mécanisme | Usage | Statut |
|---|---|---|---|
| Basique | Mot de passe + SMS/MFA | Citoyens | RECOMMANDÉ |
| Élevé | TOTP + FIDO2 | Agents/Responsables | RECOMMANDÉ |
| Très élevé | FIDO2 uniquement | Admins/Administrateurs | À VALIDER (D8) |

### 14.3 — Contrôles d'accès

| Contrôle | Implémentation | Statut |
|---|---|---|
| RBAC 7 rôles | Open Policy Agent (OPA) | RECOMMANDÉ |
| ABAC léger | Scope géographique + ownership + état + temps | RECOMMANDÉ |
| SoD automatique | Détection conflits à création compte | À VALIDER (D18) |
| Sessions | Cookies Secure/HttpOnly/SameSite=Strict | RECOMMANDÉ |

---

# 15. Matrice audit / traçabilité

**SOURCE.** §08.9, §08.10 — Dossier.

### 15.1 — Événements journalisés

| Événement | Niveau | PII dans log | Rétention |
|---|---|---|---|
| Authentification (succès/échec) | Info | Adresse IP | 36 mois |
| Déclaration créée/modifiée | Info | CNI hashée | 36 mois |
| Score de matching calculé | Info | Aucun | 36 mois |
| Validation/rejet par agent | Info | ID agent | 36 mois |
| Restitution effectuée | Info | CNI hashée | 36 mois |
| Accès aux données | Info | ID utilisateur | 36 mois |
| Modification politique | Info | ID admin | 36 mois |
| Violation tentée | Alert | IP suspecte | 36 mois |

### 15.2 — Propriétés des logs

| Propriété | Exigence | Statut |
|---|---|---|
| Immuabilité | Append-only + hash chaîné | RECOMMANDÉ |
| Intégrité | WORM si exigé APDP (D5) | À VALIDER |
| Confidentialité | Clef distincte par catégorie | RECOMMANDÉ |
| Recherche | Indexées pour SIEM | À VALIDER (D16) |

### 15.3 — Rétention des données

| Donnée | Rétention active | Archivage | Mode | Statut |
|---|---|---|---|---|
| Déclarations perte | 12 mois | 24 mois | WORM | À VALIDER (V16) |
| Dépôts trouvaille | 12 mois | 24 mois | WORM | À VALIDER (V16) |
| Photos CNI/biométrie | Jusqu'à restitution + 3 mois | 24 mois | WORM chiffré | À VALIDER (V5) |
| Logs audit | 36 mois | 5 ans | SIEM | RECOMMANDÉ |
| Sessions | 8 h | Purge | Redis TTL | RECOMMANDÉ |

---

# 16. Conservation / archivage

**SOURCE.** §06.5, §08.11 — Dossier.

### 16.1 — Cycle de vie des données

```
CRÉÉ → ACTIF → (CLÔTURÉ/RESTITUÉ) → ARCHIVÉ → EXPIRÉ → PURGÉ
```

| État | Durée | Action |
|---|---|---|
| Actif | 12 mois | Consultation + matching actif |
| Archivé | 24 mois | Consultation en lecture seule |
| Expiré | 0 mois | Après 36 mois → suppression |
| Purged | 0 mois | Suppression irréversible |

### 16.2 — Processus de suppression

| Étape | Description | Audit |
|---|---|---|
| 1. Demande suppression | Citoyen ou admin | ✅ |
| 2. Période de grâce | 30 jours | ✅ |
| 3. Purge physique | Irréversible | ✅ |
| 4. Confirmation | Notification | ✅ |

**STATUT : RECOMMANDÉ — À valider procédure finale.**

---

# 17. Cas d'erreur et exceptions

### 17.1 — Erreurs système

| Erreur | Comportement | Notification |
|---|---|---|
| Échec envoi SMS | Fallback email | Agent notifié |
| Échec calcul matching | File retry + DLQ | Admin notifié |
| Défaillance centre | Transfert centre voisin | Agent notifié |
| Timeout base | Retry exponentiel | Admin notifié |

### 17.2 — Exceptions métier

| Cas | Résolution | Audit |
|---|---|---|
| Double déclaration | Rejet automatique + notification | ✅ |
| CNI invalide | Blocage + demande rectification | ✅ |
| Centre saturé | Redirection centre voisin | ✅ |
| Match contesté | Escalade auditeur | ✅ |
| Suspiscion fraud | Signalement + investigation | ✅ |

---

# 18. Identité visuelle validée

**SOURCE.** §17, §18, §19, §20 — Dossier de conception.

**STATUT : VALIDÉ (commanditaire, 2026-09-02)**

### 18.1 — Direction artistique

| Élément | Valeur validée |
|---|---|
| Direction | Direction 3 — Communautaire modernisée |
| Logo | Proposition A — « Lien » |
| Slogan | « Ensemble, retrouvons l'essentiel. » |
| Slogan alternatif | « Chaque document a son propriétaire. Chaque objet peut être retrouvé. » (usage institutionnel) |

### 18.2 — Palette de référence

| Usage | Couleur | Code |
|---|---|---|
| Vert principal | Vert | `#1B6E3F` |
| Accent | Terre cuite | `#CC5500` |
| Fond chaud | Beige | `#F5F0E1` |
| Texte | Gris foncé | `#333333` |
| Fond | Blanc | `#FFFFFF` |
| Alerte/erreur | Rouge | `#E53935` |

### 18.3 — Typographie

| Usage | Police | Statut |
|---|---|---|
| Titres | Poppins | PROPOSÉ |
| Corps | Nunito | PROPOSÉ |
| Code | Monospace système | PROPOSÉ |

→ À VALIDER — typographies définitives

### 18.4 — Contraintes

| Contrainte | Description |
|---|---|
| Pas de nouveau logo | INTERDIT sans validation humaine |
| Pas de modification symbole | INTERDIT sans validation humaine |
| Pas de changement palette | INTERDIT sans validation humaine |
| Règles design system | À définir (contrastes, espacements, graisses) |
| Accessibilité | WCAG AA minimum |

---

# 19. Décisions déjà validées

### 19.1 — Par le commanditaire (2026-09-02)

| ID | Décision | Statut |
|---|---|---|
| IV-01 | Direction artistique = Direction 3 | VALIDÉ |
| IV-02 | Logo = Proposition A « Lien » | VALIDÉ |
| IV-03 | Vert principal = #1B6E3F | VALIDÉ |
| IV-04 | Slogan = « Ensemble, retrouvons l'essentiel. » | VALIDÉ |
| M-01 | Matching intelligent = aide à décision uniquement | VALIDÉ |
| M-02 | Validation humaine = toujours requise | VALIDÉ |
| M-03 | Aucun matching 96% = interdit | VALIDÉ |
| M-04 | Pas de Mobile Money dans MVP | VALIDÉ |
| M-05 | Pilote = Bamako + 1 région | À VALIDER |

### 19.2 — Par la loi (Loi 2013-015)

| ID | Décision | Statut |
|---|---|---|
| J-01 | Consentement explicite requis | VALIDÉ (source légale) |
| J-02 | Registre des traitements requis | VALIDÉ (source légale) |

---

# 20. Décisions restant à valider

### 20.1 — Produit & Métier

| ID | Décision | Options | Recommandation | Statut |
|---|---|---|---|---|
| P-01 | Parcours mobile vs web | Mobile only / Mobile + web | Mobile only MVP | À VALIDER |
| M-06 | Types de centre officiels | À définir | — | À VALIDER |
| M-07 | Double validation (objets sensibles) | Oui partout / Auto faible risque | Auto pour faible | À VALIDER |
| M-08 | Catégories MVP | 3 niveaux / 6 niveaux | Niveau 1-3 | À VALIDER |
| M-09 | Délai conservation centre | 6 mois / 3 mois / 12 mois | 6 mois | À VALIDER |
| M-10 | Tarification restitution | Gratuit / Payant | Gratuit | À VALIDER |

### 20.2 — Sécurité

| ID | Décision | Options | Recommandation | Statut |
|---|---|---|---|---|
| S-01 | MFA niveau rôles | TOTP / FIDO2 | TOTP V1, FIDO2 V2 | À VALIDER |
| S-02 | Détection fraude | Rules / ML | Rules V1 | À VALIDER |
| S-03 | UEBA | Oui / Non | — | À VALIDER |
| S-04 | Policy engine | OPA / Cedar / DSL | OPA | À VALIDER |
| S-05 | WORM vs SQL | WORM / SQL | SQL V1, WORM si APDP | À VALIDER |
| S-06 | SoD automatique | Oui / Non | Oui | À VALIDER |
| S-07 | SIEM | Wazuh / Elastic | — | À VALIDER |

### 20.3 — Technique & Infrastructure

| ID | Décision | Options | Recommandation | Statut |
|---|---|---|---|---|
| T-01 | Cloud | On-prem / Cloud / Hybride | Hybride | RECOMMANDÉ |
| T-02 | Cloud souverain | Local / International | — | À VALIDER |
| T-03 | Opérateur SMS | Celtel / Orange / Malitel / Multi | — | À VALIDER |
| T-04 | WhatsApp BSP | Local / International | — | À VALIDER |
| T-05 | Email | Cloud / Souverain | — | À VALIDER |
| T-06 | KYC biométrique | Oui / Non / Scope | — | À VALIDER |
| T-07 | GraphQL | Oui / Non | REST + GraphQL V2 | À VALIDER |
| T-08 | Open data | Oui / Non / Scope | — | À VALIDER |
| T-09 | Compétences DevOps | Locales / Externalisées | — | À VALIDER |
| T-10 | Volumétrie année 1 | À calibrer | — | À VALIDER |

### 20.4 — Réglementaire

| ID | Décision | Statut |
|---|---|---|
| J-03 | Hébergement données biométriques | À VALIDER — VALIDATION JURIDIQUE |
| J-04 | Délai exercice droits citoyens | À VALIDER — VALIDATION JURIDIQUE |
| J-05 | Notification violation (délai/format) | À VALIDER — VALIDATION JURIDIQUE |
| J-06 | Responsabilité centres partenaires | À VALIDER — VALIDATION JURIDIQUE |
| J-07 | Conservation photos post-restitution | À VALIDER — VALIDATION JURIDIQUE |
| J-08 | Acceptabilité notif nuit | À VALIDER — VALIDATION CULTURELLE |
| J-09 | Cohérence rétention 12 mois vs APDP | À VALIDER — VALIDATION JURIDIQUE |
| J-10 | AIPD à produire | À VALIDER |
| J-11 | Nomination DPO/Responsable traitement | À VALIDER |

### 20.5 — Rapprochement

| ID | Décision | Statut |
|---|---|---|
| R-01 | Seuils scoring 80/50 | À VALIDER |
| R-02 | Pondérations publiques vs internes | À VALIDER |
| R-03 | Taux faux positifs 5-10% | À VALIDER |

### 20.6 — Design system

| ID | Décision | Statut |
|---|---|---|
| DS-01 | Typographies définitives | À VALIDER |
| DS-02 | Règles complètes accessibilité | À VALIDER |
| DS-03 | Règles espacements/graisses | À VALIDER |

---

# 21. Questions ouvertes

**SOURCE.** §25 — Dossier.

| ID | Question | Catégorie | Statut |
|---|---|---|---|
| Q1 | Parcours mobile uniquement ou + web ? | Produit | À VALIDER |
| Q2 | Quel opérateur SMS ? | Partenariat | À VALIDER |
| Q3 | WhatsApp BSP local ou international ? | Partenariat | À VALIDER |
| Q4 | Email cloud ou souverain ? | Technique | À VALIDER |
| Q5 | KYC biométrique ? | Sécurité | À VALIDER |
| Q6 | Quelle région pour pilote (2e région) ? | Métier | À VALIDER |
| Q7 | Connectivité 2G/3G/4G par région ? | Technique | À VALIDER |
| Q8 | Compétences DevOps disponibles ? | Infrastructure | À VALIDER |
| Q9 | Cloud local certifié APDP ? | Infrastructure | À VALIDER |
| Q10 | Qui valide la liste des types de centre ? | Juridique | À VALIDER |
| Q11 | DPO désigné ? | Gouvernance | À VALIDER |
| Q12 | Langues nationales pour traduction ? | Produit | À VALIDER |
| Q13 | Volumétrie cible année 1 ? | Exploitation | À VALIDER |
| Q14 | Comment mesurer taux faux positifs ? | Exploitation | À VALIDER |

---

# 22. Critères d'acceptation du MVP

**SOURCE.** §26 — Dossier.

### 22.1 — Critères par domaine

| Domaine | Critère | Statut |
|---|---|---|
| Périmètre | MVP clairement défini avec MUST/SHOULD/COULD/FUTURE | ✅ |
| Acteurs | 7 rôles + matrice permissions | ✅ |
| Parcours | Tous parcours A-M documentés | ✅ |
| Fonctionnalités | Catalogues par domaine + priorisation | ✅ |
| Règles métier | FSM + règles matching + restitution | ✅ |
| Sécurité | CIA, MFA, RBAC/ABAC, chiffrement, logs, PRA | ✅ |
| Réglementaire | 9 points juridiques marqués À VALIDER | ✅ |
| Architecture | 9 services identifiés, topologie décrite | ✅ |
| Données | MCD 11 entités, hiérarchie admin, catégories | ✅ |
| Rapprochement | FSM + scoring + validation humaine + traçabilité | ✅ |
| Notifications | 4 canaux + multilingue + idempotence | ✅ |
| Centres | Structure hiérarchique + processus d'accueil | ✅ |
| Administration | Fonctionnalités + dashboards + signalements | ✅ |
| Identité visuelle | Direction 3 + Logo A + palette validés | ✅ VALIDÉ |
| UX/UI | Mobile-first, 3 clics, états vides/erreurs | ✅ |
| MVP | MUST/SHOULD/COULD/FUTURE + exclusions claires | ✅ |
| Roadmap | 9 phases + dépendances + prérequis | ✅ |
| Risques | 14 risques + matrice prévention/détection/correction | ✅ |
| Décisions ouvertes | 24 questions classées par 9 catégories | ✅ |

### 22.2 — Validation nécessaire avant PLAN

| Action | Statut |
|---|---|
| ✅ | Identité visuelle validée (Direction 3 + Logo A) |
| ⬜ | Parcours mobile vs web (Q1) |
| ⬜ | Opérateur SMS (Q2) |
| ⬜ | WhatsApp BSP (Q3) |
| ⬜ | Email transactionnel (Q4) |
| ⬜ | KYC biométrique (Q5) |
| ⬜ | Deuxième région pilote (Q6) |
| ⬜ | Validation juridique complète (J-03 à J-11) |
| ⬜ | Typographies définitives (DS-01) |
| ⬜ | Règles complètes design system (DS-02, DS-03) |
| ⬜ | Rapprochement seuils et pondérations (R-01, R-02) |
| ⬜ | MFA/FIDO2 (S-01) |
| ⬜ | UEBA/SIEM (S-03, S-07) |
| ⬜ | WORM vs SQL (S-05) |
| ⬜ | Modèle cloud (T-01, T-02) |
| ⬜ | Nomination DPO (J-11) |
| ⬜ | Liste types centre (Q10, M-06) |
| ⬜ | Double validation (M-07) |

---

**Fin de la matrice de validation MVP**

> Ce document est un **instrument de validation métier**. Il ne constitue ni une spécification de développement, ni un code exécutable. Toute décision marquée « À VALIDER » doit être validée par le commanditaire avant la phase PLAN.
>
> Les éléments marqués **VALIDÉ** reflètent soit une décision humaine prise (identité visuelle), soit une exigence légale (consentement APDP, registre des traitements), soit une règle d'architecture immuable (validation humaine obligatoire pour le matching).


