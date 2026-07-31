export interface LegalMentionText {
  fr: string;
  nl: string;
}

export const LEGAL_MENTIONS: Record<string, LegalMentionText> = {
  // 1. Régime B2B : Autoliquidation (Art. 20, KB nr. 1)
  AUTOLIQUIDATION_ART20: {
    fr: "Autoliquidation de la TVA. En l'absence d'objection écrite dans un délai d'un mois suivant la réception de la facture, l'acheteur est réputé reconnaître son statut d'assujetti à la TVA et tenu de déposer des déclarations périodiques. À défaut, il est redevable de la TVA, des intérêts et des pénalités dus (article 20 du décret royal n° 1).",
    nl: "Verlegging van heffing. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een belastingplichtige is gehouden tot de indiening van periodieke aangiften. Als die voorwaarde niet vervuld is, is de afnemer ten aanzien van die voorwaarde aansprakelijk voor de betaling van de verschuldigde belasting, interesten en geldboeten (artikel 20, KB 1).",
  },

  // 2. Régime B2C : Bâtiment ≥ 10 ans & Usage Mixte (Mention de Responsabilité Client)
  RESPONSIBILITY_CLIENT_GE10: {
    fr: "Taux de TVA : En l'absence d'objection écrite dans un délai d'un mois à compter de la réception de la facture, le client reconnaît que : (1) les travaux sont réalisés dans un logement dont la première occupation a eu lieu au cours d'une année civile précédant d'au moins dix ans la date de la première facture relative à ces travaux ; (2) après l'exécution des travaux, le logement est utilisé exclusivement ou principalement comme habitation privée ; et (3) les travaux sont fournis et facturés à un utilisateur final. Si au moins une de ces conditions n'est pas remplie, le taux normal de TVA de 21 % s'applique et l'acheteur est redevable de la TVA due, des intérêts et des pénalités.",
    nl: "Btw-tarief: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand vanaf de ontvangst van de factuur, wordt de klant geacht te erkennen dat (1) de werken worden verricht aan een woning waarvan de eerste ingebruikneming heeft plaatsgevonden in een kalenderjaar dat ten minste tien jaar voorafgaat aan de datum van de eerste factuur met betrekking tot die werken, (2) de woning, na uitvoering van die werken, uitsluitend of hoofzdakelijk als privéwoning wordt gebruikt en (3) de werken worden verstrekt en gefactureerd aan een eindverbruiker. Wanneer minstens één van die voorwaarden niet is voldaan, zal het normale btw-tarief van 21% van toepassing zijn en is de afnemer ten aanzien van die voorwaarden aansprakelijk voor de betaling van de verschuldigde belasting, interesten en geldboeten.",
  },

  // 3. Cas par défaut (Pas de mention spécifique requise)
  STANDARD_NONE: {
    fr: "",
    nl: "",
  },
};
