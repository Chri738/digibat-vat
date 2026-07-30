import { FormState, WorkTypeId } from './types';
import { WORK_CATEGORIES } from './translations';

export interface VatResult {
  rates: { workTypeId: WorkTypeId; label: string; rate: number }[];
  legalNotice: string;
}

export function calculateVatRules(state: FormState): VatResult {
  const isNL = state.language === 'NL';
  const totalSurface = state.surfacePrivate + state.surfacePro;
  
  // 1. Régime B2B (Cocontractant / Medecontractant)
  if (state.clientType === 'B2B') {
    const legalNotice = isNL
      ? "« Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een belastingplichtige is die gehouden is tot de indiening van periodieke aangiften (Art. 20 KB nr. 1). »"
      : "« Autoliquidation : En l'absence de contestation écrite dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 AR n° 1). »";

    const rates = state.selectedWorkTypes.map(id => {
      const cat = WORK_CATEGORIES.find(c => c.id === id);
      return {
        workTypeId: id,
        label: isNL ? cat?.labelNL || '' : cat?.labelFR || '',
        rate: 0
      };
    });

    return { rates, legalNotice };
  }

  // 2. Régime B2C
  let legalNotice = "";
  const isMixedValid = state.buildingUsage === 'MIXED' && totalSurface >= 200;

  if (state.buildingUsage === 'MIXED') {
    legalNotice = isNL
      ? "« Toepasselijk btw-tarief. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand, is de eindklant verantwoordelijk voor de naleving van de toepassingscriteria. »"
      : "« Taux de TVA applicable selon le résultat du test. En l'absence de contestation écrite dans un délai d'un mois, le client final est responsable du respect des critères d'application. »";
  } else if (state.buildingAge === 'OVER_EQUAL_10') {
    legalNotice = isNL
      ? "« Btw-tarief van 6%: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de klant geacht te erkennen dat de werken worden uitgevoerd aan een woning waarvan la eerste ingebruikneming minstens 10 jaar geleden is. »"
      : "« Taux de TVA de 6% : En l'absence de contestation écrite dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître que les travaux sont effectués à un logement dont la première occupation remonte à au moins 10 ans. »";
  }

  const rates = state.selectedWorkTypes.map(id => {
    const cat = WORK_CATEGORIES.find(c => c.id === id);
    const label = isNL ? cat?.labelNL || '' : cat?.labelFR || '';
    let rate = 21; // Par défaut 21%

    if (state.buildingAge === 'UNDER_10') {
      // Bâtiment < 10 ans
      if (id === 'heat_pump' || id === 'solar_insulation') {
        rate = 6;
      } else {
        rate = 21;
      }
    } else {
      // Bâtiment >= 10 ans
      if (
        id === 'routine_house_cleaning' ||
        id === 'routine_garden' ||
        id === 'paint_old'
      ) {
        rate = 21;
      } else {
        // Travaux éligibles à 6% en rénovation
        if (state.buildingUsage === 'MIXED') {
          if (isMixedValid && state.surfacePro > state.surfacePrivate) {
            rate = 21;
          } else {
            rate = 6;
          }
        } else {
          rate = 6;
        }
      }
    }

    return { workTypeId: id, label, rate };
  });

  return { rates, legalNotice };
}
