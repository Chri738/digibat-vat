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
  
  const [isViesVerified, setIsViesVerified] = useState<boolean>(false);
  const [viesLoading, setViesLoading] = useState<boolean>(false);
  const [viesError, setViesError] = useState<string | null>(null);

  // --- 3. Étape 2 : Bien, Travaux & Surfaces ---
  const [buildingAge, setBuildingAge] = useState<BuildingAge>('MORE_10');
  const [buildingUsage, setBuildingUsage] = useState<BuildingUsage>('PRIVATE_50');
  const [workNature, setWorkNature] = useState<WorkNature>('RENOVATION');
  const [outdoorWork, setOutdoorWork] = useState<OutdoorWork>('NONE');

  const [totalSurface, setTotalSurface] = useState<number>(200);
  const [privateSurface, setPrivateSurface] = useState<number>(120);
  const [proSurface, setProSurface] = useState<number>(80);

  // --- 4. Lignes de Prestation ---
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

  const handleVatChange = (val: string) => {
    setVatNumber(val);
    setIsViesVerified(false);
    setViesError(null);
  };

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

  const subtotal = quoteItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const vatAmount = currentVerdict.isAutoliquidation ? 0 : (subtotal * currentVerdict.rate) / 100;
  const totalTtc = subtotal + vatAmount;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const privateRatio = totalSurface > 0 ? Math.round((privateSurface / totalSurface) * 100) : 0;
  const proRatio = totalSurface > 0 ? Math.round((proSurface / totalSurface) * 100) : 0;

  const handleSaveHistory = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      clientName: clientName || 'Client',
      vatRate: currentVerdict.rateLabel,
      workNatureLabel: workNature
    };
    setHistory([newItem, ...history]);
    showToast(lang === 'FR' ? 'Détermination enregistrée dans l\'historique !' : 'Bepaling opgeslagen in historiek!');
  };

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
      
      step2Header: 'Bien immobilier & Travaux',
      step2Sub: 'Décrivez le bien et la nature des travaux.',
      ageLabel: 'Ancienneté du bâtiment',
      ageLess10: 'Moins de 10 ans',
      ageMore10: 'Plus de 10 ans',
      usageLabel: 'Usage du bâtiment',
      usagePrivate: 'Plus de 50% privé',
      usageProExcl: 'Exclusivement professionnel',
      usageMixed: 'Usage mixte (privé + pro)',
      
      mixedTitle: 'Ventilation des surfaces (Usage mixte - Min. 200 m²)',
      totalSurfaceLabel: 'Surface totale (m² min. 200) :',
      privateSurfaceLabel: 'Surface Privée (m²) :',
      proSurfaceLabel: 'Surface Pro (m²) :',
      surfaceWarning: 'La surface totale minimale recommandée pour le calcul du prorata d\'un bien mixte est de 200 m².',
      mixedLawTitle: 'Principe de loi fiscale (Prorata de surface) :',
      mixedLawBody: 'Conformément à la réglementation TVA belge, la répartition de la surface (min. 200 m²) sert de clé de ventilation directe. La quotité de surface privée bénéficie du taux réduit de 6% (si le bâtiment a plus de 10 ans), tandis que la quotité professionnelle est facturée au taux normal de 21% (ou en autoliquidation Art. 20 KB1 pour les assujettis B2B).',

      workNatureLabel: 'Nature des travaux',
      workRenovation: 'Rénovation & entretien standard',
      workHeatPump: 'Pompe à chaleur',
      workSolar: 'Panneaux solaires & Isolation',
      workDemolition: 'Démolition & Reconstitution',
      outdoorLabel: 'Travaux extérieurs / Espaces verts (optionnel)',
      outdoorOption: 'OPTIONNEL',
      outdoorSub: 'Cochez uniquement si le service concerne l\'entretien ou l\'aménagement d\'espaces verts.',
      outdoorNone: 'Non applicable',
      outdoorMaint: 'Entretien courant (Tonte, taille...)',
      outdoorLandscaping: 'Aménagement & Gros travaux (Terrasse, pavage...)',
      
      backBtn: '← Retour',
      nextToStep2: 'Suivant : Bien & Travaux →',
      viewVerdictBtn: 'Voir le verdict →',

      step3Header: 'Résultat & Facture',
      saveBtn: '💾 Enregistrer',
      transferDevisBtn: '📄 Transférer vers le devis →',
      mixedWarningTitle: '⚠️ Traitement des travaux mixtes (Privé + Pro) :',
      mixedWarningBody: 'En cas d\'usage mixte chez un client B2C, le taux réduit de 6% s\'lique uniquement sur la quotité privée calculée. La partie professionnelle doit être facturée séparément au taux normal de 21%. Si le client est B2B (Art. 20 KB1), l\'autoliquidation s\'applique sur la totalité.',

      providerSectionTitle: 'Prestataire / Entrepreneur',
      clientSectionTitle: 'Client',
      
      quoteTitle: 'Devis',
      invoiceTitle: 'Facture',
      quoteNum: 'Devis N° : DEV-2026-001',
      invoiceNum: 'Facture N° : FAC-2026-001',
      addWorkLine: '+ Ajouter une ligne',
      subtotalLabel: 'Sous-total HTVA',
      vatLabel: 'Montant TVA',
      totalLabel: 'TOTAL TTC',
      legalNoticeTitle: 'Mention légale obligatoire à faire figurer sur le document :',
      
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
      
      step2Header: 'Onroerend goed & Werken',
      step2Sub: 'Beschrijf het goed en de aard van de werken.',
      ageLabel: 'Ouderdom van het gebouw',
      ageLess10: 'Minder dan 10 jaar',
      ageMore10: 'Ouder dan 10 jaar',
      usageLabel: 'Gebruik van het gebouw',
      usagePrivate: 'Meer dan 50% privé',
      usageProExcl: 'Uitsluitend professioneel',
      usageMixed: 'Gemengd (privé + pro)',
      
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
      outdoorMaint: 'Lopend onderhoud (Gras maaien, hagen scheren...)',
      outdoorLandscaping: 'Aanleg & Grote werken (Terras, bestrating...)',
      
      backBtn: '← Terug',
      nextToStep2: 'Volgende: Onroerend goed & Werken →',
      viewVerdictBtn: 'Verdict bekijken →',

      step3Header: 'Resultaat & Factuur',
      saveBtn: '💾 Opslaan',
      transferDevisBtn: '📄 Overdragen naar offerte →',
      mixedWarningTitle: '⚠️ Behandeling van gemengde werken (Privé + Pro):',
      mixedWarningBody: 'Bij gemengd gebruik bij een B2C-klant geldt het verlaagde tarief van 6% uitsluitend voor het berekende privégedeelte. Het professionele gedeelte moet afzonderlijk worden gefactureerd aan 21%. Indien de klant B2B is (Art. 20 KB1), geldt de verlegging van heffing op het gehele bedrag.',

      providerSectionTitle: 'Dienstverlener / Aannemer',
      clientSectionTitle: 'Klant',

      quoteTitle: 'Offerte',
      invoiceTitle: 'Factuur',
      quoteNum: 'Offerte Nr. : OFF-2026-001',
      invoiceNum: 'Factuur Nr. : FAC-2026-001',
      addWorkLine: '+ Regel toevoegen',
      subtotalLabel: 'Subtotaal excl. btw',
      vatLabel: 'Btw-bedrag',
      totalLabel: 'TOTAAL INCL. BTW',
      legalNoticeTitle: 'Verplichte wettelijke vermelding op het document :',

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
      {/* Header */}
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

      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold z-50 animate-bounce">
          {notification}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-6">
        {viewMode === 'CALCULATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stepper */}
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

              {/* STEP 1 */}
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

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{currentT.step2Header}</h2>
                    <p className="text-xs text-slate-500">{currentT.step2Sub}</p>
                  </div>

                  {/* Age */}
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

                  {/* Usage */}
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
                        <span>🏛️</span> <span>{currentT.usageMixed}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mixed details */}
                  {buildingUsage === 'MIXED' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <h3 className="text-xs font-bold text-slate-800">{currentT.mixedTitle}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-600 font-semibold mb-1">{currentT.totalSurfaceLabel}</label>
                          <input 
                            type="number" 
                            value={totalSurface} 
                            onChange={(e) => setTotalSurface(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 font-semibold mb-1">{currentT.privateSurfaceLabel}</label>
                          <input 
                            type="number" 
                            value={privateSurface} 
                            onChange={(e) => setPrivateSurface(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 font-semibold mb-1">{currentT.proSurfaceLabel}</label>
                          <input 
                            type="number" 
                            value={proSurface} 
                            onChange={(e) => setProSurface(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p><strong>Privé:</strong> {privateRatio}% | <strong>Pro:</strong> {proRatio}%</p>
                        <p className="text-[11px] text-amber-700">{currentT.surfaceWarning}</p>
                      </div>
                    </div>
                  )}

                  {/* Work Nature */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.workNatureLabel}</label>
                    <select 
                      value={workNature}
                      onChange={(e) => setWorkNature(e.target.value as WorkNature)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="RENOVATION">{currentT.workRenovation}</option>
                      <option value="HEAT_PUMP">{currentT.workHeatPump}</option>
                      <option value="SOLAR_INSULATION">{currentT.workSolar}</option>
                      <option value="DEMOLITION_RECONSTRUCTION">{currentT.workDemolition}</option>
                    </select>
                  </div>

                  {/* Outdoor work */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">{currentT.outdoorLabel}</label>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">{currentT.outdoorOption}</span>
                    </div>
                    <select 
                      value={outdoorWork}
                      onChange={(e) => setOutdoorWork(e.target.value as OutdoorWork)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="NONE">{currentT.outdoorNone}</option>
                      <option value="MAINTENANCE">{currentT.outdoorMaint}</option>
                      <option value="LANDSCAPING">{currentT.outdoorLandscaping}</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between pt-4">
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
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

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">{currentT.step3Header}</h2>
                    <button 
                      onClick={handleSaveHistory}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1"
                    >
                      {currentT.saveBtn}
                    </button>
                  </div>

                  {/* Verdict Box */}
                  <div className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-md">
                        {currentVerdict.rateLabel}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{currentVerdict.code}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-blue-950">{currentVerdict.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{currentVerdict.legalText}</p>
                  </div>

                  {buildingUsage === 'MIXED' && clientStatus === 'B2C' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                      <p className="font-bold">{currentT.mixedWarningTitle}</p>
                      <p>{currentT.mixedWarningBody}</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      {currentT.backBtn}
                    </button>
                    <button 
                      onClick={() => setViewMode('QUOTE')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                    >
                      {currentT.transferDevisBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - History */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>📜</span> {currentT.historyTitle}
                </h3>
                
                {history.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">{currentT.historyEmpty}</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{item.clientName}</span>
                          <span className="text-blue-600">{item.vatRate}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>{item.workNatureLabel}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUOTE / INVOICE VIEWS */}
        {(viewMode === 'QUOTE' || viewMode === 'INVOICE') && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <button 
                onClick={() => setViewMode('CALCULATOR')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                ← {lang === 'FR' ? 'Retour au calculateur' : 'Terug naar calculator'}
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('QUOTE')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'QUOTE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {currentT.quoteTitle}
                </button>
                <button 
                  onClick={() => setViewMode('INVOICE')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'INVOICE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {currentT.invoiceTitle}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">{currentT.providerSectionTitle}</h4>
                <p className="font-extrabold text-slate-800">{providerName}</p>
                <p className="text-slate-600">{providerAddress}</p>
                <p className="font-mono text-slate-600">TVA : {providerVat}</p>
                <p className="font-mono text-slate-600">IBAN : {providerIban}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">{currentT.clientSectionTitle}</h4>
                <p className="font-extrabold text-slate-800">{clientName || 'Client'}</p>
                <p className="text-slate-600">{country}</p>
                {vatNumber && <p className="font-mono text-slate-600">TVA : {vatNumber}</p>}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3 pt-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 w-20 text-center">Qté</th>
                    <th className="pb-2 w-28 text-right">Prix Unitaire</th>
                    <th className="pb-2 w-28 text-right">Total HTVA</th>
                    <th className="pb-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quoteItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 pr-2">
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input 
                          type="number" 
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, 'qty', Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                        />
                      </td>
                      <td className="py-2 text-right">
                        <input 
                          type="number" 
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-slate-200 rounded text-xs text-right"
                        />
                      </td>
                      <td className="py-2 text-right font-mono font-bold">
                        {(item.qty * item.unitPrice).toFixed(2)} €
                      </td>
                      <td className="py-2 text-center">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button 
                onClick={handleAddItem}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                {currentT.addWorkLine}
              </button>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{currentT.subtotalLabel} :</span>
                  <span className="font-mono font-bold">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{currentT.vatLabel} ({currentVerdict.rateLabel}) :</span>
                  <span className="font-mono font-bold">{vatAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                  <span>{currentT.totalLabel} :</span>
                  <span className="font-mono text-blue-600">{totalTtc.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Legal notice block */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-slate-700">{currentT.legalNoticeTitle}</p>
              <p className="text-slate-600 italic leading-relaxed">{currentVerdict.legalText}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                {viewMode === 'QUOTE' ? currentT.printQuoteBtn : currentT.printInvoiceBtn}
              </button>
              <button 
                onClick={() => showToast('Transfert Peppol simulé avec succès !')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {currentT.peppolBtn}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
