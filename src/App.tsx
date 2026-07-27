Actue en tant que Développeur Senior React / TypeScript expert en fiscalité belge (TVA Construction, e-invoicing & Peppol).

L'objectif est de corriger et finaliser l'application "DigiBât TVA / DigiBouw BTW" dans `src/App.tsx` en respectant scrupuleusement la présentation visuelle des maquettes fournies et les fonctionnalités requises.

---

### 🟢 ÉTAPE 1 : PROFIL DU CLIENT (Correction complète)
1. **Champs vides par défaut (Clean State)** :
   - Les champs `NOM / ENTREPRISE` et `NUMÉRO DE TVA` doivent être strictement vides au chargement (`useState("")`).
   - N'afficher que des exemples textuels sous forme de `placeholder` (ex: "ex: Jean Dupont / Nom d'entreprise", "ex: BE0123456789").
2. **Liste déroulante PAYS (27 pays de l'Union Européenne)** :
   - Remplacer le sous-ensemble actuel par un tableau complet contenant l'ensemble des 27 pays de l'UE :
     `[BE, FR, NL, DE, LU, AT, BG, CY, HR, DK, ES, EE, FI, EL, HU, IE, IT, LV, LT, MT, PL, PT, RO, SK, SI, SE, CZ]`.
   - Formater chaque entrée de la liste de manière bilingue FR/NL selon la langue sélectionnée :
     - Ex (FR) : `Belgique / België (BE)`, `France / Frankrijk (FR)`, `Pays-Bas / Nederland (NL)`, `Allemagne / Duitsland (DE)`...
     - Ex (NL) : `België / Belgique (BE)`, `Frankrijk / France (FR)`, `Nederland / Pays-Bas (NL)`, `Duitsland / Duitsland (DE)`...
3. **Conserver le bouton VIES** ("Vérifier VIES" / "VIES Controleren") aligné avec le champ du numéro de TVA.

---

### 🔵 ÉTAPE 2 : BIEN & TRAVAUX (Correction UI / Cartes & Adresse)
Rétablir l'interface graphique sous forme de **cartes cliquables (boutons sélecteurs)** au lieu de simples menus déroulants :

1. **Section 1 - Ancienneté du bâtiment** (Boutons cartes) :
   - `🏢 Moins de 10 ans`
   - `⏱️ Plus de 10 ans`
2. **Section 2 - Usage du bâtiment** (Boutons cartes) :
   - `🏡 Plus de 50% privé`
   - `🏢 Exclusivement professionnel`
   - `🧱 Gemengd (privé + pro) / Usage mixte`
3. **Section 3 - Nature des travaux** (Grille de cartes avec icônes) :
   - `🔨 Standaard onderhoud en renovatie` / `Entretien standard et rénovation`
   - `🔥 Warmtepomp` / `Pompe à chaleur`
   - `☀️ Zonnepanelen & Isolatie` / `Panneaux solaires & Isolation`
   - `🏗️ Sloop & Heropbouw` / `Démolition & Reconstruction`
4. **Section 4 - Travaux extérieurs / Espaces verts (Optionnel)** (Cartes) :
   - `🚫 Niet van toepassing` / `Non applicable`
   - `🌿 Lopend onderhoud (Gras maaien, hagen scheren...)` / `Entretien courant`
   - `🏗️ Aanleg & Grote werken (Terras, bestrating, drainage...)` / `Aménagement & Grands travaux`
5. **Section 5 - Adresse du chantier** :
   - Ajouter le champ de saisie texte obligatoire : `ADRESSE DU CHANTIER / BIEN` (avec placeholder `ex: Rue de la Loi 16, 1000 Bruxelles`).

---

### 🟣 ÉTAPE 3 : RÉSULTAT & JURIDIQUE
1. **Génération du verdict fiscal & Citations textuelles de loi** :
   - **Régime B2B Autoliquidation** :
     - Titre : `✓ Autoliquidation — Régime Cocontractant` | Badge : `0% (Autoliquidation / Btw verlegd)`
     - Texte obligatoire : *"Autoliquidation : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l'Arrêté Royal n° 1)."* (et version NL).
   - **Régime B2C (> 10 ans)** : Application du taux de **6%** avec référence à la *Rubrique XXXVIII du tableau A de l'AR n° 20*.
   - **Régime mixte** : Avertissement explicite sur la ventilation obligatoire des montants (séparation prorata privé 6% / pro 21% ou autoliquidation B2B).
2. **Boutons d'action à l'Étape 3** :
   - 💾 `Enregistrer la détermination` (sauvegarde dans le composant Historique).
   - 📄 `Transferer vers un devis` (ouvre le module Devis en transmettant toutes les données).

---

### 📝 MODULE DEVIS (Quote)
1. **Coordonnées Prestataire** : Permettre à l'entrepreneur de saisir/modifier les informations de son entreprise (Nom entreprise, N° TVA, Adresse, IBAN/BIC).
2. **Lignes de prestations** : Tableau éditable avec ajout/suppression de lignes (Description des travaux, Quantité, Prix unitaire HTVA).
3. **Application automatique de la TVA** : Le taux de TVA déterminé à l'Étape 3 s'applique automatiquement sur le calcul total HTVA/TVA/TTC.
4. **Boutons d'action Devis** :
   - 💾 `Enregistrer le devis`
   - 🖨️ `Imprimer le devis` (mise en page PDF/Impression)
   - ⚡ `Convertir le devis en facture`

---

### 🧾 MODULE FACTURE (Invoice & Peppol)
1. **Reprise automatique** : Importer l'intégralité des éléments issus du Devis, les coordonnées client, l'adresse du chantier et le texte légal de l'Étape 3.
2. **Boutons d'action Facture** :
   - 💾 `Enregistrer la facture`
   - 🖨️ `Imprimer la facture`
   - 🌐 `Transférer via Peppol` : Déclencher une modale d'envoi simulant la transmission au réseau Peppol avec confirmation de succès.

---

### 🎨 DESIGN & ERGONOMIE
Maintenir la cohérence visuelle Tailwind CSS (fond gris clair `#f8fafc`, cartes blanches avec bordures fines, boutons bleus `#2563eb`, typographie propre et badges de statut verts/jaunes).
