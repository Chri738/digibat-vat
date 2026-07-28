Agis en tant qu'expert Développeur React / TypeScript. Tu dois mettre à jour le code complet du composant principal dans `src/App.tsx` du projet `digibat-vat` afin de respecter strictement le cahier des charges fonctionnel, ergonomique et fiscal belge (2025-2026).

---

### 1. RÈGLES DE SAISIE & ÉTATS INITIAUX (CHAMPS VIERGES PAR DÉFAUT)
Les états (`useState`) des champs suivants doivent être initialisés avec des valeurs neutres/vides (`""`) pour laisser une autonomie totale à l'entrepreneur :
- **Client :** `nomRaisonSociale`, `numeroTVA`
- **Chantier :** `adresseChantier`
- **Prestataire :** `nomEntreprise`, `numeroTVAPrestataire`, `adressePrestataire`, `coordonneesPrestataire`
- **Facturation :** `dateLivraisonChantier` (champ manuel sur la facture)
- **Tableau de prestations :** Tableau dynamique initialisé avec des lignes vierges (désignations vides, montants HT vides).

---

### 2. TRADUCTION STRICTE & MIROIR LINGUISTIQUE (FR ↔ NL)
Intègre un dictionnaire de traduction réactif permettant de basculer instantanément toute l'interface entre le Français (FR) et le Néerlandais (NL) sans perte de données :
- "Détermination TVA « Travaux immobiliers » — Belgique 2025-2026" ↔ "Btw-bepaling « Werken in onroerende staat » — België 2025-2026"
- "Conforme réformes 2025-2026" ↔ "Conform de hervormingen 2025-2026"
- "Assujetti à la TVA (B2B)" ↔ "Btw-plichtige (B2B)"
- "Particulier / Non-assujetti (B2C)" ↔ "Particulier (B2C)"
- "TVA VIES Validée (OK)" ↔ "VIES Validated (Oké)"
- "Nom / Raison sociale" ↔ "Naam / Bedrijfsnaam"
- "Numéro de TVA" ↔ "Btw-nummer"
- "Adresse du chantier / bien" ↔ "Adres van de werf / bouwwerf"
- "Prestataire de services / Entrepreneur" ↔ "Dienstverlener / Aannemer"
- "Prestations & Matériels" ↔ "Prestaties & Materialen"
- "Montant" ↔ "Bedrag" | "TVA" ↔ "Btw" | "Total" ↔ "Totaal"
- "Date de livraison des travaux" ↔ "Opleveringsdatum van de werken"
- "Transférer via Peppol" ↔ "Verzenden via Peppol"
- "Convertir en facture" ↔ "Omzetten naar factuur"

La constante `EU_COUNTRIES` doit afficher dynamiquement les noms de tous les pays de l'UE selon la langue active (`nameFR` / `nameNL`).

---

### 3. ÉTAPE 1 — PROFIL CLIENT & VALIDATION VIES
- **B2B :** La validation du numéro de TVA via l'API VIES est **bloquante**. L'utilisateur ne peut passer à l'Étape 2 que si le numéro est validé (`VIES Validated (Oké)`). Afficher les messages d'erreur/succès dans la langue sélectionnée.
- **B2C :** Pas de validation VIES. Accès direct à l'Étape 2.

---

### 4. ÉTAPE 2 — BIEN IMMOBILIER & NATURE DES TRAVAUX
- **Âge du bâtiment :** 2 options (`≥ 10 ans` / `≥ 10 jaar` OU `< 10 ans` / `< 10 jaar`).
- **Usage :** 4 options (`100% Privé`, `> 50% Privé`, `Exclusif Pro`, `Mixte (Privé + Pro)`).
  - *Si Mixte :* Activer le contrôle du critère de surface minimale de 200 m².
- **Nature des travaux :** 5 options (`Rénovation standard`, `Pompe à chaleur`, `Entretien courant / Jardinage`, `Panneaux solaires & Isolation`, `Démolition et/ou Construction`).
- Mise en page : Textes centrés en petite écriture, champ « Adresse du chantier » vierge par défaut.

---

### 5. ÉTAPE 3 — MOTEUR FISCAL TVA (DROIT BELGE 2025-2026 & AR 29/03/2022)
Détermine le taux de TVA principal et la mention légale associée :
1. **Client B2B (Assujetti) :**
   - Taux : **0%** (Autoliquidation / Cocontractant / Medecontractant).
   - Mention légale : *"Autoliquidation : Btw te voldoen door de medecontractant (Art. 20, KB nr. 1)"*.
2. **Client B2C — Bâtiment < 10 ans :**
   - **Pompes à chaleur (AR 29/03/2022) :** Taux réduit de **6%**.
   - **Autres travaux (Rénovation, Solaire, Jardinage) :** Taux normal de **21%**.
3. **Client B2C — Bâtiment ≥ 10 ans :**
   - **Entretien courant / Jardinage (tonte, taille, nettoyage, petits travaux, peinture < 2 ans) :** Taux de **21%** systématique.
   - **Rénovation standard & Gros aménagement (terrasses, pavage, abattage d'arbres, pompes à chaleur, panneaux solaires) :** Taux réduit de **6%**.
4. **Usage Mixte (Privé + Pro) & Principe de Hoofdzaak :**
   - Pro > Privé : Ventilation obligatoire (21% partie pro / 6% partie privée).
   - Pro ≤ Privé : Taux de 6% applicable avec mention du principe de *hoofdzaak* (domicile privé principal) dédouanant l'entrepreneur.
5. **Attestation légale AR 29/03/2022 :** Générer automatiquement la clause de présomption d'un mois sur la facture pour les travaux sous taux réduit.

---

### 6. ÉCRANS DEVIS & FACTURE
- **Horodatage :** Générer automatiquement la date et l'heure courantes à la création du devis.
- **Ajustement mixte ligne par ligne :** Dans le tableau dynamique des prestations, permettre d'ajuster le taux de TVA (6% ou 21%) pour chaque ligne individuellement.
- **Ventilation des sous-totaux en bas de page :**
  - Total HT (6%) + TVA 6%
  - Total HT (21%) + TVA 21%
  - Total Général TTC
- **Facture :**
  - Reprendre toutes les données du devis (numéro, date, prestations, montants, coordonnées).
  - Inclure la cellule vierge `Date de livraison des travaux` (saisie manuelle).
  - Boutons d'action bien visibles : `[Enregistrer la facture]`, `[Imprimer]`, `[Transférer via Peppol]`.
- **Règle d'impression & Peppol :**
  - Ajouter les règles CSS `@media print` et la structure XML/JSON Peppol pour **masquer strictement l'historique des modifications** lors de l'impression ou de l'envoi Peppol.

Fournis le code TypeScript/React complet, propre et directement compilable pour `src/App.tsx`.
