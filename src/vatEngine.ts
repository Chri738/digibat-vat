export interface VatInput {
  clientType: 'B2C' | 'B2B' | 'B2GOV';
  countryCode: string;
  buildingAge: 'UNDER_10' | 'OVER_EQUAL_10';
  buildingUsage: '100_PRIVATE' | 'OVER_50_PRIVATE' | 'UNDER_50_PRIVATE' | '100_PRO';
  workType: 'renov_standard' | 'energy_insulation' | 'demolition_reconstruction' | 'maintenance' | 'new_construction';
  surfacePrivate?: number;
  surfacePro?: number;
  isUniqueOwnHome?: boolean;
  surfaceMax200m2?: boolean;
  language: 'FR' | 'NL';
}

export interface VatResult {
  rate: number;
  secondaryRate?: number;
  proRataPrivatePercent?: number;
  regime: string;
  label: string;
  legalNotice: string;
  certificateRequired: boolean;
  explanation: string;
}

export function calculateVAT(input: VatInput): VatResult {
  const isNL = input.language === 'NL';

  // 1. Règle B2B Belgique - Autoliquidation (Art. 20 AR n°1)
  if (input.clientType === 'B2B' && input.countryCode === 'BE') {
    return {
      rate: 0,
      regime: 'REVERSE_CHARGE',
      label: isNL ? 'BTW verlegging (Art. 20 KB nr. 1)' : 'Autoliquidation (Art. 20 Arrêté Royal n°1)',
      legalNotice: isNL
        ? 'Verlegging van heffing. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de klant geacht te erkennen dat de werken worden uitgevoerd aan een woning waarvan de eerste ingebruikneming dateert van minstens 10 jaar.'
        : 'Autoliquidation - En l\'absence de contestation par écrit dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître que les travaux sont effectués à un bâtiment d\'habitation dont la première occupation date d\'au moins 10 ans.',
      certificateRequired: false,
      explanation: isNL
        ? 'Werken in onroerende staat uitgevoerd voor een BTW-plichtige klant in België.'
        : 'Travaux immobiliers effectués pour un assujetti à la TVA établi en Belgique.'
    };
  }

  // 2. Démolition & Reconstruction (Régime 6%)
  if (input.workType === 'demolition_reconstruction') {
    if (input.isUniqueOwnHome && input.surfaceMax200m2) {
      return {
        rate: 6,
        regime: 'DEMOLITION_RECONSTRUCTION_6',
        label: isNL ? 'Verlaagd tarief 6% (Sloop & Heropbouw)' : 'Taux réduit 6% (Démolition & Reconstruction)',
        legalNotice: isNL
          ? 'Verlaagd BTW-tarief van 6% inzake sloop en heropbouw van een eigen en enige woning (oppervlakte ≤ 200m²).'
          : 'Taux de TVA réduit de 6% applicable aux travaux de démolition et reconstruction d\'un logement propre et unique (surface ≤ 200m²).',
        certificateRequired: true,
        explanation: isNL ? 'Sloop en heropbouw van enige eigen woning ≤ 200m².' : 'Démolition et reconstruction d\'un logement unique ≤ 200m².'
      };
    } else {
      return {
        rate: 21,
        regime: 'STANDARD_21',
        label: isNL ? 'Standaardtarief 21%' : 'Taux normal 21%',
        legalNotice: '',
        certificateRequired: false,
        explanation: isNL ? 'Sloop/heropbouw voldoet niet aan de voorwaarden voor 6%.' : 'La démolition/reconstruction ne remplit pas les conditions du taux réduit.'
      };
    }
  }

  // 3. Usage Mixte avec Répartition de Surface (Prorata m²)
  if (input.buildingUsage === 'UNDER_50_PRIVATE' && input.surfacePrivate && input.surfacePro) {
    const totalSurface = input.surfacePrivate + input.surfacePro;
    const privateRatio = Math.round((input.surfacePrivate / totalSurface) * 100);
    return {
      rate: input.buildingAge === 'OVER_EQUAL_10' ? 6 : 21,
      secondaryRate: 21,
      proRataPrivatePercent: privateRatio,
      regime: 'MIXED_PRORATA',
      label: isNL ? `Gemengd gebruik (${privateRatio}% privé op 6%, ${100 - privateRatio}% pro op 21%)` : `Usage mixte (${privateRatio}% privé à 6%, ${100 - privateRatio}% pro à 21%)`,
      legalNotice: isNL
        ? 'Opsplitsing volgens privé/professioneel gebruik op basis van oppervlakte.'
        : 'Ventilation de la TVA au prorata des surfaces privées et professionnelles conformément à la réglementation fiscale.',
      certificateRequired: input.buildingAge === 'OVER_EQUAL_10',
      explanation: isNL ? `Privégedeelte (${privateRatio}%) geniet van verlaagd tarief indien ≥ 10 jaar.` : `La partie privée (${privateRatio}%) bénéficie du taux réduit si le bâtiment a ≥ 10 ans.`
    };
  }

  // 4. Bâtiment ≥ 10 ans (Usage 100% privé ou > 50% privé)
  if (input.buildingAge === 'OVER_EQUAL_10' && (input.buildingUsage === '100_PRIVATE' || input.buildingUsage === 'OVER_50_PRIVATE')) {
    return {
      rate: 6,
      regime: 'RENOVATION_6',
      label: isNL ? 'Verlaagd tarief 6% (Renovatie ≥ 10 jaar)' : 'Taux réduit 6% (Rénovation ≥ 10 ans)',
      legalNotice: isNL
        ? 'Verlaagd BTW-tarief van 6% op grond van rubriek XXXVIII van tabel A van de bijlage bij het koninklijk besluit nr. 20.'
        : 'Taux de TVA réduit de 6% en vertu de la rubrique XXXVIII du tableau A de l\'annexe à l\'arrêté royal n° 20.',
      certificateRequired: true,
      explanation: isNL ? 'Privéwoning van meer dan 10 jaar oud.' : 'Bâtiment d\'habitation de plus de 10 ans à usage principal privé.'
    };
  }

  // 5. Cas Général (Taux normal 21%)
  return {
    rate: 21,
    regime: 'STANDARD_21',
    label: isNL ? 'Standaardtarief 21%' : 'Taux normal 21%',
    legalNotice: '',
    certificateRequired: false,
    explanation: isNL ? 'Standaard tarief van toepassing (< 10 jaar of professioneel gebruik).' : 'Taux normal applicable (bâtiment < 10 ans ou usage professionnel).'
  };
}
