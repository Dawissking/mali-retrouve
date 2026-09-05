# Dossier d'Arbitrage MVP — Décisions du Commanditaire
## MALI RETROUVÉ — Phase DEFINE — Round 2 (Arbitrage humain)

---

**Document :** Registre officiel des arbitrages humains du commanditaire
**Statut :** ARBITRAGES HUMAINS INTÉGRÉS — EN ATTENTE DE VALIDATION JURIDIQUE ULTÉRIEURE
**Date :** 2026-09-03
**Contexte :** Suite à la revue humaine de la matrice MVP — Phase d'arbitrage des décisions bloquantes

> Ce document consigne les **arbitrages humains du commanditaire** et constitue la référence officielle pour ces sujets. Les réserves juridiques restent conservées lorsqu'une décision n'est pas encore juridiquement vérifiée. Aucune recommandation ne constitue une obligation légale définitive.

---

# 1. Objet

Consigner les **arbitrages humains** rendus par le commanditaire sur les points précédemment identifiés comme bloquants. Ce document devient le **registre officiel** des décisions pour la phase DEFINE.

Points arbitrés :
1. **J-01 à J-06** — Points juridiques
2. **FSM** — Cycle de vie principal (14 états)
3. **CAT** — Modèle de catégorisation NATURE → DOMAINE → TYPE
4. **SMS** — Architecture multi-opérateur et coût paramétrique
5. **R2** — Périmètre pilote Bamako + Ségou
6. **A-02 / A-03** — Authentification API et mTLS
7. **D-01 / D-02 / D-03** — Moteur vectoriel, chunking, matching
9. **INTERFACE** — Web responsive / mobile / WhatsApp / téléphone (X-01 à X-04)
10. **LANGUE** — Français uniquement pour le MVP (X-05)

---

# 2. Situation actuelle (post-arbitrage)

**SOURCE.** `00_DOSSIER_CONCEPTION.md`, `02_MATRICE_VALIDATION_MVP.md`, `03_REVUE_HUMAINE_MVP.md`, présente session d'arbitrage.

| Élément | Statut |
|---|---|
| Identité visuelle | VALIDÉE (2026-09-02) |
| Matching = aide décision | VALIDÉ |
| Validation humaine obligatoire | VALIDÉ |
| Périmètre pilote | VALIDÉ — Bamako + Ségou |
| FSM principale | VALIDÉE (14 états) |
| Catégorisation MVP | VALIDÉE — NATURE → DOMAINE → TYPE |
| Architecture SMS | VALIDÉE — multi-opérateur, coût paramétrique |
| Interface MVP | VALIDÉE — Web responsive |
| Langue MVP | VALIDÉE — Français |
| API MVP | VALIDÉE — API Key ; OAuth 2.1 = FUTURE |
| mTLS | VALIDÉE — selon exposition / exigences |
| Moteur vectoriel | NON BLOQUANT — abstraction requise |
| Chunking | NON BLOQUANT — paramètre expérimental |
| 6 points juridiques | ARBITRÉS — avec réserves (durées / DPO / délai 72h) |

---

# 3. Arbitrages juridiques

> Les points ci-dessous ont été **arbitrés par le commanditaire**. Chaque arbitrage est accompagné de son niveau de certitude et, le cas échéant, d'une **réserve juridique** explicite qui devra être confirmée par le DPO, l'APDP ou le conseil juridique avant exploitation opérationnelle.

### J-01 — KYC biométrique

| Attribut | Valeur |
|---|---|
| **ID** | J-01 |
| **Décision** | **VALIDÉE** — KYC biométrique EXCLU du MVP. Placé en **FUTURE**. |
| **Réserve** | Toute intégration biométrique ultérieure devra faire l'objet, **avant mise en œuvre**, d'une analyse dédiée (juridique, réglementaire, sécurité, architecture, protection des données). |
| **Niveau de certitude** | **DÉCISION VALIDÉE** — mais la biométrie **n'est pas présentée comme une exigence légale actuelle**. |
| **Impact** | Le MVP n'intègre pas de biométrie. Les clés de chiffrement biométrique distinctes ne sont pas requises au lancement. |

### J-02 — Notification des violations de données

| Attribut | Valeur |
|---|---|
| **ID** | J-02 |
| **Décision** | **VALIDÉE AVEC RÉSERVE JURIDIQUE** — Le MVP doit prévoir dès le lancement le processus complet de gestion des incidents : détection → analyse → confinement → remédiation → notification / rapport selon exigences applicables. |
| **Réserve** | Le délai de **72 h NE DOIT PAS être présenté comme une obligation légale validée**. Il peut être conservé comme **« HYPOTHÈSE NON VÉRIFIÉE »** ou référence de travail. Le délai réglementaire définitif sera confirmé par l'autorité compétente / DPO / conseil juridique. |
| **Niveau de certitude** | Processus = **DÉCISION VALIDÉE**. Délai 72 h = **HYPOTHÈSE NON VÉRIFIÉE**. |
| **Impact** | Plan d'intervention conçu autour d'un processus complet ; le délai exact sera paramétré une fois la confirmation juridique obtenue. |

### J-03 — Responsabilité des centres partenaires

