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
    viesOk: "TVA VIES Validée (OK)",
    nameLabel: "Nom / Raison sociale",
    vatLabel: "Numéro de TVA",
    countryLabel: "Pays du client",
    nextStep: "Étape suivante"
  },
  NL: {
    title: "Btw-bepaling « Werken in onroerende staat » — België 2025-2026",
    subtitle: "Conform de hervormingen 2025-2026",
    step1Title: "Stap 1: Klantprofiel",
    clientTypeB2B: "Btw-plichtige (B2B)",
    clientTypeB2C: "Particulier (B2C)",
    viesOk: "VIES Validated (Oké)",
    nameLabel: "Naam / Bedrijfsnaam",
    vatLabel: "Btw-nummer",
    countryLabel: "Land van de klant",
    nextStep: "Volgende stap"
  }
};

export default function App() {
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const t = TRANSLATIONS[lang];

  // États vierges par défaut
  const [clientType, setClientType] = useState<'B2B' | 'B2C'>('B2C');
  const [clientName, setClientName] = useState('');
  const [clientVat, setClientVat] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('BE');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      {/* Sélecteur de Langue */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button 
          onClick={() => setLang('FR')} 
          style={{ fontWeight: lang === 'FR' ? 'bold' : 'normal', marginRight: '5px', padding: '5px 10px' }}>
          FR
        </button>
        <button 
          onClick={() => setLang('NL')} 
          style={{ fontWeight: lang === 'NL' ? 'bold' : 'normal', padding: '5px 10px' }}>
          NL
        </button>
      </div>

      {/* En-tête */}
      <h1 style={{ fontSize: '20px', color: '#1e3a8a' }}>{t.title}</h1>
      <p style={{ color: '#64748b', fontSize: '14px' }}>{t.subtitle}</p>

      <hr style={{ margin: '20px 0' }} />

      {/* Étape 1 : Profil Client */}
      <h2>{t.step1Title}</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '15px' }}>
          <input 
            type="radio" 
            name="clientType" 
            checked={clientType === 'B2C'} 
            onChange={() => setClientType('B2C')} 
          /> {t.clientTypeB2C}
        </label>
        <label>
          <input 
            type="radio" 
            name="clientType" 
            checked={clientType === 'B2B'} 
            onChange={() => setClientType('B2B')} 
          /> {t.clientTypeB2B}
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px' }}>{t.nameLabel}</label>
          <input 
            type="text" 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
            placeholder=""
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {clientType === 'B2B' && (
          <div>
            <label style={{ display: 'block', fontSize: '12px' }}>{t.vatLabel}</label>
            <input 
              type="text" 
              value={clientVat} 
              onChange={(e) => setClientVat(e.target.value)} 
              placeholder="BE 0123.456.789"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '12px' }}>{t.countryLabel}</label>
          <select 
            value={selectedCountry} 
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            {EU_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {lang === 'FR' ? country.nameFR : country.nameNL}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
