import React, { useState } from 'react';
import { DevisFactureScreen } from './components/DevisFactureScreen';

// Dictionnaire de traduction FR / NL complet
const translations = {
  FR: {
    title: "Détermination TVA « Travaux immobiliers » — Belgique 2025-2026",
    step1Nav: "1. Profil Client",
    step2Nav: "2. Bâtiment & VIES",
    step3Nav: "3. Régime TVA",
    step1Title: "Étape 1 : Profil Client",
    clientTypeB2C: "Particulier / Non-assujetti (B2C)",
    clientTypeB2B: "Assujetti à la TVA (B2B)",
    clientNameLabel: "Nom / Raison sociale :",
    clientVatLabel: "Numéro TVA client :",
    siteAddressLabel: "Adresse du chantier :",
    siteAddressPlaceholder: "Rue, N°, Code Postal, Ville",
    btnToStep2: "Passer à l'Étape 2 →",
    step2Title: "Étape 2 : Localisation, VIES & Bâtiment",
    countryLabel: "Pays du client / chantier :",
    viesBoxTitle: "🇪🇺 Vérification du numéro de TVA VIES :",
    viesBtn: "Vérifier VIES",
    viesLoading: "Vérification...",
    viesValid: "✅ Numéro TVA Valide dans le système VIES.",
    viesInvalid: "❌ Numéro TVA Invalide sur VIES.",
    buildingAgeLabel: "Ancienneté du bâtiment :",
    buildingAgeMore10: "Plus de 10 ans d'ancienneté",
    buildingAgeLess10: "Moins de 10 ans / Neuf",
    buildingUseLabel: "Usage du bâtiment :",
    buildingUsePrivate: "Logement principalement privé",
    buildingUsePro: "Usage professionnel / Commercial",
    btnBack: "← Retour",
    btnToStep3: "Passer à l'Étape 3 →",
    step3Title: "Étape 3 : Régime TVA & Attestation Légale",
    regimeTitle: "RÉGIME TVA APPLICABLE",
    legalNoticeTitle: "📜 Mention légale obligatoire à inscrire sur la facture :",
    btnToStep4: "📄 Générer le Devis / la Facture →",
    // Régimes TVA FR
    labelAuto: "Autoliquidation (Co-contractant) - Article 20 AR n°1",
    noticeAuto: "Autoliquidation : En l'absence de contestation par écrit, dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques et que les travaux immobiliers sont affectés à son activité professionnelle (Art. 20 KB n° 1).",
    labelIntra: "Prestation Intracommunautaire (Autoliquidation 0%)",
    noticeIntra: "Exonération de TVA - Autoliquidation par le destinataire (Article 196 de la Directive 2006/112/CE).",
    labelExport: "Exportation / Hors UE (0%)",
    noticeExport: "Prestation localisée hors Union Européenne - Exonération de TVA.",
    labelReduit: "Taux réduit 6% (Habitation privée > 10 ans)",
    noticeReduit: "Taux réduit de 6% applicable (Rubrique XXXVIII de l'annexe au KB n° 20). Le client atteste que l'immeuble est affecté à titre principal comme logement privé et est occupé depuis plus de 10 ans.",
    labelNormal: "Taux normal 21%",
    noticeNormal: "Taux normal de 21% applicable aux travaux immobiliers."
  },
  NL: {
    title: "BTW-bepaling «Werken in onroerende staat» — België 2025-2026",
    step1Nav: "1. Klantprofiel",
    step2Nav: "2. Gebouw & VIES",
    step3Nav: "3. BTW-regime",
    step1Title: "Stap 1: Klantprofiel",
    clientTypeB2C: "Particulier / Niet-belastingplichtige (B2C)",
    clientTypeB2B: "BTW-belastingplichtige (B2B)",
    clientNameLabel: "Naam / Bedrijfsnaam:",
    clientVatLabel: "BTW-nummer klant:",
    siteAddressLabel: "Adres van de werf:",
    siteAddressPlaceholder: "Straat, Nr, Postcode, Stad",
    btnToStep2: "Ga naar Stap 2 →",
    step2Title: "Stap 2: Locatie, VIES & Gebouw",
    countryLabel: "Land van klant / werf:",
    viesBoxTitle: "🇪🇺 Verificatie VIES BTW-nummer:",
    viesBtn: "VIES Controleren",
    viesLoading: "Controleren...",
    viesValid: "✅ Geldig BTW-nummer in VIES-systeem.",
    viesInvalid: "❌ Ongeldig BTW-nummer op VIES.",
    buildingAgeLabel: "Ouderdom van het gebouw:",
    buildingAgeMore10: "Meer dan 10 jaar oud",
    buildingAgeLess10: "Minder dan 10 jaar / Nieuw",
    buildingUseLabel: "Gebruik van het gebouw:",
    buildingUsePrivate: "Hoofdzakelijk privéwoning",
    buildingUsePro: "Professioneel / Commercieel gebruik",
    btnBack: "← Terug",
    btnToStep3: "Ga naar Stap 3 →",
    step3Title: "Stap 3: BTW-regime & Wettelijke Attestering",
    regimeTitle: "TOEPASSELIJK BTW-REGIME",
    legalNoticeTitle: "📜 Verplichte wettelijke vermelding op de factuur:",
    btnToStep4: "📄 Offerte / Factuur Genereren →",
    // Régimes TVA NL
    labelAuto: "Btw verlegd (Medecontractant) - Artikel 20 KB nr. 1",
    noticeAuto: "Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer verondersteld te erkennen dat hij een belastingplichtige is die gehouden is tot het indienen van periodieke aangiften en dat de werken in onroerende staat bestemd zijn voor zijn professionele activiteit (Art. 20 KB nr. 1).",
    labelIntra: "Intracommunautaire dienst (Btw verlegd 0%)",
    noticeIntra: "Vrijstelling van BTW - Verlegging van heffing naar de medecontractant (Artikel 196 Richtlijn 2006/112/EG).",
    labelExport: "Export / Buiten EU (0%)",
    noticeExport: "Dienst geplaatst buiten de Europese Unie - Vrijstelling van BTW.",
    labelReduit: "Verlaagd tarief 6% (Privéwoning > 10 jaar)",
    noticeReduit: "Verlaagd tarief van 6% van toepassing (Rubriek XXXVIII van bijlage KB nr. 20). De klant attesteert dat het gebouw hoofdzakelijk als privéwoning wordt gebruikt en meer dan 10 jaar in gebruik is.",
    labelNormal: "Normaal tarief 21%",
    noticeNormal: "Normaal tarief van 21% van toepassing op werken in onroerende staat."
  }
};

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');

  const t = translations[lang];

  // Étape 1 : Client
  const [clientType, setClientType] = useState<'b2c' | 'b2b'>('b2b');
  const [clientName, setClientName] = useState<string>('Vicernant(NV)');
  const [clientVat, setClientVat] = useState<string>('BE 0400.075.312');
  const [siteAddress, setSiteAddress] = useState<string>('');

  // Étape 2 : Pays, VIES & Bâtiment
  const [country, setCountry] = useState<string>('BE');
  const [viesStatus, setViesStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [buildingAge, setBuildingAge] = useState<'more10' | 'less10'>('more10');
  const [buildingUse, setBuildingUse] = useState<'private' | 'pro'>('private');

  // Simulation / Vérification VIES
  const handleCheckVies = () => {
    if (!clientVat) return;
    setViesStatus('loading');
    setTimeout(() => {
      if (clientVat.replace(/[^a-zA-Z0-9]/g, '').length >= 8) {
        setViesStatus('valid');
      } else {
        setViesStatus('invalid');
      }
    }, 600);
  };

  // Calcul du régime TVA selon la langue active
  const getVatLogic = () => {
    if (clientType === 'b2b') {
      if (country === 'BE') {
        return { rate: 0 as const, label: t.labelAuto, notice: t.noticeAuto };
      } else if (country !== 'NON_EU') {
        return { rate: 0 as const, label: t.labelIntra, notice: t.noticeIntra };
      } else {
        return { rate: 0 as const, label: t.labelExport, notice: t.noticeExport };
      }
    }

    if (country === 'BE') {
      if (buildingAge === 'more10' && buildingUse === 'private') {
        return { rate: 6 as const, label: t.labelReduit, notice: t.noticeReduit };
      }
      return { rate: 21 as const, label: t.labelNormal, notice: t.noticeNormal };
    }

    return { rate: 21 as const, label: t.labelNormal, notice: t.noticeNormal };
  };

  const currentVat = getVatLogic();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sélecteur FR / NL */}
      <div style={{ maxWidth: '800px', margin: '0 auto 10px auto', textAlign: 'right' }}>
        <button 
          onClick={() => setLang('FR')} 
          style={{ fontWeight: lang === 'FR' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', padding: '5px', fontSize: '14px' }}>
          🇫🇷 FR
        </button>
        |
        <button 
          onClick={() => setLang('NL')} 
          style={{ fontWeight: lang === 'NL' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', padding: '5px', fontSize: '14px' }}>
          🇳🇱 NL
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1e3a8a', marginTop: 0 }}>
          {t.title}
        </h2>

        {/* Fil d'Ariane */}
        {step <= 3 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            <span style={{ color: step === 1 ? '#2563eb' : '#64748b' }}>{t.step1Nav}</span> &gt;
            <span style={{ color: step === 2 ? '#2563eb' : '#64748b' }}>{t.step2Nav}</span> &gt;
            <span style={{ color: step === 3 ? '#2563eb' : '#64748b' }}>{t.step3Nav}</span>
          </div>
        )}

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <div>
            <h3>{t.step1Title}</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input type="radio" name="clientType" value="b2c" checked={clientType === 'b2c'} onChange={() => setClientType('b2c')} />
                {t.clientTypeB2C}
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input type="radio" name="clientType" value="b2b" checked={clientType === 'b2b'} onChange={() => setClientType('b2b')} />
                {t.clientTypeB2B}
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.clientNameLabel}</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            {clientType === 'b2b' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.clientVatLabel}</label>
                <input type="text" value={clientVat} onChange={(e) => setClientVat(e.target.value)} placeholder="BE 0123.456.789" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.siteAddressLabel}</label>
              <input type="text" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} placeholder={t.siteAddressPlaceholder} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <button onClick={() => setStep(2)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              {t.btnToStep2}
            </button>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <div>
            <h3>{t.step2Title}</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.countryLabel}</label>
              <select value={country} onChange={(e) => { setCountry(e.target.value); setViesStatus('idle'); }} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="BE">🇧🇪 Belgique / België (BE)</option>
                <option value="FR">🇫🇷 France / Frankrijk (FR)</option>
                <option value="NL">🇳🇱 Pays-Bas / Nederland (NL)</option>
                <option value="DE">🇩🇪 Allemagne / Duitsland (DE)</option>
                <option value="LU">🇱🇺 Luxembourg / Luxemburg (LU)</option>
                <option value="ES">🇪🇸 Espagne / Spanje (ES)</option>
                <option value="IT">🇮🇹 Italie / Italië (IT)</option>
                <option value="EU_OTHER">🇪🇺 Autre pays UE / Ander EU-land</option>
                <option value="NON_EU">🌐 Hors UE / Buiten EU</option>
              </select>
            </div>

            {clientType === 'b2b' && country !== 'NON_EU' && (
              <div style={{ marginBottom: '20px', background: '#f1f5f9', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e3a8a' }}>{t.viesBoxTitle}</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{clientVat || '—'}</span>
                  <button onClick={handleCheckVies} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {viesStatus === 'loading' ? t.viesLoading : t.viesBtn}
                  </button>
                </div>
                {viesStatus === 'valid' && <p style={{ color: '#16a34a', margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '13px' }}>{t.viesValid}</p>}
                {viesStatus === 'invalid' && <p style={{ color: '#dc2626', margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '13px' }}>{t.viesInvalid}</p>}
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.buildingAgeLabel}</label>
              <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input type="radio" name="buildingAge" value="more10" checked={buildingAge === 'more10'} onChange={() => setBuildingAge('more10')} />
                {t.buildingAgeMore10}
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input type="radio" name="buildingAge" value="less10" checked={buildingAge === 'less10'} onChange={() => setBuildingAge('less10')} />
                {t.buildingAgeLess10}
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.buildingUseLabel}</label>
              <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input type="radio" name="buildingUse" value="private" checked={buildingUse === 'private'} onChange={() => setBuildingUse('private')} />
                {t.buildingUsePrivate}
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input type="radio" name="buildingUse" value="pro" checked={buildingUse === 'pro'} onChange={() => setBuildingUse('pro')} />
                {t.buildingUsePro}
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(1)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                {t.btnBack} 1
              </button>
              <button onClick={() => setStep(3)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                {t.btnToStep3}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {step === 3 && (
          <div>
            <h3>{t.step3Title}</h3>

            <div style={{ border: '1px solid #2563eb', background: '#eff6ff', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', fontWeight: 'bold' }}>{t.regimeTitle}</span>
              <h3 style={{ color: '#1e40af', margin: '5px 0 0 0' }}>{currentVat.label}</h3>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic' }}>{t.legalNoticeTitle}</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>« {currentVat.notice} »</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(2)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                {t.btnBack} 2
              </button>
              <button onClick={() => setStep(4)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                {t.btnToStep4}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : DEVIS / FACTURE */}
        {step === 4 && (
          <DevisFactureScreen 
            lang={lang}
            defaultVatRate={currentVat.rate}
            legalMention={currentVat.notice}
            initialClientName={clientName}
            initialClientVat={clientVat}
            initialSiteAddress={siteAddress}
            onBackToStep3={() => setStep(3)}
          />
        )}

      </div>
    </div>
  );
}
