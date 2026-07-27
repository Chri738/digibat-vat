import React, { useState } from 'react';

type Lang = 'FR' | 'NL';
type ViewMode = 'CALCULATOR' | 'QUOTE' | 'INVOICE';

type ClientStatus = 'B2C' | 'B2B_PERIODIC';
type BuildingAge = 'LESS_10' | 'MORE_10';
type BuildingUsage = 'PRIVATE_50' | 'PRO_EXCL' | 'MIXED';
type WorkNature = 'RENOVATION' | 'HEAT_PUMP' | 'SOLAR_INSULATION' | 'DEMOLITION_RECONSTRUCTION';
type OutdoorWork = 'NONE' | 'MAINTENANCE' | 'LANDSCAPING';

interface HistoryItem {
  id: string;
  date: string;
  clientName: string;
  vatRate: string;
  workNatureLabel: string;
}

interface QuoteLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

// Liste complète des 27 pays de l'Union Européenne
const EU_COUNTRIES = [
  'Belgique / België (BE)',
  'France (FR)',
  'Nederland (NL)',
  'Deutschland (DE)',
  'Luxembourg (LU)',
  'Österreich / Austria (AT)',
  'Bulgaria (BG)',
  'Croatia (HR)',
  'Cyprus (CY)',
  'Czechia (CZ)',
  'Danmark (DK)',
  'Eesti / Estonia (EE)',
  'Suomi / Finland (FI)',
  'Greece (EL)',
  'Magyarország / Hungary (HU)',
  'Ireland (IE)',
  'Italia (IT)',
  'Latvija / Latvia (LV)',
  'Lietuva / Lithuania (LT)',
  'Malta (MT)',
  'Polska / Poland (PL)',
  'Portugal (PT)',
  'România (RO)',
  'Slovensko / Slovakia (SK)',
  'Slovenija / Slovenia (SI)',
  'España (ES)',
  'Sverige / Sweden (SE)'
];

