# MALI RETROUVÉ — Analyse Produit (Product Analyst)

> **Document de cadrage produit — niveau senior analyst**
> Plateforme nationale d'objets et documents perdus/trouvés (Mali)
> Auteur : Product Analyst • Date : 02/09/2026

---

## Légende des étiquettes

| Étiquette | Sens |
|---|---|
| **FAIT** | Fait observable, documenté, vérifiable |
| **SOURCE** | Référence externe citée (loi, norme, doc existante) |
| **DÉDUCTION** | Inférence logique issue d'un fait observé |
| **RECOMMANDATION** | Proposition de l'analyste, à valider |
| **HYPOTHÈSE** | Estimation non confirmée, à vérifier |
| **DÉCISION À PRENDRE** | Choix bloquant qui nécessite un arbitrage humain |
| **POINT À VÉRIFIER** | Affirmation à confirmer avant engagement |

---

## 01 — Vision produit

**MALI RETROUVÉ** est la plateforme nationale malienne de rapprochement entre **citoyens ayant perdu** un document ou un objet, et **citoyens ayant trouvé** un document ou un objet. Elle étend le service existant micati.site/cni (CNI uniquement) à l'ensemble des pièces d'identité, documents de voyage, titres de transport, diplômes, badges professionnels, cartes santé/assurance, actes administratifs, téléphones, et objets personnels.

**Promesse** : *« Chaque document a son propriétaire. Chaque objet peut être retrouvé. »*

**FAIT** — micati.site/cni existe aujourd'hui, couvre la CNI uniquement, collecte NNI/CNI number/nom/téléphone/email, utilise HMAC-SHA256 pour le NNI, applique une rétention de 12 mois et dispose d'un lien de don Wave.
**DÉDUCTION** — Le système a prouvé la faisabilité et la pertinence métier sur la CNI ; l'extension nationale doit capitaliser sur cette base sans casser le service existant.

### Trois piliers

1. **Inclusion** — couverture rurale, péri-urbaine, faible littératie numérique, multilinguisme (français + bambara + autres langues nationales à terme).
2. **Confiance** — vérification forte du propriétaire avant restitution, traçabilité, conformité APDP et Code pénal malien 2024 (articles 322-9 à 322-30 — référence exacte **À vérifier juridiquement**).
3. **Réseau** — partenariat avec les centres partenaires (mairies, préfectures, commissariats, gares, aéroports, établissements partenaires) pour la collecte et la conservation physique sécurisée.

### Objectif stratégique

Devenir **le point de contact unique national** pour la déclaration, la recherche, le rapprochement, la vérification et la restitution des documents/objets perdus au Mali, avec une gouvernance publique transparente et un modèle économique durable (subventions + partenariats + dons volontaires Wave).

