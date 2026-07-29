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
    
    // Saisie Surfaces Mixte (Minimum 200 m²)
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

    // Travaux extérieurs / Espaces verts
    outdoorTitle: "🌿 TRAVAUX EXTÉRIEURS / ESPACES VERTS (OPTIONNEL)",
    outdoorSubtitle: "Cochez uniquement si la prestation porte sur l'entretien ou l'aménagement d'espaces verts.",
    outdoorNoneTitle: "Ne s'applique pas",
    outdoorGardenTitle: "Entretien courant",
    outdoorGardenSub: "(Tonte, taille, plantes...)",
    outdoorLandscapingTitle: "Aménagement & Gros travaux",
    outdoorLandscapingSub: "(Terrasse, pavage...)",

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
    
    // Saisie Surfaces Mixte (NL)
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

    // Travaux extérieurs / Espaces verts (NL)
    outdoorTitle: "🌿 BUITENWERKEN / GROENVOORZIENINGEN (OPTIONEEL)",
    outdoorSubtitle: "Vink alleen aan als de dienst betrekking heeft op het onderhoud of de aanleg van groene ruimten.",
    outdoorNoneTitle: "Niet van toepassing",
    outdoorGardenTitle: "Lopend onderhoud",
    outdoorGardenSub: "(Maaien, snoeien, planten...)",
    outdoorLandscapingTitle: "Aanleg & Grote werken",
    outdoorLandscapingSub: "(Terras, bestrating...)",

    siteAddressLabel: "Adres van de werf / bouwwerf",
    previousStep: "Terug naar Stap 1",
    toStep3: "Btw-regeling berekenen (Stap 3)"
  }
};

export default function App() {
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const t = TRANSLATIONS[lang];

  // Nav Étape (1 ou 2)
  const [step, setStep] = useState<1 | 2>(1);

  // --- ÉTAPE 1 : ÉTATS ---
  const [clientType, setClientType] = useState<'B2B' | 'B2C'>('B2C');
  const [clientName, setClientName] = useState('');
  const [clientVat, setClientVat] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('BE');
  const [viesStatus, setViesStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // --- ÉTAPE 2 : ÉTATS ---
  const [buildingAge, setBuildingAge] = useState<'over10' | 'under10'>('over10');
  const [buildingUsage, setBuildingUsage] = useState<'prive100' | 'prive50' | 'pro' | 'mixte'>('prive100');
  
  // Surfaces pour l'usage mixte (saisie libre par l'entrepreneur)
  const [surfacePrive, setSurfacePrive] = useState<number | ''>('');
  const [surfacePro, setSurfacePro] = useState<number | ''>('');

  const [workType, setWorkType] = useState<'renov' | 'heatpump' | 'garden' | 'solar' | 'demolition'>('renov');
  
  // Travaux Extérieurs / Espaces verts (Optionnel)
  const [outdoorOption, setOutdoorOption] = useState<'none' | 'garden' | 'landscaping'>('none');

  const [siteAddress, setSiteAddress] = useState('');

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

            {/* SAISIE DES SUPERFICIES SI USAGE MIXTE (MINIMUM 200 m²) */}
            {buildingUsage === 'mixte' && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '6px', maxWidth: '550px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '14px' }}>
                  Répartition des superficies (Usage Mixte — Minimum 200 m²)
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

                {/* Validation du Seuil de 200 m² sur la Superficie Totale */}
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

            {/* SECTIONS TRAVAUX EXTÉRIEURS / ESPACES VERTS (OPTIONNEL) */}
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#15803d', marginBottom: '2px' }}>
                {t.outdoorTitle}
              </label>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
                {t.outdoorSubtitle}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                
                {/* Option 1 : Ne s'applique pas */}
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

                {/* Option 2 : Entretien courant */}
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

                {/* Option 3 : Aménagement & Gros travaux */}
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
                onClick={() => alert("Étape 3 : Prêt pour le moteur fiscal !")}
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
