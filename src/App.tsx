import { useState } from 'react';
import { calculateBelgianVat } from './vatEngine';
import { VatInput, ClientType, PropertyUsage } from './types/vat';

type Step = 1 | 2 | 3;
type WorkType = 'RENOVATION' | 'HEAT_PUMP' | 'DEMOLITION' | 'GARDEN_MAINTENANCE' | 'GARDEN_HEAVY';

// --- DICTIONNAIRE DE TRADUCTION / VERTAALWOORDENBOEK ---
const translations = {
  FR: {
    title: "DigiBât VAT / DigiBouw BTW",
    subtitle: "Détermination TVA « Travaux immobiliers » — Belgique 2025-2026",
    badgeCompliance: "✓ Conforme réformes 2025-2026",
    langToggle: "NL",
    steps: {
      client: "Profil du Client",
      property: "Bien & Travaux",
      result: "Résultat & Facture"
    },
    step1: {
      title: "Étape 1 : Profil du Client",
      clientName: "Nom / Entreprise",
      country: "Pays",
      vatNumber: "Numéro de TVA",
      verifyVies: "Vérifier VIES",
      statusLabel: "Statut Assujetti à la TVA",
      individual: "Particulier (Non assujetti)",
      vatPeriodic: "Assujetti avec déclarations périodiques (Art. 20)",
      vatNoPeriodic: "Assujetti sans déclarations (Franchisé / Exonéré)",
      next: "Suivant : Bien & Travaux ➔"
    },
    step2: {
      title: "Étape 2 : Bien & Travaux",
      usageLabel: "Usage du bâtiment",
      usagePrivate: "Logement Privé",
      usagePro: "Bâtiment Professionnel",
      usageMixed: "Usage Mixte (Privé + Professionnel)",
      occupancyYear: "Année de 1ère occupation",
      workTypeLabel: "Nature des travaux",
      renovation: "Rénovation standard",
      heatPump: "Pompe à chaleur",
      demolition: "Démolition & Reconstruction",
      outdoorTitle: "Travaux extérieurs / Espaces verts",
      optional: "optionnel",
      outdoorNone: "🚫 Ne s'applique pas",
      outdoorMaintenance: "🌱 Entretien courant (Tonte, taille...)",
      outdoorHeavy: "🏗️ Aménagement & Gros travaux (Terrasse...)",
      back: "← Retour",
      calculate: "Obtenir le verdict ➔"
    },
    step3: {
      verdictTitle: "VERDICT FISCAL",
      rateApplied: "Taux appliqué",
      motivationTitle: "Motivation",
      mentionTitle: "Mention légale à insérer sur la facture",
      copy: "Copier",
      copied: "Copié !",
      legalRefTitle: "Références légales",
      recapVat: "BTW / TVA",
      recapAge: "Ancienneté",
      recapWork: "Nature des travaux",
      recapUsage: "Surface / Usage",
      btnReset: "Recommencer",
      btnSave: "Enregistrer",
      btnPrint: "Imprimer la fiche justificative",
      savedSuccess: "✓ Détermination enregistrée avec succès dans l'historique !",
      ageOver10: "Plus de 10 ans",
      ageYears: "ans",
      usage100Private: "100% Privé",
      usageProOnly: "Professionnel",
      usageMixedText: "Mixte"
    },
    history: {
      title: "Historique des déterminations",
      empty: "Aucune détermination enregistrée.",
      regime: "Régime"
    }
  },
  NL: {
    title: "DigiBât VAT / DigiBouw BTW",
    subtitle: "Btw-bepaling « Werken in onroerende staat » — België 2025-2026",
    badgeCompliance: "✓ Conform hervormingen 2025-2026",
    langToggle: "FR",
    steps: {
      client: "Klantprofiel",
      property: "Pand & Werken",
      result: "Resultaat & Factuur"
    },
    step1: {
      title: "Stap 1: Klantprofiel",
      clientName: "Naam / Bedrijf",
      country: "Land",
      vatNumber: "Btw-nummer",
      verifyVies: "VIES controleren",
      statusLabel: "Btw-status van de klant",
      individual: "Particulier (Niet btw-plichtig)",
      vatPeriodic: "Btw-plichtige met periodieke aangiften (Art. 20)",
      vatNoPeriodic: "Btw-plichtige zonder periodieke aangiften (Kleine onderneming)",
      next: "Volgende: Pand & Werken ➔"
    },
    step2: {
      title: "Stap 2: Pand & Werken",
      usageLabel: "Gebruik van het gebouw",
      usagePrivate: "Privéwoning",
      usagePro: "Beroepsgebouw",
      usageMixed: "Gemengd gebruik (Privé + Beroep)",
      occupancyYear: "Jaar van 1ste ingebruikneming",
      workTypeLabel: "Aard van de werken",
      renovation: "Standaard renovatie",
      heatPump: "Warmtepomp",
      demolition: "Sloop & Heropbouw",
      outdoorTitle: "Buitenwerken / Groenzone",
      optional: "optioneel",
      outdoorNone: "🚫 Niet van toepassing",
      outdoorMaintenance: "🌱 Gewoon onderhoud (Maaien, snoeien...)",
      outdoorHeavy: "🏗️ Aanleg & Zware werken (Terras...)",
      back: "← Terug",
      calculate: "Fiscale uitspraak bepalen ➔"
    },
    step3: {
      verdictTitle: "FISCALE UITSPRAAK",
      rateApplied: "Toegepast tarief",
      motivationTitle: "Motivering",
      mentionTitle: "Wettelijke vermelding op de factuur",
      copy: "Kopiëren",
      copied: "Gekopieerd!",
      legalRefTitle: "Wettelijke referenties",
      recapVat: "BTW / TVA",
      recapAge: "Ouderdom",
      recapWork: "Aard der werken",
      recapUsage: "Oppervlakte / Gebruik",
      btnReset: "Opnieuw beginnen",
      btnSave: "Opslaan",
      btnPrint: "Afdrukken bewijsstuk",
      savedSuccess: "✓ Bepaling succesvol opgeslagen in de historiek!",
      ageOver10: "Meer dan 10 jaar",
      ageYears: "jaar",
      usage100Private: "100% Privé",
      usageProOnly: "Beroepsmatig",
      usageMixedText: "Gemengd"
    },
    history: {
      title: "Historiek van bepalingen",
      empty: "Nog geen bepalingen geregistreerd.",
      regime: "Stelsel"
    }
  }
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const [history, setHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const t = translations[lang];

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

  // Libellé de la nature des travaux selon la langue
  const getWorkTypeName = () => {
    switch (workType) {
      case 'RENOVATION': return t.step2.renovation;
      case 'HEAT_PUMP': return t.step2.heatPump;
      case 'DEMOLITION': return t.step2.demolition;
      default: return lang === 'FR' ? 'Travaux immobiliers' : 'Werken in onroerende staat';
    }
  };

  // Texte de motivation bilingue
  const getMotivationText = () => {
    const mainRate = result.rates[0]?.rate;
    if (usage === 'PROFESSIONAL') {
      return lang === 'FR'
        ? "Usage professionnel exclusif : le taux normal de 21% s'applique. Le taux réduit de 6% est réservé à l'habitation privée."
        : "Uitsluitend beroepsgebruik: het normale tarief van 21% is van toepassing. Het verlaagde tarief van 6% is voorbehouden voor privéwoningen.";
    }
    if (buildingAge < 10 && workType === 'RENOVATION') {
      return lang === 'FR'
        ? `L'immeuble a ${buildingAge} ans d'ancienneté (moins de 10 ans). Le taux réduit de 6% requiert au moins 10 ans d'occupation. Le taux normal de 21% s'applique.`
        : `Het gebouw is ${buildingAge} jaar oud (minder dan 10 jaar). Het verlaagd tarief van 6% vereist minstens 10 jaar inbedrijfstelling. Het normaal tarief van 21% is van toepassing.`;
    }
    if (result.taxRegime === 'REVERSE_CHARGE' || result.isReverseCharge) {
      return lang === 'FR'
        ? "Prestation réalisée pour un assujetti à la TVA avec déclarations périodiques. Application du régime du cocontractant (autoliquidation de la TVA par le client)."
        : "Dienst verricht voor een btw-plichtige met periodieke aangiften. Toepassing van de regeling medecontractant (btw te voldoen door de klant).";
    }
    if (mainRate === 6) {
      return lang === 'FR'
        ? "Application du taux réduit de 6% conformément au Tableau A, Rubrique XXXVIII de l'AR n° 20 (logement privé de plus de 10 ans)."
        : "Toepassing van het verlaagd tarief van 6% overeenkomstig Tabel A, Rubriek XXXVIII van KB nr. 20 (privéwoning ouder dan 10 jaar).";
    }
    return lang === 'FR'
      ? "Application du taux normal de 21% conformément au Code TVA belge."
      : "Toepassing van het normale tarief van 21% overeenkomstig het Belgische Btw-Wetboek.";
  };

  // Mention légale bilingue
  const getLegalMentionText = () => {
    const mainRate = result.rates[0]?.rate;
    if (result.taxRegime === 'REVERSE_CHARGE' || result.isReverseCharge) {
      return lang === 'FR'
        ? "Autoliquidation : Taxe à acquitter par le cocontractant - Art. 20 du KB n° 1."
        : "Btw verlegd: Btw te voldoen door de medecontractant - Art. 20 van KB nr. 1.";
    }
    if (mainRate === 6) {
      return lang === 'FR'
        ? "Taux de TVA : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître que l'immeuble est effectivement destiné à être utilisé principalement comme logement privé et qu'il a été mis en service il y a au moins 10 ans. (Arrêté Royal n° 20, Tableau A, Rubrique XXXVIII)."
        : "Btw-tarief: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand vanaf de ontvangst van de factuur, wordt de klant verondersteld te erkennen dat het gebouw effectief hoofdzakelijk als privéwoning wordt gebruikt en dat het ten minste 10 jaar geleden in gebruik is genomen. (Koninklijk Besluit nr. 20, Tabel A, Rubriek XXXVIII).";
    }
    return lang === 'FR'
      ? "Taux de TVA normal de 21% applicable."
      : "Normaal btw-tarief van 21% van toepassing.";
  };

  // Gestion du bouton Copier la mention
  const handleCopyMention = () => {
    const textToCopy = getLegalMentionText();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Gestion de l'enregistrement dans l’historique
  const handleSaveToHistory = () => {
    const mainRate = result.rates[0]?.rate || 21;
    const newEntry = {
      date: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }),
      client: clientName || (lang === 'FR' ? 'Client anonyme' : 'Anonieme klant'),
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

  // Styles et libellés de la bannière selon le régime fiscal
  const getBannerStyle = () => {
    const mainRate = result.rates[0]?.rate;
    if (result.taxRegime === 'REVERSE_CHARGE' || result.isReverseCharge) {
      return {
        bg: 'bg-indigo-700',
        badgeBg: 'bg-indigo-800/60',
        text: lang === 'FR' ? 'Cocontractant — Autoliquidation' : 'Medecontractant — Btw verlegd',
        alertBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      };
    }
    if (mainRate === 6) {
      return {
        bg: 'bg-emerald-600',
        badgeBg: 'bg-emerald-700/60',
        text: lang === 'FR' ? 'Taux réduit 6% — Logement privé' : 'Verlaagd tarief 6% — Privéwoning',
        alertBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      };
    }
    if (mainRate === 12) {
      return {
        bg: 'bg-blue-600',
        badgeBg: 'bg-blue-700/60',
        text: lang === 'FR' ? 'Taux réduit 12% — Logement social' : 'Verlaagd tarief 12% — Sociale huisvesting',
        alertBg: 'bg-blue-100 text-blue-900 border-blue-200',
      };
    }
    return {
      bg: 'bg-rose-700',
      badgeBg: 'bg-rose-800/60',
      text: usage === 'PROFESSIONAL' 
        ? (lang === 'FR' ? 'Taux normal 21% — Usage professionnel' : 'Normaal tarief 21% — Beroepsgebruik')
        : (lang === 'FR' ? 'Taux normal 21% — Condition non remplie' : 'Normaal tarief 21% — Voorwaarde niet voldaan'),
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
              {t.title}
            </h1>
            <p className="text-xs text-slate-500">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            {t.badgeCompliance}
          </span>
          <button
            onClick={() => setLang(lang === 'FR' ? 'NL' : 'FR')}
            className="border border-slate-300 rounded-lg px-3 py-1 text-xs font-bold hover:bg-slate-100 transition flex items-center space-x-1"
          >
            <span>🌐</span>
            <span>{t.langToggle}</span>
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
              <span>{t.steps.client}</span>
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
              <span>{t.steps.property}</span>
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
              <span>{t.steps.result}</span>
            </div>
          </div>

          {/* ÉTAPE 1 : PROFIL DU CLIENT */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">
                {t.step1.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.step1.clientName}
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Jean Dupont / BVBA Peeters"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.step1.country}
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  {t.step1.vatNumber}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-100 text-blue-900 font-medium text-xs px-4 rounded-lg hover:bg-blue-200 transition">
                    {t.step1.verifyVies}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {t.step1.statusLabel}
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
                  <option value="INDIVIDUAL">{t.step1.individual}</option>
                  <option value="VAT_PERIODIC">{t.step1.vatPeriodic}</option>
                  <option value="VAT_NO_PERIODIC">{t.step1.vatNoPeriodic}</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md transition"
                >
                  {t.step1.next}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : BIEN & TRAVAUX */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">
                {t.step2.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.step2.usageLabel}
                  </label>
                  <select
                    value={usage}
                    onChange={(e) => setUsage(e.target.value as PropertyUsage)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PRIVATE">{t.step2.usagePrivate}</option>
                    <option value="PROFESSIONAL">{t.step2.usagePro}</option>
                    <option value="MIXED">{t.step2.usageMixed}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.step2.occupancyYear}
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
                  {t.step2.workTypeLabel}
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
                    <div className="font-bold text-sm text-slate-800">{t.step2.renovation}</div>
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
                    <div className="font-bold text-sm text-slate-800">{t.step2.heatPump}</div>
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
                    <div className="font-bold text-sm text-slate-800">{t.step2.demolition}</div>
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-700">🌱</span>
                  <span className="font-bold text-sm text-slate-800">
                    {t.step2.outdoorTitle}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {t.step2.optional}
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
                    {t.step2.outdoorNone}
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
                    {t.step2.outdoorMaintenance}
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
                    {t.step2.outdoorHeavy}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-600 font-medium text-sm hover:underline"
                >
                  {t.step2.back}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md transition"
                >
                  {t.step2.calculate}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RÉSULTAT FISCAL & IMPRESSION */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
              
              {/* 1. BANNIÈRE DU VERDICT FISCAL */}
              <div className={`${bannerStyle.bg} text-white p-6 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-white/80 font-bold block">
                    {t.step3.verdictTitle}
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
                    {t.step3.rateApplied}
                  </div>
                </div>
              </div>

              {/* CONTENU DE LA MOTIVATION ET DES MENTIONS LÉGALES */}
              <div className="p-6 space-y-6">
                
                {/* 2. MOTIVATION */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                    <span className="text-blue-600">⚖️</span>
                    <span>{t.step3.motivationTitle}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {getMotivationText()}
                  </p>
                </div>

                {/* 3. MENTION LÉGALE À INSÉRER SUR LA FACTURE */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                      <span className="text-blue-600">📑</span>
                      <span>{t.step3.mentionTitle}</span>
                    </div>
                    
                    {/* Bouton Copier */}
                    <button
                      onClick={handleCopyMention}
                      className="flex items-center space-x-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      <span>📋</span>
                      <span>{copied ? t.step3.copied : t.step3.copy}</span>
                    </button>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans shadow-inner">
                    "{getLegalMentionText()}"
                  </div>
                </div>

                {/* 4. RÉFÉRENCES LÉGALES */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                    <span className="text-blue-600">📄</span>
                    <span>{t.step3.legalRefTitle}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-6">
                    <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                      {lang === 'FR' ? 'AR n° 20, Annexe, Tableau A, Rubrique XXXVIII' : 'KB nr. 20, Bijlage, Tabel A, Rubriek XXXVIII'}
                    </span>
                    {result.taxRegime === 'REVERSE_CHARGE' && (
                      <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                        {lang === 'FR' ? 'Art. 20 du KB n° 1' : 'Art. 20 van KB nr. 1'}
                      </span>
                    )}
                  </div>
                </div>

                {/* 5. RÉCAPITULATIF DES CRITÈRES */}
                <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-600">
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.step3.recapVat}</span>
                    <span className="font-semibold text-slate-800">{vatNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.step3.recapAge}</span>
                    <span className="font-semibold text-slate-800">
                      {buildingAge >= 10 ? t.step3.ageOver10 : `${buildingAge} ${t.step3.ageYears}`}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.step3.recapWork}</span>
                    <span className="font-semibold text-slate-800">{getWorkTypeName()}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.step3.recapUsage}</span>
                    <span className="font-semibold text-slate-800">
                      {usage === 'PRIVATE' ? t.step3.usage100Private : usage === 'PROFESSIONAL' ? t.step3.usageProOnly : t.step3.usageMixedText}
                    </span>
                  </div>
                </div>

                {/* 6. BOUTONS D'ACTION */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-slate-200">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>{t.step3.btnReset}</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={handleSaveToHistory}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <span>💾</span>
                      <span>{t.step3.btnSave}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <span>🖨️</span>
                      <span>{t.step3.btnPrint}</span>
                    </button>
                  </div>
                </div>

                {/* Toast de confirmation */}
                {savedNotification && (
                  <div className="bg-emerald-500 text-white text-xs font-bold p-3 rounded-lg text-center transition">
                    {t.step3.savedSuccess}
                  </div>
                )}

              </div>

              {/* 7. BANNIÈRE D'ALERTE EN BAS */}
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
              {t.history.title}
            </h2>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6 italic">
              {t.history.empty}
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
                    <span>{t.history.regime} : {item.regime}</span>
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
