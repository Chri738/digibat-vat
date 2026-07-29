import React, { useState } from 'react';

// --- LISTE COMPLÈTE DES 27 PAYS DE L'UE ---
const EU_COUNTRIES = [
  { code: 'BE', nameFR: 'Belgique (BE)', nameNL: 'België (BE)' },
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
  { code: 'EE', nameFR: 'Estonie (EE)', nameNL: 'Estland (EE)' },
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
  { code: 'RO', nameFR: 'Roumanie (RO)', nameNL: 'Roemenië (RO)' },
  { code: 'SK', nameFR: 'Slovaquie (SK)', nameNL: 'Slowakije (SK)' },
  { code: 'SI', nameFR: 'Slovénie (SI)', nameNL: 'Slovenië (SI)' },
  { code: 'SE', nameFR: 'Suède (SE)', nameNL: 'Zweden (SE)' },
  { code: 'CZ', nameFR: 'Tchéquie (CZ)', nameNL: 'Tsjechië (CZ)' }
];

// --- DICTIONNAIRE DE TRADUCTION STRICT (FR / NL) ---
const TRANSLATIONS = {
  FR: {
    title: "Détermination TVA « Travaux immobiliers » — Belgique 2025-2026",
    subtitle: "Conforme réformes 2025-2026",
    step1Title: "Étape 1 : Profil Client",
    clientTypeB2B: "Assujetti à la TVA (B2B)",
    clientTypeB2C: "Particulier / Non-assujetti (B2C)",
    viesBtn: "Vérifier le numéro TVA (VIES)",
    viesOk: "TVA VIES Validée (OK)",
    viesError: "Numéro TVA non valide dans VIES",
    viesRequired: "La validation VIES est obligatoire pour débloquer l'Étape 2.",
    nameLabel: "Nom / Raison sociale",
    vatLabel: "Numéro de TVA",
    countryLabel: "Pays du client",
    nextStep: "Passer à l'Étape 2",

    step2Title: "Étape 2 : Bien immobilier & Nature des travaux",
    ageLabel: "Âge du bâtiment",
    ageOver10: "≥ 10 ans",
    ageUnder10: "< 10 ans",
    usageLabel: "Usage du bâtiment",
    usagePrive100: "100% Privé",
    usagePrive50: "> 50% Privé",
    usagePro: "Exclusif Pro",
    usageMixte: "Mixte (Privé + Pro)",
    
    // Surfaces
    surfaceBoxTitle: "Répartition des superficies (Usage Mixte — Minimum 200 m²)",
    surfacePriveLabel: "Superficie Privée (m²)",
    surfaceProLabel: "Superficie Professionnelle (m²)",
    totalSurfaceLabel: "Superficie Totale du bâtiment",
    minSurfaceOk: "✓ Superficie totale ≥ 200 m² (Minimum requis respecté)",
    minSurfaceKo: "⚠️ Superficie totale < 200 m² (Le bâtiment doit avoir une superficie minimale de 200 m²)",

    workLabel: "Nature des travaux",
    workRenov: "Rénovation standard",
    workHeatPump: "Pompe à chaleur",
    workGarden: "Entretien courant / Jardinage",
    workSolar: "Panneaux solaires & Isolation",
    workDemolition: "Démolition et/ou Construction",

    // Travaux extérieurs
    outdoorTitle: "🌿 TRAVAUX EXTÉRIEURS / ESPACES VERTS (OPTIONNEL)",
    outdoorSubtitle: "Cochez uniquement si la prestation porte sur l'entretien ou l'aménagement d'espaces verts.",
    outdoorNoneTitle: "Ne s'applique pas",
    outdoorGardenTitle: "Entretien courant",
    outdoorGardenSub: "(Tonte, taille, plantes...)",
    outdoorLandscapingTitle: "Aménagement & Gros travaux",
    outdoorLandscapingSub: "(Terrasse, pavage...)",

    siteAddressLabel: "Adresse du chantier / bien",
    previousStep: "Retour Étape 1",
    toStep3: "Calculer le régime TVA (Étape 3)",

    // Étape 3
    step3Title: "Étape 3 : Régime TVA & Attestation Légale",
    summaryTitle: "Récapitulatif du dossier",
    summaryClient: "Client",
    summaryCountry: "Pays client",
    summaryBuildingAge: "Âge du bâtiment",
    summaryUsage: "Usage du bâtiment",
    summaryWorkType: "Nature des travaux",
    summaryOutdoor: "Travaux extérieurs",
    summarySiteAddress: "Adresse du chantier",

    regimeTitle: "Régime TVA Applicable",
    legalClauseTitle: "Mention légale obligatoire à inscrire sur la facture",
    restartBtn: "Nouvelle simulation",
    copyBtn: "Copier la mention légale",
    copiedMsg: "Mention copiée dans le presse-papier !",
    
    // Libellés Régime
    reverseCharge: "Autoliquidation (Co-contractant)",
    rate6: "Taux réduit 6%",
    rate21: "Taux normal 21%",
    rateProrata: "Régime Mixte (Prorata 6% / 21%)"
  },
  NL: {
    title: "Btw-bepaling « Werken in onroerende staat » — België 2025-2026",
    subtitle: "Conform de hervormingen 2025-2026",
    step1Title: "Stap 1: Klantprofiel",
    clientTypeB2B: "Btw-plichtige (B2B)",
    clientTypeB2C: "Particulier (B2C)",
    viesBtn: "Btw-nummer verifiëren (VIES)",
    viesOk: "VIES Validated (Oké)",
    viesError: "Ongeldig Btw-nummer in VIES",
    viesRequired: "VIES-validatie is verplicht om Stap 2 ontgrendelen.",
    nameLabel: "Naam / Bedrijfsnaam",
    vatLabel: "Btw-nummer",
    countryLabel: "Land van de klant",
    nextStep: "Ga naar Stap 2",

    step2Title: "Stap 2: Onroerend goed & Aard van de werken",
    ageLabel: "Ouderdom van het gebouw",
    ageOver10: "≥ 10 jaar",
    ageUnder10: "< 10 jaar",
    usageLabel: "Gebruik van het gebouw",
    usagePrive100: "100% Privé",
    usagePrive50: "> 50% Privé",
    usagePro: "Exclusief Beroepsmatig",
    usageMixte: "Gemengd (Privé + Pro)",
    
    // Surfaces
    surfaceBoxTitle: "Verdeling van de oppervlakten (Gemengd gebruik — Minimum 200 m²)",
    surfacePriveLabel: "Privé-oppervlakte (m²)",
    surfaceProLabel: "Beroepsmatige oppervlakte (m²)",
    totalSurfaceLabel: "Totale oppervlakte van het gebouw",
    minSurfaceOk: "✓ Totale oppervlakte ≥ 200 m² (Vereiste minimumoppervlakte bereikt)",
    minSurfaceKo: "⚠️ Totale oppervlakte < 200 m² (Het gebouw moet een minimale oppervlakte van 200 m² hebben)",

    workLabel: "Aard van de werken",
    workRenov: "Standaard renovatie",
    workHeatPump: "Warmtepomp",
    workGarden: "Lopend onderhoud / Tuinonderhoud",
    workSolar: "Zonnepanelen & Isolatie",
    workDemolition: "Sloop en/of Bouw",

    // Travaux extérieurs
    outdoorTitle: "🌿 BUITENWERKEN / GROENVOORZIENINGEN (OPTIONEEL)",
    outdoorSubtitle: "Vink alleen aan als de dienst betrekking heeft op het onderhoud of de aanleg van groene ruimten.",
    outdoorNoneTitle: "Niet van toepassing",
    outdoorGardenTitle: "Lopend onderhoud",
    outdoorGardenSub: "(Maaien, snoeien, planten...)",
    outdoorLandscapingTitle: "Aanleg & Grote werken",
    outdoorLandscapingSub: "(Terras, bestrating...)",

    siteAddressLabel: "Adres van de werf / bouwwerf",
    previousStep: "Terug naar Stap 1",
    toStep3: "Btw-regeling berekenen (Stap 3)",

    // Étape 3
    step3Title: "Stap 3: Btw-regeling & Wettelijke Vermelding",
    summaryTitle: "Samenvatting van het dossier",
    summaryClient: "Klant",
    summaryCountry: "Land klant",
    summaryBuildingAge: "Ouderdom gebouw",
    summaryUsage: "Gebruik gebouw",
    summaryWorkType: "Aard van de werken",
    summaryOutdoor: "Buitenwerken",
    summarySiteAddress: "Adres van de werf",

    regimeTitle: "Toepasselijke Btw-regeling",
    legalClauseTitle: "Verplichte wettelijke vermelding op de factuur",
    restartBtn: "Nieuwe simulatie",
    copyBtn: "Kopieer vermelding",
    copiedMsg: "Vermelding gecopieerd naar klembord!",

    // Libellés Régime
    reverseCharge: "Btw verlegd (Medecontractant)",
    rate6: "Verlaagd tarief 6%",
    rate21: "Normaal tarief 21%",
    rateProrata: "Gemengde regeling (Prorata 6% / 21%)"
  }
};

