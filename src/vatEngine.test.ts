import { describe, it, expect } from 'vitest';
import { calculateVAT } from './vatEngine';

describe('Tests du Moteur Fiscal TVA (Belgique 2025-2026)', () => {
  it('B2B : Applique l autoliquidation 0% si VIES est valide', () => {
    const res = calculateVAT({
      lang: 'FR',
      clientType: 'B2B',
      isViesValid: true,
      buildingAge: 'OVER_10',
      buildingUsage: 'PRO_EXCLUSIVITY',
      workCategory: 'RENOVATION_STANDARD',
    });
    expect(res.isValid).toBe(true);
    expect(res.vatRate).toBe(0);
    expect(res.badgeText).toContain('0%');
  });

  it('B2C < 10 ans : Pompe à chaleur à 6%', () => {
    const res = calculateVAT({
      lang: 'NL',
      clientType: 'B2C',
      buildingAge: 'UNDER_10',
      buildingUsage: 'PRIVATE_100',
      workCategory: 'HEAT_PUMP',
    });
    expect(res.isValid).toBe(true);
    expect(res.vatRate).toBe(6);
  });

  it('B2C ≥ 10 ans : Entretien courant reste à 21%', () => {
    const res = calculateVAT({
      lang: 'FR',
      clientType: 'B2C',
      buildingAge: 'OVER_10',
      buildingUsage: 'PRIVATE_100',
      workCategory: 'ROUTINE_MAINTENANCE',
    });
    expect(res.isValid).toBe(true);
    expect(res.vatRate).toBe(21);
  });

  it('B2C ≥ 10 ans : Usage mixte avec Pro > Privé sur parcel ≥ 200m² ventile les taux', () => {
    const res = calculateVAT({
      lang: 'FR',
      clientType: 'B2C',
      buildingAge: 'OVER_10',
      buildingUsage: 'MIXED',
      plotArea: 250,
      privateArea: 50,
      proArea: 100,
      workCategory: 'RENOVATION_STANDARD',
    });
    expect(res.isValid).toBe(true);
    expect(res.isSplitRate).toBe(true);
    expect(res.proVatRate).toBe(21);
    expect(res.privateVatRate).toBe(6);
  });
});
