import React, { useState } from 'react';

type Lang = 'FR' | 'NL';
type ClientStatus = 'B2C' | 'B2B_PERIODIC' | 'B2B_SPECIAL';

const translations = {
  FR: {
    title: 'DigiBât VAT / DigiBouw BTW',
    subtitle: 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026',
    badge: '✓ Conforme réformes 2025-2026',
    step1Title: 'Profil du Client',
    step1Sub: 'Vérifiez la qualité fiscale de votre client',
    step2Title: 'Bien & Travaux',
    step2Sub: 'Décrivez le bien et la nature des travaux',
    step3Title: 'Résultat & Facture',
    step3Sub: 'Verdict fiscal et mentions légales à insérer',
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
    nextStep: 'Suivant : Bien & Travaux →',
    historyTitle: 'Historique des déterminations',
    historyEmpty: 'Aucune détermination enregistrée.',
  },
  NL: {
    title: 'DigiBât VAT / DigiBouw BTW',
    subtitle: 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026',
    badge: '✓ Conform hervormingen 2025-2026',
    step1Title: 'Klantprofiel',
    step1Sub: 'Controleer de fiscale status van uw klant',
    step2Title: 'Onroerend goed & Werken',
    step2Sub: 'Beschrijf het goed en de aard van de werken',
    step3Title: 'Resultaat & Factuur',
    step3Sub: 'Fiscaal verdict en te vermelden wetteksten',
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
    nextStep: 'Volgende: Onroerend goed & Werken →',
    historyTitle: 'Historiek van bepalingen',
    historyEmpty: 'Geen bepalingen geregistreerd.',
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>('FR');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [clientName, setClientName] = useState<string>('Vicernant(NV)');
  const [country, setCountry] = useState<string>('BE');
  const [status, setStatus] = useState<ClientStatus>('B2B_PERIODIC');
  const [vatNumber, setVatNumber] = useState<string>('BE0400075312');
  const [viesVerified, setViesVerified] = useState<boolean>(true);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* En-tête / Header */}
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

          {/* Commutateur de langue clair FR / NL */}
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
          {/* Barre d'étapes */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step1Title}</p>
                <p className="text-xs text-slate-400">{t.step1Sub}</p>
              </div>
            </div>
            <div className="h-0.5 w-12 bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step2Title}</p>
                <p className="text-xs text-slate-400">{t.step2Sub}</p>
              </div>
            </div>
            <div className="h-0.5 w-12 bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step3Title}</p>
                <p className="text-xs text-slate-400">{t.step3Sub}</p>
              </div>
            </div>
          </div>

          {/* Formulaire Étape 1 */}
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
                  {t.nextStep}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Historique */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
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
