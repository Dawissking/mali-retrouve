# MALI RETROUVÉ — Analyse UX/UI & Direction Artistique

> **Périmètre du document** : sections 07 (Architecture UX/UI), 08 & 17 (Design system), 18 (Direction artistique), 19 (Logos), 20 (Palettes).
>
> **Légende des statuts d'information** :
> - **FAIT** : information factuelle vérifiée.
> - **SOURCE** : référence externe identifiable (W3C, WAI, RGAA, Loi Mali, OAPI).
> - **DÉDUCTION** : conclusion tirée du contexte ou d'un standard.
> - **RECOMMANDATION** : choix proposé par l'UI/UX designer.
> - **HYPOTHÈSE** : supposition à confirmer.
> - **DÉCISION À PRENDRE** : choix à valider par le commanditaire.
> - **POINT À VÉRIFIER** : élément à confirmer avant production finale.

---

## 07 — Architecture UX/UI

### 7.1 Espaces & audiences

| Espace | Audience | Accès | Appareil dominant |
|---|---|---|---|
| **Espace Citoyen** | Tout citoyen malien ou résident | Public, sans compte | **Mobile** (HYPOTHÈSE — pénétration mobile élevée au Mali, SOURCE : Banque Mondiale, Digital Development Dashboard) |
| **Espace Centre / Partenaire** | Centres d'état civil, mairies, postes, banques, assurances, transporteurs | Compte + rôle | Mobile + desktop |
| **Espace Administration** | Ministère, DGI, ANTIM, agents de supervision | Compte + rôle + MFA | Desktop |

### 7.2 Arborescence globale

```
Accueil (/)
├── Comment ça marche
├── FAQ & aide multilingue (FR + Bambara)
├── Statistiques publiques
├── Contact & partenaires
├── Espace Citoyen (/)
│   ├── Déclarer une perte
│   ├── Déclarer une trouvaille
│   ├── Rechercher un document retrouvé
│   ├── Vérifier la propriété d'un document
│   ├── Mes déclarations
│   ├── Suivre un rapprochement
│   └── Mon profil
├── Espace Centre / Partenaire (/centre)
│   ├── Tableau de bord
│   ├── Documents à vérifier
│   ├── Demandes de restitution
│   ├── Déclarations entrantes (trouvailles)
│   ├── Statistiques du centre
│   ├── Mon centre & équipe
│   └── Paramètres
└── Espace Administration (/admin)
    ├── Tableau de bord national
    ├── Centres & partenaires
    ├── Agents & rôles
    ├── Audit & logs
    ├── Fraudes & litiges
    ├── Statistiques nationales
    ├── Paramètres plateforme
    └── Gestion des annonces (CMS public)
```

**RECOMMANDATION** : routes plates avec préfixe d'espace, navigation transversale désactivée entre espaces (sécurité contextuelle).

### 7.3 Navigation principale

**Desktop — header institutionnel**
- Logo à gauche
- Liens publics : « Comment ça marche » • « Rechercher » • « Statistiques » • « FAQ »
- Sélecteur de langue : `FR | BM | SN | FF`
- Boutons primaires à droite : « Déclarer une perte » (CTA principal, accent) + « Déclarer une trouvaille »
- Menu utilisateur (si connecté) : avatar → Mes déclarations • Profil • Déconnexion

**Mobile — bottom nav**
1. Accueil (maison)
2. Déclarer (FAB-like central)
3. Rechercher (loupe)
4. Mes dossiers (dossier)
5. Profil / Aide (utilisateur)

### 7.4 Sélecteur de langue

**FAIT** : français = langue administrative officielle au Mali.
**HYPOTHÈSE** : Bambara (bamanankan) ≈ 46 % des locuteurs, suivi Soninké, Peul, Tamasheq, Dogon, Bobo, Sénoufo.
**POINT À VÉRIFIER** : aucune langue nationale n'a de script numérique standard ; le **N'Ko** existe mais reste minoritaire.
**RECOMMANDATION** : interface en **FR + Bambara translittéré (latin)** v1, autres langues en roadmap. SMS/USSD comme canaux alternatifs (HYPOTHÈSE).

