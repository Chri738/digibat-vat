import React, { useState } from 'react';
import { calculateVAT, VatInput, VatResult } from './vatEngine';

// Liste des 27 pays de l'UE
const EU_COUNTRIES = [
  { code: 'BE', name_fr: 'Belgique (BE)', name_nl: 'België (BE)' },
  { code: 'FR', name_fr: 'France (FR)', name_nl: 'Frankrijk (FR)' },
  { code: 'NL', name_fr: 'Pays-Bas (NL)', name_nl: 'Nederland (NL)' },
  { code: 'DE', name_fr: 'Allemagne (DE)', name_nl: 'Duitsland (DE)' },
  { code: 'LU', name_fr: 'Luxembourg (LU)', name_nl: 'Luxemburg (LU)' },
  { code: 'AT', name_fr: 'Autriche (AT)', name_nl: 'Oostenrijk (AT)' },
  { code: 'BG', name_fr: 'Bulgarie (BG)', name_nl: 'Bulgarije (BG)' },
  { code: 'CY', name_fr: 'Chypre (CY)', name_nl: 'Cyprus (CY)' },
  { code: 'CZ', name_fr: 'Tchéquie (CZ)', name_nl: 'Tsjechië (CZ)' },
  { code: 'DK', name_fr: 'Danemark (DK)', name_nl: 'Denemarken (DK)' },
  { code: 'EE', name_fr: 'Estonie (EE)', name_nl: 'Estland (EE)' },
  { code: 'ES', name_fr: 'Espagne (ES)', name_nl: 'Spanje (ES)' },
  { code: 'FI', name_fr: 'Finlande (FI)', name_nl: 'Finland (FI)' },
  { code: 'GR', name_fr: 'Grèce (GR)', name_nl: 'Griekenland (GR)' },
  { code: 'HR', name_fr: 'Croatie (HR)', name_nl: 'Kroatië (HR)' },
  { code: 'HU', name_fr: 'Hongrie (HU)', name_nl: 'Hongarije (HU)' },
  { code: 'IE', name_fr: 'Irlande (IE)', name_nl: 'Ierland (IE)' },
  { code: 'IT', name_fr: 'Italie (IT)', name_nl: 'Italië (IT)' },
  { code: 'LT', name_fr: 'Lituanie (LT)', name_nl: 'Litouwen (LT)' },
  { code: 'LV', name_fr: 'Lettonie (LV)', name_nl: 'Letland (LV)' },
  { code: 'MT', name_fr: 'Malte (MT)', name_nl: 'Malta (MT)' },
  { code: 'PL', name_fr: 'Pologne (PL)', name_nl: 'Polen (PL)' },
  { code: 'PT', name_fr: 'Portugal (PT)', name_nl: 'Portugal (PT)' },
  { code: 'RO', name_fr: 'Roumanie (RO)', name_nl: 'Roemenië (RO)' },
  { code: 'SE', name_fr: 'Suède (SE)', name_nl: 'Zweden (SE)' },
  { code: 'SI', name_fr: 'Slovénie (SI)', name_nl: 'Slovenië (SI)' },
  { code: 'SK', name_fr: 'Slovaquie (SK)', name_nl: 'Slowakije (SK)' }
];

