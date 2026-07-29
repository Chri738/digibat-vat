Vous êtes un expert React / TypeScript / Supabase. Votre mission est de refactoriser et compléter le code de l'application `digibat-vat` (notamment `src/App.tsx`, `src/types.ts` et `src/supabase.ts`) en respectant scrupuleusement le cahier des charges métier et fiscal belge (2025-2026).

---

## 🛠️ ARCHITECTURE DES FICHIERS

### 1. `src/types.ts`
Définir les types TypeScript stricts pour :
- `Language`: `'FR' | 'NL'`
- `ClientType`: `'B2B' | 'B2C'`
- `BuildingAge`: `'UNDER_10' | 'OVER_EQUAL_10'`
- `BuildingUsage`: `'ONLY_PRIVATE' | 'MAJORITY_PRIVATE' | 'ONLY_PRO' | 'MIXED'`
- `WorkNature`: `'RENOVATION' | 'HEAT_PUMP' | 'GARDENING' | 'SOLAR_INSULATION' | 'DEMOLITION_BUILD'`
- `InvoiceLine`: `{ id: string; description: string; amount: number | ''; vatRate: 0 | 6 | 21 }`
- `ClientProfile`: `{ name: string; vatNumber: string; country: string; type: ClientType; isViesValid: boolean }`
- `ChantierInfo`: `{ age: BuildingAge; usage: BuildingUsage; surfaceOver200m2?: boolean; nature: WorkNature; address: string; deliveryDate?: string }`
- `DocumentState`: Structure globale pour le Devis / Facture (horodatage, lignes, sous-totaux HT 6%, HT 21%, TVA 6%, TVA 21%, Total TTC, historique).

---

## 📋 RÈGLES DE GESTION & MOTEUR FISCAL (À IMPLÉMENTER DANS `App.tsx`)

### ÉTAPE 1 – Profil Client (`Klantprofiel`)
1. **Langue :** Sélecteur FR / NL modifiant instantanément l'intégralité du vocabulaire de l'application via un dictionnaire de traduction miroir strict.
2. **Pays UE :** Liste complète `EU_COUNTRIES` (27 pays) affichée dans la langue sélectionnée.
3. **Validation VIES (API VIES) :**
   - Si `ClientType === 'B2B'` : L'accès à l'Étape 2 est **bloqué** tant que le N° de TVA n'est pas validé. Afficher le badge `VIES Validated (Oké)` en vert ou le message d'erreur dans la langue sélectionnée.
   - Si `ClientType === 'B2C'` : Accès direct à l'Étape 2 sans contrôle VIES.

---

### ÉTAPE 2 – Bien Immobilier & Chantier
1. **Âge bâtiment :** `< 10 ans` ou `≥ 10 ans`.
2. **Usage :** 
   - Options : `100% Privé`, `> 50% Privé`, `Exclusif Pro`, `Mixte (Privé + Pro)`.
   - **Règle :** L'activation du choix `Mixte` déclenche un champ/checkbox obligatoire pour vérifier le critère de surface minimale de 200 m².
3. **Nature des travaux :**
   - `Rénovation standard`
   - `Pompe à chaleur`
   - `Entretien courant / Jardinage`
   - `Panneaux solaires & Isolation`
   - `Démolition et/ou Construction`
4. **Saisie neutre :** La cellule `Adresse du chantier / bien` reste **strictement vierge par défaut** (saisie manuelle).

---

### ÉTAPE 3 – Moteur Fiscal TVA Belge (2025-2026 & AR 29/03/2022)
Implémenter la fonction de calcul du taux par défaut et des mentions obligatoires :

1. **Régime B2B :**
   - Taux TVA = 0% (Autoliquidation).
   - Mention légale automatique : *"Autoliquidation - Art. 20, KB nr. 1 / Btw verlegd - KB nr. 1, art. 20"*.

2. **Régime B2C :**
   - **Entretien courant / Jardinage :** Toujours **21%** (peu importe l'âge du bâtiment).
   - **Pompes à chaleur (AR 29/03/2022) :** Toujours **6%** (même si le bâtiment a < 10 ans).
   - **Panneaux solaires & Isolation :** 6% si `≥ 10 ans`, 21% si `< 10 ans`.
   - **Rénovation standard :** 6% si `≥ 10 ans`, 21% si `< 10 ans`.
   - **Démolition / Construction :** 21%.
   - **Clause de présomption (6%) :** Générer automatiquement la mention obligatoire d'exonération/présomption d'un mois sur les documents si le taux 6% est appliqué.

3. **Usage Mixte (Règle Hoofdzaak) :**
   - Si `Pro > Privé` : Ventilation obligatoire (21% pro / 6% privé).
   - Si `Pro ≤ Privé` : 6% sur la totalité si l'affectation principale est le domicile privé (générer la mention explicite de décharge pour l'entrepreneur).

---

## 📝 ÉCRANS DEVIS & FACTURE

1. **Saisie Neutre :**
   - Nom / Raison sociale, N° TVA, Adresse chantier, Entrepreneur et Lignes de prestation doivent être **vides par défaut**.
   - Permettre l'ajout et la suppression dynamique de lignes avec bascule manuelle possible du taux de TVA (6% ou 21%) ligne par ligne.

2. **Ventilation des sous-totaux en bas de document :**
   - Total HT (6%) + TVA (6%)
   - Total HT (21%) + TVA (21%)
   - Total Général TTC

3. **Écran Devis :**
   - Horodatage automatique à la création (`new Date()`).
   - Boutons : `[Enregistrer]`, `[Imprimer]`, `[Convertir en facture]`.

4. **Écran Facture :**
   - Reprise intégrale des données du devis.
   - Champ obligatoire et vierge par défaut : `Date de livraison du chantier` (`Opleveringsdatum van de werken`).
   - Boutons : `[Enregistrer la facture]`, `[Imprimer]`, `[Transférer via Peppol]`.

5. **Sécurité CSS & Export PDF :**
   - Utiliser des règles `@media print` pour **masquer systématiquement l'historique** des modifications à l'impression et dans le payload exporté vers Peppol.

---

## 🌐 DICTIONNAIRE MULTILINGUE (FR / NL)

Garantir le miroir linguistique strict 1:1 pour l'ensemble de l'UI (titres, boutons, statuts VIES, mentions légales).

Exemples de clés :
- FR: *"Détermination TVA « Travaux immobiliers » — Belgique 2025-2026"* ↔ NL: *"Btw-bepaling « Werken in onroerende staat » — België 2025-2026"*
- FR: *"Autoliquidation (B2B)"* ↔ NL: *"Btw verlegd - KB nr. 1, art. 20"*
- FR: *"Convertir en facture"* ↔ NL: *"Omzetten naar factuur"*
- FR: *"Transférer via Peppol"* ↔ NL: *"Verzenden via Peppol"*

---

## 🎯 LIVRABLES ATTENDUS
Fournir un code React / TypeScript propre, modulaire et typé pour `src/types.ts`, `src/App.tsx` et l'intégration Supabase (`src/supabase.ts`) pour la sauvegarde des devis et factures.
