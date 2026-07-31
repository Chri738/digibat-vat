import React, { useState } from 'react';
import {
  calculateVAT,
  VatInput,
  VatResult,
  WorkType,
  StatutTVA,
  AgeBatiment,
  UsageBatiment,
  ViesStatus,
} from './vatEngine';
import { TRANSLATIONS, Language } from './translations';
import { LEGAL_MENTIONS } from './types/constants/legalMentions';

// Liste des 27 pays membres de l'UE
const EU_COUNTRIES = [
  { code: 'BE', name_fr: 'Belgique (BE)', name_nl: 'België (BE)' },
  { code: 'FR', name_fr: 'France (FR)', name_nl: 'Frankrijk (FR)' },
  { code: 'NL', name_fr: 'Pays-Bas (NL)', name_nl: 'Nederland (NL)' },
  { code: 'DE', name_fr: 'Allemagne (DE)', name_nl: 'Duitsland (DE)' },
  { code: 'LU', name_fr: 'Luxembourg (LU)', name_nl: 'Luxemburg (LU)' },
  { code: 'AT', name_fr: 'Autriche (AT)', name_nl: 'Oostenrijk (AT)' },
  { code: 'BG', name_fr: 'Bulgarie (BG)', name_nl: 'Bulgarije (BG)' },
  { code: 'CY', name_fr: 'Chypre (CY)', name_nl: 'Cyprus (CY)' },
  { code: 'CZ', name_fr: 'Tchéquie (CZ)', name_nl: 'Tsjechië (CZ)' },
  { code: 'DK', name_fr: 'Danemark (DK)', name_nl: 'Denemarken (DK)' },
  { code: 'EE', name_fr: 'Estonie (EE)', name_nl: 'Estland (EE)' },
  { code: 'ES', name_fr: 'Espagne (ES)', name_nl: 'Spanje (ES)' },
  { code: 'FI', name_fr: 'Finlande (FI)', name_nl: 'Finland (FI)' },
  { code: 'GR', name_fr: 'Grèce (GR)', name_nl: 'Griekenland (GR)' },
  { code: 'HR', name_fr: 'Croatie (HR)', name_nl: 'Kroatië (HR)' },
  { code: 'HU', name_fr: 'Hongrie (HU)', name_nl: 'Hongarije (HU)' },
  { code: 'IE', name_fr: 'Irlande (IE)', name_nl: 'Ierland (IE)' },
  { code: 'IT', name_fr: 'Italie (IT)', name_nl: 'Italië (IT)' },
  { code: 'LT', name_fr: 'Lituanie (LT)', name_nl: 'Litouwen (LT)' },
  { code: 'LU', name_fr: 'Luxembourg (LU)', name_nl: 'Luxemburg (LU)' },
  { code: 'LV', name_fr: 'Lettonie (LV)', name_nl: 'Letland (LV)' },
  { code: 'MT', name_fr: 'Malte (MT)', name_nl: 'Malta (MT)' },
  { code: 'PL', name_fr: 'Pologne (PL)', name_nl: 'Polen (PL)' },
  { code: 'PT', name_fr: 'Portugal (PT)', name_nl: 'Portugal (PT)' },
  { code: 'RO', name_fr: 'Roumanie (RO)', name_nl: 'Roemenië (RO)' },
  { code: 'SE', name_fr: 'Suède (SE)', name_nl: 'Zweden (SE)' },
  { code: 'SI', name_fr: 'Slovénie (SI)', name_nl: 'Slovenië (SI)' },
  { code: 'SK', name_fr: 'Slovaquie (SK)', name_nl: 'Slowakije (SK)' },
];

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  workType: WorkType;
}

