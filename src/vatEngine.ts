/**
 * DIGIBÂT VAT / DIGIBOUW BTW - Moteur Fiscal TVA (Belgique 2025-2026)
 * Fichier : src/vatEngine.ts
 */

export type Language = 'FR' | 'NL';
export type ClientType = 'B2B' | 'B2C';
export type BuildingAge = 'UNDER_10' | 'OVER_10';
export type BuildingUsage = 'PRIVATE_100' | 'PRIVATE_OVER_50' | 'PRO_EXCLUSIVITY' | 'MIXED';

export type WorkCategory =
  | 'RENOVATION_STANDARD'      
  | 'HEAT_PUMP'                
  | 'SOLAR_PANELS'             
  | 'INDUSTRIAL_CLEANING'      
  | 'ROUTINE_MAINTENANCE'      
  | 'NEW_PAINTING'             
  | 'DANGEROUS_TREE_FELLING'   
  | 'DEMOLITION_CONSTRUCTION';

export interface TaxEngineInput {
  lang: Language;
  clientType: ClientType;
  isViesValid?: boolean;
  buildingAge: BuildingAge;
  buildingUsage: BuildingUsage;
  plotArea?: number;      
  privateArea?: number;   
  proArea?: number;       
  workCategory: WorkCategory;
}

export interface TaxEngineResult {
  isValid: boolean;
  errorMessage?: string;
  vatRate: number;              
  isSplitRate: boolean;          
  proVatRate?: number;          
  privateVatRate?: number;      
  badgeText: string;            
  legalMention: string;         
  explanation: string;          
}