| Attribut | Valeur |
|---|---|
| **ID** | J-03 |
| **Décision** | **VALIDÉE** — La répartition des responsabilités entre MALI RETROUVÉ et les centres partenaires sera **définie juridiquement et contractuellement** avant leur mise en production opérationnelle. |
| **Réserve** | Ni MALI RETROUVÉ ni les centres ne sont **a priori** désignés comme juridiquement responsables avant l'établissement du cadre contractuel. |
| **Niveau de certitude** | **DÉCISION VALIDÉE** sur le principe. La répartition finale = **À DÉFINIR contractuellement**. |
| **Impact** | Le système doit prévoir dès la conception : identification du centre, identification de l'agent, traçabilité des opérations, journal des restitutions, preuve de remise, historique des actions. |

### J-04 — Conservation des données

| Attribut | Valeur |
|---|---|
| **ID** | J-04 |
| **Décision** | **VALIDÉE AVEC DURÉE NON FIGÉE** — L'architecture doit prévoir : données actives, archivage, purge, traçabilité, politique de conservation **configurable**. |
| **Réserve** | Si « 12 mois actifs + 24 mois archivage WORM » est conservé, il doit être explicitement marqué : **« HYPOTHÈSE DE DIMENSIONNEMENT NON VALIDÉE JURIDIQUEMENT »**. La durée définitive sera fixée après validation juridique / DPO / APDP. |
| **Niveau de certitude** | Architecture = **DÉCISION VALIDÉE**. Durée précise = **HYPOTHÈSE NON VALIDÉE JURIDIQUEMENT**. |
| **Impact** | Politique de rétention implémentée comme paramètre, pas comme constante. WORM ou SQL dépendent de l'exigence APDP. |

### J-05 — DPO / Responsable du traitement

| Attribut | Valeur |
|---|---|
| **ID** | J-05 |
| **Décision** | **VALIDÉE SUR LE PRINCIPE** — Une fonction de **responsable du traitement** et une fonction **DPO ou équivalente** devront être clairement désignées avant l'exploitation opérationnelle. Le titulaire exact reste à désigner par l'autorité compétente. |
| **Réserve** | L'**Administrateur national** n'est **pas automatiquement** le DPO. Cette hypothèse n'est pas retenue. |
| **Niveau de certitude** | Principe = **DÉCISION VALIDÉE**. Titulaire = **À DÉSIGNER**. |
| **Impact** | L'architecture doit prévoir dès maintenant : RBAC, séparation des responsabilités, habilitations, journalisation, registre des traitements, traçabilité des accès. |

### J-06 — Photos après restitution

| Attribut | Valeur |
|---|---|
| **ID** | J-06 |
| **Décision** | **VALIDÉE AVEC DURÉE PROVISOIRE** — Une politique de purge post-restitution doit être prévue dès le MVP. |
| **Réserve** | La proposition « 3 mois après restitution » peut être conservée uniquement comme **« HYPOTHÈSE PROVISOIRE DE DIMENSIONNEMENT »**. Elle ne doit **PAS** être présentée comme une durée légalement validée. La durée définitive sera confirmée juridiquement. |
| **Niveau de certitude** | Processus de purge = **DÉCISION VALIDÉE**. Durée 3 mois = **HYPOTHÈSE PROVISOIRE NON VALIDÉE**. |
| **Impact** | Politique de purge implémentée comme paramètre. |

### Tableau récapitulatif des arbitrages juridiques

| ID | Décision | Réserve | Niveau de certitude |
|---|---|---|---|
| J-01 | KYC biométrique EXCLU du MVP, FUTURE | Toute réintroduction devra faire l'objet d'une analyse dédiée | DÉCISION VALIDÉE |
| J-02 | Processus incident complet dans le MVP | Délai 72 h = HYPOTHÈSE NON VÉRIFIÉE | Processus validé ; délai hypothétique |
| J-03 | Cadre juridique/contractuel à définir | Pas de désignation a priori | Principe validé ; répartition à définir |
| J-04 | Politique de conservation configurable | 12 mois + 24 mois archivage WORM = HYPOTHÈSE | Architecture validée ; durée hypothétique |
| J-05 | DPO / Responsable de traitement à désigner | Pas d'identification automatique | Principe validé ; titulaire à désigner |
| J-06 | Politique de purge post-restitution | 3 mois = HYPOTHÈSE PROVISOIRE | Processus validé ; durée hypothétique |

---

# 4. FSM — Conflit et proposition d'harmonisation

**SOURCE.** §06.1, §06.2, §13.2 — Dossier. Proposition 14 états commanditaire (03_REVUE_HUMAINE §B-ÉTAT-01).

## 4.1 — FSM du dossier (historique — 7 états actifs)

```
DéclarationPerte :
CRÉÉ → EN_ATTENTE_RAPPROCHEMENT → CORRESPONDANCE_TROUVÉE
                                     → [ACCEPTÉE → RESTITUTION_EN_COURS → RÉGLÉE]
                                     → [REJETÉE]
                                     → [EXPIRÉE]

DepotTrouvaille :
CRÉÉ → EN_ATTENTE_RAPPROCHEMENT → CORRESPONDANCE_TROUVÉE
                                     → [ASSIGNÉE_AU_CENTRE → RESTITUÉE]
                                     → [NON_RAPPROCHÉE → ARCHIVÉE]
```

> **Statut :** référence historique. La FSM officielle retenue est celle de la section 4.4.

## 4.2 — Proposition 14 états (commanditaire — retenue)

> **STATUT : VALIDÉ par le commanditaire.** Cette liste constitue les 14 états principaux du cycle de vie.