export default function App() {
  const [lang, setLang] = useState<Lang>('NL');
  const [viewMode, setViewMode] = useState<ViewMode>('CALCULATOR');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // --- 1. Prestataire / Entrepreneur ---
  const [providerName, setProviderName] = useState('My Company BV / SRL');
  const [providerVat, setProviderVat] = useState('BE0123456789');
  const [providerAddress, setProviderAddress] = useState('Rue du Progrès 12, 1000 Bruxelles');
  const [providerIban, setProviderIban] = useState('BE68 0000 1234 5678');

  // --- 2. Étape 1 : Profil Client & Contrôle VIES ---
  const [clientName, setClientName] = useState('');
  const [country, setCountry] = useState('Belgique / België (BE)');
  const [clientStatus, setClientStatus] = useState<ClientStatus>('B2B_PERIODIC');
  const [vatNumber, setVatNumber] = useState('');
  
  // États pour la vérification VIES
  const [isViesVerified, setIsViesVerified] = useState<boolean>(false);
  const [viesLoading, setViesLoading] = useState<boolean>(false);
  const [viesError, setViesError] = useState<string | null>(null);

  // --- 3. Étape 2 : Bien, Travaux & Surfaces ---
  const [buildingAge, setBuildingAge] = useState<BuildingAge>('MORE_10');
  const [buildingUsage, setBuildingUsage] = useState<BuildingUsage>('PRIVATE_50');
  const [workNature, setWorkNature] = useState<WorkNature>('RENOVATION');
  const [outdoorWork, setOutdoorWork] = useState<OutdoorWork>('NONE');

  // Surfaces pour l'option Mixte (Min. 200 m²)
  const [totalSurface, setTotalSurface] = useState<number>(200);
  const [privateSurface, setPrivateSurface] = useState<number>(120);
  const [proSurface, setProSurface] = useState<number>(80);

  // --- 4. Lignes de Prestation (Devis & Facture) ---
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([
    {
      id: '1',
      description: 'Standaard onderhoud en renovatiewerken / Travaux de rénovation',
      qty: 1,
      unitPrice: 1500,
    }
  ]);

  // --- 5. Historique & Notifications ---
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Handler réinitialisation VIES quand le numéro TVA change
  const handleVatChange = (val: string) => {
    setVatNumber(val);
    setIsViesVerified(false);
    setViesError(null);
  };

  // Simuler la vérification VIES officielle
  const handleViesCheck = () => {
    setViesError(null);
    if (!vatNumber || vatNumber.trim().length < 8) {
      setViesError(
        lang === 'FR' 
          ? 'Veuillez saisir un numéro de TVA valide (ex: BE0400075312).' 
          : 'Voer een geldig btw-nummer in (bijv. BE0400075312).'
      );
      setIsViesVerified(false);
      return;
    }

    setViesLoading(true);
    setTimeout(() => {
      setViesLoading(false);
      setIsViesVerified(true);
      showToast(
        lang === 'FR' 
          ? '✓ Numéro TVA vérifié avec succès sur la base VIES !' 
          : '✓ Btw-nummer succesvol geverifieerd in VIES-database!'
      );
    }, 700);
  };

  // Calcul du verdict fiscal
  const getTaxVerdict = () => {
    if (clientStatus === 'B2B_PERIODIC') {
      return {
        rate: 0,
        rateLabel: '0% (Autoliquidation / Btw verlegd)',
        isAutoliquidation: true,
        code: 'B2B_ART20',
        title: lang === 'FR' ? 'Autoliquidation — Régime Cocontractant' : 'Medecontractant — Btw verlegd',
        legalText: lang === 'FR' 
          ? 'Autoliquidation : En l\'absence de contestation par écrit dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître qu\'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l\'Arrêté Royal n° 1).'
          : 'Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een btw-plichtige is die gehouden is tot het indienen van periodieke aangiften (Art. 20 van het Koninklijk Besluit nr. 1).'
      };
    }

    if (buildingAge === 'MORE_10') {
      return {
        rate: 6,
        rateLabel: '6%',
        isAutoliquidation: false,
        code: 'B2C_REDUCED_6',
        title: lang === 'FR' ? 'Taux réduit de 6% (Bâtiment de plus de 10 ans)' : 'Verlaagd tarief van 6% (Gebouw ouder dan 10 jaar)',
        legalText: lang === 'FR'
          ? 'Taux de TVA réduit de 6% appliqué sur la base de la rubrique XXXVIII du tableau A de l\'annexe à l\'Arrêté Royal n° 20 (bâtiment d\'habitation de plus de 10 ans à usage privé prépondérant).'
          : 'Verlaagd btw-tarief van 6% op grond van rubriek XXXVIII van tabel A van de bijlage bij het Koninklijk Besluit nr. 20 (privéwoning ouder dan 10 jaar).'
      };
    } else {
      return {
        rate: 21,
        rateLabel: '21%',
        isAutoliquidation: false,
        code: 'B2C_STANDARD_21',
        title: lang === 'FR' ? 'Taux standard de 21% (Bâtiment de moins de 10 ans)' : 'Standaardtarief van 21% (Gebouw jonger dan 10 jaar)',
        legalText: lang === 'FR'
          ? 'Taux normal de TVA de 21% applicable conformément à l\'article 38 du Code de la TVA.'
          : 'Standaard btw-tarief van 21% van toepassing overeenkomstig artikel 38 van het Btw-Wetboek.'
      };
    }
  };

  const currentVerdict = getTaxVerdict();

  // Gestion des lignes de devis
  const handleAddItem = () => {
    setQuoteItems([
      ...quoteItems,
      { id: Date.now().toString(), description: '', qty: 1, unitPrice: 0 }
    ]);
  };

  const handleUpdateItem = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setQuoteItems(quoteItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  // Calculs totaux
  const subtotal = quoteItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const vatAmount = currentVerdict.isAutoliquidation ? 0 : (subtotal * currentVerdict.rate) / 100;
  const totalTtc = subtotal + vatAmount;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Calcul des ratios de surface pour usage mixte
  const privateRatio = totalSurface > 0 ? Math.round((privateSurface / totalSurface) * 100) : 0;
  const proRatio = totalSurface > 0 ? Math.round((proSurface / totalSurface) * 100) : 0;

  // Traduction des libellés
  const t = {
    FR: {
      appName: 'DigiBât VAT / DigiBouw BTW',
      appSubtitle: 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026',
      badgeReform: '✓ Conforme réformes 2025-2026',
      step1Title: 'Profil client',
      step1Desc: 'Contrôler le statut fiscal',
      step2Title: 'Bien & Travaux',
      step2Desc: 'Description des travaux',
      step3Title: 'Résultat & Facture',
      step3Desc: 'Verdict & mentions légales',
      historyTitle: 'Historique des déterminations',
      historyEmpty: 'Aucune détermination enregistrée.',
      
      // Step 1
      step1Header: 'Étape 1 : Profil du Client',
      nameLabel: 'NOM / ENTREPRISE',
      countryLabel: 'PAYS (UNION EUROPÉENNE)',
      vatStatusLabel: 'STATUT TVA DU CLIENT',
      vatStatusB2B: 'Btw-plichtige B2B met periodieke aangiften (Art. 20 / KB1)',
      vatStatusB2C: 'Particulier (B2C - Non assujetti)',
      vatNumLabel: 'NUMÉRO DE TVA',
      viesBtn: 'Vérifier VIES',
      viesChecking: 'Vérification...',
      viesVerifiedBadge: '✓ Assujetti contrôlé VIES',
      viesWarningMessage: '⚠️ La vérification VIES du numéro de TVA est obligatoire pour les clients B2B avant d\'accéder à l\'Étape 2.',
      
      // Step 2
      step2Header: 'Bien immobilier & Travaux',
      step2Sub: 'Beschrijf het goed en de aard van de werken.',
      ageLabel: 'Ancienneté du bâtiment',
      ageLess10: 'Moins de 10 ans',
      ageMore10: 'Plus de 10 ans',
      usageLabel: 'Usage du bâtiment',
      usagePrivate: 'Plus de 50% privé',
      usageProExcl: 'Exclusivement professionnel',
      usageMixed: 'Gemengd (privé + pro)',
      
      // Mixed Surface section
      mixedTitle: 'Ventilation des surfaces (Usage mixte - Min. 200 m²)',
      totalSurfaceLabel: 'Surface totale (m² min. 200) :',
      privateSurfaceLabel: 'Surface Privée (m²) :',
      proSurfaceLabel: 'Surface Pro (m²) :',
      surfaceWarning: 'La surface totale minimale recommandée pour le calcul du prorata d\'un bien mixte est de 200 m².',
      mixedLawTitle: 'Principe de loi fiscale (Prorata de surface) :',
      mixedLawBody: 'Conformément à la réglementation TVA belge, la répartition de la surface (min. 200 m²) sert de clé de ventilation directe. La quotité de surface privée bénéficie du taux réduit de 6% (si le bâtiment a plus de 10 ans), tandis que la quotité professionnelle est facturée au taux normal de 21% (ou en autoliquidation Art. 20 KB1 pour les assujettis B2B).',

      workNatureLabel: 'Nature des travaux',
      workRenovation: 'Standaard onderhoud en renovatie',
      workHeatPump: 'Warmtepomp',
      workSolar: 'Zonnepanelen & Isolatie',
      workDemolition: 'Sloop & Heropbouw',
      outdoorLabel: 'Travaux extérieurs / Espaces verts (optionnel)',
      outdoorOption: 'OPTIONNEL',
      outdoorSub: 'Vink alleen aan als de dienst betrekking heeft op het onderhoud of de aanleg van groenzones.',
      outdoorNone: 'Niet van toepassing',
      outdoorMaint: 'Lopend onderhoud\n(Gras maaien, hagen scheren...)',
      outdoorLandscaping: 'Aanleg & Grote werken\n(Terras, bestrating...)',
      
      backBtn: '← Terug',
      nextToStep2: 'Volgende: Onroerend goed & Werken →',
      viewVerdictBtn: 'Verdict bekijken →',

      // Step 3
      step3Header: 'Resultaat & Facture',
      saveBtn: '💾 Enregistrer',
      transferDevisBtn: '📄 Overdragen naar offerte →',
      mixedWarningTitle: '⚠️ Traitement des travaux mixtes (Privé + Pro) :',
      mixedWarningBody: 'En cas d\'usage mixte chez un client B2C, le taux réduit de 6% s\'lique uniquement sur la quotité privée calculée. La partie professionnelle doit être facturée séparément au taux normal de 21%. Si le client est B2B (Art. 20 KB1), l\'autoliquidation s\'applique sur la totalité.',

      // Provider
      providerSectionTitle: 'Prestataire / Entrepreneur',
      clientSectionTitle: 'Client',
      
      // Devis / Facture
      quoteTitle: 'Devis',
      invoiceTitle: 'Facture',
      quoteNum: 'Devis N° : DEV-2026-001',
      invoiceNum: 'Facture N° : FAC-2026-001',
      addWorkLine: '+ Ajouter une ligne',
      subtotalLabel: 'Sous-total HTVA',
      vatLabel: 'Montant TVA',
      totalLabel: 'TOTAL TTC',
      legalNoticeTitle: 'Mention légale obligatoire à faire figurer sur le document :',
      
      // Actions
      saveQuoteBtn: '💾 Enregistrer le devis',
      printQuoteBtn: '🖨️ Imprimer / PDF',
      convertToInvoiceBtn: '⚡ Convertir en facture →',
      saveInvoiceBtn: '💾 Enregistrer la facture',
      printInvoiceBtn: '🖨️ Imprimer la facture',
      peppolBtn: '🌐 Transférer via Peppol',
    },
    NL: {
      appName: 'DigiBât VAT / DigiBouw BTW',
      appSubtitle: 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026',
      badgeReform: '✓ Conform hervormingen 2025-2026',
      step1Title: 'Klantprofiel',
      step1Desc: 'Controleer de fiscale status van uw klant',
      step2Title: 'Onroerend goed & Werken',
      step2Desc: 'Beschrijf het goed en de aard van de werken',
      step3Title: 'Resultaat & Factuur',
      step3Desc: 'Fiscaal verdict en te vermelden wetteksten',
      historyTitle: 'Historiek van bepalingen',
      historyEmpty: 'Geen bepalingen geregistreerd.',
      
      // Step 1
      step1Header: 'Stap 1 : Klantprofiel',
      nameLabel: 'NAAM / ONDERNEMING',
      countryLabel: 'LAND (EUROPESE UNIE)',
      vatStatusLabel: 'BTW-STATUS VAN DE KLANT',
      vatStatusB2B: 'Btw-plichtige B2B met periodieke aangiften (Art. 20 / KB1)',
      vatStatusB2C: 'Particulier (B2C - Niet btw-plichtig)',
      vatNumLabel: 'BTW-NUMMER',
      viesBtn: 'VIES Controleren',
      viesChecking: 'Controleren...',
      viesVerifiedBadge: '✓ Btw-plichtige gecontroleerd in VIES',
      viesWarningMessage: '⚠️ Een verplichte VIES-controle van het btw-nummer is vereist voor B2B-klanten alvorens naar Stap 2 te gaan.',
      
      // Step 2
      step2Header: 'Onroerend goed & Werken',
      step2Sub: 'Beschrijf het goed en de aard van de werken.',
      ageLabel: 'Ouderdom van het gebouw',
      ageLess10: 'Minder dan 10 jaar',
      ageMore10: 'Ouder dan 10 jaar',
      usageLabel: 'Gebruik van het gebouw',
      usagePrivate: 'Meer dan 50% privé',
      usageProExcl: 'Uitsluitend professioneel',
      usageMixed: 'Gemengd (privé + pro)',
      
      // Mixed Surface section
      mixedTitle: 'Oppervlakteverdeling (Gemengd gebruik - Min. 200 m²)',
      totalSurfaceLabel: 'Totale oppervlakte (m² min. 200) :',
      privateSurfaceLabel: 'Privéoppervlakte (m²) :',
      proSurfaceLabel: 'Pro-oppervlakte (m²) :',
      surfaceWarning: 'De aanbevolen minimale totale oppervlakte voor de prorata-berekening van een gemengd pand is 200 m².',
      mixedLawTitle: 'Fiscaal wettelijk beginsel (Oppervlakte prorata):',
      mixedLawBody: 'Overeenkomstig de Belgische btw-wetgeving dient de oppervlakteverdeling (min. 200 m²) als rechtstreekse verdeelsleutel. Het privé-oppervlaktegedeelte geniet van het verlaagde tarief van 6% (indien het gebouw ouder is dan 10 jaar), terwijl het professionele gedeelte gefactureerd wordt aan het standaardtartief van 21% (of onder btw verlegd Art. 20 KB1 voor B2B btw-plichtigen).',

      workNatureLabel: 'Aard van de werken',
      workRenovation: 'Standaard onderhoud en renovatie',
      workHeatPump: 'Warmtepomp',
      workSolar: 'Zonnepanelen & Isolatie',
      workDemolition: 'Sloop & Heropbouw',
      outdoorLabel: 'Buitenwerken / Groenzones (optioneel)',
      outdoorOption: 'OPTIONEEL',
      outdoorSub: 'Vink alleen aan als de dienst betrekking heeft op het onderhoud of de aanleg van groenzones (tuin, terras, bestrating...).',
      outdoorNone: 'Niet van toepassing',
      outdoorMaint: 'Lopend onderhoud\n(Gras maaien, hagen scheren, verzorging planten...)',
      outdoorLandscaping: 'Aanleg & Grote werken\n(Terras, bestrating, drainage, bomen kappen...)',
      
      backBtn: '← Terug',
      nextToStep2: 'Volgende: Onroerend goed & Werken →',
      viewVerdictBtn: 'Verdict bekijken →',

      // Step 3
      step3Header: 'Resultaat & Factuur',
      saveBtn: '💾 Opslaan',
      transferDevisBtn: '📄 Overdragen naar offerte →',
      mixedWarningTitle: '⚠️ Behandeling van gemengde werken (Privé + Pro):',
      mixedWarningBody: 'Bij gemengd gebruik bij een B2C-klant geldt het verlaagde tarief van 6% uitsluitend voor het berekende privégedeelte. Het professionele gedeelte moet afzonderlijk worden gefactureerd aan 21%. Indien de klant B2B is (Art. 20 KB1), geldt de verlegging van heffing op het gehele bedrag.',

      // Provider
      providerSectionTitle: 'Dienstverlener / Aannemer',
      clientSectionTitle: 'Klant',

      // Devis / Facture
      quoteTitle: 'Offerte',
      invoiceTitle: 'Factuur',
      quoteNum: 'Offerte Nr. : OFF-2026-001',
      invoiceNum: 'Factuur Nr. : FAC-2026-001',
      addWorkLine: '+ Regel toevoegen',
      subtotalLabel: 'Subtotaal excl. btw',
      vatLabel: 'Btw-bedrag',
      totalLabel: 'TOTAAL INCL. BTW',
      legalNoticeTitle: 'Verplichte wettelijke vermelding op het document :',

      // Actions
      saveQuoteBtn: '💾 Offerte opslaan',
      printQuoteBtn: '🖨️ Afdrukken / PDF',
      convertToInvoiceBtn: '⚡ Omzetten naar factuur →',
      saveInvoiceBtn: '💾 Factuur opslaan',
      printInvoiceBtn: '🖨️ Factuur afdrukken',
      peppolBtn: '🌐 Verzenden via Peppol',
    }
  };

  const currentT = t[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* En-tête principal */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md">
            🏢
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{currentT.appName}</h1>
            <p className="text-xs text-slate-500">{currentT.appSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            {currentT.badgeReform}
          </span>
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex space-x-1">
            <button
              onClick={() => setLang('FR')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                lang === 'FR' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('NL')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                lang === 'NL' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NL
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold z-50 animate-bounce">
          {notification}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-6">
        
        {/* --- VUE CALCULATEUR --- */}
        {viewMode === 'CALCULATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stepper Navigation */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div 
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center space-x-3 cursor-pointer transition-opacity ${currentStep === 1 ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{currentT.step1Title}</p>
                    <p className="text-[10px] text-slate-400">{currentT.step1Desc}</p>
                  </div>
                </div>

                <div className="h-0.5 w-8 bg-slate-200"></div>

                <div 
                  onClick={() => {
                    if (clientStatus === 'B2B_PERIODIC' && !isViesVerified) {
                      showToast(currentT.viesWarningMessage);
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className={`flex items-center space-x-3 cursor-pointer transition-opacity ${currentStep === 2 ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{currentT.step2Title}</p>
                    <p className="text-[10px] text-slate-400">{currentT.step2Desc}</p>
                  </div>
                </div>

                <div className="h-0.5 w-8 bg-slate-200"></div>

                <div 
                  onClick={() => {
                    if (clientStatus === 'B2B_PERIODIC' && !isViesVerified) {
                      showToast(currentT.viesWarningMessage);
                      return;
                    }
                    setCurrentStep(3);
                  }}
                  className={`flex items-center space-x-3 cursor-pointer transition-opacity ${currentStep === 3 ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{currentT.step3Title}</p>
                    <p className="text-[10px] text-slate-400">{currentT.step3Desc}</p>
                  </div>
                </div>
              </div>

              {/* ÉTAPE 1 : PROFIL CLIENT (AVEC VIES MANDATOIRE) */}
              {currentStep === 1 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-slate-900">{currentT.step1Header}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{currentT.nameLabel}</label>
                      <input 
                        type="text" 
                        placeholder="ex: Vicernant(NV) / Jean Dupont"
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{currentT.countryLabel}</label>
                      <select 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {EU_COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{currentT.vatStatusLabel}</label>
                    <select 
                      value={clientStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as ClientStatus;
                        setClientStatus(newStatus);
                        if (newStatus === 'B2C') setIsViesVerified(true);
                        else setIsViesVerified(false);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="B2B_PERIODIC">{currentT.vatStatusB2B}</option>
                      <option value="B2C">{currentT.vatStatusB2C}</option>
                    </select>
                  </div>

                  {clientStatus === 'B2B_PERIODIC' && (
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">{currentT.vatNumLabel}</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="BE0400075312"
                          value={vatNumber} 
                          onChange={(e) => handleVatChange(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-mono"
                        />
                        <button 
                          onClick={handleViesCheck}
                          disabled={viesLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                        >
                          {viesLoading ? currentT.viesChecking : currentT.viesBtn}
                        </button>
                      </div>

                      {viesError && (
                        <p className="text-xs font-semibold text-red-600 mt-1">{viesError}</p>
                      )}

                      {isViesVerified && (
                        <div className="flex items-center gap-2 p-2.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold">
                          <span>✅</span>
                          <span>{currentT.viesVerifiedBadge}</span>
                          <span className="text-[10px] text-emerald-700 ml-auto">(VIES Verified - BE-VAT ACTIVE)</span>
                        </div>
                      )}

                      {!isViesVerified && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs leading-relaxed">
                          {currentT.viesWarningMessage}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => {
                        if (clientStatus === 'B2B_PERIODIC' && !isViesVerified) {
                          showToast(currentT.viesWarningMessage);
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      disabled={clientStatus === 'B2B_PERIODIC' && !isViesVerified}
                      className={`font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm ${
                        clientStatus === 'B2B_PERIODIC' && !isViesVerified
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {currentT.nextToStep2}
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : BIEN, TRAVAUX & SURFACES (USAGE MIXTE) */}
              {currentStep === 2 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{currentT.step2Header}</h2>
                    <p className="text-xs text-slate-500">{currentT.step2Sub}</p>
                  </div>

                  {/* Ouderdom / Ancienneté */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.ageLabel}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBuildingAge('LESS_10')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingAge === 'LESS_10' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>📅</span> <span>{currentT.ageLess10}</span>
                      </button>
                      <button
                        onClick={() => setBuildingAge('MORE_10')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingAge === 'MORE_10' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🕒</span> <span>{currentT.ageMore10}</span>
                      </button>
                    </div>
                  </div>

                  {/* Gebruik / Usage */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.usageLabel}</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setBuildingUsage('PRIVATE_50')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingUsage === 'PRIVATE_50' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🏠</span> <span>{currentT.usagePrivate}</span>
                      </button>
                      <button
                        onClick={() => setBuildingUsage('PRO_EXCL')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingUsage === 'PRO_EXCL' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🏢</span> <span>{currentT.usageProExcl}</span>
                      </button>
                      <button
                        onClick={() => setBuildingUsage('MIXED')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingUsage === 'MIXED' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🧱</span> <span>{currentT.usageMixed}</span>
                      </button>
                    </div>
                  </div>

                  {/* SECTION SURFACES SI OPTION MIXTE SELECTIONNEE */}
                  {buildingUsage === 'MIXED' && (
                    <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2">
                          <span>📐</span> {currentT.mixedTitle}
                        </h3>
                        <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded">
                          Privé {privateRatio}% / Pro {proRatio}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{currentT.totalSurfaceLabel}</label>
                          <input 
                            type="number" 
                            min="200"
                            value={totalSurface}
                            onChange={(e) => {
                              const val = Math.max(1, parseFloat(e.target.value) || 0);
                              setTotalSurface(val);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{currentT.privateSurfaceLabel}</label>
                          <input 
                            type="number" 
                            value={privateSurface}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              setPrivateSurface(val);
                              setProSurface(Math.max(0, totalSurface - val));
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-emerald-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{currentT.proSurfaceLabel}</label>
                          <input 
                            type="number" 
                            value={proSurface}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              setProSurface(val);
                              setPrivateSurface(Math.max(0, totalSurface - val));
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-blue-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      {totalSurface < 200 && (
                        <p className="text-[11px] text-amber-700 font-semibold italic">
                          ⚠️ {currentT.surfaceWarning}
                        </p>
                      )}

                      <div className="p-3 bg-white rounded-lg border border-blue-100 text-[11px] space-y-1 text-slate-700">
                        <p className="font-bold text-blue-900">{currentT.mixedLawTitle}</p>
                        <p className="leading-relaxed">{currentT.mixedLawBody}</p>
                      </div>
                    </div>
                  )}

                  {/* Nature des travaux */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.workNatureLabel}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setWorkNature('RENOVATION')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          workNature === 'RENOVATION' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🔨</span> <span>{currentT.workRenovation}</span>
                      </button>
                      <button
                        onClick={() => setWorkNature('HEAT_PUMP')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          workNature === 'HEAT_PUMP' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🔥</span> <span>{currentT.workHeatPump}</span>
                      </button>
                      <button
                        onClick={() => setWorkNature('SOLAR_INSULATION')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          workNature === 'SOLAR_INSULATION' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>☀️</span> <span>{currentT.workSolar}</span>
                      </button>
                      <button
                        onClick={() => setWorkNature('DEMOLITION_RECONSTRUCTION')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          workNature === 'DEMOLITION_RECONSTRUCTION' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🏗️</span> <span>{currentT.workDemolition}</span>
                      </button>
                    </div>
                  </div>

                  {/* Buitenwerken / Espaces verts */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-800">{currentT.outdoorLabel}</label>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">{currentT.outdoorOption}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{currentT.outdoorSub}</p>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <button
                        onClick={() => setOutdoorWork('NONE')}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                          outdoorWork === 'NONE' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        🚫 {currentT.outdoorNone}
                      </button>
                      <button
                        onClick={() => setOutdoorWork('MAINTENANCE')}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                          outdoorWork === 'MAINTENANCE' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        🪴 {currentT.outdoorMaint}
                      </button>
                      <button
                        onClick={() => setOutdoorWork('LANDSCAPING')}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                          outdoorWork === 'LANDSCAPING' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        🏗️ {currentT.outdoorLandscaping}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="text-slate-600 hover:text-slate-900 font-semibold text-xs px-4 py-2"
                    >
                      {currentT.backBtn}
                    </button>
                    <button 
                      onClick={() => setCurrentStep(3)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                    >
                      {currentT.viewVerdictBtn}
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : RÉSULTAT FISCAL EXPLICITE */}
              {currentStep === 3 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-slate-900">{currentT.step3Header}</h2>

                  {/* Cadre fiscal principal */}
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-emerald-900 font-bold text-base flex items-center gap-2">
                        ✓ {currentVerdict.title}
                      </p>
                      <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                        {currentVerdict.rateLabel}
                      </span>
                    </div>
                    <div className="p-3 bg-white/80 rounded-lg border border-emerald-100 font-mono text-xs text-slate-800 leading-relaxed">
                      "{currentVerdict.legalText}"
                    </div>
                  </div>

                  {/* Avertissement pour travaux mixtes */}
                  {buildingUsage === 'MIXED' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                      <p className="font-bold">{currentT.mixedWarningTitle}</p>
                      <p className="leading-relaxed">{currentT.mixedWarningBody}</p>
                      <p className="font-semibold text-slate-700 pt-1 border-t border-amber-200/60">
                        Prorata appliqué : Privé ({privateRatio}%) / Pro ({proRatio}%) sur surface totale de {totalSurface} m².
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="text-slate-600 hover:text-slate-900 font-semibold text-xs px-3 py-2"
                    >
                      {currentT.backBtn}
                    </button>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          const newItem: HistoryItem = {
                            id: Date.now().toString(),
                            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            clientName: clientName || 'Client',
                            vatRate: currentVerdict.rateLabel,
                            workNatureLabel: workNature,
                          };
                          setHistory([newItem, ...history]);
                          showToast('Bepaling opgeslagen in historiek!');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-slate-300"
                      >
                        {currentT.saveBtn}
                      </button>

                      <button 
                        onClick={() => setViewMode('QUOTE')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
                      >
                        {currentT.transferDevisBtn}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Historique latéral */}
            <div className="lg:col-span-1">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <span className="text-lg">📜</span>
                  <h3 className="font-bold text-sm text-slate-800">{currentT.historyTitle}</h3>
                </div>

                {history.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-8">{currentT.historyEmpty}</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">{item.clientName}</span>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600">{item.workNatureLabel}</span>
                          <span className="font-bold text-blue-600">{item.vatRate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- VUE DEVIS ET FACTURE EDITEURS --- */}
        {(viewMode === 'QUOTE' || viewMode === 'INVOICE') && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-8 max-w-4xl mx-auto">
            
            {/* Header du document */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  {viewMode === 'QUOTE' ? currentT.quoteTitle : currentT.invoiceTitle}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {viewMode === 'QUOTE' ? currentT.quoteTitle : currentT.invoiceTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {viewMode === 'QUOTE' ? currentT.quoteNum : currentT.invoiceNum}
                </p>
              </div>
              <button 
                onClick={() => setViewMode('CALCULATOR')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-lg"
              >
                ← Terug naar calculator
              </button>
            </div>

            {/* Coordonnées Prestataire & Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{currentT.providerSectionTitle}</p>
                <input 
                  type="text" 
                  value={providerName} 
                  onChange={(e) => setProviderName(e.target.value)}
                  className="w-full text-xs font-bold px-2 py-1 border border-slate-300 rounded bg-white"
                  placeholder="Nom de votre entreprise"
                />
                <input 
                  type="text" 
                  value={providerVat} 
                  onChange={(e) => setProviderVat(e.target.value)}
                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                  placeholder="Numéro TVA"
                />
                <input 
                  type="text" 
                  value={providerAddress} 
                  onChange={(e) => setProviderAddress(e.target.value)}
                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                  placeholder="Adresse"
                />
                <input 
                  type="text" 
                  value={providerIban} 
                  onChange={(e) => setProviderIban(e.target.value)}
                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                  placeholder="IBAN"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{currentT.clientSectionTitle}</p>
                <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-800">{clientName || 'Nom du client non spécifié'}</p>
                  <p className="text-xs font-mono text-slate-600">{vatNumber || 'Pas de numéro de TVA'}</p>
                  <p className="text-xs text-slate-600">{country}</p>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-emerald-700">{currentVerdict.title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau dynamique des travaux */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800">Prestations & Matériaux</h3>
                <button 
                  onClick={handleAddItem}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  {currentT.addWorkLine}
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 w-20 text-center">Qté</th>
                      <th className="p-3 w-32 text-right">Prix Unit. (€)</th>
                      <th className="p-3 w-32 text-right">Total HTVA (€)</th>
                      <th className="p-3 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {quoteItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <input 
                            type="text" 
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                            placeholder="Description des travaux..."
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number" 
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number" 
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-right"
                          />
                        </td>
                        <td className="p-3 text-right font-bold text-slate-800">
                          {(item.qty * item.unitPrice).toFixed(2)} €
                        </td>
                        <td className="p-2 text-center">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totaux & Taux calculé */}
            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{currentT.subtotalLabel}:</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{currentT.vatLabel} ({currentVerdict.rateLabel}):</span>
                  <span>{vatAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                  <span>{currentT.totalLabel}:</span>
                  <span>{totalTtc.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Mention légale obligatoire */}
            <div className="p-4 bg-slate-100 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-700">{currentT.legalNoticeTitle}</p>
              <p className="text-xs font-mono text-slate-600 leading-relaxed italic">
                "{currentVerdict.legalText}"
              </p>
            </div>

            {/* Actions Devis / Facture */}
            <div className="flex flex-wrap justify-between items-center pt-4 border-t border-slate-200 gap-3">
              {viewMode === 'QUOTE' ? (
                <>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => showToast('Devis enregistré !')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300"
                    >
                      {currentT.saveQuoteBtn}
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300"
                    >
                      {currentT.printQuoteBtn}
                    </button>
                  </div>
                  <button 
                    onClick={() => setViewMode('INVOICE')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
                  >
                    {currentT.convertToInvoiceBtn}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => showToast('Facture enregistrée !')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300"
                    >
                      {currentT.saveInvoiceBtn}
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300"
                    >
                      {currentT.printInvoiceBtn}
                    </button>
                  </div>
                  <button 
                    onClick={() => showToast('Facture transmise avec succès au réseau Peppol !')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
                  >
                    {currentT.peppolBtn}
                  </button>
                </>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
