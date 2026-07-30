export type Language = 'FR' | 'NL';
export type ClientType = 'B2C' | 'B2B';
export type BuildingAge = 'UNDER_10' | 'OVER_EQUAL_10';
export type BuildingUsage = '100_PRIVATE' | 'OVER_50_PRIVATE' | 'EXCLUSIVE_PRO' | 'MIXED';

export interface Country {
  code: string;
  nameFR: string;
  nameNL: string;
}

export type WorkTypeId = 
  | 'heat_pump'
  | 'standard_reno'
  | 'heavy_exterior'
  | 'solar_insulation'
  | 'solar_general'
  | 'industrial_cleaning'
  | 'tree_felling'
  | 'paint_new'
  | 'paint_old'
  | 'routine_house_cleaning'
  | 'routine_garden';

export interface WorkCategory {
  id: WorkTypeId;
  labelFR: string;
  labelNL: string;
}

export interface LineItem {
  id: string;
  workTypeId?: WorkTypeId;
  description: string;
  vatRate: number;
  quantity: number;
  unitPrice: number;
}

export interface FormState {
  // Étape 1
  language: Language;
  countryCode: string;
  clientType: ClientType;
  clientName: string;
  vatNumber: string;
  isViesValidated: boolean;

  // Étape 2
  buildingAge: BuildingAge;
  buildingUsage: BuildingUsage;
  surfacePrivate: number;
  surfacePro: number;
  selectedWorkTypes: WorkTypeId[];
  siteAddress: string;

  // Étape Devis / Facture
  contractorName: string;
  contractorVat: string;
  contractorAddress: string;
  lineItems: LineItem[];
  deliveryDate: string; // Uniquement pour la Facture
}
