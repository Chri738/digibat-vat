Actue en tant qu'développeur Senior React / TypeScript expert en législation fiscale belge (TVA Bâtiment & Peppol). 

Nous travaillons sur l'application "DigiBât TVA / DigiBouw BTW" (fichier principal : src/App.tsx). 
Voici le cahier des charges des modifications à implémenter étape par étape :

---

### 🟢 Étape 1 : Profil du Client (Mise à jour)
1. **Liste des pays UE** : Mettre à jour le champ `<select>` du pays pour inclure la liste complète des 27 pays membres de l'Union Européenne (avec leurs codes ISO à 2 lettres pour la validation VIES).
2. Maintenir la vérification VIES existante et le support bilingue (FR/NL).

---

### 🔵 Étape 2 : Bien & Travaux (Mise à jour UI & Champs)
1. **Adresse du chantier / bien** : 
   - Ajouter une section obligatoire "Adresse du chantier" (Rue, Numéro, Code Postal, Ville).
2. **Gestion de l'Usage Mixte & Règle des 200 m²** :
   - Si l'option "Gemengd (privé + pro)" / "Usage mixte" est sélectionnée dans l'usage du bâtiment :
     - Afficher un champ de saisie de la surface totale de construction.
     - Ajouter une règle de répartition obligatoire : Permettre de ventiler la surface (Privé vs Pro) avec une contrainte/validation précisant que la surface minimale de construction à ventiler est de **200 m²**.
     - Calculer automatiquement le prorata de répartition.

---

### 🟣 Étape 3 : Résultat & Legal Disclaimer
1. **Citations textuelles précises des textes de lois** (support FR/NL) :
   - **Régime B2B (Autoliquidation)** :
     - FR : *"Autoliquidation : Réduction/absence de TVA en vertu de l'Article 20 de l'Arrêté Royal n° 1. La TVA est à acquitter par le cocontractant."*
     - NL : *"B2B Verlegging van heffing volgens Art. 20 KB nr. 1. BTW te voldoen door de medecontractant."*
   - **Régime B2C (Taux réduit 6% / 21%)** :
     - Préciser la référence exacte selon l'ancienneté (> 10 ans : Rubrique XXXVIII du tableau A de l'AR n° 20).
   - **Travaux mixtes (Séparation des taux)** :
     - En cas d'usage mixte, afficher un tableau explicatif détaillant la ventilation du taux de TVA appliqué à la partie privée (ex: 6%) et à la partie professionnelle (ex: 21% ou autoliquidation Art. 20).
2. **Clause de Responsabilité Fiscale** :
   - Ajouter un encadré d'avertissement légal précisant : *"L'entrepreneur et le client sont tenus de vérifier l'exactitude des déclarations d'affectation du bâtiment. En cas de fausse déclaration, la responsabilité fiscale incombe au client conformément à la réglementation en vigueur."*
3. **Actions / Boutons** :
   - Activer le bouton **"Enregistrer la détermination"**.
   - Activer le bouton **"Convertir en devis"** qui redirige vers le module Devis.

---

### 📄 Module Devis (Nouveau / Extension)
1. **Profil de l'entreprise (Prestataire)** :
   - Permettre à l'entrepreneur de renseigner ou modifier ses coordonnées (Nom entreprise, Adresse, N° TVA, IBAN, BIC, Email).
2. **Lignes de devis & Calculs** :
   - Permettre la saisie des prestations (Description, Quantité, Prix unitaire HTVA).
   - **Automatisme TVA** : Le taux de TVA applicable par ligne doit être **automatiquement verrouillé/pré-rempli** selon le verdict obtenu à l'Étape 3 (ex: 0% Autoliquidation Art. 20, 6%, 21%, ou mixte).
3. **Boutons d'action du Devis** :
   - `Enregistrer le devis` (dans l'historique/state).
   - `Imprimer / Exporter PDF` (mise en page propre du devis).
   - `Convertir en facture` (transfère toutes les données vers la facture).

---

### 🧾 Module Facture (Nouveau / Extension)
1. **Reprise des données** :
   - Importer automatiquement toutes les données issues du devis (Données client, Chantier, Mentions légales de l'Étape 3, Lignes de prix, Taux de TVA).
2. **Boutons d'action de la Facture** :
   - `Enregistrer la facture`.
   - `Imprimer / Exporter la facture PDF`.
   - `Transférer via Peppol` (Ajouter un bouton fonctionnel avec simulation/modal d'envoi au réseau e-invoicing Peppol au format UBL/e-FFF).

---

### 🛠️ Consignes Techniques
- Conserver le design Tailwind CSS propre existant (cartes, badges, boutons d'action).
- Assurer la gestion d'état (State React) pour passer de manière fluide de l'Étape 3 au Devis, puis du Devis à la Facture.
- Conserver le support bilingue parfait (FR/NL) pour tous les nouveaux éléments.