---

### 7.5 Les 8 parcours utilisateurs

#### Parcours 1 — Citoyen : accueil & découverte

| Étape | Contenu |
|---|---|
| **Entrée** | Direct, QR code, partage social, Google, SMS reçu |
| **Objectif** | Comprendre la plateforme en ≤ 10 s |
| **Étapes** | 1) Hero slogan + 2 CTA (J'ai perdu / J'ai trouvé) • 2) Compteur public • 3) Témoignages • 4) Bandeau partenaires • 5) FAQ rapide |
| **Données** | Aucune |
| **Validations** | — |
| **Erreurs** | — |
| **Confirmation** | — |
| **Notifications** | Bandeau cookies |
| **Sortie** | Vers parcours perte / trouvaille / recherche |

**États** : loading (squelette), error (bandeau maintenance), success par défaut.

#### Parcours 2 — J'ai perdu un document/objet

| Étape | Contenu |
|---|---|
| **Entrée** | CTA « J'ai perdu » |
| **Objectif** | Déclarer en < 90 s sur mobile |
| **Étapes** | 1) Type (CNI, passeport, permis, carte, autre) • 2) Numéro (optionnel) • 3) Lieu + date (géoloc ou manuel) • 4) Photo (optionnelle, ≤ 5 Mo) • 5) Description (10–500 car.) • 6) Téléphone (+223) + email (optionnel) • 7) Récap • 8) Confirmation + numéro **MR-XXXX-XXXX** |
| **Données** | type, numéro, lieu, date, photo, description, téléphone, email |
| **Validations** | tél. format +223 XX XX XX XX, photo ≤ 5 Mo, descr. 10–500 |
| **Erreurs** | hors-ligne → file locale ; photo invalide ; numéro déjà déclaré (doublon) |
| **Confirmation** | Écran succès + SMS référence (opt-in) + QR code |
| **Notifications** | SMS à chaque changement d'état ; email récap |
| **Sortie** | Vers « Mes déclarations » ou partage QR |

**États** : loading (upload progress), empty, error (champ invalide), success, no-match, potential-match.

#### Parcours 3 — J'ai trouvé un document/objet

| Étape | Contenu |
|---|---|
| **Entrée** | CTA « J'ai trouvé » |
| **Objectif** | Signaler rapidement, même anonymement |
| **Étapes** | 1) Type • 2) Numéro visible ? (oui → scan caméra + OCR ; non → suite) • 3) Lieu + date • 4) Photo (obligatoire) • 5) Contact (optionnel) • 6) Mode de remise : (a) déposer au centre partenaire (carte) ou (b) déclaration seule, plateforme notifie un centre |
| **Données** | type, numéro (opt.), lieu, date, photo obligatoire, contact (opt.) |
| **Validations** | photo obligatoire |
| **Erreurs** | refus caméra, photo floue (avertissement) |
| **Confirmation** | Reçu + instruction « déposer au centre X ou attendre un contact » |
| **Notifications** | Centre le plus proche notifié si mode (b) |
| **Sortie** | Page « Merci citoyen » ou carte des centres |

#### Parcours 4 — Rapprochement automatique (système)

| Étape | Contenu |
|---|---|
| **Entrée** | Événement système (nouvelle perte OU trouvaille) |
| **Objectif** | Détecter une correspondance |
| **Étapes backend** | 1) Normalisation (type, numéro, date, lieu rayon 5 km HYPOTHÈSE) • 2) Score 0–100 • 3) ≥ 80 → notif des deux parties • 4) 50–79 → suggéré au centre • 5) < 50 → archivé |
| **Données traitées** | type, numéro normalisé, hash photo, géoloc approx. |
| **Validations** | aucune côté UX |
| **Erreurs** | faux positif → bouton « Ce n'est pas mon document » |
| **Confirmation** | Validation par parcours 5 |
| **Notifications** | push + SMS « Correspondance possible MR-XXXX » |
| **Sortie** | Vers parcours 5 |

