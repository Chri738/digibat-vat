import { VatInput, VatOutput } from './types/vat';
import { LEGAL_MENTIONS } from './types/constants/legalMentions';

export function calculateBelgianVat(input: VatInput): VatOutput {
  // 1. Si ce n'est pas un travail immobilier, taux standard 21%
  if (!input.service.isRealEstateWork) {
    return {
      rates: [{ rate: 21, percentageOfTotal: 100 }],
      taxRegime: 'STANDARD_21',
      legalMentionCode: null,
      legalMentionText: null,
      legalReferences: []
    };
  }

  // 2. Règle Cocontractant B2B (Prioritaire : Art. 51, § 2, 5° & AR n°1, Art. 20)
  if (input.client.countryCode === 'BE' && input.client.submitsPeriodicVatReturns) {
    return {
      rates: [{ rate: 0, percentageOfTotal: 100 }],
      taxRegime: 'REVERSE_CHARGE',
      legalMentionCode: 'AR1_ART20',
      legalMentionText: LEGAL_MENTIONS.AR1_ART20.text,
      legalReferences: [...LEGAL_MENTIONS.AR1_ART20.references]
    };
  }

  // 3. Immeuble à usage 100% Professionnel
  if (input.property.usage === 'PROFESSIONAL') {
    return {
      rates: [{ rate: 21, percentageOfTotal: 100 }],
      taxRegime: 'STANDARD_21',
      legalMentionCode: null,
      legalMentionText: null,
      legalReferences: []
    };
  }

  // 4. Calcul de l'ancienneté (Règle des 10 ans pour le 6%)
  const invoiceYear = new Date(input.transaction.issueDate).getFullYear();
  const buildingAge = invoiceYear - input.property.firstOccupancyYear;
  const isEligible6Percent = buildingAge >= 10;

  // 5. Immeuble à Usage Mixte
  if (input.property.usage === 'MIXED') {
    if (input.service.targetScope === 'PROFESSIONAL_PART' || !isEligible6Percent) {
      return {
        rates: [{ rate: 21, percentageOfTotal: 100 }],
        taxRegime: 'STANDARD_21',
        legalMentionCode: null,
        legalMentionText: null,
        legalReferences: []
      };
    }

    if (input.service.targetScope === 'PRIVATE_PART') {
      return {
        rates: [{ rate: 6, percentageOfTotal: 100 }],
        taxRegime: 'REDUCED_6',
        legalMentionCode: 'AR20_TAB_A_XXXVIII',
        legalMentionText: LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.text,
        legalReferences: [...LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.references]
      };
    }

    // Portée commune ou globale (Règle de prépondérance ≥ 50%)
    const privateRatio = input.property.privateUsePercentage ?? 50;
    if (privateRatio >= 50) {
      return {
        rates: [{ rate: 6, percentageOfTotal: 100 }],
        taxRegime: 'REDUCED_6',
        legalMentionCode: 'AR20_TAB_A_XXXVIII',
        legalMentionText: LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.text,
        legalReferences: [...LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.references]
      };
    }

    // Ventilation si usage privé < 50%
    return {
      rates: [
        { rate: 6, percentageOfTotal: privateRatio },
        { rate: 21, percentageOfTotal: 100 - privateRatio }
      ],
      taxRegime: 'SPLIT_RATE',
      legalMentionCode: 'AR20_TAB_A_XXXVIII',
      legalMentionText: LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.text,
      legalReferences: [...LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.references]
    };
  }

  // 6. Immeuble Privé
  if (isEligible6Percent) {
    return {
      rates: [{ rate: 6, percentageOfTotal: 100 }],
      taxRegime: 'REDUCED_6',
      legalMentionCode: 'AR20_TAB_A_XXXVIII',
      legalMentionText: LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.text,
      legalReferences: [...LEGAL_MENTIONS.AR20_TAB_A_XXXVIII.references]
    };
  }

  return {
    rates: [{ rate: 21, percentageOfTotal: 100 }],
    taxRegime: 'STANDARD_21',
    legalMentionCode: null,
    legalMentionText: null,
    legalReferences: []
  };
}
