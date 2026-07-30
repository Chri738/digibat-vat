import { FormState, VatCalculationResult } from './types';

export function calculateVatRules(state: FormState): VatCalculationResult {
  // 1. Régime B2B (Cocontractant / Autoliquidation 0%)
  if (state.clientType === 'B2B' && state.isViesValidated) {
    return {
      rates: [
        {
          workTypeId: 'b2b-all',
          label: 'Travaux immobiliers (Régime B2B - Autoliquidation)',
          rate: 0
        }
      ],
      legalNotice: 'Autoliquidation : En l\'absence de contestation écrite dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître qu\'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l\'AR n° 1).'
    };
  }

  // 2. Régime B2C (Particuliers)
  const isOldBuilding = state.buildingAge === 'OVER_EQUAL_10';
  
  // Vérification de la surface totale pour l'usage mixte
  const totalSurface = (state.surfacePrivate || 0) + (state.surfacePro || 0);
  const isMixedBelowThreshold = state.buildingUsage === 'MIXED' && totalSurface < 200;

  // Rénovation à 6% (Bâtiment de +10 ans, non mixte ou mixte >= 200m²)
  if (isOldBuilding && !isMixedBelowThreshold && (state.buildingUsage === '100_PRIVATE' || state.buildingUsage === 'OVER_50_PRIVATE' || state.buildingUsage === 'MIXED')) {
    return {
      rates: [
        {
          workTypeId: 'renov-6',
          label: 'Rénovation / Aménagement de logement privé (> 10 ans)',
          rate: 6
        }
      ],
      legalNotice: 'Taux réduit de TVA de 6 % applicable aux travaux de rénovation pour logements de plus de 10 ans (Rubrique XXXVIII de l\'annexe au tarif des taux de TVA).'
    };
  }

  // 3. Taux standard par défaut (21%) - Ne bloque plus l'application !
  return {
    rates: [
      {
        workTypeId: 'standard-21',
        label: isMixedBelowThreshold 
          ? 'Travaux sur bâtiment mixte (< 200 m²) - Taux normal 21%'
          : 'Travaux de construction / rénovation - Taux normal 21%',
        rate: 21
      }
    ],
    legalNotice: isMixedBelowThreshold
      ? 'Application du taux normal de 21% : la superficie totale minimale de 200 m² n\'étant pas atteinte pour le régime mixte dérogatoire.'
      : 'Taux normal de TVA à 21% applicable.'
  };
}