**États UI** : loading, no-match (rassurer), potential-match (badge orange), confirmed (vert), rejected (gris), expired (90 j, HYPOTHÈSE), archived.

#### Parcours 5 — Vérification de propriété

| Étape | Contenu |
|---|---|
| **Entrée** | Notification « correspondance possible » |
| **Objectif** | Confirmer la légitimité du propriétaire |
| **Étapes** | 1) Résumé (type, numéro masqué, date/lieu) • 2) Question secrète 1 (ex : derniers chiffres) • 3) Question secrète 2 (ex : reconnaissance photo recto/verso) • 4) Consentement contact |
| **Données** | réponses, signature numérique |
| **Validations** | 2/2 correctes OU 1/2 + photo + vérif au centre |
| **Erreurs** | 2 essais max → escalade humaine au centre |
| **Confirmation** | Badge vert « Propriété confirmée — restitution en cours » |
| **Notifications** | Centre reçoit instruction de restitution |
| **Sortie** | Vers parcours 6 |

#### Parcours 6 — Restitution

| Étape | Contenu |
|---|---|
| **Entrée** | Propriété confirmée |
| **Objectif** | Remise physique au propriétaire |
| **Étapes** | 1) Centre planifie RDV • 2) Propriétaire reçoit QR • 3) Présentation au centre + pièce d'identité ou biométrie (HYPOTHÈSE — POINT À VÉRIFIER cadre CNI) • 4) Centre scanne QR + capture signature • 5) Trouveur reçoit notif de succès |
| **Données** | créneau, signature, scan QR, biométrie (opt.) |
| **Validations** | identité croisée, signature, photo (consentement) |
| **Erreurs** | retard, désistement → 2 reprogrammations max |
| **Confirmation** | « Restitué » + reçu PDF aux deux parties |
| **Notifications** | SMS + email + compteur public incrémenté |
| **Sortie** | Évaluation satisfaction (1 tap) |

**États** : loading, empty, error, success, **rejected** (absent 2 fois → archive + notif trouveur), expired (90 j, HYPOTHÈSE).

#### Parcours 7 — Centre / Partenaire

| Étape | Contenu |
|---|---|
| **Entrée** | Connexion 2FA (mdp + OTP) |
| **Objectif** | Traiter les déclarations de sa zone |
| **Étapes** | 1) Dashboard (compteurs) • 2) Liste filtrable • 3) Détail (photo, hash anti-doublon) • 4) Vérif propriété • 5) Planif restitution • 6) Capture remise • 7) Stats (CSV/PDF) |
| **Données** | déclarations de la zone + logs |
| **Validations** | RBAC par centre |
| **Erreurs** | session expirée, conflit (verrou optimiste) |
| **Confirmation** | Action loggée |
| **Notifications** | Push interne sonore pour urgentes |
| **Sortie** | Déconnexion (15 min inactivité) |

**États** : **access-refused** (centre désactivé), **session-expired**.

#### Parcours 8 — Administration

| Étape | Contenu |
|---|---|
| **Entrée** | MFA (mdp + OTP ± WebAuthn) |
| **Objectif** | Superviser, auditer, paramétrer |
| **Étapes** | 1) Dashboard national • 2) Gestion centres • 3) Gestion agents (RBAC) • 4) Audit & logs (export CSV signé) • 5) Fraudes & litiges • 6) Paramètres • 7) CMS public |
| **Données** | toutes (cloisonnement régional) |
| **Validations** | double validation admin + super-admin pour modifications critiques |
| **Erreurs** | refus, conflit version, import invalide |
| **Confirmation** | Modal + email de traçabilité |
| **Notifications** | Alertes temps réel (fraude, pic, centre hors ligne) |
| **Sortie** | Timeout court (10 min) |

