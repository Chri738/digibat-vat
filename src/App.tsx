import { useState } from 'react';
import { calculateBelgianVat } from './vatEngine';
import { VatInput, ClientType, PropertyUsage } from './types/vat';

type Step = 1 | 2 | 3;
type WorkType = 'RENOVATION' | 'HEAT_PUMP' | 'DEMOLITION' | 'GARDEN_MAINTENANCE' | 'GARDEN_HEAVY';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const [history, setHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Données du formulaire
  const [clientName, setClientName] = useState('');
  const [vatNumber, setVatNumber] = useState('BE0828033669');
  const [clientType, setClientType] = useState<ClientType>('INDIVIDUAL');
  const [countryCode, setCountryCode] = useState('BE');
  const [submitsPeriodicVat, setSubmitsPeriodicVat] = useState(false);

  const [usage, setUsage] = useState<PropertyUsage>('PRIVATE');
  const [firstOccupancyYear, setFirstOccupancyYear] = useState(2010);
  const [privatePercentage, setPrivatePercentage] = useState(100);

  const [workType, setWorkType] = useState<WorkType>('RENOVATION');
  const [outdoorWork, setOutdoorWork] = useState<'NONE' | 'MAINTENANCE' | 'HEAVY'>('NONE');

  // Calcul dynamique du moteur
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
      targetScope: 'ENTIRE_BUILDING',
      description: workType,
    },
  };

  const result = calculateBelgianVat(input);

  // Ancienneté du bâtiment
  const currentYear = new Date().getFullYear();
  const buildingAge = currentYear - firstOccupancyYear;

  // Libellé de la nature des travaux
  const getWorkTypeName = () => {
    switch (workType) {
      case 'RENOVATION': return 'Rénovation standard';
      case 'HEAT_PUMP': return 'Pompe à chaleur';
      case 'DEMOLITION': return 'Démolition & Reconstruction';
      default: return 'Travaux immobiliers';
    }
  };

  // Gestion du bouton Copier la mention
  const handleCopyMention = () => {
    const textToCopy = result.legalMentionText || "Taux de TVA normal de 21% applicable.";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Gestion de l'enregistrement dans l’historique
  const handleSaveToHistory = () => {
    const mainRate = result.rates[0]?.rate || 21;
    const newEntry = {
      date: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }),
      client: clientName || 'Client anonyme',
      regime: result.taxRegime,
      rates: `${mainRate}%`,
    };
    setHistory([newEntry, ...history]);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  // Réinitialiser / Recommencer
  const handleReset = () => {
    setCurrentStep(1);
    setClientName('');
  };

  // Styles de la bannière selon le régime fiscal
  const getBannerStyle = () => {
    const mainRate = result.rates[0]?.rate;
    if (result.taxRegime === 'REVERSE_CHARGE' || result.isReverseCharge) {
      return {
        bg: 'bg-indigo-700',
        badgeBg: 'bg-indigo-800/60',
        text: 'Cocontractant — Autoliquidation',
        alertBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      };
    }
    if (mainRate === 6) {
      return {
        bg: 'bg-emerald-600',
        badgeBg: 'bg-emerald-700/60',
        text: 'Taux réduit 6% — Logement privé',
        alertBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      };
    }
    if (mainRate === 12) {
      return {
        bg: 'bg-blue-600',
        badgeBg: 'bg-blue-700/60',
        text: 'Taux réduit 12% — Logement social / Rénovation',
        alertBg: 'bg-blue-100 text-blue-900 border-blue-200',
      };
    }
    return {
      bg: 'bg-rose-700',
      badgeBg: 'bg-rose-800/60',
      text: usage === 'PROFESSIONAL' 
        ? 'Taux normal 21% — Usage professionnel exclusif'
        : 'Taux normal 21% — Condition d\'application non remplie',
      alertBg: 'bg-rose-100 text-rose-900 border-rose-200',
    };
  };

  const bannerStyle = getBannerStyle();

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
        
        {/* Colonne Gauche : Formulaire & Verdict */}
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
              onClick={() => setCurrentStep(2)}
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
                    <div className="font-bold text-sm text-slate-800">Rénovation standard</div>
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
                    <div className="font-bold text-sm text-slate-800">Pompe à chaleur</div>
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
                    <div className="font-bold text-sm text-slate-800">Démolition & Reconstruction</div>
                  </button>
                </div>
              </div>

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

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-600 font-medium text-sm hover:underline"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md transition"
                >
                  Obtenir le verdict ➔
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RÉSULTAT FISCAL ET IMPRESSION */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
              
              {/* 1. BANNIÈRE ROUGE / VERTE / BLEUE DU VERDICT FISCAL */}
              <div className={`${bannerStyle.bg} text-white p-6 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-white/80 font-bold block">
                    VERDICT FISCAL
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {bannerStyle.text}
                  </h2>
                </div>

                {/* Badge Taux Appliqué */}
                <div className={`${bannerStyle.badgeBg} border border-white/20 rounded-2xl p-4 text-center min-w-[120px]`}>
                  <div className="text-3xl font-black">
                    {result.rates[0]?.rate || 21}%
                  </div>
                  <div className="text-[11px] font-medium text-white/90 uppercase tracking-wider">
                    Taux appliqué
                  </div>
                </div>
              </div>

              {/* CONTENU DE LA MOTIVATION ET DES MENTIONS LÉGALES */}
              <div className="p-6 space-y-6">
                
                {/* 2. MOTIVATION */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                    <span className="text-blue-600">⚖️</span>
                    <span>Motivation</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {usage === 'PROFESSIONAL'
                      ? "Usage professionnel exclusif : le taux normal de 21% s'applique. Le taux réduit de 6% est réservé à l'habitation privée."
                      : buildingAge < 10 && workType === 'RENOVATION'
                      ? `L'immeuble a ${buildingAge} ans d'ancienneté (moins de 10 ans). Le taux réduit de 6% requiert au moins 10 ans d'occupation. Le taux normal de 21% s'applique.`
                      : result.taxRegime === 'REVERSE_CHARGE'
                      ? "Prestation réalisée pour un assujetti à la TVA avec déclarations périodiques. Application du régime du cocontractant (autoliquidation de la TVA par le client)."
                      : "Application du taux réduit de 6% conformément au Tableau A, Rubrique XXXVIII de l'AR n° 20 (logement privé de plus de 10 ans)."}
                  </p>
                </div>

                {/* 3. MENTION LÉGALE À INSÉRER SUR LA FACTURE */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                      <span className="text-blue-600">📑</span>
                      <span>Mention légale à insérer sur la facture</span>
                    </div>
                    
                    {/* Bouton Copier */}
                    <button
                      onClick={handleCopyMention}
                      className="flex items-center space-x-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      <span>📋</span>
                      <span>{copied ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans shadow-inner">
                    "{result.legalMentionText || "Taux de TVA normal de 21% applicable. En l'absence de contestation écrite dans un délai d'un mois, le client final est responsable du respect des critères d'application."}"
                  </div>
                </div>

                {/* 4. RÉFÉRENCES LÉGALES (BADGES / PILLS) */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                    <span className="text-blue-600">📄</span>
                    <span>Références légales</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-6">
                    {result.legalReferences && result.legalReferences.length > 0 ? (
                      result.legalReferences.map((ref, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg"
                        >
                          {ref}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                          AR n° 20, Annexe, Tableau A, Rubrique XXXVIII
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 5. RÉCAPITULATIF DES CRITÈRES DANS UN BLOC GRIS */}
                <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-600">
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">BTW / TVA</span>
                    <span className="font-semibold text-slate-800">{vatNumber || 'Non renseigné'}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ancienneté</span>
                    <span className="font-semibold text-slate-800">
                      {buildingAge >= 10 ? 'Plus de 10 ans' : `${buildingAge} ans`}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nature des travaux</span>
                    <span className="font-semibold text-slate-800">{getWorkTypeName()}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">Surface / Usage</span>
                    <span className="font-semibold text-slate-800">
                      {usage === 'PRIVATE' ? '100% Privé' : usage === 'PROFESSIONAL' ? 'Professionnel' : 'Mixte'}
                    </span>
                  </div>
                </div>

                {/* 6. BOUTONS D'ACTION (RECOMMENCER, ENREGISTRER ET IMPRIMER) */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-slate-200">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Recommencer</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={handleSaveToHistory}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <span>💾</span>
                      <span>Enregistrer</span>
                    </button>

                    {/* BOUTON IMPRIMER VERT VISIBLE */}
                    <button
                      onClick={() => window.print()}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <span>🖨️</span>
                      <span>Imprimer la fiche justificative</span>
                    </button>
                  </div>
                </div>

                {/* Toast de confirmation d'enregistrement */}
                {savedNotification && (
                  <div className="bg-emerald-500 text-white text-xs font-bold p-3 rounded-lg text-center transition">
                    ✓ Détermination enregistrée avec succès dans l'historique !
                  </div>
                )}

              </div>

              {/* 7. BANNIÈRE D'ALERTE EN BAS (ROUGE, VERTE OU INDIGO) */}
              <div className={`p-3 text-center text-xs font-bold border-t ${bannerStyle.alertBg}`}>
                Taux {result.rates[0]?.rate || 21}% — {bannerStyle.text}
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
