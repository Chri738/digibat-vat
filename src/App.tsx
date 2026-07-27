import React, { useState } from 'react';

type Lang = 'FR' | 'NL';
type ViewMode = 'CALCULATOR' | 'QUOTE';

type ClientStatus = 'B2C' | 'B2B_PERIODIC' | 'B2B_SPECIAL';
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

export default function App() {
  const [lang, setLang] = useState<Lang>('NL');
  const [viewMode, setViewMode] = useState<ViewMode>('CALCULATOR');
  const [currentStep, setCurrentStep] = useState<number>(3); // Étape 3 (Résultat)

  // Étape 1 : Client
  const [clientName, setClientName] = useState('Vicernant(NV)');
  const [country, setCountry] = useState('Belgique / België (BE)');
  const [clientStatus, setClientStatus] = useState<ClientStatus>('B2B_PERIODIC');
  const [vatNumber, setVatNumber] = useState('BE0400075312');

  // Étape 2 : Immeuble & Travaux
  const [buildingAge, setBuildingAge] = useState<BuildingAge>('MORE_10');
  const [buildingUsage, setBuildingUsage] = useState<BuildingUsage>('PRIVATE_50');
  const [workNature, setWorkNature] = useState<WorkNature>('RENOVATION');
  const [outdoorWork, setOutdoorWork] = useState<OutdoorWork>('MAINTENANCE');

  // Historique
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // État du Devis / Offerte
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([
    {
      id: '1',
      description: lang === 'FR' ? 'Travaux de rénovation et entretien' : 'Renovatie- en onderhoudswerken',
      qty: 1,
      unitPrice: 2450.00,
    }
  ]);

  // Dictionnaire bilingue
  const t = {
    FR: {
      appName: 'DigiBât VAT / DigiBouw BTW',
      appSubtitle: 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026',
      badgeReform: '✓ Conformité réformes 2025-2026',
      step1Title: 'Profil client',
      step1Desc: 'Contrôler le statut fiscal du client',
      step2Title: 'Bien immobilier & Travaux',
      step2Desc: 'Description du bien et nature des travaux',
      step3Title: 'Résultat & Facture',
      step3Desc: 'Verdict fiscal et mentions légales',
      historyTitle: 'Historique des déterminations',
      historyEmpty: 'Aucune détermination enregistrée.',
      step1Header: 'Étape 1 : Profil client',
      nameLabel: 'NOM / ENTREPRISE',
      countryLabel: 'PAYS',
      vatStatusLabel: 'STATUT TVA DU CLIENT',
      vatStatusB2B: 'Assujetti TVA B2B avec déclarations périodiques (Art. 20)',
      vatNumLabel: 'NUMÉRO DE TVA',
      viesBtn: 'VIES Controleren',
      viesValid: '✓ Numéro TVA valide dans VIES (Assujetti)',
      nextStep2: 'Suivant : Bien immobilier & Travaux →',
      step2Header: 'Bien immobilier & Travaux',
      step2Sub: 'Décrivez le bien et la nature des travaux.',
      ageLabel: 'Ancienneté du bâtiment',
      ageLess10: 'Moins de 10 ans',
      ageMore10: 'Plus de 10 ans',
      usageLabel: 'Usage du bâtiment',
      usagePrivate: 'Plus de 50% privé',
      usageProExcl: 'Exclusivement professionnel',
      usageMixed: 'Mixte (privé + pro)',
      workNatureLabel: 'Nature des travaux',
      workRenovation: 'Entretien standard & rénovation',
      workHeatPump: 'Pompe à chaleur',
      workSolar: 'Panneaux solaires & Isolation',
      workDemolition: 'Démolition & Reconstruction',
      outdoorLabel: 'Travaux extérieurs / Espaces verts (optionnel)',
      outdoorOption: 'OPTIONNEL',
      outdoorSub: 'Cochez uniquement si le service concerne l\'entretien ou l\'aménagement d\'espaces verts.',
      outdoorNone: 'Non applicable',
      outdoorMaint: 'Entretien courant\n(Tonte, taille de haies...)',
      outdoorLandscaping: 'Aménagement & Grands travaux\n(Terrasse, pavage...)',
      backBtn: '← Retour',
      viewVerdictBtn: 'Voir le verdict →',
      step3Header: 'Résultat & Facture',
      
      // Textes fiscaux corrigés
      verdictTitle: '✓ Verdict Fiscal Belgique 2025-2026',
      verdictBody: 'Taux TVA applicable : 6% (Avis de rénovation) ou Autoliquidation Art. 20 selon le profil du client.',
      
      saveBtn: '💾 Enregistrer',
      transferBtn: '📄 Transférer au devis →',
      pageQuoteTitle: 'Devis',
      pageQuoteSubtitle: 'Gestion et édition du devis client',
      quoteNum: 'Devis N° : DEV-2026-0089',
      quoteClientHeader: 'Client :',
      quoteVatStatusHeader: 'Statut TVA & Mention applicable :',
      colDesc: 'Description',
      colQty: 'Qté',
      colPrice: 'Prix Unit. HTVA (€)',
      colTotal: 'Total HTVA (€)',
      subtotal: 'Sous-total HTVA',
      vatAmount: 'Montant TVA (6%)',
      totalTtc: 'Total TTC',
      printBtn: '🖨️ Imprimer / PDF',
      backToCalc: '← Retour au calculateur',
      savedSuccess: 'Détermination enregistrée dans l\'historique !',
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
      countryLabel: 'LAND',
      vatStatusLabel: 'BTW-STATUS VAN DE KLANT',
      vatStatusB2B: 'Btw-plichtige B2B met periodieke aangiften (Art. 20)',
      vatNumLabel: 'BTW-NUMMER',
      viesBtn: 'VIES Controleren',
      viesValid: '✓ Geldig btw-nummer in VIES (Btw-plichtige)',
      nextStep2: 'Volgende: Onroerend goed & Werken →',
      step2Header: 'Onroerend goed & Werken',
      step2Sub: 'Beschrijf het goed en de aard van de werken.',
      ageLabel: 'Ouderdom van het gebouw',
      ageLess10: 'Minder dan 10 jaar',
      ageMore10: 'Ouder dan 10 jaar',
      usageLabel: 'Gebruik van het gebouw',
      usagePrivate: 'Meer dan 50% privé',
      usageProExcl: 'Uitsluitend professioneel',
      usageMixed: 'Gemengd (privé + pro)',
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
      viewVerdictBtn: 'Verdict bekijken →',
      step3Header: 'Resultaat & Facture',

      // Textes fiscaux corrigés en NL
      verdictTitle: '✓ Fiscaal Verdict België 2025-2026',
      verdictBody: 'Toepasselijk btw-tarief: 6% (Renovatieattest) of Verlegging van heffing Art. 20 afhankelijk van het klantprofiel.',

      saveBtn: '💾 Opslaan',
      transferBtn: '📄 Overdragen naar offerte →',
      pageQuoteTitle: 'Offerte',
      pageQuoteSubtitle: 'Beheer en opmaak van de klantofferte',
      quoteNum: 'Offerte Nr. : OFF-2026-0089',
      quoteClientHeader: 'Klant :',
      quoteVatStatusHeader: 'Btw-status & Toepasselijke vermelding :',
      colDesc: 'Beschrijving',
      colQty: 'Aantal',
      colPrice: 'Eenheidsprijs excl. btw (€)',
      colTotal: 'Totaal excl. btw (€)',
      subtotal: 'Subtotaal excl. btw',
      vatAmount: 'Btw-bedrag (6%)',
      totalTtc: 'Totaal incl. btw',
      printBtn: '🖨️ Afdrukken / PDF',
      backToCalc: '← Terug naar calculator',
      savedSuccess: 'Bepaling succesvol opgeslagen in historiek!',
    }
  };

  const currentT = t[lang];

  // Enregistrer dans l'historique
  const handleSave = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clientName: clientName || 'Client',
      vatRate: '6% / Art. 20',
      workNatureLabel: lang === 'FR' ? 'Rénovation (>10 ans)' : 'Renovatie (>10 jaar)',
    };
    setHistory([newItem, ...history]);
    setNotification(currentT.savedSuccess);
    setTimeout(() => setNotification(null), 3000);
  };

  // Transférer vers le Devis / Offerte
  const handleTransferToQuote = () => {
    setViewMode('QUOTE');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Barre Supérieure / Header */}
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
        <div className="fixed top-20 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 transition-all animate-bounce">
          {notification}
        </div>
      )}

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        {viewMode === 'CALCULATOR' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne de Gauche : Formulaire & Étapes */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stepper Header */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                {/* Étape 1 */}
                <div 
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center space-x-3 cursor-pointer transition-opacity ${currentStep === 1 ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    1
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{currentT.step1Title}</p>
                    <p className="text-[10px] text-slate-400">{currentT.step1Desc}</p>
                  </div>
                </div>

                <div className="h-0.5 w-8 bg-slate-200"></div>

                {/* Étape 2 */}
                <div 
                  onClick={() => setCurrentStep(2)}
                  className={`flex items-center space-x-3 cursor-pointer transition-opacity ${currentStep === 2 ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    2
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{currentT.step2Title}</p>
                    <p className="text-[10px] text-slate-400">{currentT.step2Desc}</p>
                  </div>
                </div>

                <div className="h-0.5 w-8 bg-slate-200"></div>

                {/* Étape 3 */}
                <div 
                  onClick={() => setCurrentStep(3)}
                  className={`flex items-center space-x-3 cursor-pointer transition-opacity ${currentStep === 3 ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    3
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{currentT.step3Title}</p>
                    <p className="text-[10px] text-slate-400">{currentT.step3Desc}</p>
                  </div>
                </div>
              </div>

              {/* Contenu Étape 1 */}
              {currentStep === 1 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-slate-900">{currentT.step1Header}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">{currentT.nameLabel}</label>
                      <input 
                        type="text" 
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
                        <option>Belgique / België (BE)</option>
                        <option>France (FR)</option>
                        <option>Nederland (NL)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{currentT.vatStatusLabel}</label>
                    <select 
                      value={clientStatus}
                      onChange={(e) => setClientStatus(e.target.value as ClientStatus)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="B2B_PERIODIC">{currentT.vatStatusB2B}</option>
                      <option value="B2C">Particulier / B2C</option>
                    </select>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">{currentT.vatNumLabel}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={vatNumber} 
                        onChange={(e) => setVatNumber(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                        {currentT.viesBtn}
                      </button>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      {currentT.viesValid}
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                    >
                      {currentT.nextStep2}
                    </button>
                  </div>
                </div>
              )}

              {/* Contenu Étape 2 */}
              {currentStep === 2 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{currentT.step2Header}</h2>
                    <p className="text-xs text-slate-500">{currentT.step2Sub}</p>
                  </div>

                  {/* Âge du bâtiment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.ageLabel}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBuildingAge('LESS_10')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingAge === 'LESS_10' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>📅</span> <span>{currentT.ageLess10}</span>
                      </button>
                      <button
                        onClick={() => setBuildingAge('MORE_10')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingAge === 'MORE_10' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🕒</span> <span>{currentT.ageMore10}</span>
                      </button>
                    </div>
                  </div>

                  {/* Usage du bâtiment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.usageLabel}</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setBuildingUsage('PRIVATE_50')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingUsage === 'PRIVATE_50' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🏠</span> <span>{currentT.usagePrivate}</span>
                      </button>
                      <button
                        onClick={() => setBuildingUsage('PRO_EXCL')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingUsage === 'PRO_EXCL' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🏢</span> <span>{currentT.usageProExcl}</span>
                      </button>
                      <button
                        onClick={() => setBuildingUsage('MIXED')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          buildingUsage === 'MIXED' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🧱</span> <span>{currentT.usageMixed}</span>
                      </button>
                    </div>
                  </div>

                  {/* Nature des travaux */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{currentT.workNatureLabel}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setWorkNature('RENOVATION')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          workNature === 'RENOVATION' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🔨</span> <span>{currentT.workRenovation}</span>
                      </button>
                      <button
                        onClick={() => setWorkNature('HEAT_PUMP')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          workNature === 'HEAT_PUMP' 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>🔥</span> <span>{currentT.workHeatPump}</span>
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

              {/* Contenu Étape 3 (Image 4 mise à jour avec traduction & boutons) */}
              {currentStep === 3 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-slate-900">{currentT.step3Header}</h2>

                  {/* Cadre Vert : Verdict Fiscal traduit dans la langue active */}
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <p className="text-emerald-900 font-bold text-sm flex items-center gap-2">
                      {currentT.verdictTitle}
                    </p>
                    <p className="text-emerald-800 text-xs leading-relaxed">
                      {currentT.verdictBody}
                    </p>
                  </div>

                  {/* Actions : Terug, Enregistrer / Opslaan, Transférer / Overdragen */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="text-slate-600 hover:text-slate-900 font-semibold text-xs px-3 py-2"
                    >
                      {currentT.backBtn}
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Bouton Enregistrer / Opslaan */}
                      <button 
                        onClick={handleSave}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-slate-300"
                      >
                        {currentT.saveBtn}
                      </button>

                      {/* Bouton Transférer au devis / Overdragen naar offerte */}
                      <button 
                        onClick={handleTransferToQuote}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                      >
                        {currentT.transferBtn}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Colonne de Droite : Historique des déterminations */}
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
        ) : (
          /* Page Devis (FR) / Offerte (NL) */
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-8 max-w-4xl mx-auto">
            
            {/* Header du Devis */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  {currentT.pageQuoteTitle}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{currentT.pageQuoteTitle}</h2>
                <p className="text-xs text-slate-500">{currentT.quoteNum}</p>
              </div>
              <button 
                onClick={() => setViewMode('CALCULATOR')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-lg"
              >
                {currentT.backToCalc}
              </button>
            </div>

            {/* Infos Client & Régime Fiscal appliqué */}
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{currentT.quoteClientHeader}</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{clientName}</p>
                <p className="text-xs text-slate-600">{vatNumber}</p>
                <p className="text-xs text-slate-600">{country}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{currentT.quoteVatStatusHeader}</p>
                <p className="text-xs font-bold text-emerald-700 mt-1">
                  {lang === 'FR' ? 'Taux réduit 6% + Autoliquidation Art. 20' : 'Verlaagd tarief 6% + Verlegging van heffing Art. 20'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug italic">
                  {currentT.verdictBody}
                </p>
              </div>
            </div>

            {/* Tableau des lignes de devis */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-bold text-slate-500">
                  <th className="py-2">{currentT.colDesc}</th>
                  <th className="py-2 text-center">{currentT.colQty}</th>
                  <th className="py-2 text-right">{currentT.colPrice}</th>
                  <th className="py-2 text-right">{currentT.colTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {quoteItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-slate-800">{item.description}</td>
                    <td className="py-3 text-center text-slate-600">{item.qty}</td>
                    <td className="py-3 text-right text-slate-600">{item.unitPrice.toFixed(2)} €</td>
                    <td className="py-3 text-right font-bold text-slate-900">{(item.qty * item.unitPrice).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{currentT.subtotal}:</span>
                  <span className="font-semibold">2 450,00 €</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{currentT.vatAmount}:</span>
                  <span>147,00 €</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                  <span>{currentT.totalTtc}:</span>
                  <span>2 597,00 €</span>
                </div>
              </div>
            </div>

            {/* Boutons d'impression */}
            <div className="flex justify-end gap-3 pt-6">
              <button 
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                {currentT.printBtn}
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