export function calculateVAT(input: TaxEngineInput): TaxEngineResult {
  const {
    lang,
    clientType,
    isViesValid,
    buildingAge,
    buildingUsage,
    plotArea = 0,
    privateArea = 0,
    proArea = 0,
    workCategory,
  } = input;

  // 1. Contrôle B2B / VIES
  if (clientType === 'B2B' && !isViesValid) {
    return {
      isValid: false,
      errorMessage:
        lang === 'FR'
          ? 'Validation VIES requise pour le statut B2B assujetti.'
          : 'VIES-validatie vereist voor B2B btw-plichtige status.',
      vatRate: 21,
      isSplitRate: false,
      badgeText: 'ERR',
      legalMention: '',
      explanation: '',
    };
  }

  // Contrôle Usage Mixte & Parcelle de 200m²
  if (buildingUsage === 'MIXED' && plotArea < 200) {
    return {
      isValid: false,
      errorMessage:
        lang === 'FR'
          ? 'Un bâtiment à usage mixte doit être situé sur une parcelle de minimum 200 m².'
          : 'Een gebouw met gemengd gebruik moet zich op een perceel van minstens 200 m² bevinden.',
      vatRate: 21,
      isSplitRate: false,
      badgeText: 'ERR',
      legalMention: '',
      explanation: '',
    };
  }

  // 2. Régime B2B (Art. 20, KB nr. 1)
  if (clientType === 'B2B' && isViesValid) {
    const legalMention =
      lang === 'FR'
        ? 'Autoliquidation : En l\'absence de contestation écrite dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître qu\'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l\'AR n° 1).'
        : 'Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een belastingplichtige is die gehouden is tot de indiening van periodieke aangiften (Art. 20 KB nr. 1).';

    return {
      isValid: true,
      vatRate: 0,
      isSplitRate: false,
      badgeText: lang === 'FR' ? '✓ 0% (Autoliquidation)' : '✓ 0% (Btw verlegd)',
      legalMention,
      explanation:
        lang === 'FR'
          ? 'Régime B2B : Application de l\'autoliquidation TVA à 0%.'
          : 'B2B-regeling: Toepassing van btw verlegd 0%.',
    };
  }

  // 3. Clause de responsabilité client (B2C)
  const clientResponsibilityClause =
    lang === 'FR'
      ? 'Taux de TVA applicable. En l\'absence de contestation écrite dans un délai d\'un mois, le client final est responsable du respect des critères d\'application.'
      : 'Toepasselijk btw-tarief. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand, is de eindklant verantwoordelijk voor de naleving van de toepassingscriteria.';

  // 4. Régime B2C < 10 ans
  if (buildingAge === 'UNDER_10') {
    if (workCategory === 'HEAT_PUMP' || workCategory === 'INDUSTRIAL_CLEANING') {
      return {
        isValid: true,
        vatRate: 6,
        isSplitRate: false,
        badgeText: '✓ 6%',
        legalMention: clientResponsibilityClause,
        explanation:
          lang === 'FR'
            ? 'Bâtiment < 10 ans : Taux réduit de 6% applicable (Pompe à chaleur AR 29/03/2022 ou Nettoyage industriel de fin de chantier).'
            : 'Gebouw < 10 jaar: Verlaagd tarief van 6% van toepassing (Warmtepomp KB 29/03/2022 of Industriële opleveringsschoonmaak).',
      };
    }

    return {
      isValid: true,
      vatRate: 21,
      isSplitRate: false,
      badgeText: '✓ 21%',
      legalMention: clientResponsibilityClause,
      explanation:
        lang === 'FR'
          ? 'Bâtiment < 10 ans : Taux normal de 21% applicable.'
          : 'Gebouw < 10 jaar: Normaal tarief van 21% van toepassing.',
    };
  }

  // 5. Régime B2C ≥ 10 ans
  if (buildingUsage === 'MIXED') {
    if (proArea > privateArea) {
      return {
        isValid: true,
        vatRate: 21,
        isSplitRate: true,
        proVatRate: 21,
        privateVatRate: 6,
        badgeText: lang === 'FR' ? '✓ Ventilation (21% Pro / 6% Privé)' : '✓ Splitsing (21% Pro / 6% Privé)',
        legalMention: clientResponsibilityClause,
        explanation:
          lang === 'FR'
            ? 'Usage mixte (Pro > Privé) sur parcelle ≥ 200 m² : Ventilation obligatoire (21% sur la partie pro / 6% sur la partie privée).'
            : 'Gemengd gebruik (Pro > Privé) op perceel ≥ 200 m²: Verplichte splitsing (21% pro-gedeelte / 6% privé-gedeelte).',
      };
    } else {
      return {
        isValid: true,
        vatRate: 6,
        isSplitRate: false,
        badgeText: '✓ 6%',
        legalMention: clientResponsibilityClause,
        explanation:
          lang === 'FR'
            ? 'Usage mixte (Pro ≤ Privé) sur parcelle ≥ 200 m² : Taux réduit de 6% sur la totalité (affectation principale résidentielle).'
            : 'Gemengd gebruik (Pro ≤ Privé) op perceel ≥ 200 m²: Verlaagd tarief van 6% op het totaal (hoofdbestemming woning).',
      };
    }
  }

  if (workCategory === 'ROUTINE_MAINTENANCE' || workCategory === 'NEW_PAINTING') {
    return {
      isValid: true,
      vatRate: 21,
      isSplitRate: false,
      badgeText: '✓ 21%',
      legalMention: clientResponsibilityClause,
      explanation:
        lang === 'FR'
          ? 'Bâtiment ≥ 10 ans : L\'entretien courant et le jardinage ordinaire restent assujettis au taux de 21%.'
          : 'Gebouw ≥ 10 jaar: Gewoon onderhoud en tuinonderhoud blijven onderworpen aan het tarief van 21%.',
    };
  }

  return {
    isValid: true,
    vatRate: 6,
    isSplitRate: false,
    badgeText: '✓ 6%',
    legalMention: clientResponsibilityClause,
    explanation:
      lang === 'FR'
        ? 'Bâtiment ≥ 10 ans : Taux réduit de 6% applicable (Rénovation, Isolation, Panneaux solaires, Abattage d\'arbres dangereux, Nettoyage industriel).'
        : 'Gebouw ≥ 10 jaar: Verlaagd tarief van 6% van toepassing (Renovatie, Isolatie, Zonnepanelen, Vellen gevaarlijke bomen, Industriële reiniging).',
  };
}