BROUILLON, SOUMISE, EN_ATTENTE_RAPPROCHEMENT, CORRESPONDANCE_TROUVÉE, EN_VALIDATION_HUMAINE, VALIDÉE, RESTITUTION_PLANIFIÉE, RESTITUÉE, CLÔTURÉE, REJETÉE, ARCHIVÉE, EXPIRÉE, SUSPENDUE, CONTESTÉE

> **Important : ANNULÉE n'est PAS un 15e état principal.** L'annulation d'un brouillon avant soumission doit être modélisée comme événement/action de workflow ou statut technique du brouillon (à traiter lors de la phase PLAN), **et non** comme état supplémentaire de la FSM principale.

## 4.3 — Matrice de correspondance FSM (historique)

| État actuel (dossier) | Source | Correspondance (14 états) | Fusion possible | État proposé | Justification | À VALIDER |
|---|---|---|---|---|---|---|
| CRÉÉ | §06.1 | BROUILLON + SOUMISE | Oui | BROUILLON → SOUMISE | Brouillon local, puis soumission serveur | ✅ VALIDÉE |
| EN_ATTENTE_RAPPROCHEMENT | §06.1 | EN_ATTENTE_RAPPROCHEMENT | Identique | EN_ATTENTE_RAPPROCHEMENT | Terme technique du dossier | ✅ VALIDÉE |
| CORRESPONDANCE_TROUVÉE | §06.1 | CORRESPONDANCE_TROUVÉE | Identique | CORRESPONDANCE_TROUVÉE | Conservé | ✅ VALIDÉE |
| ACCEPTÉE | §06.1 | VALIDÉE | Oui | VALIDÉE | Harmonisation terminologique | ✅ VALIDÉE |
| RESTITUTION_EN_COURS | §06.1 | RESTITUTION_PLANIFIÉE | Oui | RESTITUTION_PLANIFIÉE | Plus explicite | ✅ VALIDÉE |
| RÉGLÉE | §06.1 | RESTITUÉE + CLÔTURÉE | Oui (chemin A uniquement) | RESTITUÉE → CLÔTURÉE | Chemin normal unique | ✅ VALIDÉE |
| REJETÉE | §06.1 | REJETÉE | Identique | REJETÉE | Aucun changement | ✅ VALIDÉE |
| EXPIRÉE | §06.1 | EXPIRÉE | Identique | EXPIRÉE | Distingué d'ARCHIVÉE | ✅ VALIDÉE |
| ASSIGNÉE_AU_CENTRE | §06.2 | RESTITUTION_PLANIFIÉE | Oui | RESTITUTION_PLANIFIÉE | Harmonisation | ✅ VALIDÉE |
| RESTITUÉE | §06.2 | RESTITUÉE | Identique | RESTITUÉE | Aucun changement | ✅ VALIDÉE |
| NON_RAPPROCHÉE | §06.2 | NON_RAPPROCHÉE (résultat métier / événement) | — | NON_RAPPROCHÉE | Conservé comme **résultat métier** | ✅ VALIDÉE |
| ARCHIVÉE | §06.2 | ARCHIVÉE | Identique | ARCHIVÉE | État terminal | ✅ VALIDÉE |
| — | — | EN_VALIDATION_HUMAINE | N/A (nouveau) | EN_VALIDATION_HUMAINE | Étape explicite de validation | ✅ VALIDÉE |
| — | — | SUSPENDUE | N/A (nouveau) | SUSPENDUE | Suspicion fraude | ✅ VALIDÉE |
| — | — | CONTESTÉE | N/A (nouveau) | CONTESTÉE | Contestation citoyen | ✅ VALIDÉE |
| — | — | CLÔTURÉE | N/A (terminal) | CLÔTURÉE | Clôture administrative | ✅ VALIDÉE |

> **Note sur NON_RAPPROCHÉE :** NON_RAPPROCHÉE peut être modélisé comme **résultat métier, événement ou état dérivé**, mais ne doit **pas** être présenté comme une rétrogradation d'une correspondance déjà trouvée. La transition `CORRESPONDANCE_TROUVÉE → NON_RAPPROCHÉE` est **INTERDITE**.

## 4.4 — FSM OFFICIELLE (VALIDÉE — 14 états principaux)

> **STATUT : VALIDÉ par le commanditaire.**

### 4.4.0 — Logique générale

La FSM officielle distingue quatre étapes logiques :
1. **Validation de la correspondance** — `EN_ATTENTE_RAPPROCHEMENT` → `CORRESPONDANCE_TROUVÉE` (système) → `EN_VALIDATION_HUMAINE` (système) → `VALIDÉE` / `REJETÉE` (agent).
2. **Préparation de la restitution** — `VALIDÉE` → `RESTITUTION_PLANIFIÉE` (agent).
3. **Restitution effectivement réalisée** — `RESTITUTION_PLANIFIÉE` → `RESTITUÉE` (système/centre).
4. **Clôture administrative du dossier** — `RESTITUÉE` → `CLÔTURÉE` (système).

### 4.4.1 — Diagramme

```
BROUILLON → SOUMISE → EN_ATTENTE_RAPPROCHEMENT ──┬─→ CORRESPONDANCE_TROUVÉE → EN_VALIDATION_HUMAINE
                                                │                                │
                                                │                                ├─→ VALIDÉE → RESTITUTION_PLANIFIÉE → RESTITUÉE → CLÔTURÉE   (chemin normal unique)
                                                │                                ├─→ REJETÉE → ARCHIVÉE
                                                │                                ├─→ SUSPENDUE ──(audit)──→ CORRESPONDANCE_TROUVÉE | REJETÉE
                                                │                                └─→ CONTESTÉE → EN_VALIDATION_HUMAINE (réexamen)
                                                │
                                                └─→ NON_RAPPROCHÉE (résultat métier) ──(délai)──→ EXPIRÉE → ARCHIVÉE

EXPIRÉE ← SOUMISE (délai de soumission dépassé)
```