**POINT À VÉRIFIER** — Mandat officiel des autorités maliennes (Ministère de la Sécurité, ANINF, Ministère de l'Administration du Territoire) pour piloter un tel service à l'échelle nationale.

---

## 02 — Problème à résoudre

### Problème fondamental

Les citoyens maliens perdent quotidiennement des documents (CNI, passeports, permis, diplômes) et objets (téléphones, clés) qui finissent soit :
- non déclarés → jamais retrouvés ;
- déclarés à la police/gendarmerie sans suite par manque d'outil ;
- déposés dans des services qui n'ont pas les moyens de retrouver le propriétaire ;
- conservés indéfiniment par des « trouveurs » qui ne savent pas où s'adresser.

**FAIT** — micati.site/cni démontre qu'une plateforme numérique légère peut absorber ce flux pour la CNI.

### Sous-problèmes critiques

| # | Sous-problème | Impact |
|---|---|---|
| P1 | Absence d'identifiant unique autre que le NNI pour relier un objet perdu à un déclarant | Faux positifs, usurpation |
| P2 | Aucun canal national unifié (police, gendarmerie, mairies, transporteurs traitent en silos) | Duplications, pertes sèches |
| P3 | Confidentialité insuffisante : afficher publiquement des données sensibles (NNI, téléphone) crée un risque d'usurpation d'identité | Violation Loi 2013-015 + Code pénal 2024 |
| P4 | Processus de vérification de propriété inexistant ou faible | Restitution à un mauvais propriétaire |
| P5 | Pas d'incitation pour les « trouveurs » honnêtes | Découragement, non-déclaration |
| P6 | Couverture mobile inégale, alphabétisation numérique variable | Exclusion rurale |
| P7 | Rétention non encadrée → conservation indéfinie de données personnelles | Risque APDP |
| P8 | Pas de traçabilité post-restitution → aucune lutte contre le recel | Difficulté à poursuivre |

**SOURCE** — Loi n° 2013-015 du 21 mai 2013 relative à la protection des données à caractère personnel (APDP). **POINT À VÉRIFIER** — référence exacte et intitulé des articles 322-9 à 322-30 du Code pénal malien 2024 (texte intégral à confirmer auprès du Juridique).

### Indicateurs d'échec à éviter

- Faux positifs (croisement trop large) → frustration, perte de confiance.
- Faux négatifs (correspondance trop stricte) → service inutile.
- Fuite de données → sanctions APDP (2,5M-20M FCFA) + Code pénal 2024 (**à vérifier juridiquement**).
- Blocage géographique (centre à Bamako) → exclusion rurale.

---

## 03 — Utilisateurs et acteurs

### Utilisateurs primaires

| Persona | Profil | Besoin | Contrainte |
|---|---|---|---|
| **Citoyen lambda (perdeur)** | Salarié, étudiant, commerçant, 18-65 ans, smartphone bas/mi-gamme | Retrouver un document critique pour son quotidien | Réseau limité, parfois SMS only, faible littératie numérique |
| **Citoyen honnête (trouveur)** | Passant, chauffeur, agent de gare | Remettre l'objet à bon propriétaire de façon fiable | Manque de temps, méfiance institutionnelle |
| **Agent de centre partenaire** | Personnel de mairie, commissariat, gare, bureau | Réceptionner, sécuriser, rapprocher | Besoin d'outils simples, formation courte |
| **Opérateur d'administration centrale** | Équipe projet MALI RETROUVÉ | Superviser, modérer, traiter les cas | Volume potentiellement élevé |
| **Modérateur / Vérificateur** | Personnel formé à la vérification de propriété | Confirmer le lien propriétaire/objet | Sensibilité des données, risque d'erreur |

### Acteurs secondaires

| Acteur | Rôle |
|---|---|
| **APDP** | Autorité de contrôle (Loi 2013-015). Droits d'accès, rectification, suppression. Délai de réponse 30 jours. |
| **Forces de sécurité** (police, gendarmerie) | Réception des déclarations officielles, investigations recel, partenariats locaux |
| **Ministères sectoriels** | Tutelle, validation des process, communication officielle |
| **Opérateurs télécom** (Orange, Moov, Malitel) | Diffusion SMS, USSD, intégration mobile money |
| **ANINF** (HYPOTHÈSE) | Hébergement souverain, conformité cloud national |
| **Wave** | Donations, paiement de frais de service (modèle économique) |
| **Partenaires logistique** (SGG, mairies, préfectures) | Conservation physique sécurisée, points de retrait |
| **Associations / OSC** | Sensibilisation, médiation, accompagnement victimes |
| **Assureurs / Banques** | Intégration future (déclaration auto, opposition) |

---

## 04 — Parcours utilisateurs (8 parcours)

### P1 — Parcours Citoyen (vue d'ensemble)
Découverte via Google, radio communautaire, bouche-à-oreille, affiche en centre partenaire. Choix entre « J'ai perdu » / « J'ai trouvé ». États d'entrée : `nouveau`, `déclarant inscrit`, `déclarant invité`. Sortie : déclaration créée, notification reçue, ou abandon (analytics à tracker).

### P2 — J'ai perdu (déclarant)
1. Sélection du type (12 catégories).
2. Identification déclarant : nom, prénom, téléphone (OTP SMS), email (optionnel).
3. Description : catégorie, sous-catégorie, marque/modèle, couleur(s), signes distinctifs ; date/lieu de perte ; numéro de référence si disponible.
4. Pièces justificatives : photo (recommandé), reçu de dépôt si existant.
5. Choix du rayon de recherche : commune, cercle, région, district.
6. Consentement (RGPD-like).
7. Validation → ID dossier (`MR-2026-001234`).
8. Notification SMS de confirmation.

**Critique** : aucune donnée sensible (NNI complet, photo intégrale de CNI) ne doit être exposée publiquement.

### P3 — J'ai trouvé (déclarant)
1. Identification trouveur (OTP).
2. Description + photo.
3. Choix du mode de remise : centre partenaire OU conservation personnelle.
4. Consentement éclairé.

**DÉCISION À PRENDRE** : autoriser la conservation personnelle longue durée ? **RECOMMANDATION** : décourager, privilégier centre partenaire.

### P4 — Rapprochement (matching — cÅ“ur métier)
Processus systématique à chaque nouvelle déclaration :
- **Règles strictes** : NNI + nom + date de naissance + 1 autre champ / CNI number + nom / IMEI + marque + couleur / Passeport numéro + nom + date de naissance.
- **Règles moyennes** : catégorie + couleur(s) + zone géographique + proximité temporelle.
- **Score** : combinaison pondérée (calibrage phase 2).
- **Décision** : score ≥ 0.85 = confirmé ; 0.5-0.85 = potentiel ; < 0.5 = pas de notification.
- **Traceabilité** : journal de chaque calcul (audit APDP).

**RECOMMANDATION** : ne jamais afficher de score à l'utilisateur final.

### P5 — Vérification de propriété
- Notification au perdeur avec questionnaire (adresse liée au document, photo récente, anciens NNI partiels).
- Demande de dépôt en centre partenaire au trouveur (si conservation personnelle).
- Modérateur humain statue : Confirmé / À compléter / Rejeté.

### P6 — Restitution
- Choix du mode : centre partenaire (défaut) / rencontre contrôlée / envoi postal (**POINT À VÉRIFIER**).
- Vérification finale : pièce d'identité + code OTP.
- Quittance signée + horodatée + photo (consentie).
- Notification de clôture aux deux parties.
- Anonymisation postrétention.

### P7 — Centre partenaire
1. Réception : scan QR / numéro de dossier.
2. Photographie et description complémentaire.
3. Conservation : casier sécurisé + journal d'accès.
4. Rapprochement local automatique.
5. Remise au propriétaire légitime après vérification.
6. Rapport mensuel.

### P8 — Administration / Modération
1. Tableau de bord KPIs temps réel.
2. File de modération par type/région.
3. Vérification de propriété (escalade).
4. Gestion des centres partenaires.
5. Conformité APDP (exports, journal).
6. Communication ciblée (SMS blast régional).
7. Paramétrage des règles métier.

---

## 05 — Fonctionnalités

### Bloc A — Déclaration & description
- **F1** Formulaire « J'ai perdu » multi-type (12 catégories).
- **F2** Formulaire « J'ai trouvé » multi-type.
- **F3** Saisie assistée avec autocomplétion.
- **F4** Capture photo avec recadrage guidé.
- **F5** Anti-fausse déclaration (détection floutage).

### Bloc B — Identité & compte
- **F6** Auth OTP téléphone.
- **F7** Email + mot de passe (récurrents).
- **F8** Espace personnel.
- **F9** Demande RGPD (30 j).
- **F10** Désinscription.

### Bloc C — Rapprochement
- **F11** Moteur matching pondéré + journal d'audit.
- **F12** Détection de doublons.
- **F13** File des correspondances potentielles.
- **F14** Scoring paramétrable.

### Bloc D — Vérification & restitution
- **F15** Questionnaire dynamique.
- **F16** Code de retrait (OTP/QR).
- **F17** Signature numérique de quittance.
- **F18** Preuve de restitution (PDF).

### Bloc E — Centres partenaires
- **F19** Inscription centre (workflow).
- **F20** Stock physique virtuel.
- **F21** Interface agent mobile-first.
- **F22** Rapport mensuel auto.
- **F23** Audit terrain.

### Bloc F — Notifications & multilingue
- **F24** SMS FR (+ bambara futur).
- **F25** In-app.
- **F26** Emails transactionnels.
- **F27** Bandeaux contextuels.

### Bloc G — Sécurité & conformité
- **F28** HMAC-SHA256 NNI/CNI/IMEI (déjà en place).
- **F29** Journalisation accès données.
- **F30** TLS 1.2+ + chiffrement at-rest.
- **F31** RBAC.
- **F32** Rétention configurable (12 mois).
- **F33** Export RGPD + registre des traitements.

### Bloc H — Administration
- **F34** Dashboard multi-KPIs.
- **F35** Gestion utilisateurs & rôles.
- **F36** Modération motivée.
- **F37** Communication institutionnelle.
- **F38** Rapports CSV/PDF.
- **F39** Logs immutables.

### Bloc I — Économie & don
- **F40** Don Wave (déjà en place, à étendre).
- **F41** Freemium (publication gratuite ; premium pros).

---

## 06 — Règles métier

### R-C Confidentialité
- **R-C1** Aucune diffusion publique d'identifiants sensibles.
- **R-C2** CNI number complet visible uniquement par : déclarant, modérateur autorisé, agent centre lors de la remise.
- **R-C3** NNI stocké haché HMAC-SHA256 (déjà en place).
- **R-C4** Noms/prénoms partiellement masqués (initiale + 2 caractères) pour correspondances potentielles.

### R-M Matching
- **R-M1** Toute correspondance tracée (inputs, score, timestamp).
- **R-M2** Aucune correspondance communiquée sans vérification validée.
- **R-M3** Score conservateur (limite faux positifs).

### R-R Rétention
- **R-R1** Données : 12 mois max après clôture.
- **R-R2** Photos : 12 mois après clôture.
- **R-R3** Logs d'audit : 24 mois.
- **R-R4** Effacement dur au terme.

### R-V Vérification
- **R-V1** Documents financiers → contrôle physique d'identité obligatoire.
- **R-V2** Passeports : vérification consulaire (**POINT À VÉRIFIER**).
- **R-V3** Séparation des rôles déclarant/vérificateur.

### R-MO Modération
- **R-MO1** Toute décision de restitution tracée et motivée.
- **R-MO2** Plafond de N dossiers/jour/modérateur (à calibrer).
- **R-MO3** Rejet = motif codifié.

### R-É Économie
- **R-É1** Service gratuit.
- **R-É2** Don Wave autorisé.
- **R-É3** Pas de monétisation des données.

### R-E Escalade
- **R-E1** Document falsifié / identité incohérente → escalade police/gendarmerie.
- **R-E2** Plainte d'usurpation → suspension immédiate + enquête.
---

## 11 — Architecture fonctionnelle (modules / business domains)

`
+------------------------------------------------------------------+
¦                       FRONT-END UNIFIÉ                            ¦
¦  Web public • Web admin • App mobile (PWA) • Interface centre    ¦
+------------------------------------------------------------------+
                 ¦
+----------------?-------------------------------------------------+
¦                  COUCHE API / SERVICES                             ¦
¦ +-------------------------------------------------------------+  ¦
¦ ¦ Auth       ¦ Identité   ¦ Notification¦ Matching            ¦  ¦
¦ ¦ OTP/Email  ¦ (PDV)      ¦ SMS/Email   ¦ (règles+journal)    ¦  ¦
¦ +-------------------------------------------------------------+  ¦
¦ +-------------------------------------------------------------+  ¦
¦ ¦ Déclaration¦ Centres    ¦ Vérification¦ Quittance/RGPD      ¦  ¦
¦ ¦ (perdue/   ¦ Partenaires¦ Propriété   ¦ Export/Suppression  ¦  ¦
¦ ¦  trouvée)  ¦            ¦             ¦                     ¦  ¦
¦ +-------------------------------------------------------------+  ¦
¦ +-------------------------------------------------------------+  ¦
¦ ¦ Modération ¦ Admin      ¦ Audit &     ¦ Donation (Wave)     ¦  ¦
¦ ¦ (workflow) ¦            ¦ Observab.   ¦                     ¦  ¦
¦ +-------------------------------------------------------------+  ¦
+------------------------------------------------------------------+
                 ¦
+----------------?-------------------------------------------------+
¦                  COUCHE DONNÉES                                    ¦
¦  Déclarations • Identités (hashées) • Logs • Stock centres •     ¦
¦  Pièces jointes (S3-compatible) • Index matching                  ¦
+------------------------------------------------------------------+
`

### Domaines métier (DDD)

1. **Déclaration** — entité racine (perdue/trouvée), événements.
2. **Rapprochement** — service autonome, prêt-à-l'emploi.
3. **Vérification** — service d'authentification de propriétaire.
4. **Restitution** — workflow de remise, quittance.
5. **Centre Partenaire** — entité, stock, agents.
6. **Conformité** — registre RGPD, journal d'audit, demandes usagers.
7. **Notification** — orchestrateur multi-canal.
8. **Identité utilisateur** — compte, OTP, RBAC.
9. **Don / Économie** — gestion Wave.

---

## 14 — Notifications

### Matrice des notifications

| Évènement | SMS | Email | In-app | Push |
|---|---|---|---|---|
| OTP de connexion | ? | — | — | ? |
| Confirmation déclaration | ? | ? | ? | ? |
| Correspondance potentielle | ? | — | ? | ? |
| Correspondance confirmée | ? | ? | ? | ? |
| Demande vérification propriété | ? | ? | ? | ? |
| Code de retrait | ? | — | — | — |
| Restitution effectuée | ? | ? | ? | ? |
| Rejet modération | ? | ? | ? | — |
| Rappel expiration (J-7) | ? | ? | ? | ? |
| Expiration dossier | ? | ? | ? | — |
| Sollicitation APDP | ? | ? | ? | — |
| Panne service / info critique | ? (région) | ? | ? | ? |

### Règles de fréquence
- **RN-1** Maximum 2 SMS par déclarant et par jour sauf escalade sécurité.
- **RN-2** Possibilité de désactiver les notifications non-sécurité depuis l'espace personnel.
- **RN-3** Templates FR ; bambara pour les versions orales (futur).

### Sécurité
- **RN-S1** Aucun lien cliquable portant d'identifiant en clair.
- **RN-S2** OTP à durée courte (5 min) et usage unique.

---

## 15 — Centres partenaires

### Modèle

Un centre partenaire est une entité physique (mairie, commissariat, gare, préfecture, aéroport, bureau de poste, banque partenaire) qui accepte de :
1. réceptionner les objets trouvés déposés par les trouveurs ;
2. conserver ces objets en sécurité ;
3. faciliter la remise au propriétaire légitime après vérification.

### Inscription
- **C-1** Demande en ligne par un référent identifié.
- **C-2** Validation par l'administration centrale (existence juridique, identité du référent, adhésion charte).
- **C-3** Formation en ligne (3 modules : réception, conservation, remise) — obligatoire.
- **C-4** Activation du compte agent avec rôle gent_centre.

### Rôles dans le centre
- **Référent** : valide les opérations, signe les restitutions.
- **Agent accueil** : enregistre les dépôts/retraits.
- **Agent vérificateur** : examine les éléments de preuve.

### Stock
- Casier virtuel (centre/zone/casier).
- Chaque mouvement tracé (entrée, sortie, transfert).
- Audit mensuel : inventaire réel vs virtuel.

### Couverture géographique
- **Phase 1** : District de Bamako (5 communes) + capitales régionales (19 régions).
- **Phase 2** : cercles et arrondissements principaux.
- **Phase 3** : couverture intégrale 12 712 villages/fractions/quartiers via Points Services.

**HYPOTHÈSE** — Le nombre 12 712 peut varier selon la source (INSTAT, MATD). **POINT À VÉRIFIER**.

### Indicateurs
- Taux de récupération.
- Délai moyen de restitution.
- Taux d'occupation du stock.
- Taux de satisfaction déclarant.

---

## 16 — Administration

### Tableau de bord (KPIs)
- Volume de déclarations (jour/semaine/mois).
- Répartition par catégorie.
- Taux de rapprochement automatique / manuel.
- Délai moyen perte?déclaration et déclaration?restitution.
- Couverture géographique (% communes couvertes).
- Demandes RGPD reçues / traitées / délai moyen.
- Statistiques de fraude (signalements, suspensions).
- Don Wave collecté.

### Rôles admin
- **Super-admin** : tous droits y compris suppression.
- **Admin régional** : périmètre régional.
- **Modérateur national** : file de vérification.
- **Auditeur** : lecture seule, logs et rapports.
- **Support** : assistance N1, escalade N2.

### Outils
- Recherche full-text dans les déclarations.
- Filtres avancés (catégorie, région, âge, statut).
- Tableau de comparaison côte-à-côte (perdu/trouvé).
- Export CSV / PDF (rapports officiels).
- Webhooks sortants (futur).

### Conformité
- Registre des traitements (RGPD local + APDP).
- Procédure violation de données (72 h).
- AIPD (analyse d'impact relative à la protection des données) en début de projet (**RECOMMANDATION** forte).


---

## 17 — Design system (fondations)

### Couleurs (palette institutionnelle)
- **Primaire** : vert Mali #1B9E3F (référence drapeau malien).
- **Secondaire** : or #F2C94C.
- **Neutre 900** : #0E1B2C (encre, texte principal).
- **Neutre 700** : #3A4A5C.
- **Neutre 500** : #7A8A9C.
- **Neutre 300** : #C8D1DA.
- **Neutre 100** : #F2F5F8.
- **Succès** : #1B9E3F (idem primaire).
- **Attention** : #F2A93B.
- **Erreur** : #D6453C.
- **Information** : #2C7BE5.

> Voir section 20 pour les palettes détaillées.

### Typographie
- **Titres** : Inter ou Plus Jakarta Sans. Alternative open : Manrope.
- **Corps** : Inter Regular 16 px (desktop), 14 px (mobile).
- **Mono** : JetBrains Mono (codes OTP, identifiants techniques).
- **Hiérarchie** : H1 32/40 semibold ; H2 24/32 semibold ; H3 20/28 medium ; Body 16/24 regular ; Caption 12/16 medium uppercase.
- **Support** : police système mobile (SF Pro, Roboto).

### Espacement
- Système base 4 : 4, 8, 12, 16, 24, 32, 48, 64.
- Padding interne boutons : 12 20.
- Cartes : padding 24, 
adius 16.
- Sections : margin 64 desktop, 32 mobile.

### Grille
- **Desktop** : 12 colonnes, gouttière 24, marges 64.
- **Tablette** : 8 colonnes, gouttière 16, marges 32.
- **Mobile** : 4 colonnes, gouttière 16, marges 16.

### Composants (aperçu)
Boutons (Primary/Secondary/Tertiary/Ghost, sm/md/lg, états default/hover/active/disabled/loading), Champs (texte/OTP/téléphone/select/multi-select/date/file/photo), Cartes (déclaration, centre, KPI, notification), Badges statut, Modales, Toasts, Stepper, Tag chips, Avatar, Empty states illustrés, Loaders (skeleton + spinner), Tableau de données (tri, filtre, pagination, export).

### Iconographie
- Style : ligne 2 px, coin arrondi 2 px.
- Bibliothèque : **Lucide** (open source).
- Pictogrammes additionnels pour catégories : créé sur mesure (12 icônes type document/objet).

### Accessibilité (**RECOMMANDATION** forte)
- Contraste AA minimum 4.5:1.
- Navigation clavier intégrale.
- Aria-labels sur tous les contrôles.
- Taille tactile min 44×44.
- Focus visible 2 px.
- Mode daltonien (palette secondaire alternative).
- Voice-over / TalkBack testé.

---

## 18 — Direction artistique (3 directions créatives)

### Direction A — **« Institution sobre & République »**
- **Concept** : prolongement modernisé de l'identité micati existante, plateforme officielle et rassurante.
- **Logo idée** : monogramme MR ligaturé en drapeau stylisé + mot-symbole MALI RETROUVÉ. Symbole discret : livre ouvert retourné (objet) encadré par une arche (porte d'entrée).
- **Symbole** : arche + main ouverte + fil tendu (lien entre les deux parties).
- **Palette** : vert Mali + or + encre profonde + ivoire.
- **Typographie** : serif institutionnel (Source Serif Pro pour titres) + sans-serif (Inter).
- **Caractère** : institutionnel, sobre, public, légèrement traditionnel.
- **Avantages** : confiance immédiate, lisibilité universelle, alignement administration.
- **Inconvénients** : peut paraître froid, peu émotionnel.
- **Pertinence** : forte pour le **site web public et l'administration**.
- **Usage** : web public (homepage), documents officiels (PDF quittance), administration.
- **Potentiel d'évolution** : extensions sectorielles (Santé Retrouvé, Éducation Retrouvé).

### Direction B — **« Tisserand malien »**
- **Concept** : métaphore du tissage (pagne, bogolan) qui relie les gens, les fils et les histoires.
- **Logo idée** : sigle MR stylisé en trame tissée, dominante ocre/bogolan.
- **Symbole** : motifs bogolan minimalisés, fil/knot central qui unit deux extrémités.
- **Palette** : ocre (#C18A3D), bogolan brun (#5C3A21), blanc cassé (#F4ECDF), accent vert Mali.
- **Typographie** : sans-serif géométrique (Manrope) + display à empattement (Bricolage Grotesque).
- **Caractère** : culturel, chaleureux, mémorable, légèrement artisanal.
- **Avantages** : forte identité culturelle, émotion positive, remarquable.
- **Inconvénients** : risque folklore perçu « régional » par urbains ; accessibilité visuelle plus complexe.
- **Pertinence** : forte pour le **mobile et la communication grand public**.
- **Usage** : mobile app, campagnes d'affichage, réseaux sociaux, badges centres.
- **Potentiel d'évolution** : déclinaisons régionales (Tisserand Kayes, Tisserand Sikasso).

### Direction C — **« Connecté & Signal »**
- **Concept** : signal numérique entre deux personnes — point d'origine + point de destination. Métaphore GPS social.
- **Logo idée** : monogramme MR stylisé en deux nœuds reliés par une ligne pointillée ou un arc.
- **Symbole** : deux cercles concentriques (émetteur/récepteur) + arc de connexion.
- **Palette** : vert Mali + bleu signal (#2C7BE5) + violet accent (#7A53C8) + blanc pur.
- **Typographie** : sans-serif géométrique (Plus Jakarta Sans).
- **Caractère** : tech, moderne, scalable, international.
- **Avantages** : modernité, lisibilité mobile, compatible dashboards, accessible daltoniens.
- **Inconvénients** : moins de chaleur humaine, moins d'ancrage local.
- **Pertinence** : forte pour l'**admin et les dashboards**.
- **Usage** : back-office, dashboards modération, applications partenaires.
- **Potentiel d'évolution** : extensions B2B (assureurs, banques), plateforme data.

### Synthèse — application des directions
| Espace | Direction recommandée |
|---|---|
| Site public & grand public | **B** (Tisserand malien) avec touche **A** |
| Mobile / App | **B** |
| Administration / Back-office | **C** |
| Documents officiels (quittances) | **A** |
| Campagnes / Affichage | **B** |

---

## 19 — Propositions de logos (3 concepts minimum)

### Logo 1 — **L'arche du retour** (institutionnel)
- **Logique visuelle** : arche inspirée des portes traditionnelles maliennes (Djenné, Tombouctou). À l'intérieur, deux lignes convergentes évoquent un fil tendu entre deux personnes. Le sommet porte le monogramme MR.
- **Full** : arche verte Mali + monogramme MR centré + texte « MALI RETROUVÉ » en serif institutionnel en dessous, baseline italique : *« Chaque document retrouve son propriétaire »*.
- **Compact** : arche + MR.
- **Favicon** : arche stylisée + 2 lignes.
- **Dark** : arche or (#F2C94C) sur fond vert Mali (#0E1B2C).
- **Light** : arche verte Mali sur fond blanc.
- **Document** : monochrome noir + usage filigrane.

### Logo 2 — **Le tissage MR** (culturel)
- **Logique visuelle** : lettres M et R composées de fils entrecroés (motif bogolan simplifié). Le contre-poinçon du R forme un anneau ouvert qui se referme sur le M.
- **Full** : sigle tissé + texte « MALI RETROUVÉ » en sans-serif géométrique. Baseline en bambara/français sous le sigle.
- **Compact** : sigle MR tissé.
- **Favicon** : sigle plein monochrome.
- **Dark** : sigle ocre/bogolan sur fond sombre.
- **Light** : sigle vert Mali sur fond crème.
- **Document** : variante aquarelle/textile pour affiches campagnes.

### Logo 3 — **Le signal entre deux points** (tech)
- **Logique visuelle** : deux cercles (un vert Mali plein = « déclarant », un contour = « trouvé ») reliés par une trajectoire en arc. Au centre de l'arc : un point blanc = l'instant du rapprochement.
- **Full** : sigle M+R sous les deux cercles + texte institutionnel.
- **Compact** : deux cercles + arc.
- **Favicon** : deux cercles + arc miniature.
- **Dark** : signal blanc sur fond vert Mali.
- **Light** : signal vert Mali sur fond blanc.
- **Document** : aplat monochrome.

> **DÉCISION À PRENDRE** : retenir 1 des 3 logos après test utilisateur (sondage rapide + A/B hero page). Budget test estimé : interne, 1 semaine.

---

## 20 — Palettes de couleurs

### Palette 1 — **République du Mali** (primaire, officielle)
Vert Mali #1B9E3F, Or institutionnel #F2C94C, Encre #0E1B2C, Ivoire #F4ECDF, Succès #1B9E3F, Attention #F2A93B, Erreur #D6453C, Info #2C7BE5.

### Palette 2 — **Bogolan & Chaleur** (mobile/grand public)
Ocre #C18A3D, Bogolan brun #5C3A21, Blanc cassé #F4ECDF, Vert accent #1B9E3F, Indigo nuit #1E2D4D, Sable clair #E8D9BD, Rouge terre #B0392A.

### Palette 3 — **Signal Tech** (admin/dashboard)
Vert Mali #1B9E3F, Bleu signal #2C7BE5, Violet accent #7A53C8, Blanc pur #FFFFFF, Slate 900 #0F172A, Slate 700 #334155, Slate 300 #CBD5E1, Slate 100 #F1F5F9.

### Règles d'usage
- Palette 1 = base pour tous les produits.
- Palette 2 = activation marketing mobile / affiches / campagnes.
- Palette 3 = back-office et dashboards.
- Contraste AA garanti pour tous les couples texte/fond.
- Mode daltonien : variante sans dépendance rouge-vert (icônes + texte d'état).


---

## 21 — Architecture UX/UI

### Information Architecture (IA)

`
ACCUEIL
+-- J'ai perdu
¦   +-- Choisir le type (12 catégories)
¦   +-- Décrire l'objet
¦   +-- Identité déclarant
¦   +-- Confirmation
+-- J'ai trouvé
¦   +-- Choisir le type
¦   +-- Décrire l'objet
¦   +-- Identité trouveur
¦   +-- Choix du mode de remise (centre / conservation)
+-- Mon espace
¦   +-- Déclarations actives
¦   +-- Historique
¦   +-- Notifications
¦   +-- Demande RGPD
¦   +-- Paramètres
+-- Aide / FAQ
+-- Politique de confidentialité
+-- À propos

[ADMIN — sous-domaine admin.maliretrouve.ml]
+-- Dashboard
+-- Déclarations
+-- Rapprochements
+-- Vérifications
+-- Modération
+-- Centres partenaires
+-- Utilisateurs & rôles
+-- Conformité RGPD
+-- Communication
+-- Paramétrage
+-- Audit & logs

[AGENT CENTRE — sous-domaine centre.maliretrouve.ml]
+-- Tableau de bord
+-- Stock
+-- Réception
+-- Restitution
+-- Rapports
+-- Aide
`

### Navigation
- **Web public** : header sticky, menu burger < 768 px, breadcrumbs contextuels, footer institutionnel.
- **Mobile (PWA)** : bottom tab bar (4 onglets : Perdre, Trouver, Espace, aide) + FAB contextuel.
- **Admin** : sidebar collapsible, recherche globale (Ctrl+K), notifications en cloche.
- **Centre** : navigation simplifiée, gros boutons, mode haut contraste (lieux lumineux).

### États UI (complets)
| État | Déclencheur | UI |
|---|---|---|
| **Loading** | Attente API > 200 ms | Skeleton + spinner accessible (aria-live="polite") |
| **Empty** | Liste vide | Illustration + CTA « Créer ma première déclaration » |
| **Error** | Échec API | Toast rouge + bouton « Réessayer » + lien support |
| **Success** | Action validée | Toast vert + message + redirection |
| **No match** | Matching sans résultat | « Aucune correspondance pour le moment. Vous serez prévenu(e)… » + suggestion élargir la zone |
| **Potential** | Score 0.5-0.85 | Bandeau attention + CTA « Confirmer la propriété » |
| **Confirmed** | Score = 0.85 + vérif OK | Bandeau succès + étapes suivantes numérotées |
| **Expired** | 12 mois sans suite | Bandeau gris + texte + bouton « Renouveler » / « Supprimer » |
| **Archived** | Dossier clôturé | Section dédiée + action « Télécharger la quittance » |
| **Refused** | Vérification échouée | Bandeau rouge + motif codifié + recours |
| **Expired session** | Inactivité > 15 min | Modal reconnexion + OTP |

### Wireframes clés (description sémantique)
- **Accueil** : hero plein écran avec titre + 2 CTA (« J'ai perdu » / « J'ai trouvé »), illustration bogolan + statistiques clés (« 12 345 documents restitués »), section « Comment ça marche » en 3 étapes, témoignages, carte des centres partenaires, footer institutionnel.
- **Formulaire « J'ai perdu »** : stepper 4 étapes (Type ? Description ? Identité ? Confirmation), barre de progression, sauvegarde locale (brouillon).
- **Espace personnel** : liste cards empilées, filtres rapides (statut, type, date), empty state illustré.
- **Admin Dashboard** : 4 KPI cards en haut, graphe activité, carte chaleur Mali, table des dossiers en attente.
- **Centre — Réception** : scan QR au centre, formulaire court, confirmation.

### Accessibilité (WCAG 2.2 AA cible)
- Contraste = 4.5:1 (corps), = 3:1 (gros titres).
- Lecteur d'écran : ordre DOM cohérent.
- Navigation clavier intégrale.
- Skip links.
- Sous-titres / transcriptions pour tout contenu audio/vidéo.
- Tests automatisés (axe, Lighthouse) + tests manuels (NVDA, VoiceOver).

### Patterns de design
- **Empty states** : illustration pleine + 1 phrase d'explication + 1 CTA.
- **Confirmations destructrices** : modal avec double saisie (saisie du numéro de dossier).
- **Formulaires longs** : stepper + sauvegarde brouillon localStorage.
- **Notifications contextuelles** : bottom-sheet mobile, toast desktop.

---

## 22 — MVP (MUST / SHOULD / COULD / FUTURE)

### MUST (Phase 1 — indispensable)
- Formulaire « J'ai perdu » CNI (reprise micati) + passeport + permis + téléphone.
- Formulaire « J'ai trouvé » idem.
- Authentification OTP téléphone.
- HMAC-SHA256 sur NNI, CNI number, IMEI.
- Moteur de matching (règles strictes + score simple).
- Notifications SMS (FR).
- Espace personnel minimal.
- Dashboard admin (KPIs de base).
- Don Wave (extension du module existant).
- Conformité RGPD minimale (consentement, accès, suppression).
- Couverture District de Bamako + capitales régionales (19 régions).
- Documentation RGPD et conditions d'utilisation.

### SHOULD (Phase 2 — recommandé)
- Vérification de propriété (questionnaire dynamique).
- Centres partenaires : interface agent + stock virtuel.
- Catégories complètes (12 types).
- Mode sombre.
- Multilingue FR/Bambara (lecture seule).
- Notifications email.
- Modération avancée.
- Rapports exportables PDF/CSV.
- Couverture cercles/arrondissements principaux.

### COULD (Phase 3 — optionnel)
- App mobile native (Android d'abord).
- PWA offline.
- Signature numérique de quittance.
- Vérification consulaire passeports.
- API publique pour intégration forces de sécurité.
- USSD pour zones à faible couverture.
- Module IA d'aide à la vérification (extraction ID).
- Webhooks sortants.
- Programme de gamification pour les trouveurs (badges, classement).

### FUTURE (au-delà Phase 3)
- Intégration banques/assureurs (déclaration auto).
- Open data anonymisée pour recherche académique.
- Extensions sectorielles (Santé Retrouvé, Éducation Retrouvé).
- Blockchain de traçabilité (**HYPOTHÈSE** — pertinence à étudier).
- Module de médiation pour litiges complexes.
- Application vocale / IVR pour non-letttrés.

---

## 23 — Roadmap

### Phase 1 — MVP (0-6 mois) — Lancement District Bamako + capitales régionales
**Cible** : 30 000 déclarations attendues sur 6 mois (HYPOTHÈSE — à calibrer avec retour micati).

**M1-M2** : Specs détaillées, design system v1, identité visuelle arrêtée, AIPD réalisée, accord APDP.
**M3-M4** : Module CNI (reprise micati) + 3 nouvelles catégories (passeport, permis, téléphone), matching v1, OTP, don Wave étendu.
**M5** : Admin dashboard, modération humaine, RGPD procédure.
**M6** : Lancement beta, partenariats 5 mairies + 5 commissariats, campagne de com (radio + affichage).

### Phase 2 — Scale national partiel (6-18 mois)
**Cible** : 200 000 déclarations cumulées.

**M7-M9** : 12 catégories complètes, vérification de propriété, interface agent centre, multilingue FR/Bambara (lecture).
**M10-M12** : Couverture cercles/arrondissements, SMS email, rapports PDF/CSV, mode sombre, PWA offline.
**M13-M18** : API forces de sécurité, webhooks, signature numérique de quittance, gamification.

### Phase 3 — Scale national intégral (18-36 mois)
**Cible** : 1 000 000 déclarations cumulées.

**M19-M24** : App mobile native Android, USSD, Points Services en zones rurales, IA aide à la vérification.
**M25-M36** : Intégrations B2B (assureurs/banques), open data, extensions sectorielles.

> **DÉCISION À PRENDRE** : confirmer le calendrier en fonction des contraintes budgétaires et du partenariat institutionnel.


---

## 24 — Risques

### Risques juridiques & conformité

| Risque | Impact | Atténuation |
|---|---|---|
| **R-J1** Fuite de données personnelles | Sanctions APDP + Code pénal 2024 | Chiffrement fort, audit, AIPD, pentests |
| **R-J2** Manque de base légale pour traiter certaines données | Recours des usagers | Cadre APDP clair, consentement explicite, registre des traitements |
| **R-J3** Usurpation d'identité via restitution frauduleuse | Atteinte à la vie privée | Vérification forte (questionnaire + OTP + pièce d'identité) |
| **R-J4** Conservation au-delà de 12 mois | Non-conformité | Tâche cron de purge + audit |

### Risques techniques

| Risque | Impact | Atténuation |
|---|---|---|
| **R-T1** Faux positifs matching | Frustration, perte de confiance | Mode conservateur, journalisation, recalibrage |
| **R-T2** Faux négatifs matching | Service inutile | Tuning progressif des pondérations |
| **R-T3** Indisponibilité API SMS | Parcours bloqués | Multi-opérateurs (Orange + Moov + Malitel), file d'attente |
| **R-T4** Faille XSS/CSRF sur formulaires | Vol de session | Validation côté serveur, CSP, SameSite cookies |
| **R-T5** Hameçonnage via faux SMS | Usurpation de marque | Pas de lien avec ID en clair, sensibilisation, page « Vérifier un SMS » |

### Risques opérationnels

| Risque | Impact | Atténuation |
|---|---|---|
| **R-O1** Volume trop important pour modération | Délais, qualité dégradée | SLA + plafond + file de priorité |
| **R-O2** Centre partenaire non fiable | Objets perdus ou volés | Charte, audit, formation obligatoire |
| **R-O3** Couverture mobile insuffisante en zone rurale | Exclusion | USSD, Points Services, SMS first |
| **R-O4** Sous-effectif admin | Retard modération | Recrutement, formation, automatisation |

### Risques business

| Risque | Impact | Atténuation |
|---|---|---|
| **R-B1** Faible adoption | ROI négatif | Campagne radio + bouche-à-oreille + partenariats forces de sécurité |
| **R-B2** Financement non pérennisé | Interruption | Dons Wave + subventions + budget État |
| **R-B3** Concurrence privée (assureurs) | Fragmentation | API ouverte, partenariats |

### Risques sociétaux

| Risque | Impact | Atténuation |
|---|---|---|
| **R-S1** Mauvaise presse en cas d'incident | Confiance détruite | Communication transparente, gestion de crise |
| **R-S2** Exclusion numérique | Inégalité d'accès | Points Services physiques, USSD, assistance téléphonique |
| **R-S3** Récel via la plateforme | Criminalité | Vérification forte, audit, partenariats forces de sécurité |

---

## 25 — Questions ouvertes

| # | Question | Qui décide | Échéance |
|---|---|---|---|
| Q1 | Quel ministère/autorité porte politiquement le projet ? | Sponsor | Phase 0 |
| Q2 | Hébergement souverain ou cloud international ? | Tech + Juridique | Phase 0 |
| Q3 | Quels opérateurs SMS pour la phase 1 ? | Tech + Commercial | M2 |
| Q4 | Quelle langue prioritaire après le français (bambara, songhai, peul, touareg) ? | UX + Communautés | M3 |
| Q5 | Quel seuil de score pour le matching « confirmé » (actuellement 0.85 — HYPOTHÈSE) ? | Data + Modération | M5 |
| Q6 | Quels documents sont strictement interdits en dépôt (armes, stupéfiants) ? | Juridique + Sécurité | M2 |
| Q7 | Faut-il une contrepartie financière pour le trouveur ? | Politique + Éthique | M3 |
| Q8 | Quel est le cadre exact des articles 322-9 à 322-30 du Code pénal 2024 ? | Juridique | ASAP |
| Q9 | Quel est le coût réel d'un SMS chez Orange/Moov/Malitel ? | Commercial | M1 |
| Q10 | Qui finance la formation des agents de centre ? | Sponsor + RH | M4 |

---

## 26 — Critères d'acceptation

### Critères globaux

- **CA-G1** Toute déclaration est créée en moins de 3 minutes (mobile 3G).
- **CA-G2** Aucune donnée sensible n'apparaît dans les logs d'erreur ou les exports.
- **CA-G3** Le score de matching est journalisé pour 100 % des calculs.
- **CA-G4** Le délai de réponse à une demande RGPD est = 30 jours calendaires.
- **CA-G5** WCAG 2.2 AA validé par Lighthouse + axe + test manuel.
- **CA-G6** Compatible navigateurs modernes (Chrome, Firefox, Safari, Edge) + 2 dernières versions majeures mobile.
- **CA-G7** Support multilingue FR natif ; bambara ajouté en Phase 2.
- **CA-G8** Le site est responsive 320-2560 px sans overflow horizontal.

### Critères par parcours

- **CA-P2** Le parcours « J'ai perdu » est complétable sans quitter le formulaire, même si l'utilisateur change d'onglet (sauvegarde localStorage).
- **CA-P4** Le matching s'exécute en moins de 5 secondes pour 95 % des cas (P95).
- **CA-P5** La vérification de propriété fournit au moins 2 indices exigés pour les documents d'identité.
- **CA-P6** La quittance PDF est générée en moins de 10 secondes.
- **CA-P7** L'agent de centre peut enregistrer un dépôt en moins de 2 minutes (scan QR + photo + tags).
- **CA-P8** Le tableau de bord admin charge en moins de 3 secondes (P95) avec 100 000 déclarations.

### Critères de sécurité

- **CA-S1** Aucune valeur NNI/CNI/IMEI en clair dans la base (HMAC-SHA256 vérifié).
- **CA-S2** TLS 1.2+ obligatoire ; HSTS activé.
- **CA-S3** Logs immutables conservés 24 mois.
- **CA-S4** Tests d'intrusion (pentest) réalisés avant chaque release majeure.
- **CA-S5** Backups chiffrés, testés tous les 90 jours.

### Critères économiques

- **CA-É1** Coût SMS < 30 FCFA/message (HYPOTHÈSE).
- **CA-É2** Dons Wave traçables avec reçu PDF automatique.
- **CA-É3** Aucun frais pour le citoyen.


---

## 18 — Analyse du site existant (micati.site/cni)

> **OBSERVATION** = ce qui est constaté sur le site.
> **RECOMMANDATION** = ce qu'il faudrait faire pour MALI RETROUVÉ.
> **HYPOTHÈSE** = inférence à valider.

### Structure & UX

- **OBSERVATION** — Deux CTA principaux (« J'ai perdu ma CNI » / « J'ai trouvé une CNI ») mènent à deux formulaires quasi-symétriques. Parcours linéaire et court, peu d'étapes.
- **OBSERVATION** — Pas d'espace personnel persistant visible (HYPOTHÈSE : soit absent, soit très minimal). Le citoyen ne peut pas suivre ses déclarations au-delà du mail de confirmation.
- **RECOMMANDATION** — Introduire un espace personnel dès Phase 1 (auth OTP), avec liste des déclarations, statuts, notifications, et demande RGPD.

### Formulaires

- **OBSERVATION** — Champs collectés : NNI, CNI number, nom, téléphone, email.
- **OBSERVATION** — Aucune preuve photographique exigée.
- **RECOMMANDATION** — Ajouter photo optionnelle mais recommandée (signe distinctif). Étendre à 12 catégories (vs CNI seule).
- **RECOMMANDATION** — Étape « consentement RGPD » explicite (case obligatoire).

### Matching

- **OBSERVATION** — Pas d'information publique sur un moteur de rapprochement automatique (HYPOTHÈSE : rapprochement probablement manuel ou très basique).
- **RECOMMANDATION** — Mettre en place un moteur de matching structuré avec score + journalisation + audit APDP.

### Confidentialité

- **OBSERVATION** — Utilisation de HMAC-SHA256 pour le NNI (FAIT, conforme à la Loi 2013-015).
- **OBSERVATION** — Politique de confidentialité présente mais minimaliste.
- **RECOMMANDATION** — Politique de confidentialité étoffée, registre des traitements public, page « Mes droits RGPD » détaillée.

### Rétention

- **OBSERVATION** — Politique de rétention de 12 mois (FAIT, alignée avec APDP).
- **RECOMMANDATION** — Documenter le processus de purge, proposer un export des données à la demande.

### Don Wave

- **OBSERVATION** — Lien de don Wave mobile money présent (FAIT).
- **RECOMMANDATION** — Intégrer un module don traçable avec reçu automatique, possiblement étendu à Orange Money / Moov Money.

### Couverture fonctionnelle

- **OBSERVATION** — Couvre uniquement la CNI (FAIT).
- **RECOMMANDATION** — Élargir à 12 catégories dès Phase 1 (cf. liste Section 03).

### Couverture géographique

- **OBSERVATION** — Couvre apparemment tout le Mali national (le formulaire ne limite pas géographiquement — HYPOTHÈSE).
- **RECOMMANDATION** — Introduire un rayon de recherche structuré (commune, cercle, région) et un réseau de centres partenaires physiques.

### Modération

- **OBSERVATION** — Aucun back-office public / accessible publiquement (HYPOTHÈSE).
- **RECOMMANDATION** — Construire un back-office admin avec modération humaine, journalisation, KPIs.

### Identité visuelle

- **OBSERVATION** — Identité sobre, aux couleurs du drapeau malien (vert/or), quelques éléments décoratifs discrets (HYPOTHÈSE d'après observation publique).
- **RECOMMANDATION** — Moderniser pour la nouvelle marque MALI RETROUVÉ en capitalisant sur la confiance existante (palette 1 République du Mali, Direction B « Tisserand » pour la chaleur humaine).

### Points forts à conserver

- Service déjà fonctionnel, base existante.
- Confiance acquise des utilisateurs (HYPOTHÈSE).
- Conformité HMAC-SHA256 déjà en place.
- Présence du don Wave (engagement citoyen).

### Points faibles à corriger

- Pas d'espace personnel.
- Pas de suivi post-déclaration.
- Pas de matching automatisé visible.
- Pas de back-office modération apparent.
- Couverture limitée à la CNI.
- Pas de réseau de centres partenaires physiques.

---

## Synthèse exécutive

**MALI RETROUVÉ** peut être lancé en **6 mois** sur le périmètre Phase 1 (CNI + passeport + permis + téléphone, District de Bamako + capitales régionales, SMS OTP, matching v1, dashboard admin) en réutilisant l'infrastructure micati.site/cni.

**Conditions de succès** :
1. Mandat officiel obtenu (POINT À VÉRIFIER Q1).
2. Cadre juridique APDP validé (POINT À VÉRIFIER Q8).
3. 3-5 partenariats de centres pilotes signés avant M4.
4. Identité visuelle arrêtée (Direction B recommandée) — **DÉCISION À PRENDRE**.
5. Budget de communication Phase 1 sécurisé.

**Risque principal** : la confidentialité des données personnelles. Toute l'architecture doit être conçue privacy-by-design dès le M1.

**Levier principal** : la confiance déjà existante autour de micati.site/cni, à transformer en marque nationale par élargissement fonctionnel et géographique progressif.

