// Types & Interfaces pour le Moteur Fiscal TVA (DigiBât / DigiBouw)

export type StatutTVA = "B2B" | "B2C";
export type AgeBatiment = "<10" | ">=10";
export type UsageBatiment = "100_PRIV" | "GT50_PRIV" | "EXCL_PRO" | "MIXED";
export type ViesStatus = "UNCHECKED" | "PENDING" | "VALIDATED" | "INVALID";

// Catalogue exhaustif des 11 travaux
export type WorkType =
  | "HEAT_PUMP"               // 1. Pompe à chaleur (AR 29/03/2022)
  | "STANDARD_RENOVATION"     // 2. Rénovation standard
  | "HEAVY_OUTDOOR"          // 3. Aménagements extérieurs lourds
  | "SOLAR_INSULATION"        // 4. Panneaux solaires & Isolation
  | "SOLAR_GENERAL"           // 5. Panneaux solaires & autres travaux généraux
  | "INDUSTRIAL_CLEANING"     // 6. Nettoyage industriel de chantier
  | "TREE_FELLING"            // 7. Abattage des arbres dangereux
  | "PAINTING_NEW"            // 8. Peinture bâtiment neuf
  | "PAINTING_OLD"            // 9. Peinture bâtiment ancien
  | "ROUTINE_HOUSE_MAINT"     // 10. Nettoyage courant, lavage de vitres...
  | "ROUTINE_GARDENING";      // 11. Entretien courant & Jardinage ordinaire

export interface VatInput {
  statutTVA: StatutTVA;
  viesStatus: ViesStatus;
  ageBatiment: AgeBatiment;
  usageBatiment: UsageBatiment;
  
  // Données de surface (Usage Mixte)
  surfacePrivee?: number;        // en m²
  surfacePro?: number;           // en m²
  superficieParcelle?: number;   // en m²
  
  // Travaux sélectionnés
  workTypes: WorkType[];
}

export interface LineRateResult {
  workType: WorkType;
  rate: number;                  // Taux de TVA calculé (0, 6 ou 21)
  isVentilated?: boolean;        // Vrai si ventilation mixte (21%/6%) requise
  ratePro?: number;              // Taux part pro si ventilé (21%)
  ratePrivate?: number;          // Taux part privée si ventilé (6%)
  proPercentage?: number;        // Ratio surface pro (%)
  privatePercentage?: number;    // Ratio surface privée (%)
}

export interface VatResult {
  regimeKey: "B2B_AUTOLIQUIDATION" | "B2C_LESS_10" | "B2C_GE_10_STANDARD" | "B2C_GE_10_MIXED";
  lineResults: Record<WorkType, LineRateResult>;
  legalMentionKey: "AUTOLIQUIDATION_ART20" | "RESPONSIBILITY_CLIENT_GE10" | "STANDARD_NONE";
  isMixedUsageApplied: boolean;
  mixedUsageVentilated: boolean; // Vrai si Pro > Privé sur parcelle >= 200m²
}

/**
 * Moteur Fiscal Principal : Calcul des taux de TVA et déclenchement des mentions légales.
 */
export function calculateVAT(input: VatInput): VatResult {
  const {
    statutTVA,
    viesStatus,
    ageBatiment,
    usageBatiment,
    surfacePrivee = 0,
    surfacePro = 0,
    superficieParcelle = 0,
    workTypes,
  } = input;

  const lineResults: Record<string, LineRateResult> = {};

  // ----------------------------------------------------------------------
  // 1. CAS B2B : Autoliquidation / Medecontractant (Art. 20, KB nr. 1)
  // ----------------------------------------------------------------------
  if (statutTVA === "B2B" && viesStatus === "VALIDATED") {
    workTypes.forEach((wt) => {
      lineResults[wt] = {
        workType: wt,
        rate: 0, // Autoliquidation 0%
      };
    });

    return {
      regimeKey: "B2B_AUTOLIQUIDATION",
      lineResults: lineResults as Record<WorkType, LineRateResult>,
      legalMentionKey: "AUTOLIQUIDATION_ART20",
      isMixedUsageApplied: false,
      mixedUsageVentilated: false,
    };
  }

  // ----------------------------------------------------------------------
  // 2. CAS B2C : Application de la grille tarifaire B2C
  // ----------------------------------------------------------------------
  const isGE10 = ageBatiment === ">=10";
  const isMixed = usageBatiment === "MIXED" && superficieParcelle >= 200;

  let isMixedVentilated = false;
  let proShare = 0;
  let privateShare = 0;

  // Analyse du cas Usage Mixte (>= 10 ans et parcelle >= 200 m²)
  if (isGE10 && isMixed) {
    const totalSurface = surfacePrivee + surfacePro;
    if (totalSurface > 0) {
      proShare = Math.round((surfacePro / totalSurface) * 100);
      privateShare = 100 - proShare;
    }
    // Condition de ventilation : Surface Professionnelle > Surface Privée
    if (surfacePro > surfacePrivee) {
      isMixedVentilated = true;
    }
  }

  workTypes.forEach((wt) => {
    let calculatedRate = 21; // Taux par défaut

    if (!isGE10) {
      // --- BÂTIMENT < 10 ANS ---
      switch (wt) {
        case "HEAT_PUMP":
        case "SOLAR_INSULATION":
        case "INDUSTRIAL_CLEANING":
          calculatedRate = 6;
          break;
        case "STANDARD_RENOVATION":
        case "HEAVY_OUTDOOR":
        case "SOLAR_GENERAL":
        case "TREE_FELLING":
        case "PAINTING_NEW":
        case "PAINTING_OLD":
        case "ROUTINE_HOUSE_MAINT":
        case "ROUTINE_GARDENING":
        default:
          calculatedRate = 21;
          break;
      }

      lineResults[wt] = { workType: wt, rate: calculatedRate };

    } else {
      // --- BÂTIMENT >= 10 ANS ---
      if (isMixedVentilated) {
        // Cas Mixte Pro > Privé : Ventilation 21% Pro / 6% Privé
        lineResults[wt] = {
          workType: wt,
          rate: 6, // Taux de référence privé
          isVentilated: true,
          ratePro: 21,
          ratePrivate: 6,
          proPercentage: proShare,
          privatePercentage: privateShare,
        };
      } else {
        // Cas Standard >= 10 ans OU (Mixte Pro <= Privé -> 6% total)
        switch (wt) {
          case "HEAT_PUMP":
          case "STANDARD_RENOVATION":
          case "HEAVY_OUTDOOR":
          case "SOLAR_INSULATION":
          case "INDUSTRIAL_CLEANING":
          case "TREE_FELLING":
            calculatedRate = 6;
            break;
          case "SOLAR_GENERAL":
          case "PAINTING_NEW":
          case "PAINTING_OLD":
          case "ROUTINE_HOUSE_MAINT":
          case "ROUTINE_GARDENING":
          default:
            calculatedRate = 21;
            break;
        }

        lineResults[wt] = { workType: wt, rate: calculatedRate };
      }
    }
  });

  // Détermination du régime final et de la mention légale obligatoirement injectée
  const regimeKey = !isGE10
    ? "B2C_LESS_10"
    : isMixed
    ? "B2C_GE_10_MIXED"
    : "B2C_GE_10_STANDARD";

  const legalMentionKey = isGE10 ? "RESPONSIBILITY_CLIENT_GE10" : "STANDARD_NONE";

  return {
    regimeKey,
    lineResults: lineResults as Record<WorkType, LineRateResult>,
    legalMentionKey,
    isMixedUsageApplied: isMixed,
    mixedUsageVentilated: isMixedVentilated,
  };
}