> **ANNULÉE n'est pas un état de la FSM principale.** L'annulation d'un brouillon avant soumission est traitée comme événement/action de workflow ou statut technique du brouillon, à modéliser en phase PLAN.

> **Chemin normal unique de restitution (VALIDÉ) :**
> `VALIDÉE` → `RESTITUTION_PLANIFIÉE` → `RESTITUÉE` → `CLÔTURÉE`.
> La transition `RESTITUTION_PLANIFIÉE → CLÔTURÉE` (sans passage par `RESTITUÉE`) **n'est PAS conservée comme transition normale**.
> Toute annulation ou événement exceptionnel après planification doit être traité comme **événement métier distinct et documenté**, et non comme raccourci ambigu de la FSM principale.

> **États terminaux immuables :** `CLÔTURÉE` et `ARCHIVÉE`.

### 4.4.2 — Transitions autorisées

| De | Vers | Acteur | Condition |
|---|---|---|---|
| BROUILLON | SOUMISE | Citoyen | Validation formulaire |
| SOUMISE | EN_ATTENTE_RAPPROCHEMENT | Système | Trigger matching |
| SOUMISE | EXPIRÉE | Système | Délai de soumission dépassé |
| EN_ATTENTE_RAPPROCHEMENT | CORRESPONDANCE_TROUVÉE | Système | Score ≥ seuil |
| EN_ATTENTE_RAPPROCHEMENT | NON_RAPPROCHÉE (résultat) | Système | Délai écoulé sans correspondance valide |
| NON_RAPPROCHÉE | EXPIRÉE | Système | Délai d'expiration atteint |
| EXPIRÉE | ARCHIVÉE | Système | Archivage automatique |
| CORRESPONDANCE_TROUVÉE | EN_VALIDATION_HUMAINE | Système | Notification agent |
| EN_VALIDATION_HUMAINE | VALIDÉE | Agent | Validation humaine |
| EN_VALIDATION_HUMAINE | REJETÉE | Agent | Rejet avec motif |
| EN_VALIDATION_HUMAINE | SUSPENDUE | Système | Suspicion fraude |
| EN_VALIDATION_HUMAINE | CONTESTÉE | Citoyen | Contestation de la décision |
| CONTESTÉE | EN_VALIDATION_HUMAINE | Système | Réexamen par un autre agent |
| SUSPENDUE | CORRESPONDANCE_TROUVÉE | Système | Audit favorable |
| SUSPENDUE | REJETÉE | Système | Audit défavorable |
| VALIDÉE | RESTITUTION_PLANIFIÉE | Agent | Préparation restitution |
| RESTITUTION_PLANIFIÉE | RESTITUÉE | Centre | Confirmation restitution physique |
| RESTITUÉE | CLÔTURÉE | Système | Purge programmée, dossier clos |
| REJETÉE | ARCHIVÉE | Système | Dossier rejeté archivé |

### 4.4.3 — Transitions interdites

| De | Vers | Interdit car | Justification |
|---|---|---|---|
| VALIDÉE | EN_ATTENTE_RAPPROCHEMENT | Rétrogradation interdite | Une fois validé, ne retourne pas en cours |
| CLÔTURÉE | * | Immutable | État terminal |
| ARCHIVÉE | * | Immutable | État terminal |
| REJETÉE | VALIDÉE | Non réversible (sauf via CONTESTÉE) | Rejet définitif |
| CORRESPONDANCE_TROUVÉE | NON_RAPPROCHÉE | Conceptuel | NON_RAPPROCHÉE = aucun match trouvé, pas un match ignoré |
| RESTITUTION_PLANIFIÉE | CLÔTURÉE | Pas un raccourci normal | Le chemin normal passe par RESTITUÉE |

### 4.4.4 — États spéciaux

| État | Sens | Modélisation |
|---|---|---|
| ANNULÉE | **PAS un état principal.** Citoyen annule un brouillon avant soumission | Événement / statut technique du brouillon |
| EXPIRÉE | Délai expiré (soumission ou rapprochement) | État principal |
| SUSPENDUE | Suspicion de fraude — gel jusqu'à audit | État principal |
| CONTESTÉE | Citoyen conteste validation/rejet | État principal |
| NON_RAPPROCHÉE | Aucun rapprochement valide trouvé à l'issue du délai | Résultat métier / état dérivé (pas une rétrogradation) |

### 4.4.5 — Résumé des corrections FSM

| Problème version précédente | Correction appliquée (arbitrage) |
|---|---|
| `CORRESPONDANCE_TROUVÉE → NON_RAPPROCHÉE` (incohérent) | **INTERDIT.** NON_RAPPROCHÉE ne peut provenir que d'un état où aucune correspondance valide n'a été trouvée (typiquement `EN_ATTENTE_RAPPROCHEMENT`). |
| `RESTITUTION_PLANIFIÉE → CLÔTURÉE` comme transition normale | **NON RETENUE.** Chemin normal unique : `VALIDÉE → RESTITUTION_PLANIFIÉE → RESTITUÉE → CLÔTURÉE`. |
| ANNULÉE comme 15e état principal | **NON RETENUE.** Modélisation comme événement / statut technique du brouillon. |
| Distinction `EXPIRÉE` vs `ARCHIVÉE` | **CONSERVÉE** — EXPIRÉE = état principal (délai atteint) ; ARCHIVÉE = état terminal. |