export default function App() {
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const t = TRANSLATIONS[lang];

  // Navigation Étape (1, 2 ou 3)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // --- ÉTAPE 1 : ÉTATS ---
  const [clientType, setClientType] = useState<'B2B' | 'B2C'>('B2C');
  const [clientName, setClientName] = useState('');
  const [clientVat, setClientVat] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('BE');
  const [viesStatus, setViesStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // --- ÉTAPE 2 : ÉTATS ---
  const [buildingAge, setBuildingAge] = useState<'over10' | 'under10'>('over10');
  const [buildingUsage, setBuildingUsage] = useState<'prive100' | 'prive50' | 'pro' | 'mixte'>('prive100');
  const [surfacePrive, setSurfacePrive] = useState<number | ''>('');
  const [surfacePro, setSurfacePro] = useState<number | ''>('');
  const [workType, setWorkType] = useState<'renov' | 'heatpump' | 'garden' | 'solar' | 'demolition'>('renov');
  const [outdoorOption, setOutdoorOption] = useState<'none' | 'garden' | 'landscaping'>('none');
  const [siteAddress, setSiteAddress] = useState('');
  const [copied, setCopied] = useState(false);

  // Simulation VIES
  const handleViesCheck = () => {
    if (clientVat.trim().length > 5) {
      setViesStatus('valid');
    } else {
      setViesStatus('invalid');
    }
  };

  const canGoToStep2 = clientType === 'B2C' || viesStatus === 'valid';

  // Calculs automatiques des superficies
  const numPrive = Number(surfacePrive) || 0;
  const numPro = Number(surfacePro) || 0;
  const totalSurface = numPrive + numPro;
  const isTotalOver200 = totalSurface >= 200;

  // --- MOTEUR FISCAL (ÉTAPE 3) ---
  const calculateVatResult = () => {
    // 1. REGLE B2B : Autoliquidation / Co-contractant
    if (clientType === 'B2B') {
      return {
        regime: t.reverseCharge,
        rateText: "0% (Autoliquidation / Co-contractant)",
        color: "#2563eb",
        clause: lang === 'FR' 
          ? `« Autoliquidation : En l'absence de contestation par écrit, dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques et que les travaux immobiliers sont affectés à son activité professionnelle (Art. 20 KB n° 1). »`
          : `« Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de afnemer vermoed te erkennen dat hij een btw-plichtige is die gehouden is tot het indienen van periodieke aangiften en dat de werken in onroerende staat bestemd zijn voor zijn beroepswerkzaamheid (Art. 20 KB nr. 1). »`
      };
    }

    // 2. REGLE ESPACES VERTS (Entretien courant = toujours 21%)
    if (outdoorOption === 'garden' || workType === 'garden') {
      return {
        regime: t.rate21,
        rateText: "21%",
        color: "#dc2626",
        clause: lang === 'FR'
          ? `« Travaux d'entretien courant de jardins et espaces verts soumis au taux normal de TVA de 21% (Rubrique non éligible au taux réduit de 6%). »`
          : `« Lopend onderhoud van tuinen en groenvoorzieningen onderworpen aan het normale btw-tarief van 21%. »`
      };
    }

    // 3. B2C : Bâtiment < 10 ans
    if (buildingAge === 'under10') {
      return {
        regime: t.rate21,
        rateText: "21%",
        color: "#dc2626",
        clause: lang === 'FR'
          ? `« Prestations soumises au taux normal de TVA de 21% (Bâtiment de moins de 10 ans). »`
          : `« Diensten onderworpen aan het normale btw-tarief van 21% (Gebouw jonger dan 10 jaar). »`
      };
    }

    // 4. B2C : Bâtiment >= 10 ans
    if (buildingAge === 'over10') {
      if (buildingUsage === 'pro') {
        return {
          regime: t.rate21,
          rateText: "21%",
          color: "#dc2626",
          clause: lang === 'FR'
            ? `« Prestations affectées exclusivement à un usage professionnel : Taux normal de 21% applicable. »`
            : `« Diensten uitsluitend bestemd voor beroepsmatig gebruik: Normaal tarief van 21% van toepassing. »`
        };
      }

      if (buildingUsage === 'mixte') {
        const pctPrive = totalSurface > 0 ? Math.round((numPrive / totalSurface) * 100) : 0;
        const pctPro = totalSurface > 0 ? Math.round((numPro / totalSurface) * 100) : 0;

        if (pctPrive >= 50) {
          return {
            regime: t.rate6,
            rateText: "6%",
            color: "#16a34a",
            clause: lang === 'FR'
              ? `« TVA à 6% - Bâtiment à usage mixte (> 50% privé : ${pctPrive}% privé / ${pctPro}% pro) de plus de 10 ans. En l'absence de contestation par écrit dans un délai d'un mois, le client est présumé reconnaître que l'immeuble est affecté principalement à un logement privé. »`
              : `« Btw 6% - Gemengd gebouw (> 50% privé: ${pctPrive}% privé / ${pctPro}% pro) ouder dan 10 jaar. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand, wordt de klant verondersteld te erkennen dat het gebouw hoofdjelijk als privéwoning wordt gebruikt. »`
          };
        } else {
          return {
            regime: t.rateProrata,
            rateText: `Prorata (${pctPrive}% à 6% / ${pctPro}% à 21%)`,
            color: "#d97706",
            clause: lang === 'FR'
              ? `« Ventilation TVA pour bâtiment mixte de plus de 10 ans : ${pctPrive}% de la prestation soumis à 6% (partie privée) et ${pctPro}% soumis à 21% (partie professionnelle). »`
              : `« Btw-splitsing voor gemengd gebouw ouder dan 10 jaar: ${pctPrive}% onderworpen aan 6% (privégedeelte) en ${pctPro}% onderworpen aan 21% (beroepsgedeelte). »`
          };
        }
      }

      // Usage 100% privé ou > 50% privé
      return {
        regime: t.rate6,
        rateText: "6%",
        color: "#16a34a",
        clause: lang === 'FR'
          ? `« Taux de TVA réduit de 6% applicable (Rubrique XXXVIII du tableau A de l'arrêté royal n° 20) : Rénovation d'un logement privé de plus de 10 ans. En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître que les travaux sont effectués à un immeuble dont l'occupation effective comme logement privé remonte à plus de 10 ans. »`
          : `« Verlaagd btw-tarief van 6% van toepassing (Rubriek XXXVIII van tabel A van het koninklijk besluit nr. 20): Renovatie van een privéwoning ouder dan 10 jaar. Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand, wordt de klant vermoed te erkennen dat de werken worden uitgevoerd aan een woning waarvan de ingebruikneming meer dan 10 jaar teruggaat. »`
      };
    }

    return {
      regime: t.rate21,
      rateText: "21%",
      color: "#dc2626",
      clause: "Taux par défaut 21%."
    };
  };

  const vatResult = calculateVatResult();

  const handleCopy = () => {
    navigator.clipboard.writeText(vatResult.clause);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '850px', margin: '0 auto' }}>
      {/* Sélecteur de Langue */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button 
          onClick={() => setLang('FR')} 
          style={{ fontWeight: lang === 'FR' ? 'bold' : 'normal', marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
          FR
        </button>
        <button 
          onClick={() => setLang('NL')} 
          style={{ fontWeight: lang === 'NL' ? 'bold' : 'normal', padding: '5px 10px', cursor: 'pointer' }}>
          NL
        </button>
      </div>

      {/* En-tête */}
      <h1 style={{ fontSize: '20px', color: '#1e3a8a' }}>{t.title}</h1>
      <p style={{ color: '#64748b', fontSize: '14px' }}>{t.subtitle}</p>

      <hr style={{ margin: '20px 0' }} />

      {/* ================= ÉTAPE 1 ================= */}
      {step === 1 && (
        <div>
          <h2>{t.step1Title}</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginRight: '15px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="clientType" 
                checked={clientType === 'B2C'} 
                onChange={() => { setClientType('B2C'); setViesStatus('idle'); }} 
              /> {t.clientTypeB2C}
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="clientType" 
                checked={clientType === 'B2B'} 
                onChange={() => setClientType('B2B')} 
              /> {t.clientTypeB2B}
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '450px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>{t.nameLabel}</label>
              <input 
                type="text" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                placeholder=""
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            {clientType === 'B2B' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>{t.vatLabel}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={clientVat} 
                    onChange={(e) => { setClientVat(e.target.value); setViesStatus('idle'); }} 
                    placeholder="BE 0123.456.789"
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <button 
                    onClick={handleViesCheck} 
                    style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {t.viesBtn}
                  </button>
                </div>
                {viesStatus === 'valid' && (
                  <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '13px', marginTop: '5px' }}>
                    ✓ {t.viesOk}
                  </p>
                )}
                {viesStatus === 'invalid' && (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '5px' }}>
                    ✗ {t.viesError}
                  </p>
                )}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>{t.countryLabel}</label>
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {EU_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {lang === 'FR' ? country.nameFR : country.nameNL}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '15px' }}>
              <button 
                disabled={!canGoToStep2}
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: canGoToStep2 ? '#16a34a' : '#94a3b8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: canGoToStep2 ? 'pointer' : 'not-allowed'
                }}>
                {t.nextStep}
              </button>
              {clientType === 'B2B' && viesStatus !== 'valid' && (
                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '5px', textAlign: 'center' }}>
                  {t.viesRequired}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ÉTAPE 2 ================= */}
      {step === 2 && (
        <div>
          <h2>{t.step2Title}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Âge du bâtiment */}
            <div style={{ maxWidth: '500px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>
                {t.ageLabel}
              </label>
              <select 
                value={buildingAge} 
                onChange={(e) => setBuildingAge(e.target.value as 'over10' | 'under10')}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="over10">{t.ageOver10}</option>
                <option value="under10">{t.ageUnder10}</option>
              </select>
            </div>

            {/* Usage du bâtiment */}
            <div style={{ maxWidth: '500px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>
                {t.usageLabel}
              </label>
              <select 
                value={buildingUsage} 
                onChange={(e) => setBuildingUsage(e.target.value as any)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="prive100">{t.usagePrive100}</option>
                <option value="prive50">{t.usagePrive50}</option>
                <option value="pro">{t.usagePro}</option>
                <option value="mixte">{t.usageMixte}</option>
              </select>
            </div>

            {/* SAISIE DES SUPERFICIES SI USAGE MIXTE */}
            {buildingUsage === 'mixte' && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '6px', maxWidth: '550px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '14px' }}>
                  {t.surfaceBoxTitle}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>{t.surfacePriveLabel}</label>
                    <input 
                      type="number" 
                      value={surfacePrive} 
                      onChange={(e) => setSurfacePrive(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="ex: 120"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>{t.surfaceProLabel}</label>
                    <input 
                      type="number" 
                      value={surfacePro} 
                      onChange={(e) => setSurfacePro(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="ex: 100"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '13px' }}>
                  <p style={{ margin: '0 0 5px 0' }}>
                    <strong>{t.totalSurfaceLabel} :</strong> {totalSurface} m² 
                    {totalSurface > 0 && ` (Privé : ${Math.round((numPrive/totalSurface)*100)}% | Pro : ${Math.round((numPro/totalSurface)*100)}%)`}
                  </p>
                  {totalSurface > 0 && (
                    <p style={{ margin: 0, fontWeight: 'bold', color: isTotalOver200 ? '#16a34a' : '#dc2626' }}>
                      {isTotalOver200 ? t.minSurfaceOk : t.minSurfaceKo}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Nature des travaux */}
            <div style={{ maxWidth: '500px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>
                {t.workLabel}
              </label>
              <select 
                value={workType} 
                onChange={(e) => setWorkType(e.target.value as any)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="renov">{t.workRenov}</option>
                <option value="heatpump">{t.workHeatPump}</option>
                <option value="garden">{t.workGarden}</option>
                <option value="solar">{t.workSolar}</option>
                <option value="demolition">{t.workDemolition}</option>
              </select>
            </div>

            {/* TRAVAUX EXTÉRIEURS */}
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#15803d', marginBottom: '2px' }}>
                {t.outdoorTitle}
              </label>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
                {t.outdoorSubtitle}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div 
                  onClick={() => setOutdoorOption('none')}
                  style={{
                    border: outdoorOption === 'none' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: outdoorOption === 'none' ? '#eff6ff' : '#fff'
                  }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>🚫</div>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{t.outdoorNoneTitle}</strong>
                </div>

                <div 
                  onClick={() => setOutdoorOption('garden')}
                  style={{
                    border: outdoorOption === 'garden' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: outdoorOption === 'garden' ? '#eff6ff' : '#fff'
                  }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌱</div>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{t.outdoorGardenTitle}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t.outdoorGardenSub}</div>
                </div>

                <div 
                  onClick={() => setOutdoorOption('landscaping')}
                  style={{
                    border: outdoorOption === 'landscaping' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: outdoorOption === 'landscaping' ? '#eff6ff' : '#fff'
                  }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>🏗️</div>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{t.outdoorLandscapingTitle}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t.outdoorLandscapingSub}</div>
                </div>
              </div>
            </div>

            {/* Adresse du Chantier */}
            <div style={{ maxWidth: '500px', margin: '10px 0' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }}>
                {t.siteAddressLabel}
              </label>
              <input 
                type="text" 
                value={siteAddress} 
                onChange={(e) => setSiteAddress(e.target.value)} 
                placeholder=""
                style={{ width: '100%', padding: '8px', textAlign: 'center', fontSize: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
              <button 
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {t.previousStep}
              </button>
              <button 
                onClick={() => setStep(3)}
                style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {t.toStep3}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= ÉTAPE 3 ================= */}
      {step === 3 && (
        <div>
          <h2>{t.step3Title}</h2>

          {/* RÉSULTAT TVA */}
          <div style={{ background: '#f8fafc', border: `2px solid ${vatResult.color}`, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b' }}>
              {t.regimeTitle}
            </span>
            <h3 style={{ margin: '5px 0 10px 0', fontSize: '22px', color: vatResult.color }}>
              {vatResult.regime} ({vatResult.rateText})
            </h3>

            {/* CLAUSE OBLIGATOIRE SUR FACTURE */}
            <div style={{ marginTop: '15px', background: '#fff', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '6px' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                📋 {t.legalClauseTitle} :
              </strong>
              <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: '13px', color: '#334155', background: '#f1f5f9', padding: '10px', borderRadius: '4px' }}>
                {vatResult.clause}
              </blockquote>
              
              <button 
                onClick={handleCopy}
                style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {copied ? `✓ ${t.copiedMsg}` : t.copyBtn}
              </button>
            </div>
          </div>

          {/* RÉCAPITULATIF DU DOSSIER TRADUIT */}
          <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '6px', background: '#ffffff', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '14px' }}>{t.summaryTitle}</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569' }}>
              <li><strong>{t.summaryClient} :</strong> {clientName || 'N/A'} ({clientType === 'B2B' ? `B2B - TVA : ${clientVat}` : 'B2C Particular'})</li>
              <li><strong>{t.summaryCountry} :</strong> {selectedCountry}</li>
              <li><strong>{t.summaryBuildingAge} :</strong> {buildingAge === 'over10' ? '≥ 10 ans' : '< 10 ans'}</li>
              <li><strong>{t.summaryUsage} :</strong> {buildingUsage} {buildingUsage === 'mixte' && `(${totalSurface} m² total)`}</li>
              <li><strong>{t.summaryWorkType} :</strong> {workType}</li>
              {outdoorOption !== 'none' && <li><strong>{t.summaryOutdoor} :</strong> {outdoorOption}</li>}
              {siteAddress && <li><strong>{t.summarySiteAddress} :</strong> {siteAddress}</li>}
            </ul>
          </div>

          {/* BOUTONS D'ACTION */}
          <div style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
            <button 
              onClick={() => setStep(2)}
              style={{ flex: 1, padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {t.previousStep}
            </button>
            <button 
              onClick={() => setStep(1)}
              style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              🔄 {t.restartBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
