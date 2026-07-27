Actue en tant que Développeur Senior React / TypeScript expert en fiscalité belge (TVA Construction, e-invoicing & Peppol).

L'objectif est d'effectuer une refonte précise du fichier principal `src/App.tsx` (et des composants associés) de l'application "DigiBât VAT / DigiBouw BTW" en respectant rigoureusement les 5 points ci-dessous.

---

### 1. Étape 1 : Profil Client (Clean State & Pays UE)
- **Champs vides par défaut** : Supprimer toute valeur initiale préremplie pour le Nom/Entreprise et le Numéro de TVA (définir les states à `""`). Conserver uniquement les textes d'exemples en `placeholder`.
- **Liste déroulante des pays** : Intégrer l'ensemble des 27 pays membres de l'Union Européenne dans le menu déroulant "LAND / PAYS" (avec leurs codes ISO 2 lettres pour la validation VIES : BE, FR, NL, DE, LU, IT, ES, PT, PL, etc.).
- Conserver le bouton de validation VIES ("VIES Controleren" / "Vérifier VIES") et le support bilingue FR/NL.

---

### 2. Étape 2 : Bien & Travaux (Adresse & Options complètes)
- **Nouveau champ obligatoire** : Ajouter un champ de saisie "ADRESSE DU CHANTIER / BIEN" (Rue, Numéro, Code postal, Ville).
- **Réintégration stricte de TOUTES les options de la nature des travaux** :
  * **Nature des travaux / Aard van de werken** :
    1. 🔨 `Standaard onderhoud en renovatie` / `Entretien standard et rénovation`
    2. 🔥 `Warmtepomp` / `Pompe à chaleur`
    3. ☀️ `Zonnepanelen & Isolatie` / `Panneaux solaires & Isolation`
    4. 🏗️ `Sloop & Heropbouw` / `Démolition & Reconstruction`
  * **Travaux extérieurs / Espaces verts (Optionnel / Buitenwerken)** :
    1. 🚫 `Niet van toepassing` / `Non applicable`
    2. 🌿 `Lopend onderhoud (Gras maaien, hagen scheren...)` / `Entretien courant`
    3. 🏗️ `Aanleg & Grote werken (Terras, bestrating, drainage...)` / `Aménagement & Grands travaux`

---

### 3. Étape 3 : Précision Juridique Maximale (Verdict & Mentions légales)
Afficher le résultat exact selon le profil déterminé, avec les textes de loi textuels stricts (support FR/NL) :

- **Cas B2B Assujetti (Autoliquidation / Btw verlegd)** :
  * Titre : `✓ Autoliquidation — Régime Cocontractant` | Badge : `0% (Autoliquidation / Btw verlegd)`
  * **Texte obligatoire légal à insérer sur la facture** :
    > "Autoliquidation : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l'Arrêté Royal n° 1)."
    *(En NL: "Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een belastingplichtige is die gehouden is tot het indienen van periodieke aangiften (Art. 20 KB nr. 1).")*

- **Cas B2C Privé (> 10 ans)** :
  * Application du taux de **6%**.
  * Référence légale obligatoire : `Rubrique XXXVIII du tableau A de l'Arrêté Royal n° 20 relatif aux taux de TVA`.

- **Cas Usage mixte (Privé + Pro)** :
  * Encadré d'avertissement jaune/orange :
    > "⚠️ Traitement des travaux mixtes (Privé + Pro) : En cas d'usage mixte, une ventilation obligatoire des montants doit être effectuée (séparation au prorata : quotité privée à 6% / quotité professionnelle à 21% ou autoliquidation Art. 20)."

---

### 4. Espace Devis (Dynamique & Personnalisable)
Ajouter la vue/module Devis accessible depuis l'Étape 3 :
- **Profil Entreprise Prestataire** : Champs éditables pour l'entrepreneur (Nom société, N° TVA, Adresse, IBAN, BIC).
- **Lignes de prestations** : Table dynamique permettant d'ajouter/supprimer/éditer des lignes (Description, Quantité, Prix unitaire HTVA).
- **Automatisme TVA** : Le taux de TVA sur chaque ligne s'applique **automatiquement** selon le verdict légal obtenu à l'Étape 3.
- **Boutons d'action** :
  * 💾 `Enregistrer le devis` (sauvegarde dans l'historique local)
  * 🖨️ `Imprimer le devis` (mise en page d'impression / PDF clean)
  * ⚡ `Convertir en facture` (bascule toutes les données vers le module Facture)

---

### 5. Espace Facture complet & Intégration Peppol
- **Reprise automatique** : Récupération intégrale des données du devis, des coordonnées de l'entrepreneur, du client, de l'adresse du chantier et de la mention légale d'Étape 3.
- **Boutons d'action** :
  * 💾 `Enregistrer la facture`
  * 🖨️ `Imprimer la facture`
  * 🌐 `Transférer via Peppol` : Déclencher une modale de confirmation simulant la transmission au réseau Peppol (format UBL / e-FFF) avec un message de succès confirmant l'envoi.

---

### 🎨 Instructions UI & Code
- Conserver scrupuleusement la charte graphique existante (Tailwind CSS, cartes blanches à bordures arrondies, boutons bleus `#2563eb`, typographie propre).
- S'assurer de la bonne gestion des états React (`useState`) pour la fluidité entre les 3 étapes, le Devis et la Facture.
