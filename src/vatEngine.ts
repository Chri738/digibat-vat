import type { ClientProfile, LineItem, VatRegime } from './types';
import { CO_CONTRACTANT_MENTION } from './types';

/**
 * Normalise un numéro de TVA saisi : ajoute automatiquement le préfixe "BE"
 * s'il n'est pas déjà présent, et supprime les espaces.
 */
export function normalizeVatNumber(raw: string): string {
  const trimmed = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (!trimmed) return '';
  if (trimmed.startsWith('BE')) return trimmed;
  return `BE${trimmed}`;
}

/**
 * Détermine le régime de TVA applicable en fonction du profil client.
 *
 * Règles :
 * - Client belge assujetti à la TVA → Co-contractant obligatoire (TVA 0%).
 * - Client belge non assujetti → Régime normal.
 * - Client intra-UE (hors BE) avec numéro VIES valide → Livraison intra-UE (0%).
 * - Client hors UE → Exportation (0%).
 * - En cas d'erreur VIES sur un client intra-UE, l'utilisateur peut
 *   confirmer manuellement l'assujettissement → Co-contractant (0%).
 */
export function determineRegime(client: ClientProfile): {
  regime: VatRegime;
  mention: string | null;
} {
  if (client.manualConfirmSubject) {
    return { regime: 'co_contractant', mention: CO_CONTRACTANT_MENTION };
  }

  if (client.country === 'BE' && client.isVatSubject) {
    return { regime: 'co_contractant', mention: CO_CONTRACTANT_MENTION };
  }

  if (client.country === 'BE' && !client.isVatSubject) {
    return { regime: 'normal', mention: null };
  }

  if (
    client.country !== 'BE' &&
    client.country !== 'other' &&
    client.viesValid
  ) {
    return { regime: 'intra_eu', mention: null };
  }

  if (client.country === 'other') {
    return { regime: 'export', mention: null };
  }

  return { regime: 'normal', mention: null };
}

export interface LineTotals {
  netHT: number;
  vatAmount: number;
  totalTTC: number;
}

export function computeLineTotals(item: LineItem): LineTotals {
  const netHT = item.quantity * item.unitPrice;
  const vatAmount = netHT * (item.vatRate / 100);
  return {
    netHT,
    vatAmount,
    totalTTC: netHT + vatAmount,
  };
}

export interface InvoiceTotals {
  totalHT: number;
  totalVat: number;
  totalTTC: number;
}

export function computeInvoiceTotals(
  items: LineItem[],
  regime: VatRegime,
): InvoiceTotals {
  let totalHT = 0;
  let totalVat = 0;

  for (const item of items) {
    const totals = computeLineTotals(item);
    totalHT += totals.netHT;

    if (regime === 'co_contractant' || regime === 'intra_eu' || regime === 'export') {
      totalVat += 0;
    } else {
      totalVat += totals.vatAmount;
    }
  }

  return {
    totalHT,
    totalVat,
    totalTTC: totalHT + totalVat,
  };
}

/**
 * Vérifie un numéro de TVA via le service VIES (à travers une edge function).
 * Retourne true si valide, false si invalide, null si le service est indisponible.
 */
export async function checkVies(
  vatNumber: string,
  country: string,
): Promise<boolean | null> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vies-check`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vatNumber, country }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (typeof data.valid !== 'boolean') return null;
    return data.valid;
  } catch {
    return null;
  }
}