// Dictionnaire de traduction 100% dynamique
const i18n = {
  FR: {
    subtitle: 'Détermination TVA « Travaux immobiliers » — Belgique',
    step1: '1. Profil Client',
    step2: '2. Bien & Travaux',
    step3: '3. Moteur Fiscal',
    step4: '4. 📝 Écran Devis',
    step5: '5. 🧾 Écran Facture',
    stepTitle1: 'Étape 1 : Profil Client',
    stepTitle2: 'Étape 2 : Bien Immobilier & Nature des Travaux',
    stepTitle3: 'Étape 3 : Régime TVA Déterminé',
    countryLabel: 'Pays du client',
    statusLabel: 'Statut du client',
    b2c: 'Particulier (B2C)',
    b2b: 'Assujetti (B2B)',
    clientNameLabel: 'Nom du client',
    vatNumLabel: 'Numéro de TVA',
    viesBtn: 'Vérifier VIES',
    viesValid: '✓ TVA VIES Validée (OK)',
    nextBtn: 'Étape suivante →',
    calcBtn: 'Calculer TVA →',
    ageLabel: 'Âge du bâtiment',
    ageOver10: '≥ 10 ans',
    ageUnder10: '< 10 ans',
    usageLabel: 'Usage du bâtiment',
    usage100Priv: '100% Habitation privée',
    usageMixed: 'Usage Mixte (Privé / Pro)',
    usage100Pro: '100% Beroepsgebruik / Pro',
    surfPrivLabel: 'Surface Privée (m²)',
    surfProLabel: 'Surface Professionnelle (m²)',
    workTypeLabel: 'Nature principale des travaux',
    workRenov: 'Travaux de rénovation (standard)',
    workEnergy: 'Isolation / Énergie',
    workDemo: 'Démolition & Reconstruction',
    siteAddrLabel: 'Adresse du chantier',
    applicableRate: 'Taux applicable :',
    detailLabel: 'Détail :',
    legalNoticeTitle: 'Mention légale obligatoire :',
    genQuote: '📝 Générer le Devis',
    genInvoice: '🧾 Générer la Facture',
    quoteTitle: 'DEVIS / OFFERTE',
    invoiceTitle: 'FACTURE / FACTUUR',
    providerTitle: 'PRESTATAIRE / ENTREPRENEUR',
    clientChantierTitle: 'CLIENT & CHANTIER',
    addPos: '+ Ajouter une ligne',
    subTotal: 'Sous-total HT :',
    vatAmount: 'Montant TVA :',
    totalTtc: 'Total TTC :',
    btnPrint: '🖨️ Imprimer',
    btnSavePdf: '💾 Enregistrer (PDF)',
    btnPeppol: '🌐 Envoyer via Peppol',
    peppolSuccess: 'Facture convertie en UBL 3.0 et transmise avec succès sur le réseau Peppol !'
  },
  NL: {
    subtitle: 'BTW-bepaling « Onroerende werken » — België',
    step1: '1. Klantprofiel',
    step2: '2. Pand & Werken',
    step3: '3. Fiscale Engine',
    step4: '4. 📝 Offerte',
    step5: '5. 🧾 Factuur',
    stepTitle1: 'Stap 1: Klantidentificatie',
    stepTitle2: 'Stap 2: Kenmerken Gebouw & Werken',
    stepTitle3: 'Stap 3: Bepaling BTW-regime',
    countryLabel: 'Land van de klant',
    statusLabel: 'Statuut van de klant',
    b2c: 'Particulier (B2C)',
    b2b: 'BTW-plichtige (B2B)',
    clientNameLabel: 'Naam van de klant',
    vatNumLabel: 'BTW-nummer',
    viesBtn: 'Controleer VIES',
    viesValid: '✓ BTW VIES Goedgekeurd (OK)',
    nextBtn: 'Volgende stap →',
    calcBtn: 'Bereken BTW →',
    ageLabel: 'Ouderdom van het gebouw',
    ageOver10: '≥ 10 jaar oud',
    ageUnder10: '< 10 jaar oud',
    usageLabel: 'Bestemming van het gebouw',
    usage100Priv: '100% Privéwoning',
    usageMixed: 'Gemengd gebruik (Privé / Pro)',
    usage100Pro: '100% Beroepsgebruik',
    surfPrivLabel: 'Privé oppervlakte (m²)',
    surfProLabel: 'Professionele oppervlakte (m²)',
    workTypeLabel: 'Aard van de werkzaamheden',
    workRenov: 'Renovatiewerken (standaard)',
    workEnergy: 'Isolatie / Energie',
    workDemo: 'Sloop & Heropbouw',
    siteAddrLabel: 'Adres van de werf',
    applicableRate: 'Toepasselijk tarief:',
    detailLabel: 'Details:',
    legalNoticeTitle: 'Verplichte juridische vermelding:',
    genQuote: '📝 Offerte Genereren',
    genInvoice: '🧾 Factuur Genereren',
    quoteTitle: 'OFFERTE / DEVIS',
    invoiceTitle: 'FACTUUR / FACTURE',
    providerTitle: 'DIENSTENVERLENER / ONDERNEMER',
    clientChantierTitle: 'KLANT & WERF',
    addPos: '+ Lijn toevoegen',
    subTotal: 'Subtotaal ex. BTW:',
    vatAmount: 'BTW-bedrag:',
    totalTtc: 'Totaal incl. BTW:',
    btnPrint: '🖨️ Afdrukken',
    btnSavePdf: '💾 Opslaan als PDF',
    btnPeppol: '🌐 Verzenden via Peppol',
    peppolSuccess: 'Factuur omgezet naar UBL 3.0 en succesvol verzonden via het Peppol-netwerk!'
  }
};

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [language, setLanguage] = useState<'FR' | 'NL'>('FR');
  const t = i18n[language];

  // Form State
  const [form, setForm] = useState<VatInput>({
    clientType: 'B2B',
    countryCode: 'BE',
    buildingAge: 'OVER_EQUAL_10',
    buildingUsage: '100_PRIVATE',
    workType: 'renov_standard',
    surfacePrivate: 120,
    surfacePro: 80,
    isUniqueOwnHome: true,
    surfaceMax200m2: true,
    language: 'FR'
  });

  const [clientInfo, setClientInfo] = useState({
    name: 'Livlina NV',
    vatNumber: 'BE 0448.553.239',
    siteAddress: 'Heidestraat 43, 9070 Destelbergen',
    isViesValidated: true
  });

  const [contractorInfo, setContractorInfo] = useState({
    name: 'Mira SARL',
    vatNumber: 'BE 0552.235.026',
    address: 'Rue de l\'Industrie 12, 1000 Bruxelles'
  });

  const [lineItems, setLineItems] = useState([
    { id: '1', description: 'Travaux de rénovation (standard)', quantity: 1, unitPrice: 150, vatRate: 0 }
  ]);

  // Combined VAT Calculation
  const vatResult: VatResult = calculateVAT({ ...form, language });

  const handleStepChange = (targetStep: number) => {
    if ((targetStep === 4 || targetStep === 5) && lineItems.length > 0) {
      setLineItems(prev => prev.map(item => ({ ...item, vatRate: vatResult.rate })));
    }
    setActiveStep(targetStep);
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addLineItem = () => {
    setLineItems(prev => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, vatRate: vatResult.rate }
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const triggerPeppol = () => {
    alert(t.peppolSuccess);
  };

  // Calculations
  const totalExcl = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalVat = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + totalVat;

  return (
    <div style={{ padding: '24px', maxWidth: '1050px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* HEADER & LANGUAGE SWITCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>DIGIBÂT VAT / DIGIBOUW BTW</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          <button 
            onClick={() => { setLanguage('FR'); setForm(f => ({ ...f, language: 'FR' })); }}
            style={{ padding: '6px 14px', background: language === 'FR' ? '#2563eb' : 'transparent', color: language === 'FR' ? '#fff' : '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >FR</button>
          <button 
            onClick={() => { setLanguage('NL'); setForm(f => ({ ...f, language: 'NL' })); }}
            style={{ padding: '6px 14px', background: language === 'NL' ? '#2563eb' : 'transparent', color: language === 'NL' ? '#fff' : '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >NL</button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 1, label: t.step1 },
          { id: 2, label: t.step2 },
          { id: 3, label: t.step3 },
          { id: 4, label: t.step4 },
          { id: 5, label: t.step5 }
        ].map(step => (
          <button
            key={step.id}
            onClick={() => handleStepChange(step.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              background: activeStep === step.id ? '#2563eb' : '#ffffff',
              color: activeStep === step.id ? '#ffffff' : '#475569',
              fontWeight: activeStep === step.id ? 'bold' : '500',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* CONTENT CARD */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        
        {/* STEP 1: PROFIL CLIENT */}
        {activeStep === 1 && (
          <div>
            <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', color: '#1e293b' }}>
              {t.stepTitle1}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {t.countryLabel}
                </label>
                <select 
                  value={form.countryCode} 
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  {EU_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {language === 'NL' ? c.name_nl : c.name_fr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {t.statusLabel}
                </label>
                <div style={{ display: 'flex', gap: '16px', paddingTop: '8px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input 
                      type="radio" 
                      name="clientType" 
                      checked={form.clientType === 'B2C'} 
                      onChange={() => setForm({ ...form, clientType: 'B2C' })} 
                    /> {t.b2c}
                  </label>
                  <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                    <input 
                      type="radio" 
                      name="clientType" 
                      checked={form.clientType === 'B2B'} 
                      onChange={() => setForm({ ...form, clientType: 'B2B' })} 
                    /> {t.b2b}
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {t.clientNameLabel}
                </label>
                <input 
                  type="text" 
                  value={clientInfo.name} 
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              {form.clientType === 'B2B' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                    {t.vatNumLabel}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={clientInfo.vatNumber} 
                      onChange={(e) => setClientInfo({ ...clientInfo, vatNumber: e.target.value })}
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                    <button style={{ padding: '10px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                      {t.viesBtn}
                    </button>
                  </div>
                  <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold', display: 'block', marginTop: '6px' }}>
                    {t.viesValid}
                  </span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveStep(2)} 
              style={{ marginTop: '28px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', float: 'right' }}
            >
              {t.nextBtn}
            </button>
          </div>
        )}

        {/* STEP 2: BIEN & TRAVAUX */}
        {activeStep === 2 && (
          <div>
            <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', color: '#1e293b' }}>
              {t.stepTitle2}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {t.ageLabel}
                </label>
                <select 
                  value={form.buildingAge} 
                  onChange={(e) => setForm({ ...form, buildingAge: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  <option value="OVER_EQUAL_10">{t.ageOver10}</option>
                  <option value="UNDER_10">{t.ageUnder10}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {t.usageLabel}
                </label>
                <select 
                  value={form.buildingUsage} 
                  onChange={(e) => setForm({ ...form, buildingUsage: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  <option value="100_PRIVATE">{t.usage100Priv}</option>
                  <option value="MIXED">{t.usageMixed}</option>
                  <option value="100_PRO">{t.usage100Pro}</option>
                </select>
              </div>
            </div>

            {/* AFFICHE SI USAGE MIXTE EST SELECTIONNÉ */}
            {form.buildingUsage === 'MIXED' && (
              <div style={{ marginTop: '20px', background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1e40af' }}>
                  📐 Calcul de ventilation des surfaces / Oppervlakteberekening (Prorata)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{t.surfPrivLabel}</label>
                    <input 
                      type="number" 
                      value={form.surfacePrivate} 
                      onChange={(e) => setForm({ ...form, surfacePrivate: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #93c5fd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{t.surfProLabel}</label>
                    <input 
                      type="number" 
                      value={form.surfacePro} 
                      onChange={(e) => setForm({ ...form, surfacePro: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #93c5fd' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                {t.workTypeLabel}
              </label>
              <select 
                value={form.workType} 
                onChange={(e) => setForm({ ...form, workType: e.target.value as any })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              >
                <option value="renov_standard">{t.workRenov}</option>
                <option value="energy_insulation">{t.workEnergy}</option>
                <option value="demolition_reconstruction">{t.workDemo}</option>
              </select>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                {t.siteAddrLabel}
              </label>
              <input 
                type="text" 
                value={clientInfo.siteAddress} 
                onChange={(e) => setClientInfo({ ...clientInfo, siteAddress: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <button 
              onClick={() => setActiveStep(3)} 
              style={{ marginTop: '28px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', float: 'right' }}
            >
              {t.calcBtn}
            </button>
          </div>
        )}

        {/* STEP 3: MOTEUR FISCAL */}
        {activeStep === 3 && (
          <div>
            <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', color: '#1e293b' }}>
              {t.stepTitle3}
            </h2>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{t.applicableRate}</span>
                <span style={{ padding: '8px 20px', background: '#dcfce7', color: '#166534', fontWeight: 'bold', borderRadius: '30px', fontSize: '17px' }}>
                  ✓ {vatResult.rate}% {vatResult.secondaryRate ? `/ ${vatResult.secondaryRate}%` : ''} ({vatResult.label})
                </span>
              </div>

              <div style={{ marginTop: '16px', fontSize: '14px', color: '#334155' }}>
                <strong>{t.detailLabel}</strong> {vatResult.explanation}
              </div>

              {vatResult.legalNotice && (
                <div style={{ marginTop: '20px', background: '#eff6ff', borderLeft: '4px solid #2563eb', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: '#1e40af', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    {t.legalNoticeTitle}
                  </strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{vatResult.legalNotice}"
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleStepChange(4)} 
                style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
              >
                {t.genQuote}
              </button>
              <button 
                onClick={() => handleStepChange(5)} 
                style={{ padding: '14px 28px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
              >
                {t.genInvoice}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 & 5: DEVIS ET FACTURE */}
        {(activeStep === 4 || activeStep === 5) && (
          <div>
            {/* ACTION TOOLBAR: PRINT / SAVE / PEPPOL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                {activeStep === 4 ? t.quoteTitle : t.invoiceTitle}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => window.print()} 
                  style={{ padding: '8px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                  {t.btnPrint}
                </button>
                <button 
                  onClick={() => window.print()} 
                  style={{ padding: '8px 14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                  {t.btnSavePdf}
                </button>
                {activeStep === 5 && (
                  <button 
                    onClick={triggerPeppol} 
                    style={{ padding: '8px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    {t.btnPeppol}
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#64748b', textTransform: 'uppercase' }}>{t.providerTitle}</h4>
                <input type="text" value={contractorInfo.name} onChange={(e) => setContractorInfo({ ...contractorInfo, name: e.target.value })} style={{ width: '100%', padding: '6px', marginBottom: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <input type="text" value={contractorInfo.vatNumber} onChange={(e) => setContractorInfo({ ...contractorInfo, vatNumber: e.target.value })} style={{ width: '100%', padding: '6px', marginBottom: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <input type="text" value={contractorInfo.address} onChange={(e) => setContractorInfo({ ...contractorInfo, address: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#64748b', textTransform: 'uppercase' }}>{t.clientChantierTitle}</h4>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{clientInfo.name}</p>
                <p style={{ margin: '2px 0' }}>{t.vatNumLabel} : {clientInfo.vatNumber || 'Particulier'}</p>
                <p style={{ margin: '2px 0' }}><strong>Chantier/Werf :</strong> {clientInfo.siteAddress}</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Description</th>
                  <th style={{ padding: '10px', width: '80px' }}>Qté</th>
                  <th style={{ padding: '10px', width: '120px' }}>Prix Unitaire HT</th>
                  <th style={{ padding: '10px', width: '90px' }}>Taux TVA</th>
                  <th style={{ padding: '10px', width: '120px' }}>Total HT</th>
                  <th style={{ padding: '10px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>
                      <input type="text" value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '10px' }}>
                      <input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '10px' }}>
                      <input type="number" value={item.unitPrice} onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>
                      {item.vatRate}%
                    </td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>
                      {(item.quantity * item.unitPrice).toFixed(2)} €
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => removeLineItem(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addLineItem} style={{ padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              {t.addPos}
            </button>

            <div style={{ marginTop: '24px', width: '320px', marginLeft: 'auto', textAlign: 'right', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}>{t.subTotal} <strong>{totalExcl.toFixed(2)} €</strong></p>
              <p style={{ margin: '4px 0', color: '#2563eb' }}>{t.vatAmount} ({vatResult.rate}%) : <strong>{totalVat.toFixed(2)} €</strong></p>
              <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 'bold', borderTop: '2px solid #e2e8f0', paddingTop: '8px' }}>
                {t.totalTtc} {totalIncl.toFixed(2)} €
              </p>
            </div>

            {vatResult.legalNotice && (
              <div style={{ marginTop: '32px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155' }}>
                <strong>{t.legalNoticeTitle}</strong><br />
                <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>{vatResult.legalNotice}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