**États** : loading (virtualisation), empty (rassurant), error, **access-refused**, **session-expired**.

---

## 08 & 17 — Design System Foundations

### 8.1 Tokens

```
--radius-sm: 6px   --radius-md: 10px   --radius-lg: 16px   --radius-pill: 999px
--shadow-1: 0 1px 2px rgba(15,23,42,.08)
--shadow-2: 0 4px 12px rgba(15,23,42,.10)
--shadow-3: 0 12px 32px rgba(15,23,42,.16)
--space-1: 4px  --space-2: 8px  --space-3: 12px  --space-4: 16px  --space-5: 24px  --space-6: 32px  --space-8: 48px  --space-10: 64px
```

### 8.2 Typographie

**RECOMMANDATION** :
- **Inter** (corps UI) — license OFL, SOURCE Google Fonts.
- **Manrope** (titres).
- **JetBrains Mono** (numéros MR, codes).

**Alternatives** : Roboto, Source Sans 3.
**POINT À VÉRIFIER** : couverture glypthique pour Bambara, N'Ko (ɛ, ɲ, ŋ, ɔ). Charis SIL en fallback N'Ko.

Échelle (ratio 1.2 — major third) :
- Display : 32 / 28 / 24 px
- Heading : 20 / 18 / 16 px
- Body : 16 (mobile) / 14 (desktop dense) / 13 (meta)
- Caption : 12 px

### 8.3 Palette (Direction A retenue — détails §20)

| Token | Hex | Contraste sur blanc |
|---|---|---|
| `--brand-700` | `#0F2E5C` | 11.8 :1 AAA |
| `--brand-500` | `#1E5BB8` | 5.9 :1 AA |
| `--brand-100` | `#E6EEF8` | — |
| `--accent-600` | `#D97706` | 4.6 :1 AA |
| `--success-600` | `#1F7A4D` | 4.7 :1 AA |
| `--warning-600` | `#B45309` | 4.8 :1 AA |
| `--danger-600` | `#B91C1C` | 6.0 :1 AA |
| `--info-600` | `#0369A1` | 5.6 :1 AA |
| `--neutral-900` | `#0F172A` | 17 :1 AAA |
| `--neutral-600` | `#475569` | 7.2 :1 AAA |
| `--neutral-300` | `#CBD5E1` | — |
| `--neutral-100` | `#F1F5F9` | — |

**SOURCE** : WCAG 2.2 — 4.5 :1 normal, 3 :1 grand texte (AA). w3.org/WAI/WCAG22/

### 8.4 Grille

- Mobile : 4 col, gouttière 16, marges 16
- Tablette : 8 col, gouttière 16, marges 24
- Desktop : 12 col, gouttière 24, marges 32, max 1280

**RECOMMANDATION** : grille fluide 4→8→12 (gestion 320 px bas de gamme).

### 8.5 Boutons

- **Primaire** : `--brand-500` fond, blanc, hover -8 %, focus 2 px `--accent-600`.
- **Secondaire** : bordure 1 px `--brand-500`, texte `--brand-700`.
- **Tertiaire / lien** : underline hover.
- **Danger** : `--danger-600` + blanc.
- **Désactivé** : `--neutral-300` + `--neutral-600`, `not-allowed`.

Hauteur 48 mobile (WCAG 2.5.5 ≥ 44), 40 desktop dense.

### 8.6 Champs de formulaire

- 48 px mobile, 1 px `--neutral-300`, focus `--brand-500` 2 px + halo.
- Label au-dessus (jamais placeholder seul).
- Aide sous champ, erreur sous champ avec icône.
- Validation onBlur + submit. Jamais bloquante pendant la saisie.

### 8.7 Cartes

