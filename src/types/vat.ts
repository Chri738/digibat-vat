export type ClientType = 'COMPANY' | 'INDIVIDUAL' | 'PUBLIC_ENTITY';
export type PropertyUsage = 'PRIVATE' | 'PROFESSIONAL' | 'MIXED';
export type TargetScope = 'PRIVATE_PART' | 'PROFESSIONAL_PART' | 'COMMON_PART' | 'ENTIRE_BUILDING';

export interface VatInput {
  transaction: {
    issueDate: string; // Format YYYY-MM-DD
    currency: string;
  };
  client: {
    type: ClientType;
    countryCode: string; // Ex: "BE"
    vatNumber?: string;
    submitsPeriodicVatReturns: boolean; // True si assujetti déposant des déclarations
  };
  property: {
    countryCode: string;
    usage: PropertyUsage;
    firstOccupancyYear: number;
    privateUsePercentage?: number; // Requis si usage MIXED (ex: 60)
  };
  service: {
    isRealEstateWork: boolean; // Art. 18, § 1, 1°
    targetScope: TargetScope;
    description: string;
  };
}

export interface VatRateDetail {
  rate: number; // 0, 6 ou 21
  percentageOfTotal: number; // Ex: 100 ou 60/40
}

export interface VatOutput {
  rates: VatRateDetail[];
  taxRegime: 'REVERSE_CHARGE' | 'REDUCED_6' | 'STANDARD_21' | 'SPLIT_RATE';
  legalMentionCode: 'AR1_ART20' | 'AR20_TAB_A_XXXVIII' | null;
  legalMentionText: string | null;
  legalReferences: string[];
}
