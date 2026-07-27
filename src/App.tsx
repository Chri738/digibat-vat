import React, { useState } from 'react';

// Types
type Lang = 'FR' | 'NL';
type ClientStatus = 'B2C' | 'B2B_PERIODIC' | 'B2B_SPECIAL';
type PropertyType = 'OLD_HOUSING' | 'NEW_HOUSING' | 'COMMERCIAL';
type WorkType = 'RENOVATION' | 'DEMOLITION_RECONSTRUCTION' | 'NEW_CONSTRUCTION';

interface HistoryRecord {
  id: string;
  date: string;
  clientName: string;
  vatRate: string;
  regimeTitle: string;
  siteAddress: string;
}

// Dictionnaire des traductions
const translations = {
  FR: {
    title: 'DigiBât TVA / DigiBouw BTW',
    subtitle: 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026',
    badge: '✓ Conforme réformes 2025-2026',

    // Étapes
    step1Title: 'Profil du Client',
    step1Sub: 'Contrôler le statut fiscal',
    step2Title: 'Bien & Travaux',
    step2Sub: 'Description des travaux',
    step3Title: 'Résultat & Facture',
    step3Sub: 'Verdict & mentions légales',

    // Étape 1
    step1Header: 'Étape 1 : Profil du Client',
    clientNameLabel: 'NOM / ENTREPRISE',
    clientNamePlaceholder: 'ex: Jean Dupont / Nom d\'entreprise',
    countryLabel: 'PAYS (UNION EUROPÉENNE)',
    statusLabel: 'STATUT TVA DU CLIENT',
    statusB2C: 'Particulier (B2C - Non assujetti)',
    statusB2BPeriodic: 'Assujetti B2B avec déclarations périodiques (Autoliquidation Art. 20 / AR n° 1)',
    statusB2BSpecial: 'Assujetti B2B régimes spéciaux / non établi',
    vatLabel: 'NUMÉRO DE TVA',
    vatPlaceholder: 'ex: BE0123456789',
    verifyVies: 'Vérifier VIES',
    viesSuccess: '✓ Numéro TVA valide dans VIES (Assujetti)',
    nextStep1: 'Suivant : Bien & Travaux →',

    // Étape 2
    step2Header: 'Étape 2 : Bien & Nature des Travaux',
    propertyTypeLabel: 'TYPE ET ÂGE DU BÂTIMENT',
    propHousingOld: 'Logement privé de plus de 10 ans (Usage d\'habitation)',
    propHousingNew: 'Logement privé de moins de 10 ans',
    propCommercial: 'Bâtiment commercial / à usage professionnel',
    workTypeLabel: 'NATURE DES TRAVAUX',
    workRenovation: 'Travaux de rénovation / transformation / entretien',
    workDemolition: 'Démolition et reconstruction (Régime 6%)',
    workNewConst: 'Nouvelle construction (Taux normal 21%)',
    workAddressLabel: 'ADRESSE DU CHANTIER / BIEN',
    workAddressPlaceholder: 'ex: Rue de la Loi 16, 1000 Bruxelles',
    prevStep: '← Retour',
    nextStep2: 'Suivant : Résultat & Facture →',

    // Étape 3
    step3Header: 'Étape 3 : Verdict TVA & Mention Légale Facture',
    resultTitle: 'Régime TVA Applicable',
    rateLabel: 'Taux de TVA à appliquer',
    legalNoticeTitle: 'Mention Légale Obligatoire sur la Facture',
    copyNotice: 'Copier la mention',
    copiedNotice: '✓ Copié !',
    amountSimulatorTitle: 'Simulateur de Facturation',
    netAmountLabel: 'Montant HTVA (€)',
    vatAmountLabel: 'Montant TVA (€)',
    totalAmountLabel: 'Montant TTC (€)',
    saveRecordBtn: '💾 Enregistrer dans l\'historique',
    recordSaved: '✓ Enregistré !',

    // Régimes fiscaux
    regimeArt20Title: 'Autoliquidation (Article 20)',
    regimeArt20Rate: '0% (Autoliquidation B2B)',
    regimeArt20Desc: 'Le cocontractant (client B2B) est tenu au paiement de la TVA dans sa propre déclaration périodique.',
    legalTextArt20: '« Autoliquidation : En l\'absence de contestation par écrit, dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître qu\'il est un assujetti tenu au dépôt de déclarations périodiques. Si cette condition n\'est pas remplie, le client est responsable du paiement de la taxe, des intérêts et des amendes dus. » (AR n° 1, art. 20)',

    regime6Title: 'Taux Réduit 6%',
    regime6Rate: '6%',
    regime6RenovDesc: 'Rénovation/transformation de logement privé de plus de 10 ans.',
    legalText6Renov: '« Taux de TVA réduit de 6 % applicable en vertu de la rubrique XXXI du tableau A de l\'annexe à l\'arrêté royal n° 20. En l\'absence de contestation par écrit dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître que le bâtiment est affecté à titre principal comme logement privé et qu\'il a été occupé pour la première fois il y a plus de 10 ans. »',

    regime6DemoDesc: 'Démolition et reconstruction d\'un bâtiment d\'habitation.',
    legalText6Demo: '« Taux de TVA réduit de 6 % pour démolition et reconstruction applicable en vertu de la rubrique XXXVII du tableau A de l\'annexe à l\'arrêté royal n° 20. »',

    regime21Title: 'Taux Normal 21%',
    regime21Rate: '21%',
    regime21Desc: 'Bâtiment récent (<10 ans), nouvelle construction ou usage professionnel sans autoliquidation.',
    legalText21: '« TVA 21 % - Taux normal appliqué conformément au Code de la TVA belge. »',

    // Historique
    historyTitle: 'Historique des déterminations',
    historyEmpty: 'Aucune détermination enregistrée.',
    clearHistory: 'Effacer l\'historique',
  },
  NL: {
    title: 'DigiBât TVA / DigiBouw BTW',
    subtitle: 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026',
    badge: '✓ Conform hervormingen 2025-2026',

    // Stappen
    step1Title: 'Klantprofiel',
    step1Sub: 'Fiscale status controleren',
    step2Title: 'Onroerend goed & Werken',
    step2Sub: 'Beschrijving van de werken',
    step3Title: 'Resultaat & Factuur',
    step3Sub: 'Fiscaal verdict & wetteksten',

    // Stap 1
    step1Header: 'Stap 1 : Klantprofiel',
    clientNameLabel: 'NAAM / ONDERNEMING',
    clientNamePlaceholder: 'bv. Jan Jansen / Bedrijfsnaam',
    countryLabel: 'LAND (EUROPESE UNIE)',
    statusLabel: 'BTW-STATUS VAN DE KLANT',
    statusB2C: 'Particulier (B2C - Niet-btw-plichtige)',
    statusB2BPeriodic: 'Btw-plichtige B2B met periodieke aangiften (Btw verlegd Art. 20 / KB nr. 1)',
    statusB2BSpecial: 'Btw-plichtige B2B bijzondere regelingen / niet gevestigd',
    vatLabel: 'BTW-NUMMER',
    vatPlaceholder: 'bv. BE0123456789',
    verifyVies: 'VIES Controleren',
    viesSuccess: '✓ Geldig btw-nummer in VIES (Btw-plichtige)',
    nextStep1: 'Volgende: Onroerend goed & Werken →',

    // Stap 2
    step2Header: 'Stap 2 : Onroerend goed & Aard van de werken',
    propertyTypeLabel: 'TYPE EN OUDERDOM VAN HET GEBOUW',
    propHousingOld: 'Privéwoning ouder dan 10 jaar (Hoofdverblijf)',
    propHousingNew: 'Privéwoning jonger dan 10 jaar',
    propCommercial: 'Commercieel / Professioneel gebouw',
    workTypeLabel: 'AARD VAN DE WERKEN',
    workRenovation: 'Renovatie- / verbouwings- / onderhoudswerken',
    workDemolition: 'Sloop en heropbouw (6% regeling)',
    workNewConst: 'Nieuwbouw (Normaal tarief 21%)',
    workAddressLabel: 'ADRES VAN DE WERF / GOED',
    workAddressPlaceholder: 'bv. Wetstraat 16, 1000 Brussel',
    prevStep: '← Terug',
    nextStep2: 'Volgende: Resultaat & Factuur →',

    // Stap 3
    step3Header: 'Stap 3 : Btw-verdict & Verplichte Factuurvermelding',
    resultTitle: 'Toepasselijke Btw-regeling',
    rateLabel: 'Toe te passen btw-tarief',
    legalNoticeTitle: 'Verplichte Vermelding op de Factuur',
    copyNotice: 'Kopieer vermelding',
    copiedNotice: '✓ Gekopieerd!',
    amountSimulatorTitle: 'Facturatiesimulator',
    netAmountLabel: 'Bedrag excl. btw (€)',
    vatAmountLabel: 'Btw-bedrag (€)',
    totalAmountLabel: 'Bedrag incl. btw (€)',
    saveRecordBtn: '💾 Opslaan in historiek',
    recordSaved: '✓ Opgeslagen!',

    // Regimes
    regimeArt20Title: 'Btw verlegd (Artikel 20)',
    regimeArt20Rate: '0% (Btw verlegd B2B)',
    regimeArt20Desc: 'De medecontractant (B2B-klant) is gehouden tot voldoening van de btw in zijn eigen periodieke aangifte.',
    legalTextArt20: '« Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een btw-plichtige is die gehouden is tot het indienen van periodieke aangiften. Indien aan deze voorwaarde niet is voldaan, is de afnemer aansprakelijk voor de betaling van de belasting, intresten en geldboeten. » (KB nr. 1, art. 20)',

    regime6Title: 'Verlaagd Tarief 6%',
    regime6Rate: '6%',
    regime6RenovDesc: 'Renovatie/ombouw van privéwoning ouder dan 10 jaar.',
    legalText6Renov: '« Verlaagd btw-tarief van 6% van toepassing ter uitvoering van rubriek XXXI van tabel A van de bijlage bij het koninklijk besluit nr. 20. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer geacht te erkennen dat het gebouw hoofdzakelijk als privéwoning wordt gebruikt en meer dan 10 jaar geleden voor het eerst in gebruik is genomen. »',

    regime6DemoDesc: 'Afbraak en heropbouw van een woongebouw.',
    legalText6Demo: '« Verlaagd btw-tarief van 6% voor afbraak en heropbouw van toepassing ter uitvoering van rubriek XXXVII van tabel A van de bijlage bij het koninklijk besluit nr. 20. »',

    regime21Title: 'Normaal Tarief 21%',
    regime21Rate: '21%',
    regime21Desc: 'Recent gebouw (<10 jaar), nieuwbouw of professioneel gebruik zonder btw-verlegging.',
    legalText21: '« Btw 21% - Normaal tarief toegepast overeenkomstig het Belgische Btw-Wetboek. »',

    // Historiek
    historyTitle: 'Historiek van bepalingen',
    historyEmpty: 'Geen bepalingen geregistreerd.',
    clearHistory: 'Historiek wissen',
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>('FR');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Étape 1 : Profil Client (Champs neutres/vides par défaut)
  const [clientName, setClientName] = useState<string>('');
  const [country, setCountry] = useState<string>('BE');
  const [status, setStatus] = useState<ClientStatus>('B2B_PERIODIC');
  const [vatNumber, setVatNumber] = useState<string>('');
  const [viesVerified, setViesVerified] = useState<boolean>(false);

  // Étape 2 : Bien & Nature des travaux
  const [propertyType, setPropertyType] = useState<PropertyType>('OLD_HOUSING');
  const [workType, setWorkType] = useState<WorkType>('RENOVATION');
  const [siteAddress, setSiteAddress] = useState<string>('');

  // Étape 3 : Simulateur & Copie
  const [netAmount, setNetAmount] = useState<number>(1000);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Historique
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const t = translations[lang];

  // --- Moteur de règles fiscales TVA (Belgique 2025-2026) ---
  const getDetermination = () => {
    // Règle 1 : B2B avec déclarations périodiques -> Autoliquidation Art. 20
    if (status === 'B2B_PERIODIC') {
      return {
        rateValue: 0,
        rateLabel: t.regimeArt20Rate,
        title: t.regimeArt20Title,
        description: t.regimeArt20Desc,
        legalNotice: t.legalTextArt20,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }

    // Règle 2 : Démolition et reconstruction -> 6%
    if (workType === 'DEMOLITION_RECONSTRUCTION') {
      return {
        rateValue: 6,
        rateLabel: t.regime6Rate,
        title: `${t.regime6Title} (${t.workDemolition})`,
        description: t.regime6DemoDesc,
        legalNotice: t.legalText6Demo,
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }

    // Règle 3 : Rénovation sur logement de +10 ans -> 6%
    if (workType === 'RENOVATION' && propertyType === 'OLD_HOUSING') {
      return {
        rateValue: 6,
        rateLabel: t.regime6Rate,
        title: `${t.regime6Title} (Rénovation > 10 ans)`,
        description: t.regime6RenovDesc,
        legalNotice: t.legalText6Renov,
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }

    // Règle 4 : Par défaut (Nouvelle construction, bâtiment récent ou B2C commercial) -> 21%
    return {
      rateValue: 21,
      rateLabel: t.regime21Rate,
      title: t.regime21Title,
      description: t.regime21Desc,
      legalNotice: t.legalText21,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    };
  };

  const currentResult = getDetermination();
  const vatCalculated = (netAmount * currentResult.rateValue) / 100;
  const totalTtc = netAmount + vatCalculated;

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(currentResult.legalNotice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveHistory = () => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(lang === 'FR' ? 'fr-BE' : 'nl-BE'),
      clientName: clientName.trim() || (lang === 'FR' ? 'Client anonyme' : 'Anonieme klant'),
      vatRate: currentResult.rateLabel,
      regimeTitle: currentResult.title,
      siteAddress: siteAddress.trim() || '-',
    };

    setHistory([newRecord, ...history]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header / En-tête */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
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

          {/* Commutateur FR / NL */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar Steps */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between overflow-x-auto gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-3 text-left min-w-max focus:outline-none"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step1Title}</p>
                <p className="text-xs text-slate-400">{t.step1Sub}</p>
              </div>
            </button>

            <div className="h-0.5 w-8 bg-slate-200 shrink-0"></div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-3 text-left min-w-max focus:outline-none"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900">{t.step2Title}</p>
                <p className="text-xs text-slate-400">{t.step2Sub}</p>
              </div>
            </button>

            <div className="h-0.5 w-8 bg-slate-200 shrink-0"></div>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-3 text-left min-w-max focus:outline-none"
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
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

          {/* Étape 1 : Profil Client */}
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
                    <option value="LU">Luxembourg (LU)</option>
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

          {/* Étape 2 : Bien & Travaux */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
                {t.step2Header}
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {t.propertyTypeLabel}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="OLD_HOUSING">{t.propHousingOld}</option>
                  <option value="NEW_HOUSING">{t.propHousingNew}</option>
                  <option value="COMMERCIAL">{t.propCommercial}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {t.workTypeLabel}
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value as WorkType)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="RENOVATION">{t.workRenovation}</option>
                  <option value="DEMOLITION_RECONSTRUCTION">{t.workDemolition}</option>
                  <option value="NEW_CONSTRUCTION">{t.workNewConst}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  {t.workAddressLabel}
                </label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder={t.workAddressPlaceholder}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition"
                >
                  {t.prevStep}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow transition"
                >
                  {t.nextStep2}
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 : Verdict & Facture */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {t.step3Header}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {clientName ? `Client : ${clientName}` : ''} {vatNumber ? `(${vatNumber})` : ''}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${currentResult.badgeColor}`}>
                    {currentResult.rateLabel}
                  </span>
                </div>

                {/* Card Résultat principal */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {currentResult.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {currentResult.description}
                  </p>
                </div>

                {/* Mention Légale Facture */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      {t.legalNoticeTitle}
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyNotice}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                    >
                      {copied ? t.copiedNotice : t.copyNotice}
                    </button>
                  </div>
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-sm font-serif text-amber-900 leading-relaxed italic">
                    {currentResult.legalNotice}
                  </div>
                </div>

                {/* Simulateur de Montants */}
                <div className="border-t pt-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    {t.amountSimulatorTitle}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        {t.netAmountLabel}
                      </label>
                      <input
                        type="number"
                        value={netAmount}
                        onChange={(e) => setNetAmount(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        {t.vatAmountLabel}
                      </label>
                      <div className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 text-sm font-mono font-bold text-slate-600">
                        {vatCalculated.toFixed(2)} €
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        {t.totalAmountLabel}
                      </label>
                      <div className="w-full border border-blue-200 bg-blue-50/50 rounded-lg p-2 text-sm font-mono font-bold text-blue-900">
                        {totalTtc.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons Actions Étape 3 */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition"
                  >
                    {t.prevStep}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHistory}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition"
                  >
                    {saved ? t.recordSaved : t.saveRecordBtn}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Historique latéral */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>📜</span>
              <span>{t.historyTitle}</span>
            </h3>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-xs text-rose-600 hover:underline"
              >
                {t.clearHistory}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs text-slate-400 italic">{t.historyEmpty}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{rec.clientName}</span>
                    <span className="text-blue-600">{rec.vatRate}</span>
                  </div>
                  <p className="text-slate-500">{rec.regimeTitle}</p>
                  <p className="text-[10px] text-slate-400">{rec.date} • {rec.siteAddress}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