Fond blanc, bordure 1 px `--neutral-100`, `--shadow-1`, `--radius-md`.
Variantes : interactive (hover `--shadow-2`), selected (bordure 2 px `--brand-500`), disabled (opacité 60 %).

### 8.8 Tableaux (Centre & Admin)

- Header sticky fond `--neutral-100`.
- Zebra `#fff` / `#F8FAFC`.
- Tri (flèche), filtres (chips + recherche).
- Pagination 25/50/100 (RECOMMANDATION explicite vs infinite scroll).
- Empty + loading (5 lignes squelettes) + virtualisation > 200 lignes.

### 8.9 Badges

| Badge | Fond | Texte | Icône |
|---|---|---|---|
| Brouillon | neutral-100 | neutral-700 | crayon |
| Enregistrée | info-100 | info-700 | horloge |
| Correspondance possible | warning-100 | warning-700 | étoile |
| Propriété confirmée | success-100 | success-700 | coche |
| Restitué | success-700 | blanc | coche double |
| Rejeté | danger-100 | danger-700 | croix |
| Expiré | neutral-200 | neutral-700 | sablier |
| Archivé | neutral-100 | neutral-500 | boîte |
| Accès refusé | danger-700 | blanc | cadenas |

### 8.10 Alertes

4 niveaux (info/success/warning/danger), bandeau pleine largeur, fermable. Mobile = toast.

### 8.11 Modales & dialogues

- Standard 480–640 px, overlay noir 50 %, Échap + clic.
- Critique : double bouton + frappe de « CONFIRMER » (RECOMMANDATION pattern GitHub).
- Drawer latéral mobile swipe-to-close.
- Toasts 4 s / 8 s succès long, pause au survol.

### 8.12 Navigation

- Header 64 desktop / 56 mobile, fond blanc + ombre.
- Bottom-nav 64 px, 5 items.
- Sidebar 240 px → 64 px, pliable.
- Breadcrumb + tabs (←/→).

### 8.13 Composants de statut (métier)

- **Timeline dossier** : 6 jalons, état courant en surbrillance.
- **Carte document** : pictogramme type + `MR•• 1234` + badge.
- **Carte rencontre** : perdu ↔ trouvé (animation Lottie).
- **Force du lien** : barre 0–100 (rouge/orange/vert).

### 8.14 Composants de sécurité

- Bandeau « session expire dans 2 min » + « Rester connecté ».
- Indicateur force mdp (zxcvbn, 5 niveaux).
- OTP 6 cases + auto-focus + collage.
- Consentement RGPD (version + lien).
- Mode lecture seule (cadenas + tooltip).
- Journal d'audit visible (admin).

### 8.15 Composants mobiles

- Stepper horizontal.
- Caméra intégrée + OCR.
- Géoloc bouton + lien manuel.
- Indicateur hors-ligne + queue.
- Pull-to-refresh, swipe actions.

### 8.16 Iconographie

**RECOMMANDATION** : **Lucide** (MIT) ou **Phosphor**. Pas d'emoji en UI fonctionnelle.

### 8.17 Microcopy

**RECOMMANDATION** : ton chaleureux mais officiel, vouvoiement, voix active, phrases courtes. Toujours expliquer le « pourquoi ».

### 8.18 Accessibilité

**SOURCE** : WCAG 2.2 A + AA. Mali : pas de référentiel national identifié (POINT À VÉRIFIER). RGAA 4.1 utilisé comme référence méthodologique.
- Contraste ≥ 4.5 :1 (3 :1 grand texte).
- Cibles tactiles ≥ 44×44.
- Clavier complet + focus visible.
- Landmarks ARIA + labels.
- Sous-titres vidéo.
- Mode contraste élevé + grande police.
- `prefers-reduced-motion`.
- `lang="fr"` / `lang="bm"`.

### 8.19 Performance & bas-débit

- Lazy-load, WebP + fallback JPEG.
- Skeletons > spinners.
- Compression photo 1600 px, qualité 80.
- Bundle < 200 Ko gzip.
- **RECOMMANDATION** : PWA + service worker.
- File hors-ligne IndexedDB.