---

# 5. Catégorisation MVP — Modèle officiel (ARBITRAGE VALIDÉ)

> **DÉCISION : VALIDÉE.** Le modèle fonctionnel retenu est **`NATURE → DOMAINE → TYPE`**.
> L'ancienne formulation « 6 catégories → 4 catégories » n'est **plus** utilisée comme décision.

## 5.1 — Modèle `NATURE → DOMAINE → TYPE`

| Axe | Niveau | Valeurs |
|---|---|---|
| **NATURE** (primaire) | 1 | `Document` / `Objet` |
| **DOMAINE** (à quoi ça sert) | 2 | `Identité`, `Voyage`, `Transport`, `Éducation`, `Professionnel`, `Santé/Assurance`, `Administratif`, `Personnel` |
| **TYPE** (élément concret) | 3 | CNI, passeport, diplôme, téléphone, clés, etc. |

## 5.2 — Périmètre MVP

| Axe | Inclus MVP | Exclus MVP / FUTURE |
|---|---|---|
| NATURE | Document, Objet | — |
| DOMAINE | Identité, Voyage, Transport, Éducation, Professionnel, Santé/Assurance, Administratif, Personnel | — |
| TYPE — Documents | documents officiels, documents administratifs prioritaires | — |
| TYPE — Objets | objets personnels | objets de grande valeur (FUTURE), animaux (FUTURE) |
| Catégorie « Autre » non structurée | — | EXCLUE MVP |

## 5.3 — Exemples du modèle `NATURE → DOMAINE → TYPE`

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
| Objet | Personnel | Bijoux, œuvres d'art (FUTURE) |
| Animal | — | Chien, chat (FUTURE) |

> **Note :** L'ancienne distinction `Document officiel` vs `Document administratif` est conservée comme typologie interne au sein de `NATURE = Document`, sans constituer un axe distinct du modèle.

## 5.4 — Ancien modèle (référence historique — non décision)

| Niveau | Catégorie | Exemples | Incluse MVP (historique) |
|---|---|---|---|
| 1 | Document officiel | CNI, passeport, acte naissance | ✅ |
| 2 | Document administratif | Facture, courrier | ✅ |
| 3 | Objet personnel | Téléphone, montre, clés | ✅ |
| 4 | Objet de valeur | Bijou, œuvre d'art | ❌ |
| 5 | Animal | Chien, chat | ❌ |
| 6 | Autre | Non classé | ❌ |

> Cette classification historique est **remplacée** par le modèle `NATURE → DOMAINE → TYPE`. Elle est conservée uniquement comme référence pour traçabilité.

## 5.5 — Résumé de l'arbitrage

| Ancienne formulation | Statut |
|---|---|
| « 6 catégories → 4 catégories » | **NON RETENUE** comme décision. |
| Modèle `NATURE → DOMAINE → TYPE` | **DÉCISION VALIDÉE**. |
| MVP : documents officiels + documents administratifs prioritaires + objets personnels | **DÉCISION VALIDÉE**. |
| Objets de grande valeur, animaux = FUTURE | **DÉCISION VALIDÉE**. |
| Catégorie « Autre » non structurée | **EXCLUE MVP — DÉCISION VALIDÉE**. |

---

# 6. SMS — Architecture multi-opérateur et coût paramétrique (ARBITRAGE VALIDÉ)

> **DÉCISION : VALIDÉE.** L'architecture SMS retenue est **multi-opérateur avec couche d'abstraction**. Aucun fournisseur spécifique n'est contractuellement désigné à ce stade.

## 6.1 — Architecture retenue

```
MALI RETROUVÉ
    │
    ▼
┌──────────────────────┐
│  Notification Service │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   SMS Service (abstraction) │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│  Provider Adapter (interface) │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│  Fournisseur SMS réel (à sélectionner) │
└──────────────────────┘
```

> Cette abstraction doit permettre ultérieurement : changement de fournisseur, fournisseur principal, fournisseur secondaire, fallback, suivi des erreurs, suivi des volumes.

## 6.2 — Statut des fournisseurs (NON DÉCIDÉ)

> **IMPORTANT.** **Aucun opérateur n'est déclaré fournisseur contractuel officiel à ce stade.** Les références à Malitel, Orange Mali, Free Mali, Safaricom Mali, Expresso Mali figurant dans les versions antérieures sont des **estimations non vérifiées**, conservées uniquement comme historique.

| Ancien statut | Nouveau statut |
|---|---|
| Malitel — PROPOSÉ PRINCIPAL | **NON DÉCIDÉ** — estimation non vérifiée |
| Orange Mali — PROPOSÉ SECONDAIRE | **NON DÉCIDÉ** — estimation non vérifiée |
| Free Mali — BACKUP | **NON DÉCIDÉ** — estimation non vérifiée |
| Safaricom Mali | **NON DÉCIDÉ** — estimation non vérifiée |
| Expresso Mali | **NON DÉCIDÉ** — estimation non vérifiée |

> Le fournisseur réel sera sélectionné **après comparaison réelle des offres commerciales et techniques**.

## 6.3 — Critères de sélection (paramétriques)

