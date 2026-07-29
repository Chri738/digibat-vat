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
    step1Title: "Étape 1 : Profil Client (Klantprofiel)",
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

    step2Title: "Étape 2 : Bien immobilier & Nature des travaux (Onroerend goed & Aard van de werken)",
    ageLabel: "Âge du bâtiment",
    ageOver10: "≥ 10 ans",
    ageUnder10: "< 10 ans",
    usageLabel: "Usage du bâtiment",
    usagePrive100: "100% Privé",
    usagePrive50: "> 50% Privé",
    usagePro: "Exclusif Pro",
    usageMixte: "Mixte (Privé + Pro)",
    surface200Label: "Superficie de la partie pro ≥ 200 m² ?",
    yes: "Oui",
    no: "Non",
    workLabel: "Nature des travaux",
    workRenov: "Rénovation standard",
    workHeatPump: "Pompe à chaleur",
    workGarden: "Entretien courant / Jardinage",
    workSolar: "Panneaux solaires & Isolation",
    workDemolition: "Démolition et/ou Construction",
    siteAddressLabel: "Adresse du chantier / bien",
    previousStep: "Retour Étape 1",
    toStep3: "Calculer le régime TVA (Étape 3)"
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
    surface200Label: "Oppervlakte beroepsgedeelte ≥ 200 m²?",
    yes: "Ja",
    no: "Nee",
    workLabel: "Aard van de werken",
    workRenov: "Standaard renovatie",
    workHeatPump: "Warmtepomp",
    workGarden: "Lopend onderhoud / Tuinonderhoud",
    workSolar: "Zonnepanelen & Isolatie",
    workDemolition: "Sloop en/of Bouw",
    siteAddressLabel: "Adres van de werf / bouwwerf",
    previousStep: "Terug naar Stap 1",
    toStep3: "Btw-regeling berekenen (Stap 3)"
  }
};

export default function App() {
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const t = TRANSLATIONS[lang];

  // Gestion des étapes (1 ou 2)
  const [step, setStep] = useState<1 | 2>(1);

  // --- ÉTAPE 1 : ÉTATS (Champs vierges par défaut) ---
  const [clientType, setClientType] = useState<'B2B' | 'B2C'>('B2C');
  const [clientName, setClientName] = useState('');
  const [clientVat, setClientVat] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('BE');
  const [viesStatus, setViesStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // --- ÉTAPE 2 : ÉTATS (Champs neutres) ---
  const [buildingAge, setBuildingAge] = useState<'over10' | 'under10'>('over10');
  const [buildingUsage, setBuildingUsage] = useState<'prive100' | 'prive50' | 'pro' | 'mixte'>('prive100');
  const [isSurfaceOver200, setIsSurfaceOver200] = useState<boolean>(false);
  const [workType, setWorkType] = useState<'renov' | 'heatpump' | 'garden' | 'solar' | 'demolition'>('renov');
  const [siteAddress, setSiteAddress] = useState('');

  // Simulation / Vérification VIES
  const handleViesCheck = () => {
    if (clientVat.trim().length > 5) {
      setViesStatus('valid');
    } else {
      setViesStatus('invalid');
    }
  };

  const canGoToStep2 = clientType === 'B2C' || viesStatus === 'valid';

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
            
            {/* Âge du bâtiment */}
            <div>
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
            <div>
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

            {/* Condition 200 m² si Mixte */}
            {buildingUsage === 'mixte' && (
              <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '4px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {t.surface200Label}
                </label>
                <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="surface200" 
                    checked={isSurfaceOver200} 
                    onChange={() => setIsSurfaceOver200(true)} 
                  /> {t.yes}
                </label>
                <label style={{ cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="surface200" 
                    checked={!isSurfaceOver200} 
                    onChange={() => setIsSurfaceOver200(false)} 
                  /> {t.no}
                </label>
              </div>
            )}

            {/* Nature des travaux */}
            <div>
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

            {/* Adresse du Chantier */}
            <div>
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {t.previousStep}
              </button>
              <button 
                onClick={() => alert("Étape 3 : Moteur fiscal disponible à l'étape suivante !")}
                style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {t.toStep3}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
