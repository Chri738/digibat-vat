import React, { useState } from 'react';

// --- LISTE COMPLÈTE DES 27 PAYS DE L'UE ---
const EU_COUNTRIES = [
  { code: 'BE', nameFR: 'Belgique / België (BE)', nameNL: 'België / Belgique (BE)' },
  { code: 'FR', nameFR: 'France (FR)', nameNL: 'Frankrijk (FR)' },
  { code: 'NL', nameFR: 'Pays-Bas (NL)', nameNL: 'Nederland (NL)' },
  { code: 'DE', nameFR: 'Allemagne (DE)', nameNL: 'Duitsland (DE)' },
  { code: 'LU', nameFR: 'Luxembourg (LU)', nameNL: 'Luxemburg (LU)' },
  { code: 'AT', nameFR: 'Autriche (AT)', nameNL: 'Oostenrijk (AT)' },
  { code: 'BG', nameFR: 'Bulgarie (BG)', nameNL: 'Bulgarije (BG)' },
  { code: 'CY', nameFR: 'Chypre (CY)', nameNL: 'Cyprus (CY)' },
  { code: 'HR', nameFR: 'Croatie (HR)', nameNL: 'Kroatië (HR)' },
  { code: 'DK', nameFR: 'Danemark (DK)', nameNL: 'Denemarken (DK)' },
  { code: 'ES', nameFR: 'Espagne (ES)', nameNL: 'Spanje (ES)' },
  { code: 'EE', nameFR: 'Estonie (EE)', nameNL: 'Letland (EE)' },
  { code: 'FI', nameFR: 'Finlande (FI)', nameNL: 'Finland (FI)' },
  { code: 'GR', nameFR: 'Grèce (GR)', nameNL: 'Griekenland (GR)' },
  { code: 'HU', nameFR: 'Hongrie (HU)', nameNL: 'Hongarije (HU)' },
  { code: 'IE', nameFR: 'Irlande (IE)', nameNL: 'Ierland (IE)' },
  { code: 'IT', nameFR: 'Italie (IT)', nameNL: 'Italië (IT)' },
  { code: 'LV', nameFR: 'Lettonie (LV)', nameNL: 'Letland (LV)' },
  { code: 'LT', nameFR: 'Lituanie (LT)', nameNL: 'Litouwen (LT)' },
  { code: 'MT', nameFR: 'Malte (MT)', nameNL: 'Malta (MT)' },
  { code: 'PL', nameFR: 'Pologne (PL)', nameNL: 'Polen (PL)' },
  { code: 'PT', nameFR: 'Portugal (PT)', nameNL: 'Portugal (PT)' },
  { code: 'CZ', nameFR: 'République Tchèque (CZ)', nameNL: 'Tsjechië (CZ)' },
  { code: 'RO', nameFR: 'Roumanie (RO)', nameNL: 'Roemenië (RO)' },
  { code: 'SK', nameFR: 'Slovaquie (SK)', nameNL: 'Slowakije (SK)' },
  { code: 'SI', nameFR: 'Slovénie (SI)', nameNL: 'Slovenië (SI)' },
  { code: 'SE', nameFR: 'Suède (SE)', nameNL: 'Zweden (SE)' }
];

interface PrestationItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number | '';
}

