import React, { useState, useMemo } from 'react';
import {
  calculateVAT,
  Language,
  ClientType,
  BuildingAge,
  BuildingUsage,
  WorkCategory,
  TaxEngineResult,
} from './vatEngine';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const EU_COUNTRIES = [
  'BE', 'AT', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
  'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
];

export default function App() {
  // --- ÉTATS GLOBAUX & SAISIES NEUTRES ---
  const [lang, setLang] = useState<Language>('FR');
  const [step, setStep] = useState<1 | 2 | 3 | 'QUOTE' | 'INVOICE'>(1);

  // Étape 1 : Client
  const [clientCountry, setClientCountry] = useState<string>('BE');
  const [clientType, setClientType] = useState<ClientType>('B2C');
  const [clientName, setClientName] = useState<string>('');
  const [viesNumber, setViesNumber] = useState<string>('');
  const [isViesValid, setIsViesValid] = useState<boolean>(false);
  const [viesLoading, setViesLoading] = useState<boolean>(false);
  const [viesMessage, setViesMessage] = useState<string>('');

  // Étape 2 : Bâtiment & Travaux
  const [buildingAge, setBuildingAge] = useState<BuildingAge>('OVER_10');
  const [buildingUsage, setBuildingUsage] = useState<BuildingUsage>('PRIVATE_100');
  const [plotArea, setPlotArea] = useState<number | ''>('');
  const [privateArea, setPrivateArea] = useState<number | ''>('');
  const [proArea, setProArea] = useState<number | ''>('');
  const [workCategory, setWorkCategory] = useState<WorkCategory>('RENOVATION_STANDARD');
  const [outdoorOption, setOutdoorOption] = useState<'NONE' | 'ROUTINE' | 'MAJOR'>('NONE');
  const [siteAddress, setSiteAddress] = useState<string>('');

  // Étape Devis / Facture & Prestataire
  const [entrepreneurName, setEntrepreneurName] = useState<string>('');
  const [entrepreneurVat, setEntrepreneurVat] = useState<string>('');
  const [entrepreneurAddress, setEntrepreneurAddress] = useState<string>('');
  const [completionDate, setCompletionDate] = useState<string>('');

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 },
  ]);

  // --- CONTROLES VIES (B2B) ---
  const handleViesCheck = () => {
    if (!viesNumber.trim()) return;
    setViesLoading(true);
    setViesMessage('');

    // Simulation de validation VIES (à raccorder à Supabase edge function si disponible)
    setTimeout(() => {
      setViesLoading(false);
      if (viesNumber.replaceAll(/[^a-zA-Z0-9]/g, '').length >= 8) {
        setIsViesValid(true);
        setViesMessage(lang === 'FR' ? '✓ TVA VIES Validée (OK)' : '✓ VIES Validated (Oké)');
      } else {
        setIsViesValid(false);
        setViesMessage(lang === 'FR' ? '❌ Numéro VIES invalide' : '❌ Ongeldig VIES-nummer');
      }
    }, 600);
  };

  // --- CALCUL DU VERDICT FISCAL ---
  const vatVerdict: TaxEngineResult = useMemo(() => {
    return calculateVAT({
      lang,
      clientType,
      isViesValid,
      buildingAge,
      buildingUsage,
      plotArea: Number(plotArea) || 0,
      privateArea: Number(privateArea) || 0,
      proArea: Number(proArea) || 0,
      workCategory,
    });
  }, [
    lang,
    clientType,
    isViesValid,
    buildingAge,
    buildingUsage,
    plotArea,
    privateArea,
    proArea,
    workCategory,
  ]);

  // --- CALCULS FINANCIERS ---
  const subtotalExcl = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [lineItems]);

  const vatAmount = useMemo(() => {
    if (!vatVerdict.isValid) return 0;
    if (vatVerdict.isSplitRate && vatVerdict.proVatRate && vatVerdict.privateVatRate) {
      const priv = Number(privateArea) || 1;
      const pro = Number(proArea) || 1;
      const totalArea = priv + pro;
      const partPriv = (subtotalExcl * (priv / totalArea)) * (vatVerdict.privateVatRate / 100);
      const partPro = (subtotalExcl * (pro / totalArea)) * (vatVerdict.proVatRate / 100);
      return partPriv + partPro;
    }
    return subtotalExcl * (vatVerdict.vatRate / 100);
  }, [subtotalExcl, vatVerdict, privateArea, proArea]);

  const totalIncl = subtotalExcl + vatAmount;

  // --- GESTION TABLEAU DE LIGNES ---
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((i) => i.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // =========================================================================
  // RENDU INTERFACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* BARRE D'EN-TÊTE & SELECTEUR DE LANGUE */}
      <header className="max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-800">DIGIBÂT VAT / DIGIBOUW BTW</h1>
          <p className="text-xs text-slate-500">
            {lang === 'FR'
              ? 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026'
              : 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            {lang === 'FR' ? 'Langue / Taal :' : 'Taal / Langue :'}
          </span>
          <button
            onClick={() => setLang('FR')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              lang === 'FR' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLang('NL')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              lang === 'NL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            NL
          </button>
        </div>
      </header>

      {/* NAVIGATION ÉTAPES (MASQUÉE A L'IMPRESSION) */}
      <nav className="max-w-5xl mx-auto mb-6 flex gap-2 overflow-x-auto pb-2 print:hidden">
        <button
          onClick={() => setStep(1)}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
            step === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          1. {lang === 'FR' ? 'Profil Client' : 'Klantprofiel'}
        </button>
        <button
          onClick={() => isViesValid || clientType === 'B2C' ? setStep(2) : null}
          disabled={clientType === 'B2B' && !isViesValid}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
            step === 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
          } ${clientType === 'B2B' && !isViesValid ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          2. {lang === 'FR' ? 'Bien & Travaux' : 'Onroerend goed & Werken'}
        </button>
        <button
          onClick={() => isViesValid || clientType === 'B2C' ? setStep(3) : null}
          disabled={clientType === 'B2B' && !isViesValid}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
            step === 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
          } ${clientType === 'B2B' && !isViesValid ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          3. {lang === 'FR' ? 'Moteur Fiscal' : 'Btw-regeling'}
        </button>
        <button
          onClick={() => setStep('QUOTE')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
            step === 'QUOTE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          📄 {lang === 'FR' ? 'Écran Devis' : 'Offertescherm'}
        </button>
        <button
          onClick={() => setStep('INVOICE')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border ${
            step === 'INVOICE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          🧾 {lang === 'FR' ? 'Écran Facture' : 'Factuurscherm'}
        </button>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        {/* ===================================================================
            ÉTAPE 1 : PROFIL CLIENT
        =================================================================== */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">
              Étape 1 : {lang === 'FR' ? 'Profil du Client' : 'Klantprofiel'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'FR' ? 'Pays du client' : 'Land van de klant'}
                </label>
                <select
                  value={clientCountry}
                  onChange={(e) => setClientCountry(e.target.value)}
                  className="w-full p-2 text-sm border rounded-lg"
                >
                  {EU_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'FR' ? 'Statut fiscal du client' : 'Fiscale status van de klant'}
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="clientType"
                      checked={clientType === 'B2C'}
                      onChange={() => {
                        setClientType('B2C');
                        setIsViesValid(false);
                      }}
                    />
                    Particulier (B2C)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="clientType"
                      checked={clientType === 'B2B'}
                      onChange={() => setClientType('B2B')}
                    />
                    {lang === 'FR' ? 'Assujetti (B2B)' : 'Btw-plichtige (B2B)'}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'FR' ? 'Nom ou Raison Sociale' : 'Naam of Bedrijfsnaam'}
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={lang === 'FR' ? 'Nom du client...' : 'Naam van de klant...'}
                  className="w-full p-2 text-sm border rounded-lg"
                />
              </div>

              {clientType === 'B2B' && (
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'FR' ? 'N° de TVA Intracommunautaire' : 'BTW-nummer'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={viesNumber}
                      onChange={(e) => {
                        setViesNumber(e.target.value);
                        setIsViesValid(false);
                      }}
                      placeholder="BE 0123.456.789"
                      className="w-full p-2 text-sm border rounded-lg"
                    />
                    <button
                      onClick={handleViesCheck}
                      disabled={viesLoading}
                      className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900"
                    >
                      {viesLoading ? '...' : 'VIES Controleren'}
                    </button>
                  </div>
                  {viesMessage && (
                    <p className={`text-xs mt-1 font-semibold ${isViesValid ? 'text-green-600' : 'text-red-600'}`}>
                      {viesMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={clientType === 'B2B' && !isViesValid}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg disabled:opacity-40"
              >
                {lang === 'FR' ? 'Étape suivante →' : 'Volgende stap →'}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ÉTAPE 2 : BIEN IMMOBILIER & TRAVAUX
        =================================================================== */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">
              Étape 2 : {lang === 'FR' ? 'Bien Immobilier & Nature des Travaux' : 'Onroerend goed & Aard van de werken'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'FR' ? 'Âge du bâtiment' : 'Ouderdom van het gebouw'}
                </label>
                <select
                  value={buildingAge}
                  onChange={(e) => setBuildingAge(e.target.value as BuildingAge)}
                  className="w-full p-2 text-sm border rounded-lg"
                >
                  <option value="UNDER_10">{lang === 'FR' ? '< 10 ans' : '< 10 jaar'}</option>
                  <option value="OVER_10">{lang === 'FR' ? '≥ 10 ans' : '≥ 10 jaar'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'FR' ? 'Usage du bâtiment' : 'Gebruik van het gebouw'}
                </label>
                <select
                  value={buildingUsage}
                  onChange={(e) => setBuildingUsage(e.target.value as BuildingUsage)}
                  className="w-full p-2 text-sm border rounded-lg"
                >
                  <option value="PRIVATE_100">{lang === 'FR' ? '100% Privé' : '100% Privé'}</option>
                  <option value="PRIVATE_OVER_50">{lang === 'FR' ? '> 50% Privé' : '> 50% Privé'}</option>
                  <option value="PRO_EXCLUSIVITY">{lang === 'FR' ? 'Exclusif Pro' : 'Uitsluitend Professioneel'}</option>
                  <option value="MIXED">{lang === 'FR' ? 'Usage Mixte' : 'Gemengd Gebruik'}</option>
                </select>
              </div>
            </div>

            {buildingUsage === 'MIXED' && (
              <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
                <p className="text-xs text-amber-700 font-semibold">
                  ⚠️ {lang === 'FR' ? 'Règle d\'usage mixte (Terrain ≥ 200 m² requis)' : 'Gemengd gebruik regel (Perceel ≥ 200 m² vereist)'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1">Superficie parcelle (m²)</label>
                    <input
                      type="number"
                      value={plotArea}
                      onChange={(e) => setPlotArea(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Ex: 250"
                      className="w-full p-2 text-sm border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Surface Privée (m²)</label>
                    <input
                      type="number"
                      value={privateArea}
                      onChange={(e) => setPrivateArea(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Ex: 100"
                      className="w-full p-2 text-sm border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Surface Professionnelle (m²)</label>
                    <input
                      type="number"
                      value={proArea}
                      onChange={(e) => setProArea(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Ex: 50"
                      className="w-full p-2 text-sm border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1">
                {lang === 'FR' ? 'Nature principale des travaux' : 'Aard van de werken'}
              </label>
              <select
                value={workCategory}
                onChange={(e) => setWorkCategory(e.target.value as WorkCategory)}
                className="w-full p-2 text-sm border rounded-lg"
              >
                <option value="RENOVATION_STANDARD">Rénovation standard / Isolatie / Algemeen</option>
                <option value="HEAT_PUMP">Pompe à chaleur / Warmtepomp (6% AR 29/03/2022)</option>
                <option value="SOLAR_PANELS">Panneaux solaires / Zonnepanelen</option>
                <option value="INDUSTRIAL_CLEANING">Nettoyage industriel / Industriële opleveringsschoonmaak</option>
                <option value="ROUTINE_MAINTENANCE">Entretien courant, jardinage, lavage vitres / Gewoon onderhoud</option>
                <option value="NEW_PAINTING">Peinture sur bâtiment neuf / Schilderen nieuwbouw</option>
                <option value="DANGEROUS_TREE_FELLING">Abattage d'arbres dangereux / Vellen gevaarlijke bomen</option>
                <option value="DEMOLITION_CONSTRUCTION">Démolition & Reconstruction / Sloop & Heropbouw</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                {lang === 'FR' ? 'Adresse du chantier' : 'Adres van de werf'}
              </label>
              <input
                type="text"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder={lang === 'FR' ? 'Rue, N°, Code Postal, Ville...' : 'Straat, Nr, Postcode, Stad...'}
                className="w-full p-2 text-sm border rounded-lg"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border text-sm rounded-lg"
              >
                ← {lang === 'FR' ? 'Retour' : 'Terug'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg"
              >
                {lang === 'FR' ? 'Calculer le Régime TVA →' : 'Btw-regeling berekenen →'}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ÉTAPE 3 : VERDICT FISCAL
        =================================================================== */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">
              Étape 3 : {lang === 'FR' ? 'Résultat / Régime TVA Déterminé' : 'Resultaat / Btw-regeling'}
            </h2>

            {!vatVerdict.isValid ? (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                ❌ {vatVerdict.errorMessage}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold">Statut TVA :</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-xs">
                    {vatVerdict.badgeText}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border rounded-lg">
                  <p className="text-xs font-bold text-slate-700 mb-1">Explication :</p>
                  <p className="text-sm text-slate-800">{vatVerdict.explanation}</p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-bold text-blue-900 mb-1">
                    {lang === 'FR' ? 'Mention légale obligatoire à insérer :' : 'Verplichte wettelijke vermelding :'}
                  </p>
                  <p className="text-xs text-blue-800 italic">{vatVerdict.legalMention}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep('QUOTE')}
                    className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700"
                  >
                    📄 {lang === 'FR' ? 'Générer le Devis' : 'Offerte aanmaken'}
                  </button>
                  <button
                    onClick={() => setStep('INVOICE')}
                    className="flex-1 py-3 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700"
                  >
                    🧾 {lang === 'FR' ? 'Générer la Facture' : 'Factuur aanmaken'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ÉCRANS DEVIS & FACTURE
        =================================================================== */}
        {(step === 'QUOTE' || step === 'INVOICE') && (
          <div className="space-y-6">
            {/* EN-TÊTE DOCUMENT */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  {step === 'QUOTE' ? (lang === 'FR' ? 'DEVIS / OFFERTE' : 'OFFERTE') : (lang === 'FR' ? 'FACTURE / FACTUUR' : 'FACTUUR')}
                </h2>
                <p className="text-xs text-slate-500">
                  N° : {step === 'QUOTE' ? 'DEV-2026-001' : 'FAC-2026-001'} | Date : {new Date().toLocaleDateString()}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-full text-xs">
                {vatVerdict.badgeText}
              </span>
            </div>

            {/* PRESTATAIRE & CLIENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-2 border">
                <p className="font-bold text-slate-700 uppercase">
                  {lang === 'FR' ? 'Prestataire / Entrepreneur' : 'Dienstverlener / Ondernemer'}
                </p>
                <input
                  type="text"
                  placeholder={lang === 'FR' ? 'Nom entreprise...' : 'Bedrijfsnaam...'}
                  value={entrepreneurName}
                  onChange={(e) => setEntrepreneurName(e.target.value)}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="N° TVA (BE 0...)"
                  value={entrepreneurVat}
                  onChange={(e) => setEntrepreneurVat(e.target.value)}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="text"
                  placeholder={lang === 'FR' ? 'Adresse entreprise...' : 'Adres bedrijf...'}
                  value={entrepreneurAddress}
                  onChange={(e) => setEntrepreneurAddress(e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1 border">
                <p className="font-bold text-slate-700 uppercase">
                  {lang === 'FR' ? 'Client & Chantier' : 'Klant & Werf'}
                </p>
                <p><strong>{lang === 'FR' ? 'Client :' : 'Klant :'}</strong> {clientName || '-'}</p>
                {clientType === 'B2B' && <p><strong>N° BTW :</strong> {viesNumber}</p>}
                <p><strong>{lang === 'FR' ? 'Adresse Chantier :' : 'Adres werf :'}:</strong> {siteAddress || '-'}</p>
                {step === 'INVOICE' && (
                  <div className="mt-2 pt-2 border-t">
                    <label className="block font-semibold mb-1">
                      {lang === 'FR' ? 'Date de livraison des travaux :' : 'Opleveringsdatum van de werken :'}
                    </label>
                    <input
                      type="date"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      className="p-1 border rounded w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* TABLEAU DES PRESTATONS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase">{lang === 'FR' ? 'Prestations' : 'Prestaties'}</h3>
                <button
                  onClick={addLineItem}
                  className="px-2 py-1 bg-slate-800 text-white text-xs rounded print:hidden"
                >
                  + {lang === 'FR' ? 'Ligne' : 'Regel'}
                </button>
              </div>

              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="p-2">{lang === 'FR' ? 'Description' : 'Omschrijving'}</th>
                    <th className="p-2 w-20 text-center">{lang === 'FR' ? 'Qté' : 'Aantal'}</th>
                    <th className="p-2 w-28 text-right">{lang === 'FR' ? 'Prix unitaire' : 'Eenheidsprijs'}</th>
                    <th className="p-2 w-28 text-right">{lang === 'FR' ? 'Montant' : 'Bedrag'}</th>
                    <th className="p-2 w-8 print:hidden"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="..."
                          className="w-full p-1 border-none focus:ring-1"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full p-1 border text-center"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full p-1 border text-right"
                        />
                      </td>
                      <td className="p-2 text-right font-medium">
                        {(item.quantity * item.unitPrice).toFixed(2)} €
                      </td>
                      <td className="p-1 text-center print:hidden">
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTAUX */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-xs border-t pt-2">
                <div className="flex justify-between">
                  <span>Subtotaal EXCL. BTW :</span>
                  <span className="font-semibold">{subtotalExcl.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>{lang === 'FR' ? 'Montant TVA :' : 'Btw-bedrag :'}</span>
                  <span className="font-semibold">{vatAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-1">
                  <span>{lang === 'FR' ? 'Total TTC :' : 'Totaal incl. BTW :'}</span>
                  <span>{totalIncl.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* MENTION LÉGALE */}
            <div className="p-3 bg-slate-50 border rounded-lg text-xs">
              <p className="font-bold text-slate-700 mb-1">
                {lang === 'FR' ? 'Mention légale obligatoire :' : 'Verplichte wettelijke vermelding :'}
              </p>
              <p className="italic text-slate-600">{vatVerdict.legalMention}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between pt-4 print:hidden">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 border text-xs rounded-lg"
              >
                ← {lang === 'FR' ? 'Modifier Moteur TVA' : 'Btw-regeling wijzigen'}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg"
                >
                  🖨️ {lang === 'FR' ? 'Imprimer / PDF' : 'Afdrukken / PDF'}
                </button>
                {step === 'QUOTE' ? (
                  <button
                    onClick={() => setStep('INVOICE')}
                    className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg"
                  >
                    Convertir en Facture →
                  </button>
                ) : (
                  <button
                    onClick={() => alert('Peppol Export Ready')}
                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg"
                  >
                    Verzenden via Peppol
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