| Critère | Description |
|---|---|
| Couverture | Couverture réseau effective (à mesurer par région/cercle) |
| Délivrabilité | Taux de livraison réel (>95% cible) |
| Prix réel | Tarif unitaire négocié |
| API | Documentation + SDK + qualité technique |
| SLA | Niveau de service contractuel |
| Latence | Temps de livraison |
| Conformité | APDP / Loi 2013-015 / transfert cross-border |
| Capacité de fallback | Mécanisme de bascule entre fournisseurs |

## 6.4 — Coût (modélisation paramétrique)

> **DÉCISION : VALIDÉE SOUS FORME PARAMÉTRIQUE.**
> **Ne sont PAS retenus comme budget officiel :**
> - « 2,35 millions XOF/mois »
> - « 2–5 % du budget total »
> Ces chiffres sont des **estimations non validées**.

### Formule de coût

```
Coût mensuel = nombre de SMS × coût unitaire + éventuels frais fixes
```

### Suivi requis

Le système doit permettre le suivi de :
- volume SMS ;
- coût estimé (paramétrable) ;
- coût réel (lorsque les tarifs sont connus) ;
- consommation par type de notification.

## 6.5 — Données historiques (NON VÉRIFIÉES — référence uniquement)

> **AVERTISSEMENT.** Les données ci-dessous sont des estimations du dossier de conception, **non confirmées par les opérateurs**. Elles sont conservées uniquement comme historique.

| Opérateur | Couverture | Prix (XOF/SMS) | SLA | Note |
|---|---|---|---|---|
| Malitel | National + 4G (à vérifier) | ~45 (à vérifier) | 99.7% (à vérifier) | 9/10 (à vérifier) |
| Orange Mali | National + 4G (à vérifier) | ~50 (à vérifier) | 99.8% (à vérifier) | 9/10 (à vérifier) |
| Free Mali | 60% (à vérifier) | ~35 (à vérifier) | 99.2% (à vérifier) | 8/10 (à vérifier) |
| Safaricom Mali | 40% (à vérifier) | ~60 (à vérifier) | 99.5% (à vérifier) | 7/10 (à vérifier) |
| Expresso Mali | 30% (à vérifier) | ~70 (à vérifier) | 99.0% (à vérifier) | 6/10 (à vérifier) |

| Volume supposé | Coût supposé | Statut |
|---|---|---|
| 50 000 SMS/mois (Bamako) | ~2.35M XOF/mois | **ESTIMATION NON VALIDÉE** |
| Part budget ~3.3 % | (fourchette 2–5 % non chiffrée) | **ESTIMATION NON VALIDÉE** |

## 6.6 — Résumé de l'arbitrage

| Ancienne formulation | Statut |
|---|---|
| « Malitel fournisseur officiel » | **NON RETENUE** — NON DÉCIDÉ |
| « Orange Mali fournisseur officiel » | **NON RETENUE** — NON DÉCIDÉ |
| « 2,35M XOF/mois budget validé » | **NON RETENUE** — ESTIMATION NON VALIDÉE |
| « 2–5 % budget SMS validé » | **NON RETENUE** — ESTIMATION NON VALIDÉE |
| Architecture multi-opérateur avec couche d'abstraction | **DÉCISION VALIDÉE** |
| Coût paramétrique (formule + suivi) | **DÉCISION VALIDÉE** |

---

# 7. Périmètre pilote (ARBITRAGE VALIDÉ)

> **DÉCISION : VALIDÉE.**
> - **Périmètre pilote = BAMAKO + SÉGOU.**
> - **Ségou est retenue comme deuxième région pilote.**
> - **Kisangani est définitivement EXCLUE du périmètre géographique de MALI RETROUVÉ.** Ne jamais la réintroduire comme région pilote malienne.
> - Le **déploiement national complet est hors périmètre du MVP**.

## 7.1 — Périmètre validé

| Région | Statut |
|---|---|
| Bamako (District) | Pilote — VALIDÉ |
| Ségou | 2e région pilote — VALIDÉE |
| Kisangani | **EXCLUE DÉFINITIVEMENT** (ville de RDC, hors Mali) |
| Gao | Candidate historique — **NON RETENUE** |
| Mopti | Candidate historique — **NON RETENUE** |
| Timbuktu | Candidate historique — **EXCLUE** (risque sécurité) |

## 7.2 — Critères justifiant le choix (rappel)

| Critère | Application Bamako | Application Ségou |
|---|---|---|
| Couverture CNI | Bonne | 112 centres CNI |
| Population | District dense | 4.8M habitants |
| Connectivité | Bonne | Bonne |
| Infrastructure | Centres existants | Centres existants |
| Risque opérationnel | Stable | Stable |
| Proximité Bamako | — | Bonne |

> **Note :** Aucune autre région candidate n'a été ajoutée pour remplacer Ségou. Les autres régions mentionnées dans les versions antérieures sont conservées uniquement comme historique de cadrage.

## 7.3 — Note factuelle

> **AVERTISSEMENT FACTUEL.** Kisangani (République Démocratique du Congo) avait été mentionné par erreur dans une version antérieure du dossier comme région candidate malienne. Cette erreur a été corrigée. **Kisangani ne fait pas partie du territoire malien et ne sera jamais retenue comme région pilote.**

---

# 8. Points techniques — Architecture (ARBITRAGES INTÉGRÉS)

**SOURCE.** `00_DOSSIER_CONCEPTION.md` §10, §11.