export function App() {
  // Langue active (FR / NL)
  const [lang, setLang] = useState<Language>('FR');
  const t = TRANSLATIONS[lang];

  // ----------------------------------------------------------------------
  // Étape 1 : Profil Client
  // ----------------------------------------------------------------------
  const [clientCountry, setClientCountry] = useState<string>('BE');
  const [statutTVA, setStatutTVA] = useState<StatutTVA>('B2C');
  const [clientVatNumber, setClientVatNumber] = useState<string>('');
  const [viesStatus, setViesStatus] = useState<ViesStatus>('UNCHECKED');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');

  // ----------------------------------------------------------------------
  // Étape 2 : Bien Immobilier & Travaux
  // ----------------------------------------------------------------------
  const [ageBatiment, setAgeBatiment] = useState<AgeBatiment>('<10');
  const [usageBatiment, setUsageBatiment] = useState<UsageBatiment>('100_PRIV');
  const [surfacePrivee, setSurfacePrivee] = useState<number>(0);
  const [surfacePro, setSurfacePro] = useState<number>(0);
  const [superficieParcelle, setSuperficieParcelle] = useState<number>(0);
  const [siteAddress, setSiteAddress] = useState<string>('');
  
  // Lignes de prestations du document
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0.0,
      workType: 'STANDARD_RENOVATION',
    },
  ]);

  // Champ spécifique Facture
  const [completionDate, setCompletionDate] = useState<string>('');
  const [documentType, setDocumentType] = useState<'QUOTE' | 'INVOICE'>('QUOTE');

  // ----------------------------------------------------------------------
  // Verrou B2B VIES
  // ----------------------------------------------------------------------
  const isStep2Locked = statutTVA === 'B2B' && viesStatus !== 'VALIDATED';

  // Simulation du contrôle VIES API
  const handleCheckVies = () => {
    setViesStatus('PENDING');
    setTimeout(() => {
      if (clientVatNumber.trim().length >= 8) {
        setViesStatus('VALIDATED');
      } else {
        setViesStatus('INVALID');
      }
    }, 800);
  };

  // ----------------------------------------------------------------------
  // Calcul du Verdict Moteur Fiscal TVA
  // ----------------------------------------------------------------------
  const activeWorkTypes = Array.from(new Set(lineItems.map((item) => item.workType)));

  const vatInput: VatInput = {
    statutTVA,
    viesStatus,
    ageBatiment,
    usageBatiment,
    surfacePrivee,
    surfacePro,
    superficieParcelle,
    workTypes: activeWorkTypes,
  };

  const vatResult: VatResult = calculateVAT(vatInput);

  // ----------------------------------------------------------------------
  // Gestion des lignes de prestations
  // ----------------------------------------------------------------------
  const handleAddLine = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0.0,
        workType: 'STANDARD_RENOVATION',
      },
    ]);
  };

  const handleUpdateLine = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveLine = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  // Calculs financiers
  const calculateTotals = () => {
    let subtotalExcl = 0;
    let totalVat = 0;

    lineItems.forEach((item) => {
      const lineExcl = item.quantity * item.unitPrice;
      const rateInfo = vatResult.lineResults[item.workType];
      const rate = rateInfo ? rateInfo.rate : 21;

      subtotalExcl += lineExcl;
      totalVat += lineExcl * (rate / 100);
    });

    return {
      subtotalExcl,
      totalVat,
      totalIncl: subtotalExcl + totalVat,
    };
  };

  const totals = calculateTotals();

  // Texte légal injecté selon la langue et la clé issue du verdict fiscal
  const legalMentionText =
    LEGAL_MENTIONS[vatResult.legalMentionKey]?.[lang.toLowerCase() as 'fr' | 'nl'] || '';

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      {/* Masquage automatique à l'impression / Peppol via CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only-shadow { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Barre de navigation & Sélecteur de langue */}
      <header className="no-print max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-blue-600 text-white font-black text-xl px-3 py-1.5 rounded-lg shadow-sm">
            DigiBât
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{t.title}</h1>
            <p className="text-xs text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang('FR')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              lang === 'FR'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            FR 🇫🇷
          </button>
          <button
            onClick={() => setLang('NL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              lang === 'NL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            NL 🇧🇪
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
        {/* =================================================================== */}
        {/* ÉTAPE 1 : PROFIL CLIENT                                              */}
        {/* =================================================================== */}
        <section className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-base font-bold mb-4 text-blue-900 border-b pb-2 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">1</span>
            {t.step1Title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pays UE */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t.selectCountry}
              </label>
              <select
                value={clientCountry}
                onChange={(e) => setClientCountry(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {EU_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {lang === 'FR' ? c.name_fr : c.name_nl}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut TVA */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t.vatStatus}
              </label>
              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setStatutTVA('B2C');
                    setViesStatus('UNCHECKED');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    statutTVA === 'B2C'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.b2cLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setStatutTVA('B2B')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    statutTVA === 'B2B'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.b2bLabel}
                </button>
              </div>
            </div>

            {/* Téléphone Client */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t.clientPhone}
              </label>
              <input
                type="text"
                placeholder="+32 4XX XX XX XX"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nom / Raison Sociale */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {statutTVA === 'B2B' ? 'Raison Sociale / Bedrijfsnaam' : 'Nom Client / Naam klant'}
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Numéro TVA B2B & Validation VIES */}
            {statutTVA === 'B2B' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t.vatNumber}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="BE 0123.456.789"
                    value={clientVatNumber}
                    onChange={(e) => {
                      setClientVatNumber(e.target.value);
                      setViesStatus('UNCHECKED');
                    }}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleCheckVies}
                    className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-900 whitespace-nowrap"
                  >
                    {t.checkVies}
                  </button>
                </div>

                {/* Badge de statut VIES */}
                <div className="mt-2">
                  {viesStatus === 'VALIDATED' && (
                    <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                      ✓ {t.viesValidated}
                    </span>
                  )}
                  {viesStatus === 'INVALID' && (
                    <span className="inline-flex items-center text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md font-medium">
                      ✕ {t.viesInvalid}
                    </span>
                  )}
                  {viesStatus === 'PENDING' && (
                    <span className="inline-flex items-center text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
                      ⏳ {t.viesPending}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Message d'avertissement si l'étape 2 est verrouillée */}
        {isStep2Locked && (
          <div className="no-print bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2">
            ⚠️ {t.step2LockedMsg}
          </div>
        )}

        {/* =================================================================== */}
        {/* ÉTAPE 2 : BIEN IMMOBILIER & TRAVAUX                                  */}
        {/* =================================================================== */}
        <section
          className={`no-print bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-opacity ${
            isStep2Locked ? 'opacity-40 pointer-events-none' : 'opacity-100'
          }`}
        >
          <h2 className="text-base font-bold mb-4 text-blue-900 border-b pb-2 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">2</span>
            {t.step2Title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Âge du bâtiment */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t.buildingAge}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAgeBatiment('<10')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    ageBatiment === '<10'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.under10Years}
                </button>
                <button
                  type="button"
                  onClick={() => setAgeBatiment('>=10')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    ageBatiment === '>=10'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.over10Years}
                </button>
              </div>
            </div>

            {/* Usage du bâtiment */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t.buildingUsage}
              </label>
              <select
                value={usageBatiment}
                onChange={(e) => setUsageBatiment(e.target.value as UsageBatiment)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="100_PRIV">{t.usage100Priv}</option>
                <option value="GT50_PRIV">{t.usageGt50Priv}</option>
                <option value="EXCL_PRO">{t.usageExclPro}</option>
                <option value="MIXED">{t.usageMixed}</option>
              </select>
            </div>
          </div>

          {/* Champs dynamiques Usage Mixte */}
          {usageBatiment === 'MIXED' && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t.privateSurface}
                </label>
                <input
                  type="number"
                  min="0"
                  value={surfacePrivee}
                  onChange={(e) => setSurfacePrivee(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t.proSurface}
                </label>
                <input
                  type="number"
                  min="0"
                  value={surfacePro}
                  onChange={(e) => setSurfacePro(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t.parcelSurface}
                </label>
                <input
                  type="number"
                  min="0"
                  value={superficieParcelle}
                  onChange={(e) => setSuperficieParcelle(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                />
              </div>

              {superficieParcelle < 200 && (
                <div className="sm:col-span-3 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  {t.parcelWarning}
                </div>
              )}
            </div>
          )}

          {/* Adresse du chantier */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {t.siteAddress}
            </label>
            <input
              type="text"
              placeholder="Rue, N°, Code Postal, Ville"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* =================================================================== */}
        {/* ÉTAPE 3 : MOTEUR FISCAL & VERDICT TVA                                */}
        {/* =================================================================== */}
        <section className="no-print bg-slate-900 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-base font-bold mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mr-2">3</span>
              {t.step3Title}
            </span>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
              Régime : {vatResult.regimeKey}
            </span>
          </h2>

          <div className="mt-3 text-xs space-y-2">
            <p className="text-slate-300">
              <strong className="text-white">{t.legalMentionTitle} :</strong>
            </p>
            <blockquote className="bg-slate-800 p-3 rounded-lg border-l-4 border-blue-500 italic text-slate-200">
              {legalMentionText || '(Aucune mention légale spécifique requise)'}
            </blockquote>
          </div>
        </section>

        {/* =================================================================== */}
        {/* DOCUMENT OFFICIEL : DEVIS / FACTURE                                  */}
        {/* =================================================================== */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 print-only-shadow">
          {/* Controls document type (Cachés à l'impression) */}
          <div className="no-print flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDocumentType('QUOTE')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  documentType === 'QUOTE'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.quoteTitle}
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('INVOICE')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  documentType === 'INVOICE'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.invoiceTitle}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-900 transition-all"
              >
                🖨️ {t.printPdf}
              </button>
              {documentType === 'INVOICE' && (
                <button
                  type="button"
                  onClick={() => alert('Envoi Peppol initié !')}
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all"
                >
                  🚀 {t.sendPeppol}
                </button>
              )}
            </div>
          </div>

          {/* En-tête du Document Document */}
          <div className="flex justify-between items-start mb-8 border-b pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {documentType === 'QUOTE' ? t.quoteTitle : t.invoiceTitle}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">
                N° : {documentType === 'QUOTE' ? 'DEV-2026-001' : 'FACT-2026-001'}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Date : {new Date().toLocaleDateString(lang === 'FR' ? 'fr-BE' : 'nl-BE')}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">DigiBât Entrepreneur / Aannemer</p>
              <p className="text-xs text-slate-500">TVA / Btw : BE 0999.888.777</p>
              <p className="text-xs text-slate-500">Rue du Progrès 12, 1000 Bruxelles</p>
            </div>
          </div>

          {/* Bloc Client & Chantier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">{t.clientAndSite}</h3>
              <p className="text-sm font-bold text-slate-800">
                {clientName || '(Nom client non spécifié)'}
              </p>
              {statutTVA === 'B2B' && (
                <p className="text-xs text-slate-600">TVA / Btw : {clientVatNumber || '-'}</p>
              )}
              <p className="text-xs text-slate-600">
                <strong>{t.clientPhone} :</strong> {clientPhone || '-'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">{t.siteAddress}</h3>
              <p className="text-sm text-slate-800">{siteAddress || '(Adresse non spécifiée)'}</p>
              
              {/* Champ Spécifique Facture : Date de livraison des travaux */}
              {documentType === 'INVOICE' && (
                <div className="mt-3 pt-2 border-t border-slate-200">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {t.completionDate} :
                  </label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="no-print text-xs border border-slate-300 rounded p-1"
                  />
                  <span className="hidden print:inline text-xs font-bold text-slate-800">
                    {completionDate || '-'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tableau des Prestations */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="py-2 px-2">{t.description}</th>
                  <th className="py-2 px-2">Type de travaux</th>
                  <th className="py-2 px-2 text-right">{t.quantity}</th>
                  <th className="py-2 px-2 text-right">{t.unitPrice}</th>
                  <th className="py-2 px-2 text-right">{t.amount}</th>
                  <th className="py-2 px-2 text-center">{t.vatRate}</th>
                  <th className="py-2 px-2 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {lineItems.map((item) => {
                  const rateInfo = vatResult.lineResults[item.workType];
                  const displayRate = rateInfo ? `${rateInfo.rate}%` : '21%';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          placeholder="Description de la prestation..."
                          value={item.description}
                          onChange={(e) => handleUpdateLine(item.id, 'description', e.target.value)}
                          className="w-full border-none bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 p-1 rounded"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={item.workType}
                          onChange={(e) =>
                            handleUpdateLine(item.id, 'workType', e.target.value as WorkType)
                          }
                          className="no-print border border-slate-200 text-xs rounded p-1 bg-white"
                        >
                          <option value="HEAT_PUMP">Pompe à chaleur</option>
                          <option value="STANDARD_RENOVATION">Rénovation standard</option>
                          <option value="HEAVY_OUTDOOR">Aménagements extérieurs lourds</option>
                          <option value="SOLAR_INSULATION">Panneaux solaires & Isolation</option>
                          <option value="SOLAR_GENERAL">Panneaux solaires & travaux gén.</option>
                          <option value="INDUSTRIAL_CLEANING">Nettoyage industriel</option>
                          <option value="TREE_FELLING">Abattage d'arbres dangereux</option>
                          <option value="PAINTING_NEW">Peinture bâtiment neuf</option>
                          <option value="PAINTING_OLD">Peinture bâtiment ancien</option>
                          <option value="ROUTINE_HOUSE_MAINT">Nettoyage courant</option>
                          <option value="ROUTINE_GARDENING">Entretien jardin courant</option>
                        </select>
                        <span className="hidden print:inline">{item.workType}</span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateLine(item.id, 'quantity', Number(e.target.value))
                          }
                          className="w-16 text-right border-none bg-transparent outline-none focus:bg-white p-1 rounded"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateLine(item.id, 'unitPrice', Number(e.target.value))
                          }
                          className="w-20 text-right border-none bg-transparent outline-none focus:bg-white p-1 rounded"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-semibold">
                        {(item.quantity * item.unitPrice).toFixed(2)} €
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {displayRate}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right no-print">
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(item.id)}
                            className="text-rose-500 hover:text-rose-700 font-bold px-1"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="no-print mb-6">
            <button
              type="button"
              onClick={handleAddLine}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
            >
              {t.addLine}
            </button>
          </div>

          {/* Totaux */}
          <div className="flex flex-col items-end border-t pt-4 space-y-1 text-xs">
            <div className="flex justify-between w-64 text-slate-600">
              <span>{t.subtotalExclVat} :</span>
              <span className="font-semibold">{totals.subtotalExcl.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between w-64 text-slate-600">
              <span>{t.vatAmount} :</span>
              <span className="font-semibold">{totals.totalVat.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between w-64 text-sm font-black text-slate-900 border-t pt-2 mt-1">
              <span>{t.totalInclVat} :</span>
              <span className="text-blue-600">{totals.totalIncl.toFixed(2)} €</span>
            </div>
          </div>

          {/* Mentions Légales Injectées */}
          {legalMentionText && (
            <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-600 leading-relaxed italic">
              <p className="font-bold not-italic mb-1 text-slate-700">
                {t.legalMentionTitle} :
              </p>
              {legalMentionText}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
