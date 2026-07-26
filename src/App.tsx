import React, { useState } from 'react';

type Lang = 'FR' | 'NL';
type ClientStatus = 'B2C' | 'B2B_PERIODIC' | 'B2B_SPECIAL';

// Types pour les choix de l'Étape 2
type BuildingAge = 'LESS_10' | 'MORE_10';
type BuildingUsage = 'PRIVATE_50' | 'PRO_EXCL' | 'MIXED';
type WorkNature = 'RENOVATION' | 'HEAT_PUMP' | 'SOLAR_INSULATION' | 'DEMOLITION_RECONSTRUCTION';
type OutdoorWork = 'NONE' | 'MAINTENANCE' | 'LANDSCAPING';

const translations = {
  FR: {
    title: 'DigiBât VAT / DigiBouw BTW',
    subtitle: 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026',
    badge: '✓ Conforme réformes 2025-2026',

    // Étapes du stepper
    step1Title: 'Profil du Client',
    step1Sub: 'Vérifiez la qualité fiscale de votre client',
    step2Title: 'Bien & Travaux',
    step2Sub: 'Décrivez le bien et la nature des travaux',
    step3Title: 'Résultat & Facture',
    step3Sub: 'Verdict fiscal et mentions légales à insérer',

    // Étape 1
    step1Header: 'Étape 1 : Profil du Client',
    clientNameLabel: 'NOM / ENTREPRISE',
    clientNamePlaceholder: 'ex: Vicernant(NV)',
    countryLabel: 'PAYS',
    statusLabel: 'STATUT TVA DU CLIENT',
    statusB2C: 'Particulier (B2C - Non assujetti)',
    statusB2BPeriodic: 'Assujetti B2B avec déclarations périodiques (Art. 20)',
    statusB2BSpecial: 'Assujetti B2B régimes spéciaux / non établi',
    vatLabel: 'NUMÉRO DE TVA',
    vatPlaceholder: 'BE0400075312',
    verifyVies: 'Vérifier VIES',
    viesSuccess: '✓ Numéro TVA valide dans VIES (Assujetti)',
    nextStep1: 'Suivant : Bien & Travaux →',

    // Étape 2 - En-tête
    step2HeaderTitle: 'Bien & Travaux',
    step2HeaderSub: 'Décrivez le bien et la nature des travaux.',

    // Étape 2 - Ancienneté
    ageLabel: 'Ancienneté du bâtiment',
    ageLess10: 'Moins de 10 ans',
    ageMore10: 'Plus de 10 ans',

    // Étape 2 - Usage
    usageLabel: 'Usage du bâtiment',
    usagePrivate50: 'Plus de 50% privé',
    usageProExcl: 'Professionnel exclusif',
    usageMixed: 'Mixte (privé + pro)',

    // Étape 2 - Nature des travaux (4 fonctions)
    workNatureLabel: 'Nature des travaux',
    workRenovation: 'Rénovation & Entretien standard',
    workHeatPump: 'Pompe à chaleur',
    workSolar: 'Panneaux solaires & Isolation',
    workDemolition: 'Démolition & Reconstruction',

    // Étape 2 - Travaux extérieurs / Espaces verts
    outdoorLabel: 'Travaux extérieurs / Espaces verts (optionnel)',
    outdoorSub: "Cochez uniquement si la prestation porte sur l'entretien ou l'aménagement d'espaces verts (jardin, terrasse, pavage...).",
    outdoorBadge: 'optionnel',
    outdoorNone: "Ne s'applique pas",
    outdoorMaintenanceTitle: 'Entretien courant',
    outdoorMaintenanceDesc: '(Tonte, taille de haies, entretien des plantes...)',
    outdoorLandscapingTitle: 'Aménagement & Gros travaux',
    outdoorLandscapingDesc: "(Terrasse, pavage, drainage, abattage d'arbre...)",

    // Boutons navigation
    prevStep: '← Retour',
    getVerdict: 'Obtenir le verdict →',

    // Historique
    historyTitle: 'Historique des déterminations',
    historyEmpty: 'Aucune détermination enregistrée.',
  },
  NL: {
    title: 'DigiBât VAT / DigiBouw BTW',
    subtitle: 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026',
    badge: '✓ Conform hervormingen 2025-2026',

    // Stepper
    step1Title: 'Klantprofiel',
    step1Sub: 'Controleer de fiscale status van uw klant',
    step2Title: 'Onroerend goed & Werken',
    step2Sub: 'Beschrijf het goed en de aard van de werken',
    step3Title: 'Resultaat & Factuur',
    step3Sub: 'Fiscaal verdict en te vermelden wetteksten',

    // Stap 1
    step1Header: 'Stap 1 : Klantprofiel',
    clientNameLabel: 'NAAM / ONDERNEMING',
    clientNamePlaceholder: 'bv. Vicernant(NV)',
    countryLabel: 'LAND',
    statusLabel: 'BTW-STATUS VAN DE KLANT',
    statusB2C: 'Particulier (B2C - Niet-btw-plichtige)',
    statusB2BPeriodic: 'Btw-plichtige B2B met periodieke aangiften (Art. 20)',
    statusB2BSpecial: 'Btw-plichtige B2B bijzondere regelingen',
    vatLabel: 'BTW-NUMMER',
    vatPlaceholder: 'BE0400075312',
    verifyVies: 'VIES Controleren',
    viesSuccess: '✓ Geldig btw-nummer in VIES (Btw-plichtige)',
    nextStep1: 'Volgende: Onroerend goed & Werken →',

    // Stap 2 - Header
    step2HeaderTitle: 'Onroerend goed & Werken',
    step2HeaderSub: 'Beschrijf het goed en de aard van de werken.',

    // Stap 2 - Ouderdom
    ageLabel: 'Ouderdom van het gebouw',
    ageLess10: 'Minder dan 10 jaar',
    ageMore10: 'Ouder dan 10 jaar',

    // Stap 2 - Gebruik
    usageLabel: 'Gebruik van het gebouw',
    usagePrivate50: 'Meer dan 50% privé',
    usageProExcl: 'Uitsluitend professioneel',
    usageMixed: 'Gemengd (privé + pro)',

    // Stap 2 - Aard van de werken (4 functies)
    workNatureLabel: 'Aard van de werken',
    workRenovation: 'Standaard onderhoud en renovatie',
    workHeatPump: 'Warmtepomp',
    workSolar: 'Zonnepanelen & Isolatie',
    workDemolition: 'Sloop & Heropbouw',

    // Stap 2 - Buitenwerken / Groenzones
    outdoorLabel: 'Buitenwerken / Groenzones (optioneel)',
    outdoorSub: 'Vink alleen aan als de dienst betrekking heeft op het onderhoud of de aanleg van groenzones (tuin, terras, bestrating...).',
    outdoorBadge: 'optioneel',
    outdoorNone: 'Niet van toepassing',
    outdoorMaintenanceTitle: 'Lopend onderhoud',
    outdoorMaintenanceDesc: '(Gras maaien, hagen scheren, verzorging planten...)',
    outdoorLandscapingTitle: 'Aanleg & Grote werken',
    outdoorLandscapingDesc: '(Terras, bestrating, drainage, bomen kappen...)',

    // Navigatie
    prevStep: '← Terug',
    getVerdict: 'Verdict bekijken →',

    // Historiek
    historyTitle: 'Historiek van bepalingen',
    historyEmpty: 'Geen bepalingen geregistreerd.',
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>('FR');
  const [currentStep, setCurrentStep] = useState<number>(2); // Étape 2 active

  // Données Étape 1
  const [clientName, setClientName] = useState<string>('Vicernant(NV)');
  const [country, setCountry] = useState<string>('BE');
  const [status, setStatus] = useState<ClientStatus>('B2B_PERIODIC');
  const [vatNumber, setVatNumber] = useState<string>('BE0400075312');
  const [viesVerified, setViesVerified] = useState<boolean>(true);

  // Données Étape 2 (Boutons/Cartes)
  const [buildingAge, setBuildingAge] = useState<BuildingAge>('MORE_10');
  const [buildingUsage, setBuildingUsage] = useState<BuildingUsage>('PRIVATE_50');
  const [workNature, setWorkNature] = useState<WorkNature>('RENOVATION');
  const [outdoorWork, setOutdoorWork] = useState<OutdoorWork>('NONE');

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* En-tête de l'application */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl text-xl font-bold">
            🏢
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-xs text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
            {t.badge}
          </span>

          {/* Switch de langue FR / NL */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setLang('FR')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                lang === 'FR'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLang('NL')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                lang === 'NL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              NL
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Barre d'étapes (Stepper) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-3 text-left focus:outline-none"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step1Title}</p>
                <p className="text-xs text-slate-400">{t.step1Sub}</p>
              </div>
            </button>

            <div className="h-0.5 w-12 bg-slate-200"></div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-3 text-left focus:outline-none"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step2Title}</p>
                <p className="text-xs text-slate-400">{t.step2Sub}</p>
              </div>
            </button>

            <div className="h-0.5 w-12 bg-slate-200"></div>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-3 text-left focus:outline-none"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === 3
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step3Title}</p>
                <p className="text-xs text-slate-400">{t.step3Sub}</p>
              </div>
            </button>
          </div>

          {/* ÉTAPE 1 - PROFIL CLIENT */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
                {t.step1Header}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.clientNameLabel}
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={t.clientNamePlaceholder}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.countryLabel}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="BE">Belgique / België (BE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="NL">Nederland (NL)</option>
                    <option value="DE">Deutschland (DE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {t.statusLabel}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClientStatus)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="B2C">{t.statusB2C}</option>
                  <option value="B2B_PERIODIC">{t.statusB2BPeriodic}</option>
                  <option value="B2B_SPECIAL">{t.statusB2BSpecial}</option>
                </select>
              </div>

              {status !== 'B2C' && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    {t.vatLabel}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={vatNumber}
                      onChange={(e) => {
                        setVatNumber(e.target.value);
                        setViesVerified(false);
                      }}
                      placeholder={t.vatPlaceholder}
                      className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm font-mono bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setViesVerified(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 rounded-lg transition"
                    >
                      {t.verifyVies}
                    </button>
                  </div>

                  {viesVerified && (
                    <p className="text-xs text-emerald-700 font-bold pt-1">
                      {t.viesSuccess}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow transition"
                >
                  {t.nextStep1}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 - BIEN & TRAVAUX (Design visuel des images 1 & 2) */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              {/* En-tête Étape 2 */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t.step2HeaderTitle}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {t.step2HeaderSub}
                </p>
              </div>

              {/* 1. Ancienneté du bâtiment */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-800">
                  {t.ageLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBuildingAge('LESS_10')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      buildingAge === 'LESS_10'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">📅</span>
                    <span>{t.ageLess10}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuildingAge('MORE_10')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      buildingAge === 'MORE_10'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🕒</span>
                    <span>{t.ageMore10}</span>
                  </button>
                </div>
              </div>

              {/* 2. Usage du bâtiment */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-800">
                  {t.usageLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setBuildingUsage('PRIVATE_50')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      buildingUsage === 'PRIVATE_50'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🏠</span>
                    <span>{t.usagePrivate50}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuildingUsage('PRO_EXCL')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      buildingUsage === 'PRO_EXCL'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🏢</span>
                    <span>{t.usageProExcl}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuildingUsage('MIXED')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      buildingUsage === 'MIXED'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🧱</span>
                    <span>{t.usageMixed}</span>
                  </button>
                </div>
              </div>

              {/* 3. Nature des travaux (4 FONCTIONS DEMANDÉES) */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-slate-800">
                  {t.workNatureLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Fonction 1: Standaard onderhoud en renovatie / Rénovation standard */}
                  <button
                    type="button"
                    onClick={() => setWorkNature('RENOVATION')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      workNature === 'RENOVATION'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🔨</span>
                    <span>{t.workRenovation}</span>
                  </button>

                  {/* Fonction 2: Pompe à chaleur / Warmtepomp */}
                  <button
                    type="button"
                    onClick={() => setWorkNature('HEAT_PUMP')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      workNature === 'HEAT_PUMP'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🔥</span>
                    <span>{t.workHeatPump}</span>
                  </button>

                  {/* Fonction 3: Panneaux solaires & Isolation / Zonnepanelen & Isolatie */}
                  <button
                    type="button"
                    onClick={() => setWorkNature('SOLAR_INSULATION')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      workNature === 'SOLAR_INSULATION'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">☀️</span>
                    <span>{t.workSolar}</span>
                  </button>

                  {/* Fonction 4: Démolition & Reconstruction / Sloop & Heropbouw */}
                  <button
                    type="button"
                    onClick={() => setWorkNature('DEMOLITION_RECONSTRUCTION')}
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition text-left font-semibold text-sm ${
                      workNature === 'DEMOLITION_RECONSTRUCTION'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🏢</span>
                    <span>{t.workDemolition}</span>
                  </button>
                </div>
              </div>

              {/* 4. Travaux extérieurs / Espaces verts (optionnel) - Image 2 */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 text-lg">🍃</span>
                    <h3 className="font-bold text-slate-800 text-sm">
                      {t.outdoorLabel}
                    </h3>
                    <span className="bg-slate-200 text-slate-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {t.outdoorBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.outdoorSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Option: Ne s'applique pas */}
                  <button
                    type="button"
                    onClick={() => setOutdoorWork('NONE')}
                    className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center transition ${
                      outdoorWork === 'NONE'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-bold ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-semibold'
                    }`}
                  >
                    <span className="text-2xl mb-2">🚫</span>
                    <span className="text-sm">{t.outdoorNone}</span>
                  </button>

                  {/* Option: Entretien courant */}
                  <button
                    type="button"
                    onClick={() => setOutdoorWork('MAINTENANCE')}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center transition ${
                      outdoorWork === 'MAINTENANCE'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-bold ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">🌱</span>
                    <span className="text-xs font-bold text-slate-900 mt-1">
                      🪴 {t.outdoorMaintenanceTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {t.outdoorMaintenanceDesc}
                    </span>
                  </button>

                  {/* Option: Aménagement & Gros travaux */}
                  <button
                    type="button"
                    onClick={() => setOutdoorWork('LANDSCAPING')}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center transition ${
                      outdoorWork === 'LANDSCAPING'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-bold ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">🏗️</span>
                    <span className="text-xs font-bold text-slate-900 mt-1">
                      🏗️ {t.outdoorLandscapingTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {t.outdoorLandscapingDesc}
                    </span>
                  </button>
                </div>
              </div>

              {/* Boutons de bas de page */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-sm px-4 py-2 transition"
                >
                  {t.prevStep}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition"
                >
                  {t.getVerdict}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 - RÉSULTAT */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
                {t.step3Title}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900">
                <p className="font-bold text-sm">✓ Verdict Fiscal Belgique 2025-2026</p>
                <p className="text-xs mt-1">
                  Taux TVA applicable : <strong className="text-sm">6% (Avis de rénovation)</strong> ou Autoliquidation Art. 20 selon le profil du client.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-sm"
                >
                  {t.prevStep}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Historique latéral */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center space-x-2">
            <span>📜</span>
            <span>{t.historyTitle}</span>
          </h3>
          <div className="py-12 text-center">
            <p className="text-xs text-slate-400 italic">{t.historyEmpty}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