### A-01 — Authentification API principale

| Attribut | Valeur |
|---|---|
| **Décision** | HMAC-SHA256 (cohérent avec micati.site) — **CONSERVÉ** |
| **Statut** | VALIDÉE |

### A-02 — Authentification API tierce

| Attribut | Valeur |
|---|---|
| **Décision** | **API Key pour les intégrations MVP.** OAuth 2.1 = **FUTURE**. |
| **Réserve** | Cette décision **ne doit pas être élargie** à une affirmation selon laquelle API Key serait toujours préférable à OAuth. Il s'agit d'un choix de périmètre MVP. |
| **Statut** | VALIDÉE — périmètre MVP |

### A-03 — mTLS centres partenaires

| Attribut | Valeur |
|---|---|
| **Décision** | mTLS **n'est pas imposé à tous les acteurs du MVP**. Il doit être utilisé lorsque le niveau d'exposition ou les exigences de sécurité d'une intégration externe le justifient. L'architecture doit rester compatible avec mTLS. |
| **Statut** | VALIDÉE |

## 9. Points techniques — Données (ARBITRAGES INTÉGRÉS)

### D-01 — Moteur vectoriel

| Attribut | Valeur |
|---|---|
| **Décision** | **NON BLOQUANT.** Ne pas choisir définitivement FAISS, Pinecone ou Weaviate dans cette session. |
| **Architecture requise** | Abstraction permettant de changer le moteur de matching sans réécrire le domaine métier. |
| **Statut** | À DÉCIDER en phase PLAN / conception technique |

### D-02 — Chunking

| Attribut | Valeur |
|---|---|
| **Décision** | **NON BLOQUANT.** « 512 tokens + overlap 50 » n'est **PAS** une règle définitive. Ce sont des paramètres expérimentaux à calibrer lors des tests du système de matching. Ne pas les présenter comme une valeur validée. |
| **Statut** | À CALIBRER |

### D-03 — Matching

| Attribut | Valeur |
|---|---|
| **Décision** | **VALIDÉE.** Le matching automatique est une **AIDE À LA DÉCISION**. Il ne constitue jamais à lui seul une validation de propriétaire, une autorisation de restitution ou une décision administrative. La restitution nécessite toujours une validation humaine appropriée. |
| **Réserve** | NE PAS figer le seuil de **90 %** comme vérité universelle dans cette session. Le seuil devra être calibré et validé à partir de tests et de données appropriées. |
| **Statut** | VALIDÉE sur le principe ; seuil à calibrer |

## 10. Points bloquants — Processus (ARBITRAGES INTÉGRÉS)

### P-01 — Validation humaine

| Attribut | Valeur |
|---|---|
| **Décision** | Validation = interface web agent + mobile (mobile = FUTURE). **VALIDÉE**. |
| **Statut** | VALIDÉE |

### P-02 — Interdiction score 100%

| Attribut | Valeur |
|---|---|
| **Décision** | **VALIDÉE** — Pas de notification automatique sur score 100 %. Toujours validation humaine. |
| **Réserve** | NE PAS figer le score de **90 %** comme vérité universelle. Calibrage requis. |

## 11. Points bloquants — Expérience utilisateur (ARBITRAGES INTÉGRÉS)

> **Nomenclature X harmonisée.** Un identifiant unique par sujet.

### X-01 — Interface Web responsive (MVP)

| Attribut | Valeur |
|---|---|
| **Décision** | **MVP = WEB RESPONSIVE.** |
| **Statut** | VALIDÉE |

### X-02 — Application mobile (FUTURE)

| Attribut | Valeur |
|---|---|
| **Décision** | Application mobile = **FUTURE** (hors MVP). |
| **Statut** | REPORTÉE |

### X-03 — Chatbot WhatsApp (FUTURE)

| Attribut | Valeur |
|---|---|
| **Décision** | Chatbot WhatsApp = **FUTURE** (hors MVP). |
| **Statut** | REPORTÉE |

### X-04 — Support téléphonique via les centres (MVP)

| Attribut | Valeur |
|---|---|
| **Décision** | Support téléphonique via les centres = **MVP** (canal de recours opéré par les centres partenaires). |
| **Statut** | VALIDÉE |

### X-05 — Langue du MVP

| Attribut | Valeur |
|---|---|
| **Décision** | **MVP = FRANÇAIS.** L'architecture et l'UX doivent rester localisables. Les langues locales sont prévues pour une phase ultérieure, après étude UX et sélection de la ou des langues prioritaires. |
| **Statut** | VALIDÉE |
| **Note** | « Malinké » ou toute autre langue locale n'est **pas** retenue comme langue principale du MVP. |

---

# 12. Synthèse exécutive — Décisions du commanditaire

## 12.1 — Tableau récapitulatif des arbitrages