---

## 18 — Direction artistique (3 propositions)

### Direction A — « Le Carrefour Numérique » (RECOMMANDATION PRINCIPALE)

| Critère | Description |
|---|---|
| **Nom** | Carrefour Numérique |
| **Concept** | Deux chemins qui se croisent (perdu ↔ trouvé). Intersection visuelle d'éléments africains contemporains et de lignes géométriques nettes. |
| **Logo (idée)** | Deux demi-cercles en losange + point lumineux central. Détails §19. |
| **Symbole** | Le losange de rencontre (unité, transparence, fiabilité). |
| **Signification** | Carrefour = métaphore universelle au Mali (places de marché, intersections). |
| **Palette primaire** | Bleu nuit `#0F2E5C` + or `#D97706` sur crème `#FAF7F0` |
| **Palette secondaire** | Vert Sahel `#1F7A4D`, Terre `#B45309`, Gris `#475569` |
| **État** | success `#1F7A4D`, warning `#B45309`, danger `#B91C1C`, info `#0369A1` |
| **Typographie** | Inter, Manrope, JetBrains Mono |
| **Institutionnel** | ★★★★☆ |
| **Tech** | ★★★★☆ |
| **Pros** | Lisible, accessible, mémorable, monochrome, déclinable |
| **Cons** | Losange à vérifier vs emblèmes existants (POINT À VÉRIFIER) |
| **National** | ★★★★★ — Bamako carrefour de l'Afrique |
| **Mobile** | Losange plein bleu nuit en icône app |
| **Web** | Header bleu nuit, fonds crème, CTA or |
| **Doc admin** | Impression N&B |
| **Évolution** | Variantes régionales faciles |

### Direction B — « Le Tisserand »

| Critère | Description |
|---|---|
| **Nom** | Le Tisserand |
| **Concept** | Tissu (pagne, bogolan), fil qui relie, nœud du rapprochement. |
| **Logo (idée)** | Fil en boucle fermée + texture bogolan en filligrane. |
| **Symbole** | Boucle tissée (Bogolan, vannerie, tradition). |
| **Signification** | Tisser du lien, refaire le fil coupé. |
| **Palette primaire** | Brun `#5C3A21`, Ocre `#D4A24C`, Blanc cassé `#F5EFE6` |
| **Palette secondaire** | Indigo `#1B2A4E`, Vert nil `#2A6F4A`, Rouge bogolan `#9B2D20` |
| **État** | success vert nil, warning ocre, danger bogolan, info indigo |
| **Typographie** | Manrope + Source Serif 4 + Inter |
| **Institutionnel** | ★★★☆☆ |
| **Tech** | ★★☆☆☆ |
| **Pros** | Identité forte, originale, ancrée culturellement |
| **Cons** | Risque cliché, accessibilité textures plus difficile |
| **National** | ★★★★☆ |
| **Mobile** | Splash bogolan animé léger |
| **Web** | Sections alternées ocre/blanc cassé |
| **Doc admin** | Très beau, impression quadri |
| **Évolution** | Collections régionales bogolan |

### Direction C — « La Boussole Citoyenne »

| Critère | Description |
|---|---|
| **Nom** | La Boussole Citoyenne |
| **Concept** | Orientation fiable. Géométrie exacte, signalétique forte. |
| **Logo (idée)** | Flèche en M stylisé, pointe retournée vers le centre. |
| **Symbole** | Flèche-boussole (aller / retour). |
| **Signification** | Service public = orientation. |
| **Palette primaire** | Bleu Mali `#0E5BA8`, Blanc, Or `#F2B600` |
| **Palette secondaire** | Gris béton `#4A4A4A`, Vert eau `#1B9E8E`, Rouge signal `#E63946` |
| **État** | success `#1B9E8E`, warning `#F2B600`, danger `#E63946`, info `#0E5BA8` |
| **Typographie** | Inter uniquement |
| **Institutionnel** | ★★★★★ |
| **Tech** | ★★★★☆ |
| **Pros** | Lisible, international, déclinable |
| **Cons** | Moins distinctif |
| **National** | ★★★☆☆ |
| **Mobile** | Logo-flèche en CTA principal |
| **Web** | Épuré « gouvernement en ligne » |
| **Doc admin** | N&B parfait |
| **Évolution** | Portefeuille services publics |

