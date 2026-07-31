export type Language = "FR" | "NL";

export interface TranslationDictionary {
  // Navigation & Étapes
  title: string;
  subtitle: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  
  // Étape 1 : Profil Client
  clientProfile: string;
  selectCountry: string;
  vatStatus: string;
  b2bLabel: string;
  b2cLabel: string;
  vatNumber: string;
  checkVies: string;
  viesValidated: string;
  viesInvalid: string;
  viesPending: string;
  step2LockedMsg: string;
  
  // Étape 2 : Bien Immobilier & Travaux
  propertyAndWorks: string;
  buildingAge: string;
  under10Years: string;
  over10Years: string;
  buildingUsage: string;
  usage100Priv: string;
  usageGt50Priv: string;
  usageExclPro: string;
  usageMixed: string;
  
  // Champs dynamiques Usage Mixte
  privateSurface: string;
  proSurface: string;
  parcelSurface: string;
  parcelWarning: string;
  
  // Catalogue & Chantier
  worksCatalog: string;
  outdoorWorks: string;
  outdoorNotApplicable: string;
  outdoorRoutine: string;
  outdoorHeavy: string;
  siteAddress: string;
  
  // Étape 3 : Verdict Fiscal & Documents
  vatRegime: string;
  quoteTitle: string;
  invoiceTitle: string;
  
  // Tableaux & Champs Documents
  clientAndSite: string;
  clientPhone: string;
  completionDate: string;
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  vatRate: string;
  subtotalExclVat: string;
  vatAmount: string;
  totalInclVat: string;
  addLine: string;
  
  // Actions
  saveQuote: string;
  saveInvoice: string;
  printPdf: string;
  convertToInvoice: string;
  sendPeppol: string;
  
  // Mention Légale Header
  legalMentionTitle: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  FR: {
    // Navigation & Étapes
    title: "Détermination TVA « Travaux immobiliers »",
    subtitle: "Conforme réformes 2025-2026",
    step1Title: "Étape 1 : Profil Client",
    step2Title: "Étape 2 : Bien immobilier & Nature des travaux",
    step3Title: "Étape 3 : Régime TVA / Cocontractant",
    
    // Étape 1 : Profil Client
    clientProfile: "Profil Client",
    selectCountry: "Sélecteur de Pays (UE)",
    vatStatus: "Statut TVA",
    b2bLabel: "B2B (Assujetti)",
    b2cLabel: "B2C (Particulier)",
    vatNumber: "Numéro de TVA",
    checkVies: "VIES Controleren",
    viesValidated: "VIES Validée (OK)",
    viesInvalid: "Numéro TVA non valide dans VIES",
    viesPending: "Vérification VIES en cours...",
    step2LockedMsg: "Étape 2 verrouillée : La validation VIES est requise pour le statut B2B.",
    
    // Étape 2 : Bien Immobilier & Travaux
    propertyAndWorks: "Bien immobilier & Nature des travaux",
    buildingAge: "Âge du bâtiment",
    under10Years: "< 10 ans",
    over10Years: "≥ 10 ans",
    buildingUsage: "Usage du bâtiment",
    usage100Priv: "100% Privé",
    usageGt50Priv: "> 50% Privé",
    usageExclPro: "Exclusif Pro",
    usageMixed: "Mixte (privé-professionnel)",
    
    // Champs dynamiques Usage Mixte
    privateSurface: "Surface privée (m²)",
    proSurface: "Surface professionnelle (m²)",
    parcelSurface: "Superficie de la parcelle (m²)",
    parcelWarning: "Attention : La superficie de la parcelle doit être ≥ 200 m² pour appliquer le régime d'usage mixte.",
    
    // Catalogue & Chantier
    worksCatalog: "Catalogue des travaux",
    outdoorWorks: "Aménagements extérieurs",
    outdoorNotApplicable: "Non applicable",
    outdoorRoutine: "Entretien courant",
    outdoorHeavy: "Aménagement & Gros travaux",
    siteAddress: "Adresse du chantier",
    
    // Étape 3 : Verdict Fiscal & Documents
    vatRegime: "Btw-regeling / Medecontractant",
    quoteTitle: "DEVIS DE TRAVAUX",
    invoiceTitle: "FACTURE DE TRAVAUX",
    
    // Tableaux & Champs Documents
    clientAndSite: "Client & Chantier",
    clientPhone: "Tél. client",
    completionDate: "Date de livraison des travaux",
    description: "Description",
    quantity: "Quantité",
    unitPrice: "Prix unitaire",
    amount: "Montant",
    vatRate: "TVA",
    subtotalExclVat: "Subtotaal EXCL. BTW",
    vatAmount: "Montant TVA",
    totalInclVat: "TOTAL TTC / Totaal incl. BTW",
    addLine: "+ Ajouter une ligne",
    
    // Actions
    saveQuote: "Offerte opslaan",
    saveInvoice: "Factuur opslaan",
    printPdf: "Afdrukken / PDF",
    convertToInvoice: "Omzetten naar Factuur",
    sendPeppol: "Verzenden via Peppol",
    
    // Mention Légale Header
    legalMentionTitle: "Mention légale à insérer sur la facture",
  },
  
