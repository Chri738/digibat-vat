import { useState } from 'react';

type Step = 1 | 2 | 3;
type ClientStatus = 'INDIVIDUAL' | 'COMPANY_PERIODIC' | 'COMPANY_NON_PERIODIC';
type WorkType = 'RENOVATION' | 'GARDEN_MAINTENANCE' | 'HEAT_PUMP' | 'DEMOLITION';
type PropertyUsage = 'PRIVATE' | 'PROFESSIONAL' | 'MIXED';

const translations = {
  FR: {
    title: "DigiBât VAT / DigiBouw BTW",
    subtitle: "Détermination TVA « Travaux immobiliers » — Belgique 2025-2026",
    badgeCompliance: "✓ Conforme réformes 2025-2026",
    langToggle: "NL",
    steps: {
      client: "Profil du Client",
      property: "Bien & Travaux",
      result: "Résultat & Facture",
      subClient: "Vérifiez la qualité fiscale de votre client",
      subProperty: "Décrivez le bien et la nature des travaux",
      subResult: "Verdict fiscal et mentions légales à insérer"
    },
    step1: {
      title: "Étape 1 : Profil du Client",
      clientName: "Nom / Entreprise",
      clientNamePlaceholder: "ex: Jean Dupont / BVBA Peeters",
      country: "Pays",
      vatNumber: "Numéro de TVA",
      vatPlaceholder: "ex: BE0123456789",
      verifyVies: "Vérifier VIES",
      viesSuccess: "✓ Numéro TVA valide dans VIES (Assujetti)",
      statusLabel: "Statut TVA du client",
      individual: "Particulier (B2C - Non assujetti)",
      vatPeriodic: "Assujetti B2B avec déclarations périodiques (Art. 20)",
      vatNoPeriodic: "Assujetti B2B sans déclarations (Franchisé / Petite entreprise)",
      next: "Suivant : Bien & Travaux ➔"
    },
    step2: {
      title: "Étape 2 : Bien & Travaux",
      usageLabel: "Usage du bâtiment",
      usagePrivate: "Logement 100% Privé",
      usagePro: "Bâtiment 100% Professionnel",
      usageMixed: "Usage Mixte (Privé + Professionnel)",
      privateShare: "Part privée du bâtiment (%)",
      occupancyYear: "Année de 1ère occupation",
      workTypeLabel: "Nature des travaux",
      renovation: "Rénovation standard",
      gardenMaintenance: "Entretien courant & jardin",
      heatPump: "Pompe à chaleur",
      demolition: "Démolition & Reconstruction",
      back: "← Retour",
      calculate: "Obtenir le verdict ➔"
    },
    step3: {
      verdictTitle: "VERDICT FISCAL",
      rateApplied: "Taux appliqué",
      motivationTitle: "Motivation juridique",
      mentionTitle: "Mention légale à insérer sur la facture",
      copy: "Copier",
      copied: "Copié !",
      legalRefTitle: "Références légales",
      recapVat: "TVA / BTW",
      recapNoVat: "Particulier (Non assujetti)",
      recapAge: "Ancienneté du bâtiment",
      recapWork: "Nature des travaux",
      recapUsage: "Usage du bien",
      btnReset: "Recommencer",
      btnSave: "Enregistrer dans l'historique",
      btnPrint: "Imprimer la fiche justificative",
      savedSuccess: "✓ Détermination enregistrée avec succès !",
      ageOver10: "Plus de 10 ans",
      ageUnder10: "Moins de 10 ans",
      ageYears: "ans"
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
      result: "Resultaat & Factuur",
      subClient: "Controleer de fiscale status van uw klant",
      subProperty: "Beschrijf het pand en de aard van de werken",
      subResult: "Fiscale uitspraak en te vermelden wetteksten"
    },
    step1: {
      title: "Stap 1: Klantprofiel",
      clientName: "Naam / Bedrijf",
      clientNamePlaceholder: "bv. Jean Dupont / BVBA Peeters",
      country: "Land",
      vatNumber: "Btw-nummer",
      vatPlaceholder: "bv. BE0123456789",
      verifyVies: "VIES controleren",
      viesSuccess: "✓ Geldig btw-nummer in VIES (Btw-plichtige)",
      statusLabel: "Btw-status van de klant",
      individual: "Particulier (B2C - Niet btw-plichtig)",
      vatPeriodic: "Btw-plichtige B2B met periodieke aangiften (Art. 20)",
      vatNoPeriodic: "Btw-plichtige B2B zonder periodieke aangiften (Kleine onderneming)",
      next: "Volgende: Pand & Werken ➔"
    },
    step2: {
      title: "Stap 2: Pand & Werken",
      usageLabel: "Gebruik van het gebouw",
      usagePrivate: "100% Privéwoning",
      usagePro: "100% Beroepsgebouw",
      usageMixed: "Gemengd gebruik (Privé + Beroep)",
      privateShare: "Privé-aandeel van het gebouw (%)",
      occupancyYear: "Jaar van 1ste ingebruikneming",
      workTypeLabel: "Aard van de werken",
      renovation: "Standaard renovatie",
      gardenMaintenance: "Standaard onderhoud & tuin",
      heatPump: "Warmtepomp",
      demolition: "Sloop & Heropbouw",
      back: "← Terug",
      calculate: "Fiscale uitspraak bepalen ➔"
    },
    step3: {
      verdictTitle: "FISCALE UITSPRAAK",
      rateApplied: "Toegepast tarief",
      motivationTitle: "Juridische motivering",
      mentionTitle: "Wettelijke vermelding op de factuur",
      copy: "Kopiëren",
      copied: "Gekopieerd!",
      legalRefTitle: "Wettelijke referenties",
      recapVat: "BTW / TVA",
      recapNoVat: "Particulier (Niet btw-plichtig)",
      recapAge: "Ouderdom gebouw",
      recapWork: "Aard der werken",
      recapUsage: "Gebruik van het pand",
      btnReset: "Opnieuw beginnen",
      btnSave: "Opslaan in historiek",
      btnPrint: "Afdrukken bewijsstuk",
      savedSuccess: "✓ Bepaling succesvol opgeslagen!",
      ageOver10: "Meer dan 10 jaar",
      ageUnder10: "Minder dan 10 jaar",
      ageYears: "jaar"
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
  const [viesVerified, setViesVerified] = useState(false);

  const t = translations[lang];

  // Étape 1 : Client
  const [clientName, setClientName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [clientStatus, setClientStatus] = useState<ClientStatus>('INDIVIDUAL');
  const [countryCode, setCountryCode] = useState('BE');

  // Étape 2 : Immeuble et Travaux
  const [usage, setUsage] = useState<PropertyUsage>('PRIVATE');
  const [privatePercentage, setPrivatePercentage] = useState<number>(100);
  const [firstOccupancyYear, setFirstOccupancyYear] = useState<number>(2010);
  const [workType, setWorkType] = useState<WorkType>('RENOVATION');

  const currentYear = new Date().getFullYear();
  const buildingAge = currentYear - firstOccupancyYear;

  // Moteur de calcul du taux de TVA et des motifs
  const calculateVatVerdict = () => {
    // 1. Régime Cocontractant (B2B avec déclarations périodiques)
    if (clientStatus === 'COMPANY_PERIODIC') {
      return {
        rate: 0,
        isReverseCharge: true,
        titleFR: "Cocontractant — Autoliquidation (B2B)",
        titleNL: "Medecontractant — Btw verlegd (B2B)",
        motivationFR: "Prestation de travaux immobiliers réalisée pour un assujetti à la TVA tenu au dépôt de déclarations périodiques. Application obligatoire du régime du cocontractant.",
        motivationNL: "Werken in onroerende staat verricht voor een btw-plichtige met periodieke aangiften. Verplichte toepassing van de regeling medecontractant.",
        legalMentionFR: "Autoliquidation : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l'Arrêté Royal n° 1).",
        legalMentionNL: "Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand vanaf de ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een btw-plichtige is die gehouden is tot de indiening van periodieke aangiften (Art. 20 van het Koninklijk Besluit nr. 1).",
        articleFR: "Art. 20 AR n° 1",
        articleNL: "Art. 20 KB nr. 1",
        bgClass: "bg-indigo-700",
        alertClass: "bg-indigo-50 text-indigo-900 border-indigo-200"
      };
    }

    // 2. Entretien courant de jardin -> Toujours 21%
    if (workType === 'GARDEN_MAINTENANCE') {
      return {
        rate: 21,
        isReverseCharge: false,
        titleFR: "Taux normal 21% — Entretien courant de jardin",
        titleNL: "Normaal tarief 21% — Standaard tuinonderhoud",
        motivationFR: "Les travaux d'entretien courant de jardins (tonte, taille, nettoyages réguliers) sont expressément exclus du taux réduit de 6% par la loi (Rubrique XXXVIII, § 2, 5°). Le taux normal de 21% s'applique.",
        motivationNL: "Gewone onderhoudswerken aan tuinen (maaien, snoeien, regelmatig onderhoud) zijn uitdrukkelijk uitgesloten van het verlaagd tarief van 6% door de wet (Rubriek XXXVIII, § 2, 5°). Het normaal tarief van 21% is van toepassing.",
        legalMentionFR: "Taux de TVA normal de 21% applicable conformément au Code de la TVA belge.",
        legalMentionNL: "Normaal btw-tarief van 21% van toepassing overeenkomstig het Belgische Btw-Wetboek.",
        articleFR: "Art. 38 Code TVA / Rubrique XXXVIII §2",
        articleNL: "Art. 38 Btw-Wetboek / Rubriek XXXVIII §2",
        bgClass: "bg-rose-700",
        alertClass: "bg-rose-100 text-rose-900 border-rose-200"
      };
    }

    // 3. Immeuble professionnel exclusif -> 21%
    if (usage === 'PROFESSIONAL') {
      return {
        rate: 21,
        isReverseCharge: false,
        titleFR: "Taux normal 21% — Usage professionnel exclusif",
        titleNL: "Normaal tarief 21% — Uitsluitend beroepsgebruik",
        motivationFR: "Le bâtiment est affecté exclusivement à un usage professionnel. Le taux réduit de 6% est strictement réservé aux habitations privées.",
        motivationNL: "Het gebouw wordt uitsluitend beroepsmatig gebruikt. Het verlaagd tarief van 6% is strikt voorbehouden aan privéwoningen.",
        legalMentionFR: "Taux de TVA normal de 21% applicable.",
        legalMentionNL: "Normaal btw-tarief van 21% van toepassing.",
        articleFR: "Art. 38 Code TVA",
        articleNL: "Art. 38 Btw-Wetboek",
        bgClass: "bg-rose-700",
        alertClass: "bg-rose-100 text-rose-900 border-rose-200"
      };
    }

    // 4. Immeuble de moins de 10 ans -> 21%
    if (buildingAge < 10) {
      return {
        rate: 21,
        isReverseCharge: false,
        titleFR: `Taux normal 21% — Habitation de ${buildingAge} ans (< 10 ans)`,
        titleNL: `Normaal tarief 21% — Woning van ${buildingAge} jaar (< 10 jaar)`,
        motivationFR: `L'immeuble a été mis en service il y a ${buildingAge} ans. L'application du taux réduit de 6% exige une ancienneté minimale de 10 ans.`,
        motivationNL: `Het gebouw is ${buildingAge} jaar geleden in gebruik genomen. De toepassing van het verlaagd tarief van 6% vereist een minimale ouderdom van 10 jaar.`,
        legalMentionFR: "Taux de TVA normal de 21% applicable.",
        legalMentionNL: "Normaal btw-tarief van 21% van toepassing.",
        articleFR: "AR n° 20, Tableau A, Rubrique XXXVIII",
        articleNL: "KB nr. 20, Tabel A, Rubriek XXXVIII",
        bgClass: "bg-rose-700",
        alertClass: "bg-rose-100 text-rose-900 border-rose-200"
      };
    }

    // 5. Usage mixte (Privé >= 50% vs Privé < 50%)
    if (usage === 'MIXED') {
      if (privatePercentage >= 50) {
        return {
          rate: 6,
          isReverseCharge: false,
          titleFR: "Taux réduit 6% — Usage mixte à prépondérance privée (≥ 50%)",
          titleNL: "Verlaagd tarief 6% — Gemengd gebruik hoofdzakelijk privé (≥ 50%)",
          motivationFR: `Habitation de plus de 10 ans. La part privée (${privatePercentage}%) est prépondérante (≥ 50%). Conformément à la réglementation belge, le taux réduit de 6% s'applique exceptionnellement à l'ensemble des travaux de rénovation.`,
          motivationNL: `Woning van meer dan 10 jaar oud. Het privé-aandeel (${privatePercentage}%) is overwegend (≥ 50%). Overeenkomstig de Belgische regelgeving is het verlaagd tarief van 6% uitzonderlijk van toepassing op de gehele renovatie.`,
          legalMentionFR: "Taux de TVA : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître que l'immeuble est effectivement destiné à être utilisé principalement comme logement privé et qu'il a été mis en service il y a au moins 10 ans. (Arrêté Royal n° 20, Tableau A, Rubrique XXXVIII).",
          legalMentionNL: "Btw-tarief: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand vanaf de ontvangst van de factuur, wordt de klant verondersteld te erkennen dat het gebouw effectief hoofdzakelijk als privéwoning wordt gebruikt en dat het ten minste 10 jaar geleden in gebruik is genomen. (Koninklijk Besluit nr. 20, Tabel A, Rubriek XXXVIII).",
          articleFR: "AR n° 20, Tableau A, Rubrique XXXVIII",
          articleNL: "KB nr. 20, Tabel A, Rubriek XXXVIII",
          bgClass: "bg-emerald-600",
          alertClass: "bg-emerald-100 text-emerald-900 border-emerald-200"
        };
      } else {
        return {
          rate: 21, // Note de ventilation
          isReverseCharge: false,
          titleFR: "Ventilation requise : 6% Part privée / 21% Part professionnelle",
          titleNL: "Opsplitsing vereist: 6% Privé-deel / 21% Beroepsdeel",
          motivationFR: `Habitation de plus de 10 ans, mais la part privée (${privatePercentage}%) est inférieure à 50%. Les travaux doivent être ventilés sur la facture : 6% pour la partie privée et 21% pour la partie professionnelle.`,
          motivationNL: `Woning van meer dan 10 jaar oud, maar het privé-aandeel (${privatePercentage}%) is minder dan 50%. De werken moeten op de factuur worden opgesplitst: 6% voor het privé-gedeelte en 21% voor het beroepsgedeelte.`,
          legalMentionFR: "Taux de TVA : Partie privée appliquée à 6% (AR n° 20, Rubrique XXXVIII). Partie professionnelle appliquée au taux normal de 21%.",
          legalMentionNL: "Btw-tarief: Privé-gedeelte toegepast aan 6% (KB nr. 20, Rubriek XXXVIII). Beroepsgedeelte toegepast aan normaal tarief van 21%.",
          articleFR: "AR n° 20, Tableau A, Rubrique XXXVIII",
          articleNL: "KB nr. 20, Tabel A, Rubriek XXXVIII",
          bgClass: "bg-amber-600",
          alertClass: "bg-amber-100 text-amber-900 border-amber-200"
        };
      }
    }

    // 6. Habituel Particulier 100% Privé > 10 ans -> 6%
    return {
      rate: 6,
      isReverseCharge: false,
      titleFR: "Taux réduit 6% — Logement privé (> 10 ans)",
      titleNL: "Verlaagd tarief 6% — Privéwoning (> 10 jaar)",
      motivationFR: "Application du taux réduit de 6% conformément au Tableau A, Rubrique XXXVIII de l'AR n° 20 (logement privé de plus de 10 ans).",
      motivationNL: "Toepassing van het verlaagd tarief van 6% overeenkomstig Tabel A, Rubriek XXXVIII van KB nr. 20 (privéwoning ouder dan 10 jaar).",
      legalMentionFR: "Taux de TVA : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître que l'immeuble est effectivement destiné à être utilisé principalement comme logement privé et qu'il a été mis en service il y a au moins 10 ans. (Arrêté Royal n° 20, Tableau A, Rubrique XXXVIII).",
      legalMentionNL: "Btw-tarief: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand vanaf de ontvangst van de factuur, wordt de klant verondersteld te erkennen dat het gebouw effectief hoofzdakelijk als privéwoning wordt gebruikt en dat het ten minste 10 jaar geleden in gebruik is genomen. (Koninklijk Besluit nr. 20, Tabel A, Rubriek XXXVIII).",
      articleFR: "AR n° 20, Tableau A, Rubrique XXXVIII",
      articleNL: "KB nr. 20, Tabel A, Rubriek XXXVIII",
      bgClass: "bg-emerald-600",
      alertClass: "bg-emerald-100 text-emerald-900 border-emerald-200"
    };
  };

  const verdict = calculateVatVerdict();

  const handleCopyMention = () => {
    const textToCopy = lang === 'FR' ? verdict.legalMentionFR : verdict.legalMentionNL;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    const newEntry = {
      date: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }),
      client: clientName || (lang === 'FR' ? 'Client Particulier' : 'Particuliere klant'),
      regime: verdict.isReverseCharge ? 'Autoliquidation' : `${verdict.rate}%`,
      rates: verdict.isReverseCharge ? 'Art. 20 KB 1' : `${verdict.rate}%`,
    };
    setHistory([newEntry, ...history]);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setClientName('');
    setVatNumber('');
    setClientStatus('INDIVIDUAL');
    setViesVerified(false);
  };

  const verifyViesCode = () => {
    if (vatNumber.trim().length > 5) {
      setViesVerified(true);
    }
  };

  const getWorkTypeName = () => {
    switch (workType) {
      case 'RENOVATION': return t.step2.renovation;
      case 'GARDEN_MAINTENANCE': return t.step2.gardenMaintenance;
      case 'HEAT_PUMP': return t.step2.heatPump;
      case 'DEMOLITION': return t.step2.demolition;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* En-tête principal */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl text-xl font-bold">
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
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
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

      {/* Zone de travail principale */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulaire & Verdict */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Barre de navigation par étapes (Inspirée du style Bolt Image 6/7) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center text-sm">
            
            {/* Étape 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center space-x-3 cursor-pointer ${
                currentStep === 1 ? 'font-bold text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep > 1 
                  ? 'bg-emerald-500 text-white' 
                  : currentStep === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <div>
                <div className="leading-none text-slate-800 font-bold">{t.steps.client}</div>
                <div className="text-[10px] text-slate-400 font-normal hidden sm:block">{t.steps.subClient}</div>
              </div>
            </div>

            <div className="h-0.5 bg-slate-200 flex-1 mx-4" />

            {/* Étape 2 */}
            <div
              onClick={() => setCurrentStep(2)}
              className={`flex items-center space-x-3 cursor-pointer ${
                currentStep === 2 ? 'font-bold text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep > 2 
                  ? 'bg-emerald-500 text-white' 
                  : currentStep === 2 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <div>
                <div className="leading-none text-slate-800 font-bold">{t.steps.property}</div>
                <div className="text-[10px] text-slate-400 font-normal hidden sm:block">{t.steps.subProperty}</div>
              </div>
            </div>

            <div className="h-0.5 bg-slate-200 flex-1 mx-4" />

            {/* Étape 3 */}
            <div
              className={`flex items-center space-x-3 ${
                currentStep === 3 ? 'font-bold text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </span>
              <div>
                <div className="leading-none text-slate-800 font-bold">{t.steps.result}</div>
                <div className="text-[10px] text-slate-400 font-normal hidden sm:block">{t.steps.subResult}</div>
              </div>
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
                    placeholder={t.step1.clientNamePlaceholder}
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
                  {t.step1.statusLabel}
                </label>
                <select
                  value={clientStatus}
                  onChange={(e) => {
                    const status = e.target.value as ClientStatus;
                    setClientStatus(status);
                    if (status === 'INDIVIDUAL') {
                      setVatNumber('');
                      setViesVerified(false);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="INDIVIDUAL">{t.step1.individual}</option>
                  <option value="COMPANY_PERIODIC">{t.step1.vatPeriodic}</option>
                  <option value="COMPANY_NON_PERIODIC">{t.step1.vatNoPeriodic}</option>
                </select>
              </div>

              {/* Zone de contrôle VIES (Uniquement si client professionnel) */}
              {clientStatus !== 'INDIVIDUAL' && (
                <div className="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    {t.step1.vatNumber}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={t.step1.vatPlaceholder}
                      value={vatNumber}
                      onChange={(e) => {
                        setVatNumber(e.target.value);
                        setViesVerified(false);
                      }}
                      className="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={verifyViesCode}
                      className="bg-blue-600 text-white font-medium text-xs px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                      {t.step1.verifyVies}
                    </button>
                  </div>

                  {viesVerified && (
                    <div className="text-xs text-emerald-700 font-bold pt-1 flex items-center space-x-1">
                      <span>{t.step1.viesSuccess}</span>
                    </div>
                  )}
                </div>
              )}

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

              {/* Curseur si Usage Mixte */}
              {usage === 'MIXED' && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-900">
                    <span>{t.step2.privateShare}</span>
                    <span className="text-sm">{privatePercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={privatePercentage}
                    onChange={(e) => setPrivatePercentage(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="text-[11px] text-amber-800">
                    {privatePercentage >= 50
                      ? (lang === 'FR' ? '✓ Part privée ≥ 50% : Le taux de 6% pourra s\'appliquer à l\'ensemble de la rénovation.' : '✓ Privé-aandeel ≥ 50%: Het tarief van 6% geldt voor de gehele renovatie.')
                      : (lang === 'FR' ? '⚠️ Part privée < 50% : Ventilation obligatoire (6% privé / 21% pro).' : '⚠️ Privé-aandeel < 50%: Opsplitsing verplicht (6% privé / 21% beroeps).')
                    }
                  </div>
                </div>
              )}

              {/* Sélection de la nature des travaux */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  {t.step2.workTypeLabel}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Rénovation standard */}
                  <button
                    type="button"
                    onClick={() => setWorkType('RENOVATION')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'RENOVATION'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">🔨</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{t.step2.renovation}</div>
                      <div className="text-xs text-slate-500">
                        {lang === 'FR' ? 'Transformation, aménagement, peinture...' : 'Verbouwing, afwerking, schilderwerken...'}
                      </div>
                    </div>
                  </button>

                  {/* Entretien courant & jardin (Nouvelle option pour jardinier) */}
                  <button
                    type="button"
                    onClick={() => setWorkType('GARDEN_MAINTENANCE')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'GARDEN_MAINTENANCE'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">🌱</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{t.step2.gardenMaintenance}</div>
                      <div className="text-xs text-slate-500">
                        {lang === 'FR' ? 'Tonte, taille, entretien régulier (21%)' : 'Maaien, snoeien, gewoon onderhoud (21%)'}
                      </div>
                    </div>
                  </button>

                  {/* Pompe à chaleur */}
                  <button
                    type="button"
                    onClick={() => setWorkType('HEAT_PUMP')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'HEAT_PUMP'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">♨️</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{t.step2.heatPump}</div>
                      <div className="text-xs text-slate-500">
                        {lang === 'FR' ? 'Installation systèmes de chauffage' : 'Installatie verwarmingssystemen'}
                      </div>
                    </div>
                  </button>

                  {/* Démolition & Reconstruction */}
                  <button
                    type="button"
                    onClick={() => setWorkType('DEMOLITION')}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition ${
                      workType === 'DEMOLITION'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">🏗️</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{t.step2.demolition}</div>
                      <div className="text-xs text-slate-500">
                        {lang === 'FR' ? 'Reconstruction intégrale' : 'Volledige heropbouw'}
                      </div>
                    </div>
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

          {/* ÉTAPE 3 : RÉSULTAT FISCAL & MENTIONS LÉGALES */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
              
              {/* Bannière principale */}
              <div className={`${verdict.bgClass} text-white p-6 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-white/80 font-bold block">
                    {t.step3.verdictTitle}
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {lang === 'FR' ? verdict.titleFR : verdict.titleNL}
                  </h2>
                </div>

                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center min-w-[130px]">
                  <div className="text-3xl font-black">
                    {verdict.isReverseCharge ? '0%' : `${verdict.rate}%`}
                  </div>
                  <div className="text-[11px] font-medium text-white/90 uppercase tracking-wider">
                    {verdict.isReverseCharge ? (lang === 'FR' ? 'Autoliquidation' : 'Btw verlegd') : t.step3.rateApplied}
                  </div>
                </div>
              </div>

              {/* Corps de la décision */}
              <div className="p-6 space-y-6">
                
                {/* Motivation juridique */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                    <span className="text-blue-600">⚖️</span>
                    <span>{t.step3.motivationTitle}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {lang === 'FR' ? verdict.motivationFR : verdict.motivationNL}
                  </p>
                </div>

                {/* Mention légale exacte à insérer sur la facture */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                      <span className="text-blue-600">📑</span>
                      <span>{t.step3.mentionTitle}</span>
                    </div>
                    
                    <button
                      onClick={handleCopyMention}
                      className="flex items-center space-x-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      <span>📋</span>
                      <span>{copied ? t.step3.copied : t.step3.copy}</span>
                    </button>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-800 leading-relaxed font-mono shadow-inner">
                    "{lang === 'FR' ? verdict.legalMentionFR : verdict.legalMentionNL}"
                  </div>
                </div>

                {/* Référence de l'article de loi */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                    <span className="text-blue-600">📄</span>
                    <span>{t.step3.legalRefTitle}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-6">
                    <span className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg">
                      {lang === 'FR' ? verdict.articleFR : verdict.articleNL}
                    </span>
                  </div>
                </div>

                {/* Récapitulatif des données entrées */}
                <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-600">
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t.step3.recapVat}</span>
                    <span className="font-semibold text-slate-800">
                      {clientStatus === 'INDIVIDUAL' || !vatNumber ? t.step3.recapNoVat : vatNumber}
                    </span>
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
                      {usage === 'PRIVATE' ? '100% Privé' : usage === 'PROFESSIONAL' ? '100% Pro' : `Mixte (${privatePercentage}% Privé)`}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
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

                {savedNotification && (
                  <div className="bg-emerald-500 text-white text-xs font-bold p-3 rounded-lg text-center transition shadow">
                    {t.step3.savedSuccess}
                  </div>
                )}

              </div>

              <div className={`p-3 text-center text-xs font-bold border-t ${verdict.alertClass}`}>
                {lang === 'FR' ? verdict.titleFR : verdict.titleNL}
              </div>

            </div>
          )}
        </div>

        {/* Panneau latéral : Historique */}
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
                    <span>{t.history.regime}: {item.regime}</span>
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