| ID | Sujet | Décision | Statut | Réserve |
|---|---|---|---|---|
| J-01 | KYC biométrique | EXCLU MVP, FUTURE | VALIDÉE | Toute réintroduction = analyse dédiée |
| J-02 | Notification violation | Processus complet dans MVP | VALIDÉE (processus) | Délai 72 h = HYPOTHÈSE NON VÉRIFIÉE |
| J-03 | Responsabilité centres | À définir contractuellement | VALIDÉE (principe) | Pas de désignation a priori |
| J-04 | Conservation données | Politique configurable | VALIDÉE (architecture) | 12 mois + 24 mois WORM = HYPOTHÈSE |
| J-05 | DPO | À désigner | VALIDÉE (principe) | Pas d'identification automatique |
| J-06 | Photos post-restitution | Politique de purge | VALIDÉE (processus) | 3 mois = HYPOTHÈSE PROVISOIRE |
| FSM | 14 états principaux | VALIDÉE | VALIDÉE | ANNULÉE = événement (pas état) |
| CAT | NATURE → DOMAINE → TYPE | VALIDÉE | VALIDÉE | — |
| SMS-OP | Architecture multi-opérateur | VALIDÉE | VALIDÉE | Aucun fournisseur désigné |
| SMS-C | Coût paramétrique | VALIDÉE | VALIDÉE | Pas de budget chiffré |
| R2 | Périmètre pilote | Bamako + Ségou | VALIDÉE | Kisangani exclue définitivement |
| A-02 | API Key MVP | VALIDÉE | VALIDÉE | Périmètre MVP uniquement |
| A-03 | mTLS ciblé | VALIDÉE | VALIDÉE | Selon exposition |
| D-01 | Moteur vectoriel | NON BLOQUANT | À DÉCIDER (PLAN) | Abstraction requise |
| D-02 | Chunking | NON BLOQUANT | À CALIBRER | Paramètre expérimental |
| D-03 | Matching = aide décision | VALIDÉE | VALIDÉE | Seuil 90 % non figé |
| LANGUE | Français MVP (X-05) | VALIDÉE | VALIDÉE | Localisation ultérieure |
| X-01 | Interface Web responsive MVP | VALIDÉE | VALIDÉE | — |
| X-02 | Application mobile | FUTURE | REPORTÉE | Hors MVP |
| X-03 | Chatbot WhatsApp | FUTURE | REPORTÉE | Hors MVP |
| X-04 | Support téléphonique centres MVP | VALIDÉE | VALIDÉE | Opéré par centres partenaires |
| INTERFACE (vue globale) | Web responsive MVP ; mobile / WA = FUTURE ; téléphone centres = MVP | VALIDÉE | VALIDÉE | Nomenclature X-01..X-04 |

## 12.2 — Identité visuelle (CONSERVÉE VALIDÉE)

> L'identité visuelle est **CONSERVÉE VALIDÉE** et ne figure pas dans les éléments À VALIDER.

| Élément | Valeur | Statut |
|---|---|---|
| Direction créative | Direction 3 — Communautaire modernisée | ✅ VALIDÉE |
| Logo | Logo A — « Lien » | ✅ VALIDÉE |
| Palette | `#1B6E3F` `#CC5500` `#F5F0E1` `#333333` `#FFFFFF` `#E53935` | ✅ VALIDÉE |
| Slogan | « Ensemble, retrouvons l'essentiel. » | ✅ VALIDÉE |

## 12.3 — État du PLAN

> **Le PLAN peut être engagé.** Les arbitrages humains nécessaires au démarrage de la phase PLAN sont suffisamment fermés.

### Points arbitrés qui débloquent le PLAN

- FSM officielle (14 états) — **VALIDÉE**
- Catégorisation (`NATURE → DOMAINE → TYPE`) — **VALIDÉE**
- Périmètre pilote (Bamako + Ségou) — **VALIDÉ**
- Architecture SMS multi-opérateur + coût paramétrique — **VALIDÉE**
- Authentification API (API Key MVP, mTLS ciblé) — **VALIDÉE**
- Interface (Web responsive) et langue (Français) — **VALIDÉES**
- Matching = aide à la décision — **VALIDÉ**
- Processus juridiques : processus de notification / purge / conservation / RBAC / registre — **VALIDÉS**

### Points à exécuter en phase PLAN

| ID | Objet | Action en PLAN |
|---|---|---|
| D-01 | Moteur vectoriel (FAISS/Pinecone/Weaviate) | Sélection + tests |
| D-02 | Chunking | Calibration expérimentale |
| D-03 | Seuil de matching | Calibration + validation sur données |
| FSM-ANN | Modélisation ANNULÉE | Événement / statut technique du brouillon |
| SMS-OP | Sélection fournisseur réel | Comparaison offres commerciales et techniques |
| SMS-C | Tarif réel | Négociation fournisseurs |
| J-02 | Délai exact de notification | Confirmation APDP / DPO |
| J-03 | Contrat centres | Rédaction contractuelle |
| J-04 | Durée de rétention définitive | Validation DPO / APDP |
| J-05 | Désignation DPO | Désignation par l'autorité compétente |
| J-06 | Durée de purge définitive | Confirmation juridique |
| J-01 | Réintroduction biométrique éventuelle | Analyse dédiée préalable |

### Points pouvant attendre après le PLAN

- OAuth 2.1 (FUTURE)
- Application mobile (FUTURE)
- Chatbot WhatsApp (FUTURE)
- Langues locales supplémentaires (FUTURE)
- Objets de grande valeur, animaux (FUTURE)

## 12.4 — Statut global

> **STATUT GLOBAL : ARBITRAGES INTÉGRÉS — PLAN DÉBLOQUÉ POUR ENGAGEMENT.**
>
> Cela **ne signifie PAS** :
> - MVP validé définitivement ;
> - architecture définitive ;
> - budget définitif ;
> - conformité juridique définitive ;
> - développement autorisé automatiquement.
>
> Cela signifie uniquement : **les arbitrages humains nécessaires au démarrage de la phase PLAN sont suffisamment fermés pour engager cette phase.**