export default function App() {
  // Langue de l'interface
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  
  // Étape courante : 1, 2, 3, 'devis', 'facture'
  const [step, setStep] = useState<1 | 2 | 3 | 'devis' | 'facture'>(1);

  // Étape 1 : Informations client (Champs neutres/vides par défaut)
  const [clientName, setClientName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('BE');
  const [clientVatStatus, setClientVatStatus] = useState('B2B');
  const [isViesValidated, setIsViesValidated] = useState(true);

  // Étape 2 : Bien & Travaux
  const [buildingAge, setBuildingAge] = useState<'gt10' | 'lt10'>('gt10');
  const [buildingUse, setBuildingUse] = useState<'100priv' | 'gt50priv' | 'exclPro' | 'mixed'>('100priv');
  const [workType, setWorkType] = useState<'renovation' | 'heatpump' | 'garden' | 'solar' | 'demolition'>('renovation');
  const [outdoorWork, setOutdoorWork] = useState<'none' | 'maintenance' | 'landscaping'>('none');
  const [siteAddress, setSiteAddress] = useState('');

  // Historique des déterminations
  const [history, setHistory] = useState<Array<{ name: string; result: string; time: string }>>([]);

  // Informations de l'entrepreneur (Éditables manuellement)
  const [contractorName, setContractorName] = useState('Mon Entreprise SRL / My Company BV');
  const [contractorVat, setContractorVat] = useState('BE0123456789');
  const [contractorAddress, setContractorAddress] = useState('Rue du Progrès 12, 1000 Bruxelles');

  // Devis / Facture items
  const [items, setItems] = useState<PrestationItem[]>([
    { id: '1', description: 'Travaux de rénovation / Renovatieboorden', qty: 1, unitPrice: '' }
  ]);
  const [documentTimestamp, setDocumentTimestamp] = useState('');
  const [completionDate, setCompletionDate] = useState('2026-07-28');

  // Textes traduits
  const t = {
    FR: {
      subtitle: 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026',
      reformBadge: '✓ Conforme réformes 2025-2026',
      step1Title: '1. Profil Client',
      step2Title: '2. Bien immobilier & Aard van de werken',
      step3Title: '3. Résultat & Application régime TVA',
      clientNameLabel: 'Nom / Raison Sociale',
      clientVatStatusLabel: 'Statut TVA Client',
      vatNumberLabel: 'Numéro de TVA',
      verifyVies: 'Vérifier VIES',
      viesOk: '✓ TVA VIES Validée (OK)',
      btnStep2: 'Continuer vers Étape 2 →',
      btnStep3: 'Voir le verdict →',
      btnBack: '← Retour',
      historyTitle: '📜 Historique des déterminations',
      noHistory: 'Aucune détermination enregistrée.',
      // Étape 2
      ageTitle: 'ANCIENNETÉ DU BÂTIMENT',
      ageOption1: '≥ 10 ans',
      ageOption1Sub: 'Logement ancien',
      ageOption2: '< 10 ans',
      ageOption2Sub: 'Nouvelle construction',
      useTitle: 'USAGE DU BÂTIMENT',
      useOption1: '100% Privé',
      useOption2: '> 50% Privé',
      useOption3: 'Exclusif Pro',
      useOption4: 'Mixte (Privé + Pro)',
      natureTitle: 'NATURE DES TRAVAUX',
      natureOption1: 'Rénovation standard',
      natureOption2: 'Pompe à chaleur',
      natureOption3: 'Entretien courant / Jardinage',
      natureOption4: 'Panneaux solaires & Isolation',
      natureOption5: 'Démolition et/ou Construction',
      outdoorTitle: '🍃 TRAVAUX EXTÉRIEURS / ESPACES VERTS (OPTIONNEL)',
      outdoorDesc: 'Cochez uniquement si la prestation porte sur l\'entretien ou l\'aménagement d\'espaces verts.',
      outdoorOpt1: 'Ne s\'applique pas',
      outdoorOpt2: 'Entretien courant (Tonte, taille, plantes...)',
      outdoorOpt3: 'Aménagement & Gros travaux (Terrasse, pavage...)',
      siteAddressLabel: 'Adresse du Chantier / Bien',
      // Verdict
      verdictTitle: '✓ TVA autoliquidée — Cocontractant',
      verdictRate: '0% (TVA autoliquidée)',
      verdictLegalText: '"TVA autoliquidée: En l\'absence de contestation par écrit dans un délai d\'un mois à compter de la réception de la facture, le cocontractant est présumé reconnaître qu\'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l\'Arrêté Royal n° 1)."',
      btnConvertToQuote: '📄 Convertir en Devis',
      // Devis / Facture
      quoteTitle: 'Devis N° : DEV-2026-001',
      invoiceTitle: 'Facture N° : FAC-2026-001',
      contractorHeader: 'PRESTATAIRE DE SERVICES / ENTREPRENEUR',
      clientHeader: 'CLIENT & CHANTIER',
      addLigne: '+ Ajouter une ligne',
      descriptionCol: 'DESCRIPTION',
      qtyCol: 'QUANTITÉ',
      priceCol: 'PRIX UNITAIRE (€)',
      totalCol: 'TOTAL HTVA (€)',
      subtotalExcl: 'Sous-total HTVA :',
      vatAmount: 'Montant TVA (0% Autoliquidation) :',
      totalInc: 'TOTAL TTC :',
      btnSaveQuote: '💾 Enregistrer le devis',
      btnPrintPdf: '🖨️ Imprimer / PDF',
      btnConvertToInvoice: '⚡ Convertir en Facture →',
      btnSaveInvoice: '💾 Enregistrer la facture',
      btnSendPeppol: '🌐 Envoyer via Peppol',
      peppolReady: 'Prêt pour Peppol',
      completionDateLabel: 'Date de livraison des travaux (saisie manuelle) :'
    },
    NL: {
      subtitle: 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026',
      reformBadge: '✓ Conform de hervormingen 2025-2026',
      step1Title: '1. Klantprofiel',
      step2Title: '2. Onroerend goed & Aard van de werken',
      step3Title: '3. Resultaat & Toepasselijk btw-regime',
      clientNameLabel: 'Naam / Bedrijfsnaam',
      clientVatStatusLabel: 'Btw-status Klant',
      vatNumberLabel: 'Btw-nummer',
      verifyVies: 'VIES Verifiëren',
      viesOk: '✓ VIES Validated (OK)',
      btnStep2: 'Ga naar Stap 2 →',
      btnStep3: 'Verdict bekijken →',
      btnBack: '← Terug',
      historyTitle: '📜 Historiek van de bepalingen',
      noHistory: 'Geen bepalingen geregistreerd.',
      // Étape 2
      ageTitle: 'OUDERDOM VAN HET GEBOUW',
      ageOption1: '≥ 10 jaar',
      ageOption1Sub: 'Oude woning',
      ageOption2: '< 10 jaar',
      ageOption2Sub: 'Nieuwbouw',
      useTitle: 'GEBRUIK VAN HET GEBOUW',
      useOption1: '100% Privé',
      useOption2: '> 50% Privé',
      useOption3: 'Exclusief Professioneel',
      useOption4: 'Gemengd (Privé + Pro)',
      natureTitle: 'AARD VAN DE WERKEN',
      natureOption1: 'Standaard renovatie',
      natureOption2: 'Warmtepomp',
      natureOption3: 'Gewoon onderhoud / Tuinieren',
      natureOption4: 'Zonnepanelen & Isolatie',
      natureOption5: 'Sloop en/of Bouw',
      outdoorTitle: '🍃 BUITENWERKEN / GROENZONE (OPTIONEEL)',
      outdoorDesc: 'Vink alleen aan als de dienst betrekking heeft op tuinonderhoud of -aanleg.',
      outdoorOpt1: 'Niet van toepassing',
      outdoorOpt2: 'Gewoon onderhoud (Gras maaien, heggen snoeien...)',
      outdoorOpt3: 'Aanleg & Grote werken (Terras, bestrating...)',
      siteAddressLabel: 'Adres van de werf / Goed',
      // Verdict
      verdictTitle: '✓ Btw verlegd — Medecontractant',
      verdictRate: '0% (Btw verlegd)',
      verdictLegalText: '"Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een belastingplichtige is die gehouden is tot de indiening van periodieke aangiften (Art. 20 van het Koninklijk Besluit nr. 1)."',
      btnConvertToQuote: '📄 Omzetten naar Offerte',
      // Devis / Facture
      quoteTitle: 'Offerte N° : DEV-2026-001',
      invoiceTitle: 'Factuur N° : FAC-2026-001',
      contractorHeader: 'DIENSTVERLENER / ONDERNEMER',
      clientHeader: 'KLANT & WERF',
      addLigne: '+ Lijn toevoegen',
      descriptionCol: 'OMSCHRIJVING',
      qtyCol: 'AANTAL',
      priceCol: 'EENHEIDSPRIJS (€)',
      totalCol: 'TOTAAL EXCL. BTW (€)',
      subtotalExcl: 'Subtotaal EXCL. BTW :',
      vatAmount: 'Montant TVA (0% Autoliquidation) :',
      totalInc: 'TOTAAL TTC :',
      btnSaveQuote: '💾 Offerte opslaan',
      btnPrintPdf: '🖨️ Afdrukken / PDF',
      btnConvertToInvoice: '⚡ Omzetten naar Factuur →',
      btnSaveInvoice: '💾 Factuur opslaan',
      btnSendPeppol: '🌐 Verzenden via Peppol',
      peppolReady: 'Klaar voor Peppol',
      completionDateLabel: 'Opleveringsdatum van de werken (handmatige invoer) :'
    }
  }[lang];

  // Calculs financiers du devis / facture
  const subtotal = items.reduce((acc, item) => {
    const p = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
    return acc + (item.qty * p);
  }, 0);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', qty: 1, unitPrice: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof PrestationItem, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const generateQuote = () => {
    const now = new Date();
    setDocumentTimestamp(`${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    setStep('devis');
  };

  const generateInvoice = () => {
    setStep('facture');
  };

  const saveDeterminationHistory = () => {
    const newEntry = {
      name: clientName || (lang === 'FR' ? 'Client non spécifié' : 'Onbekende klant'),
      result: '0% (Btw verlegd / Autoliquidation)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory([newEntry, ...history]);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      {/* CSS d'impression pour masquer l'historique et les boutons */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full-width { width: 100% !important; max-width: 100% !important; }
          body { background: white !important; p: 0 !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER GLOBAL */}
        <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">
              DigiBât VAT / DigiBouw BTW
            </h1>
            <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 no-print">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
              {t.reformBadge}
            </span>
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex text-xs font-bold">
              <button 
                onClick={() => setLang('FR')} 
                className={`px-3 py-1 rounded-md transition ${lang === 'FR' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLang('NL')} 
                className={`px-3 py-1 rounded-md transition ${lang === 'NL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                NL
              </button>
            </div>
          </div>
        </header>

        {/* STEPPER STEPS 1, 2, 3 */}
        {typeof step === 'number' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex justify-around text-sm font-semibold text-slate-500 no-print">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</span>
              <span>{lang === 'FR' ? 'Profil Client' : 'Klantprofiel'}</span>
            </div>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</span>
              <span>{lang === 'FR' ? 'Bien & Travaux' : 'Onroerend goed'}</span>
            </div>
            <div className={`flex items-center gap-2 ${step === 3 ? 'text-blue-600' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
              <span>{lang === 'FR' ? 'Résultat' : 'Resultaat'}</span>
            </div>
          </div>
        )}

        {/* CONTENU PRINCIPAL + HISTORIQUE LATÉRAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ZONE DE TRAVAIL GAUCHE (2 colonnes) */}
          <div className="lg:col-span-2 space-y-6 print-full-width">

            {/* ÉTAPE 1 : PROFIL CLIENT */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <h2 className="text-xl font-bold text-slate-800">{t.step1Title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.clientNameLabel}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Vicernant (NV)" 
                      value={clientName} 
                      onChange={e => setClientName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pays / Land</label>
                    <select 
                      value={selectedCountry} 
                      onChange={e => setSelectedCountry(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      {EU_COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>
                          {lang === 'FR' ? c.nameFR : c.nameNL}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.clientVatStatusLabel}</label>
                    <select 
                      value={clientVatStatus} 
                      onChange={e => setClientVatStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="B2B">{lang === 'FR' ? 'Assujetti à la TVA (B2B)' : 'Btw-plichtige (B2B)'}</option>
                      <option value="B2C">{lang === 'FR' ? 'Particulier / Non-assujetti (B2C)' : 'Particulier (B2C)'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.vatNumberLabel}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="BE0400075312" 
                        value={vatNumber} 
                        onChange={e => setVatNumber(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <button 
                        onClick={() => setIsViesValidated(true)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                      >
                        {t.verifyVies}
                      </button>
                    </div>
                    {isViesValidated && (
                      <p className="text-emerald-600 text-xs font-semibold mt-1.5">{t.viesOk}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-lg transition shadow-sm"
                  >
                    {t.btnStep2}
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 : BIEN IMMOBILIER & NATURE DES TRAVAUX */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <h2 className="text-xl font-bold text-slate-800">{t.step2Title}</h2>

                {/* ANCIENNETÉ */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">{t.ageTitle}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setBuildingAge('gt10')}
                      className={`p-4 border-2 rounded-xl text-center transition ${buildingAge === 'gt10' ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="font-extrabold text-base">{t.ageOption1}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.ageOption1Sub}</div>
                    </button>
                    <button 
                      onClick={() => setBuildingAge('lt10')}
                      className={`p-4 border-2 rounded-xl text-center transition ${buildingAge === 'lt10' ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="font-extrabold text-base">{t.ageOption2}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.ageOption2Sub}</div>
                    </button>
                  </div>
                </div>

                {/* USAGE DU BÂTIMENT */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">{t.useTitle}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: '100priv', label: t.useOption1 },
                      { id: 'gt50priv', label: t.useOption2 },
                      { id: 'exclPro', label: t.useOption3 },
                      { id: 'mixed', label: t.useOption4 },
                    ].map(u => (
                      <button 
                        key={u.id}
                        onClick={() => setBuildingUse(u.id as any)}
                        className={`p-3 border-2 rounded-xl text-xs font-bold transition ${buildingUse === u.id ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NATURE DES TRAVAUX */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">{t.natureTitle}</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: 'renovation', label: t.natureOption1 },
                      { id: 'heatpump', label: t.natureOption2 },
                      { id: 'garden', label: t.natureOption3 },
                      { id: 'solar', label: t.natureOption4 },
                      { id: 'demolition', label: t.natureOption5 },
                    ].map(n => (
                      <button 
                        key={n.id}
                        onClick={() => setWorkType(n.id as any)}
                        className={`p-3 border-2 rounded-xl text-xs font-bold transition ${workType === n.id ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ESPACES VERTS (PHOTO 2 ALIGNMENT) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-emerald-700 uppercase">{t.outdoorTitle}</label>
                  <p className="text-xs text-slate-500 mb-2">{t.outdoorDesc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                      onClick={() => setOutdoorWork('none')}
                      className={`p-4 border-2 rounded-xl text-center transition flex flex-col items-center justify-center gap-1 ${outdoorWork === 'none' ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <span className="text-red-500 font-bold text-lg">🚫</span>
                      <span className="text-xs font-bold">{t.outdoorOpt1}</span>
                    </button>
                    <button 
                      onClick={() => setOutdoorWork('maintenance')}
                      className={`p-4 border-2 rounded-xl text-center transition flex flex-col items-center justify-center gap-1 ${outdoorWork === 'maintenance' ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <span className="text-lg">🌱</span>
                      <span className="text-xs font-bold">{t.outdoorOpt2}</span>
                    </button>
                    <button 
                      onClick={() => setOutdoorWork('landscaping')}
                      className={`p-4 border-2 rounded-xl text-center transition flex flex-col items-center justify-center gap-1 ${outdoorWork === 'landscaping' ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <span className="text-lg">🏗️</span>
                      <span className="text-xs font-bold">{t.outdoorOpt3}</span>
                    </button>
                  </div>
                </div>

                {/* ADRESSE DU CHANTIER */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.siteAddressLabel}</label>
                  <input 
                    type="text" 
                    placeholder="ex: Rue du Progrès 45, 1000 Bruxelles" 
                    value={siteAddress} 
                    onChange={e => setSiteAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setStep(1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-lg transition"
                  >
                    {t.btnBack}
                  </button>
                  <button 
                    onClick={saveDeterminationHistory}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-lg transition shadow-sm"
                  >
                    {t.btnStep3}
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 : RÉSULTAT ET RÉGIME TVA */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <h2 className="text-xl font-bold text-slate-800">{t.step3Title}</h2>

                <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-emerald-900">{t.verdictTitle}</h3>
                    <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">{t.verdictRate}</span>
                  </div>
                  <p className="text-xs text-emerald-800 italic leading-relaxed bg-white/60 p-3 rounded-lg border border-emerald-100">
                    {t.verdictLegalText}
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-lg transition"
                  >
                    {t.btnBack}
                  </button>
                  <button 
                    onClick={generateQuote}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-lg transition shadow-sm"
                  >
                    {t.btnConvertToQuote}
                  </button>
                </div>
              </div>
            )}

            {/* ÉCRAN DEVIS */}
            {step === 'devis' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 print:shadow-none print:border-none">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{t.quoteTitle}</h2>
                    <p className="text-xs text-slate-400 mt-1">{documentTimestamp}</p>
                  </div>
                  <button 
                    onClick={() => setStep(3)} 
                    className="no-print text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg"
                  >
                    {t.btnBack}
                  </button>
                </div>

                {/* COORDONNÉES ENTREPRENEUR ET CLIENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-blue-700 uppercase">{t.contractorHeader}</span>
                    <input 
                      type="text" 
                      value={contractorName} 
                      onChange={e => setContractorName(e.target.value)} 
                      className="w-full p-1.5 text-xs font-bold border border-slate-300 rounded bg-white" 
                    />
                    <input 
                      type="text" 
                      value={contractorVat} 
                      onChange={e => setContractorVat(e.target.value)} 
                      className="w-full p-1.5 text-xs border border-slate-300 rounded bg-white" 
                    />
                    <input 
                      type="text" 
                      value={contractorAddress} 
                      onChange={e => setContractorAddress(e.target.value)} 
                      className="w-full p-1.5 text-xs border border-slate-300 rounded bg-white" 
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="text-xs font-extrabold text-slate-700 uppercase block mb-1">{t.clientHeader}</span>
                    <p className="font-bold text-slate-900">{clientName || 'Vicernant (NV)'}</p>
                    <p className="text-slate-600">{vatNumber || 'BE0400075312'}</p>
                    <p className="text-emerald-700 font-bold mt-1">✓ {t.verdictRate}</p>
                    <p className="text-slate-500 italic">Chantier : {siteAddress || 'Non spécifié'}</p>
                  </div>
                </div>

                {/* TABLEAU PRESTATONS */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">PRESTATIES & MATERIALEN</span>
                    <button 
                      onClick={addItem} 
                      className="no-print text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      {t.addLigne}
                    </button>
                  </div>

                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase font-bold">
                        <th className="p-2.5 border-b">{t.descriptionCol}</th>
                        <th className="p-2.5 border-b w-20 text-center">{t.qtyCol}</th>
                        <th className="p-2.5 border-b w-32 text-right">{t.priceCol}</th>
                        <th className="p-2.5 border-b w-32 text-right">{t.totalCol}</th>
                        <th className="p-2.5 border-b w-10 no-print"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => {
                        const rowTotal = item.qty * (typeof item.unitPrice === 'number' ? item.unitPrice : 0);
                        return (
                          <tr key={item.id} className="border-b border-slate-100">
                            <td className="p-2">
                              <input 
                                type="text" 
                                value={item.description} 
                                onChange={e => updateItem(item.id, 'description', e.target.value)}
                                className="w-full p-1 border border-slate-200 rounded" 
                                placeholder="Description..." 
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                type="number" 
                                value={item.qty} 
                                onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                className="w-full p-1 border border-slate-200 rounded text-center" 
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                type="number" 
                                value={item.unitPrice} 
                                onChange={e => updateItem(item.id, 'unitPrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="w-full p-1 border border-slate-200 rounded text-right" 
                                placeholder="0.00" 
                              />
                            </td>
                            <td className="p-2 text-right font-bold">
                              {rowTotal.toFixed(2)} €
                            </td>
                            <td className="p-2 no-print text-center">
                              <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold hover:text-red-700">✕</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* TOTAUX */}
                  <div className="flex justify-end pt-2">
                    <div className="w-64 space-y-1 text-xs text-right">
                      <div className="flex justify-between text-slate-600">
                        <span>{t.subtotalExcl}</span>
                        <span className="font-bold">{subtotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>{t.vatAmount}</span>
                        <span>0.00 €</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-1">
                        <span>{t.totalInc}</span>
                        <span>{subtotal.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MENTION LÉGALE DEVIS */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs italic text-slate-600">
                  <p className="font-bold not-italic text-slate-700 mb-0.5">Verplichte wettelijke vermelding op het document:</p>
                  {t.verdictLegalText}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-100 no-print">
                  <div className="flex gap-2">
                    <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg">
                      {t.btnSaveQuote}
                    </button>
                    <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg border border-slate-300">
                      {t.btnPrintPdf}
                    </button>
                  </div>
                  <button 
                    onClick={generateInvoice} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm"
                  >
                    {t.btnConvertToInvoice}
                  </button>
                </div>
              </div>
            )}

            {/* ÉCRAN FACTURE */}
            {step === 'facture' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 print:shadow-none print:border-none">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-900">{t.invoiceTitle}</h2>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {t.peppolReady}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{documentTimestamp}</p>
                  </div>
                  <button 
                    onClick={() => setStep('devis')} 
                    className="no-print text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg"
                  >
                    {t.btnBack}
                  </button>
                </div>

                {/* DATE DE LIVRAISON DES TRAVAUX (SAISIE MANUELLE) */}
                <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between gap-4">
                  <label className="text-xs font-extrabold text-emerald-900">{t.completionDateLabel}</label>
                  <input 
                    type="date" 
                    value={completionDate} 
                    onChange={e => setCompletionDate(e.target.value)}
                    className="p-1.5 text-xs font-bold border border-emerald-300 rounded bg-white outline-none" 
                  />
                </div>

                {/* RAPPEL CLIENT ET MONTANTS */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p><span className="font-bold">Client :</span> {clientName || 'Vicernant (NV)'}</p>
                      <p><span className="font-bold">Chantier :</span> {siteAddress || 'Non spécifié'}</p>
                    </div>
                    <div className="text-right">
                      <p><span className="font-bold">Montant HTVA :</span> {subtotal.toFixed(2)} €</p>
                      <p><span className="font-bold">TVA :</span> 0.00 €</p>
                      <p className="text-sm font-extrabold text-slate-900 mt-1"><span className="font-bold">TOTAL TTC :</span> {subtotal.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>

                {/* MENTION LÉGALE FACTURE */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs italic text-slate-600">
                  <p className="font-bold not-italic text-slate-700 mb-0.5">Verplichte wettelijke vermelding op het document:</p>
                  {t.verdictLegalText}
                </div>

                {/* ACTIONS FACTURE / PEPPOL */}
                <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-100 no-print">
                  <div className="flex gap-2">
                    <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg">
                      {t.btnSaveInvoice}
                    </button>
                    <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg border border-slate-300">
                      {t.btnPrintPdf}
                    </button>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5">
                    {t.btnSendPeppol}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* COLONNE DROITE : HISTORIQUE LATÉRAL (MASQUÉ À L'IMPRESSION) */}
          <div className="no-print">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 sticky top-6">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                {t.historyTitle}
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 italic">{t.noHistory}</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {history.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{h.name}</span>
                        <span className="text-slate-400 font-normal text-[10px]">{h.time}</span>
                      </div>
                      <p className="text-emerald-700 font-medium text-[11px]">— {h.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