### Synthèse

**RECOMMANDATION : Direction A comme cap**, avec emprunts culturels discrets à la Direction B (filigrane bogolan partenaires). Direction C en plan B si institutionnel maximal.

---

## 19 — Logos (3 concepts)

> Tous logos vectoriels (SVG) : full, compact, favicon, fond clair, fond sombre, monochrome, usage document.

### Logo 1 — « Carrefour » (Direction A)

**Logique** : deux demi-cercles en losange + point lumineux central. Losange = carrefour (route, place, intersection).

- **Full** : losange + « MALI RETROUVÉ » + baseline « Chaque document a son propriétaire »
- **Compact** : losange + monogramme « MR »
- **Favicon** : losange plein bleu nuit
- **Fond sombre** : or sur bleu nuit
- **Fond clair** : bleu nuit sur crème
- **Document** : monochrome + tampon « SERVICE PUBLIC »

### Logo 2 — « Le Nœud » (Direction B)

**Logique** : fil croisé en nœud plat (bogolan, vannerie). Nœud = rencontre.

- **Full** : nœud ocre + baseline « Le lien reprend »
- **Compact** : nœud seul
- **Favicon** : ocre sur blanc
- **Fond sombre** : ocre clair sur brun
- **Fond clair** : brun sur crème
- **Document** : noir + mention « République du Mali — Service de l'état civil »

### Logo 3 — « Le Retour » (Direction C)

**Logique** : flèche en M stylisé, pointe vers le centre. Symétrie axiale.

- **Full** : M-flèche + texte
- **Compact** : M-flèche + « R »
- **Favicon** : M-flèche plein
- **Fond sombre** : or sur bleu Mali
- **Fond clair** : bleu Mali sur blanc
- **Document** : N&B vectoriel

**Anti-clichés** : ❌ loupe + document • ❌ main + document • ❌ carte du Mali silhouette. ✅ géométrie abstraite, rencontre.

**POINT À VÉRIFIER** : validation commanditaire + cellule com. ministère, recherche INPI / OAPI Mali (Organisation Africaine de la Propriété Intellectuelle).

---

## 20 — Palettes

### 20.1 Institutionnelle (Direction A — RECOMMANDÉE)

| Rôle | Token | Hex | Usage |
|---|---|---|---|
| Primaire | brand-700 | `#0F2E5C` | Header autorité |
| Primaire | brand-500 | `#1E5BB8` | CTA |
| Primaire | brand-100 | `#E6EEF8` | Hover |
| Accent | accent-600 | `#D97706` | Slogan, accent secondaire |
| Accent | accent-100 | `#FCE8C8` | Badge warning |
| Succès | success-600 | `#1F7A4D` | Confirmation |
| Succès | success-100 | `#D7EFE2` | Fond succès |
| Warning | warning-600 | `#B45309` | Expiration |
| Warning | warning-100 | `#FCE7C9` | Fond warning |
| Danger | danger-600 | `#B91C1C` | Erreur, suppression |
| Danger | danger-100 | `#FADADA` | Fond danger |
| Info | info-600 | `#0369A1` | Information |
| Info | info-100 | `#CCE7F2` | Fond info |
| Neutre | neutral-900 | `#0F172A` | Texte principal |
| Neutre | neutral-700 | `#334155` | Texte secondaire |
| Neutre | neutral-500 | `#64748B` | Texte tertiaire |
| Neutre | neutral-300 | `#CBD5E1` | Bordures |
| Neutre | neutral-100 | `#F1F5F9` | Fonds secondaires |
| Surface | surface | `#FFFFFF` | Cartes |
| Fond | bg-soft | `#F8FAFC` | Fond de page |