  NL: {
    // Navigation & Étapes
    title: "Btw-bepaling « Werken in onroerende staat »",
    subtitle: "Conform de hervormingen 2025-2026",
    step1Title: "Stap 1: Klantprofiel",
    step2Title: "Stap 2: Onroerend goed & Aard van de werken",
    step3Title: "Stap 3: Btw-regeling / Medecontractant",
    
    // Étape 1 : Profil Client
    clientProfile: "Klantprofiel",
    selectCountry: "Landenselectie (EU)",
    vatStatus: "Btw-status",
    b2bLabel: "B2B (Btw-plichtige)",
    b2cLabel: "B2C (Particulier)",
    vatNumber: "Btw-nummer",
    checkVies: "VIES Controleren",
    viesValidated: "Btw-nummer via VIES gevalideerd (Oké)",
    viesInvalid: "Ongeldig Btw-nummer in VIES",
    viesPending: "VIES-controle wordt uitgevoerd...",
    step2LockedMsg: "Stap 2 vergrendeld: VIES-validatie is vereist voor B2B-status.",
    
    // Étape 2 : Bien Immobilier & Travaux
    propertyAndWorks: "Onroerend goed & Aard van de werken",
    buildingAge: "Ouderdom van het gebouw",
    under10Years: "< 10 jaar",
    over10Years: "≥ 10 jaar",
    buildingUsage: "Gebruik van het gebouw",
    usage100Priv: "100% Privéwoning",
    usageGt50Priv: "> 50% Privéwoning",
    usageExclPro: "Exclusief Beroepsgebruik",
    usageMixed: "Gemengd gebruik (privé-zakelijk)",
    
    // Champs dynamiques Usage Mixte
    privateSurface: "Privégedeelte (m²)",
    proSurface: "Zakelijk vloeroppervlak (m²)",
    parcelSurface: "Perceeloppervlakte (m²)",
    parcelWarning: "Opgelet: De perceeloppervlakte moet ≥ 200 m² zijn om de regeling voor gemengd gebruik toe te passen.",
    
    // Catalogue & Chantier
    worksCatalog: "Catalogus van de werken",
    outdoorWorks: "Buitenwerken / Groenvoorzieningen",
    outdoorNotApplicable: "Niet van toepassing",
    outdoorRoutine: "Lopend onderhoud",
    outdoorHeavy: "Aanleg & Grote werken",
    siteAddress: "Adres van de werf / bouwwerf",
    
    // Étape 3 : Verdict Fiscal & Documents
    vatRegime: "Btw-regeling / Medecontractant",
    quoteTitle: "OFFERTE WERKEN",
    invoiceTitle: "FACTUUR WERKEN",
    
    // Tableaux & Champs Documents
    clientAndSite: "Klant & Werf",
    clientPhone: "Tel. klant",
    completionDate: "Opleveringsdatum van de werken",
    description: "Omschrijving",
    quantity: "Aantal",
    unitPrice: "Eenheidsprijs",
    amount: "Bedrag",
    vatRate: "Btw",
    subtotalExclVat: "Subtotaal EXCL. BTW",
    vatAmount: "Btw-bedrag",
    totalInclVat: "Totaal incl. BTW",
    addLine: "+ Lijn toevoegen",
    
    // Actions
    saveQuote: "Offerte opslaan",
    saveInvoice: "Factuur opslaan",
    printPdf: "Afdrukken / PDF",
    convertToInvoice: "Omzetten naar Factuur",
    sendPeppol: "Verzenden via Peppol",
    
    // Mention Légale Header
    legalMentionTitle: "Verplichte wettelijke vermelding op het document",
  },
};
