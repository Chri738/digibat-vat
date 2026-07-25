import { useState } from 'react';
import { calculateBelgianVat } from './vatEngine';
import { VatInput, ClientType, PropertyUsage, TargetScope } from './types/vat';

type Step = 1 | 2 | 3;
type WorkType = 'RENOVATION' | 'HEAT_PUMP' | 'DEMOLITION' | 'GARDEN_MAINTENANCE' | 'GARDEN_HEAVY';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const [history, setHistory] = useState<any[]>([]);

  // Données du formulaire
  const [clientName, setClientName] = useState('');
  const [vatNumber, setVatNumber] = useState('BE0400378485');
  const [clientType, setClientType] = useState<ClientType>('INDIVIDUAL');
  const [countryCode, setCountryCode] = useState('BE');
  const [submitsPeriodicVat, setSubmitsPeriodicVat] = useState(false);

  const [usage, setUsage] = useState<PropertyUsage>('PRIVATE');
  const [firstOccupancyYear, setFirstOccupancyYear] = useState(2010);
  const [privatePercentage, setPrivatePercentage] = useState(100);

  const [workType, setWorkType] = useState<WorkType>('RENOVATION');
  const [outdoorWork, setOutdoorWork] = useState<'NONE' | 'MAINTENANCE' | 'HEAVY'>('NONE');

  // Moteur de calcul
  const input: VatInput = {
    transaction: {
      issueDate: new Date().toISOString().split('T')[0],
      currency: 'EUR',
    },
    client: {
      type: clientType,
      countryCode,
      vatNumber,
      submitsPeriodicVatReturns: submitsPeriodicVat,
    },
    property: {
      countryCode: 'BE',
      usage,
      firstOccupancyYear,
      privateUsePercentage: usage === 'MIXED' ? privatePercentage : 100,
    },
    service: {
      isRealEstateWork: outdoorWork !== 'MAINTENANCE',
      targetScope: usage === 'MIXED' ? 'ENTIRE_BUILDING' : 'ENTIRE_BUILDING',
      description: workType,
    },
  };

  const result = calculateBelgianVat(input);

  const handleCalculate = () => {
    setCurrentStep(3);
    const newEntry = {
      date: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }),
      client: clientName || 'Client anonyme',
      regime: result.taxRegime,
      rates: result.rates.map(r => `${r.rate}%`).join(' / '),
    };
    setHistory([newEntry, ...history]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* En-tête */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl text-xl font-bold">
            🏢
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              DigiBât VAT / DigiBouw BTW
            </h1>
            <p className="text-xs text-slate-500">
              Détermination TVA « Travaux immobiliers » — Belgique 2025-2026
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Conforme réformes 2025-2026
          </span>
          <button
            onClick={() => setLang(lang === 'FR' ? 'NL' : 'FR')}
            className="border border-slate-300 rounded-lg px-3 py-1 text-xs font-semibold hover:bg-slate-100"
          >
            {lang === 'FR' ? 'FR ➔ NL' : 'NL ➔ FR'}
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Gauche : Formulaire à 3 Étapes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Indicateur d'étapes */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center text-sm">
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center space-x-2 cursor-pointer ${
                currentStep === 1 ? 'font-bold text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100'
              }`}>1</span>
              <span>Profil du Client</span>
            </div>

            <div className="h-0.5 bg-slate-200 flex-1 mx-4" />

            <div
              onClick={() => currentStep >= 2 && setCurrentStep(2)}
              className={`flex items-center space-x-2 cursor-pointer ${
                currentStep === 2 ? 'font-bold text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100'
              }`}>2</span>
              <span>Bien & Travaux</span>
            </div>

            <div className="h-0.5 bg-slate-200 flex-1 mx-4" />

            <div
              className={`flex items-center space-x-2 ${
                currentStep === 3 ? 'font-bold text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100'
              }`}>3</span>
              <span>Résultat & Facture</span>
            </div>
          </div>

          {/* ÉTAPE 1 : PROFIL DU CLIENT */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">
                Étape 1 : Profil du Client
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Nom / Entreprise
                  </label>
                  <input
                    type="text"
                    placeholder="Nom du client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Pays
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BE">Belgique (BE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="NL">Pays-Bas (NL)</option>
                    <option value="DE">Allemagne (DE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Numéro de TVA
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-300 text-blue-900 font-medium text-xs px-4 rounded-lg hover:bg-blue-400">
                    Vérifier VIES
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Statut Assujetti à la TVA
                </label>
                <select
                  value={clientType === 'INDIVIDUAL' ? 'INDIVIDUAL' : submitsPeriodicVat ? 'VAT_PERIODIC' : 'VAT_NO_PERIODIC'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'INDIVIDUAL') {
                      setClientType('INDIVIDUAL');
                      setSubmitsPeriodicVat(false);
                    } else if (val === 'VAT_PERIODIC') {
                      setClientType('COMPANY');
                      setSubmitsPeriodicVat(true);
                    } else {
                      setClientType('COMPANY');
                      setSubmitsPeriodicVat(false);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INDIVIDUAL">Particulier (Non assujetti)</option>
                  <option value="VAT_PERIODIC">Assujetti avec déclarations périodiques (Art. 20)</option>
                  <option value="VAT_NO_PERIODIC">Assujetti sans déclarations (Franchisé / Exonéré)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md transition"
                >
                  Suivant : Bien & Travaux ➔
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : BIEN & TRAVAUX */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">
                Étape 2 : Bien & Travaux
              </h2>

              {/* Usage & Ancienneté */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Usage du bâtiment
                  </label>
                  <select
                    value={usage}
                    onChange={(e) => setUsage(e.target.value as PropertyUsage)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PRIVATE">Logement Privé</option>
                    <option value="PROFESSIONAL">Bâtiment Professionnel</option>
                    <option value="MIXED">Usage Mixte (Privé + Professionnel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Année de 1ère occupation
                  </label>
                  <input
                    type="number"
                    value={firstOccupancyYear}
                    onChange={(e) => setFirstOccupancyYear(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Nature des travaux */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Nature des travaux
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setWorkType('RENOVATION')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'RENOVATION'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🔨</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">Rénovation standard</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkType('HEAT_PUMP')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'HEAT_PUMP'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">♨️</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">Pompe à chaleur</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkType('DEMOLITION')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'DEMOLITION'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">🏢</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">Démolition & Reconstruction</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Travaux extérieurs / Espaces verts */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-700">🌱</span>
                  <span className="font-bold text-sm text-slate-800">
                    Travaux extérieurs / Espaces verts
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    optionnel
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setOutdoorWork('NONE')}
                    className={`p-3 rounded-lg border text-center text-xs font-semibold ${
                      outdoorWork === 'NONE'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    🚫 Ne s'applique pas
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutdoorWork('MAINTENANCE')}
                    className={`p-3 rounded-lg border text-center text-xs font-semibold ${
                      outdoorWork === 'MAINTENANCE'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    🌱 Entretien courant (Tonte, taille...)
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutdoorWork('HEAVY')}
                    className={`p-3 rounded-lg border text-center text-xs font-semibold ${
                      outdoorWork === 'HEAVY'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    🏗️ Aménagement & Gros travaux (Terrasse...)
                  </button>
                </div>
              </div>

              {/* Boutons de navigation */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-600 font-medium text-sm hover:underline"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleCalculate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md transition"
                >
                  Obtenir le verdict ➔
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RÉSULTAT & FACTURE (AVEC LES TEXTES DE LOI) */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-bold text-slate-800">
                  Étape 3 : Résultat & Mention Légale Facture
                </h2>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  ✏️ Modifier la saisie
                </button>
              </div>

              {/* Résumé du Taux */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                    Régime Fiscal Déterminé
                  </span>
                  <span className="text-lg font-extrabold text-blue-700">
                    {result.taxRegime}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                    Taux de TVA Applicable
                  </span>
                  {result.rates.map((r, i) => (
                    <div key={i} className="text-xl font-extrabold text-slate-800">
                      {r.rate}% <span className="text-xs font-normal text-slate-500">({r.percentageOfTotal}% de la facture)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TEXTE DE LOI / MENTION OBLIGATOIRE (S'affiche systématiquement !) */}
              <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-xl space-y-3">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm uppercase tracking-wide">
                  <span>📜 Mention obligatoire à faire figurer sur la facture</span>
                  {result.legalMentionCode && (
                    <span className="bg-amber-200 text-amber-900 text-xs px-2 py-0.5 rounded">
                      {result.legalMentionCode}
                    </span>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-200 text-sm text-slate-800 italic leading-relaxed shadow-inner">
                  "{result.legalMentionText || "TVA acquittée par l'assujetti selon les règles générales du Code de la TVA belge."}"
                </div>

                {/* Références réglementaires */}
                {result.legalReferences && result.legalReferences.length > 0 && (
                  <div className="text-xs text-amber-800 font-medium pt-1">
                    <strong>Base légale / Textes de loi :</strong> {result.legalReferences.join(' • ')}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg"
                >
                  Nouveau calcul
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow"
                >
                  🖨️ Imprimer la fiche justificative
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Colonne Droite : Historique des Déterminations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3">
            <span className="text-lg">📜</span>
            <h2 className="font-bold text-slate-800 text-sm">
              Historique des déterminations
            </h2>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6 italic">
              Aucune détermination enregistrée.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{item.client}</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Régime : {item.regime}</span>
                    <span className="font-bold text-blue-600">{item.rates}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
