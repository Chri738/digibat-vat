import { describe, it, expect } from 'vitest';
import { calculateBelgianVat } from './vatEngine';

describe('Moteur de TVA Belge - Travaux Immobiliers', () => {

  // Test 1 : Cocontractant B2B (Art. 20)
  it('doit appliquer l autoliquidation (0%) pour un client B2B assujetti en Belgique', () => {
    const result = calculateBelgianVat({
      transaction: { issueDate: '2026-07-25', currency: 'EUR' },
      client: { type: 'COMPANY', countryCode: 'BE', submitsPeriodicVatReturns: true },
      property: { countryCode: 'BE', usage: 'PRIVATE', firstOccupancyYear: 2010 },
      service: { isRealEstateWork: true, targetScope: 'ENTIRE_BUILDING', description: 'Toiture' }
    });

    expect(result.taxRegime).toBe('REVERSE_CHARGE');
    expect(result.rates[0].rate).toBe(0);
    expect(result.legalMentionCode).toBe('AR1_ART20');
  });

  // Test 2 : Particulier - Logement >= 10 ans (6%)
  it('doit appliquer le taux réduit de 6% pour une habitation privée de plus de 10 ans', () => {
    const result = calculateBelgianVat({
      transaction: { issueDate: '2026-07-25', currency: 'EUR' },
      client: { type: 'INDIVIDUAL', countryCode: 'BE', submitsPeriodicVatReturns: false },
      property: { countryCode: 'BE', usage: 'PRIVATE', firstOccupancyYear: 2012 }, // 14 ans d'ancienneté
      service: { isRealEstateWork: true, targetScope: 'ENTIRE_BUILDING', description: 'Rénovation façade' }
    });

    expect(result.taxRegime).toBe('REDUCED_6');
    expect(result.rates[0].rate).toBe(6);
    expect(result.legalMentionCode).toBe('AR20_TAB_A_XXXVIII');
  });

  // Test 3 : Particulier - Logement < 10 ans (21%)
  it('doit appliquer le taux standard de 21% si la maison a moins de 10 ans', () => {
    const result = calculateBelgianVat({
      transaction: { issueDate: '2026-07-25', currency: 'EUR' },
      client: { type: 'INDIVIDUAL', countryCode: 'BE', submitsPeriodicVatReturns: false },
      property: { countryCode: 'BE', usage: 'PRIVATE', firstOccupancyYear: 2020 }, // 6 ans d'ancienneté
      service: { isRealEstateWork: true, targetScope: 'ENTIRE_BUILDING', description: 'Carrelage' }
    });

    expect(result.taxRegime).toBe('STANDARD_21');
    expect(result.rates[0].rate).toBe(21);
    expect(result.legalMentionCode).toBeNull();
  });

  // Test 4 : Immeuble mixte avec scission des taux (Usage privé à 40%)
  it('doit ventiler 6% / 21% pour un immeuble mixte si la partie privée est < 50%', () => {
    const result = calculateBelgianVat({
      transaction: { issueDate: '2026-07-25', currency: 'EUR' },
      client: { type: 'INDIVIDUAL', countryCode: 'BE', submitsPeriodicVatReturns: false },
      property: { countryCode: 'BE', usage: 'MIXED', firstOccupancyYear: 2005, privateUsePercentage: 40 },
      service: { isRealEstateWork: true, targetScope: 'ENTIRE_BUILDING', description: 'Chauffage central' }
    });

    expect(result.taxRegime).toBe('SPLIT_RATE');
    expect(result.rates).toHaveLength(2);
    expect(result.rates[0]).toEqual({ rate: 6, percentageOfTotal: 40 });
    expect(result.rates[1]).toEqual({ rate: 21, percentageOfTotal: 60 });
  });

});