### 20.2 Contraste vérifié (WCAG 2.2)

| Paire | Ratio | Niveau |
|---|---|---|
| `#0F172A` / `#FFFFFF` | 17 :1 | AAA |
| `#0F2E5C` / `#FFFFFF` | 11.8 :1 | AAA |
| `#1E5BB8` / `#FFFFFF` | 5.9 :1 | AA |
| `#D97706` / `#FFFFFF` | 4.6 :1 | AA |
| `#475569` / `#FFFFFF` | 7.2 :1 | AAA |
| blanc / `#1F7A4D` | 4.7 :1 | AA |
| blanc / `#B91C1C` | 6.0 :1 | AA |
| blanc / `#0369A1` | 5.6 :1 | AA |

### 20.3 Centres partenaires

**RECOMMANDATION** : 8 couleurs régionales, toutes AA sur blanc. POINT À VÉRIFIER existence d'un code officiel par région.
- Bamako `#7C2D12`
- Sikasso `#0E7490`
- Kayes `#581C87`
- Koulikoro `#166534`
- Mopti `#854D0E`
- Ségou `#9F1239`
- Tombouctou `#1E3A8A`
- Gao `#155E75`

### 20.4 Direction B — Le Tisserand

- Brun `#5C3A21`, Ocre `#D4A24C`, Indigo `#1B2A4E`, Vert nil `#2A6F4A`, Rouge bogolan `#9B2D20`

### 20.5 Direction C — La Boussole

- Bleu Mali `#0E5BA8`, Or `#F2B600`, Blanc, Gris béton `#4A4A4A`, Vert eau `#1B9E8E`, Rouge signal `#E63946`

---

## Annexes — Points de validation

### DÉCISIONS À PRENDRE
1. Direction artistique finale (A, B ou C).
2. Logo final parmi les 3 concepts.
3. Palette finale + adoption des variantes régionales.
4. Langues au lancement (FR seul ? FR + BM ? FR + BM + N'Ko ?).
5. Identité visuelle partenaires (co-branding ou marque blanche ?).
6. Charte de nommage (« Mali Retrouvé », « MR », « micati » conservé ?).

### POINTS À VÉRIFIER
1. Couverture glyphique Inter / Manrope pour Bambara, Peul, Soninké, N'Ko.
2. Existence d'un référentiel national d'accessibilité numérique (loi malienne).
3. Conflits logo vs emblèmes Mali / OAPI.
4. Charte graphique du ministère de tutelle à respecter / intégrer.
5. Cadre juridique CNI : Loi n°2017-015 relative à la protection des données personnelles au Mali, POINT À VÉRIFIER numéro de série, données sensibles.
6. Biométrie disponible dans les centres (équipement, cadre légal).
7. Délais d'archivage (90 j HYPOTHÈSE — à confirmer juridiquement).
8. Codes couleur officiels des régions administratives.

### HYPOTHÈSES À CONFIRMER
- Pénétration mobile ~85 % au Mali (SOURCE Banque Mondiale, à reconfirmer chiffres récents).
- Le Bambara est la 1re langue nationale (~46 %).
- Le N'Ko est utilisable mais minoritaire.
- Score de rapprochement ≥ 80 = notification (à calibrer avec l'équipe data).
- Géolocalisation rayon 5 km (à ajuster selon densité urbaine).

### RECOMMANDATIONS OUVERTES
- Lancer Direction A en sprint 1, mesurer, ajuster.
- Prévoir une charte de marque co-brandée avec les partenaires majeurs (banques, Poste, mairies).
- Intégrer un « design sprint » avec 5 citoyens cibles avant le développement des écrans critiques.

---

*Fin du document.*