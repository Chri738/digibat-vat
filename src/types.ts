export type VatRegime =
  | 'normal'
  | 'intra_eu'
  | 'export'
  | 'co_contractant';

export interface ClientProfile {
  name: string;
  vatNumber: string;
  country: 'BE' | 'FR' | 'NL' | 'DE' | 'LU' | 'other';
  address: string;
  isVatSubject: boolean;
  viesValid: boolean | null;
  manualConfirmSubject: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  client: ClientProfile;
  items: LineItem[];
  regime: VatRegime;
  vatMention: string | null;
  notes: string;
}

export const REGIME_LABELS: Record<VatRegime, string> = {
  normal: 'Régime normal (TVA standard)',
  intra_eu: 'Livraison intra-UE (TVA 0%)',
  export: 'Exportation hors UE (TVA 0%)',
  co_contractant: 'Co-contractant (TVA 0%)',
};

export const CO_CONTRACTANT_MENTION =
  'TVA à acquitter par le co-contractant — Art. 20 KB nr 1';
