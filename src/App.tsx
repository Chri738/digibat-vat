import React, { useState } from 'react';
import { calculateVAT, VatInput, VatResult } from './vatEngine';

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [language, setLanguage] = useState<'FR' | 'NL'>('FR');

  // Form State
  const [form, setForm] = useState<VatInput>({
    clientType: 'B2C',
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
    { id: '1', description: 'Travaux d\'isolation et rénovation toiture', quantity: 1, unitPrice: 4500, vatRate: 6 }
  ]);

  const isNL = language === 'NL';

  // Calcul du résultat TVA
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

  // Calculs Financiers
  const totalExcl = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalVat = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + totalVat;

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#0f172a' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>DIGIBÂT VAT / DIGIBOUW BTW</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            {isNL ? 'Moteur Fiscal TVA « Onroerende Werken » België' : 'Moteur Fiscal TVA « Travaux Immobiliers » Belgique'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => { setLanguage('FR'); setForm(f => ({ ...f, language: 'FR' })); }}
            style={{ padding: '8px 16px', background: !isNL ? '#2563eb' : '#f1f5f9', color: !isNL ? '#fff' : '#475569', border: 'none', borderRadius: '6px 0 0 6px', fontWeight: 'bold', cursor: 'pointer' }}
          >FR</button>
          <button 
            onClick={() => { setLanguage('NL'); setForm(f => ({ ...f, language: 'NL' })); }}
            style={{ padding: '8px 16px', background: isNL ? '#2563eb' : '#f1f5f9', color: isNL ? '#fff' : '#475569', border: 'none', borderRadius: '0 6px 6px 0', fontWeight: 'bold', cursor: 'pointer' }}
          >NL</button>
        </div>
      </div>

      {/* NAVIGATION ETAPES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 1, label: isNL ? '1. Klantprofiel' : '1. Profil Client' },
          { id: 2, label: isNL ? '2. Pand & Werken' : '2. Bien & Travaux' },
          { id: 3, label: isNL ? '3. Fiscale Engine' : '3. Moteur Fiscal' },
          { id: 4, label: isNL ? '4. 📝 Offerte' : '4. 📝 Écran Devis' },
          { id: 5, label: isNL ? '5. 🧾 Factuur' : '5. 🧾 Écran Facture' }
        ].map(step => (
          <button
            key={step.id}
            onClick={() => handleStepChange(step.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              background: activeStep === step.id ? '#2563eb' : '#ffffff',
              color: activeStep === step.id ? '#ffffff' : '#475569',
              fontWeight: activeStep === step.id ? 'bold' : '500',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* PANNEAU DE CONTENU */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
        
        {/* ÉTAPE 1: PROFIL CLIENT */}
        {activeStep === 1 && (
          <div>
            <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              {isNL ? 'Stap 1: Klantidentificatie' : 'Étape 1 : Identification du Client'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {isNL ? 'Land van de klant' : 'Pays d\'établissement du client'}
                </label>
                <select 
                  value={form.countryCode} 
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="BE">Belgique / België (BE)</option>
                  <option value="FR">France (FR)</option>
                  <option value="NL">Pays-Bas / Nederland (NL)</option>
                  <option value="DE">Allemagne / Deutschland (DE)</option>
                  <option value="LU">Luxembourg (LU)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {isNL ? 'Fiscaal statuut' : 'Statut fiscal du client'}
                </label>
                <select 
                  value={form.clientType} 
                  onChange={(e) => setForm({ ...form, clientType: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="B2C">{isNL ? 'Particulier (B2C)' : 'Particulier (B2C)'}</option>
                  <option value="B2B">{isNL ? 'BTW-plichtige onderneming (B2B)' : 'Assujetti à la TVA (B2B)'}</option>
                  <option value="B2GOV">{isNL ? 'Overheid / VZW (Niet-BTW-plichtig)' : 'Personne morale non-assujettie (B2Gov / ASBL)'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {isNL ? 'Naam klant / Bedrijf' : 'Nom du client / Raison sociale'}
                </label>
                <input 
                  type="text" 
                  value={clientInfo.name} 
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {form.clientType === 'B2B' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                    {isNL ? 'BTW-nummer' : 'Numéro de TVA'}
                  </label>
                  <input 
                    type="text" 
                    value={clientInfo.vatNumber} 
                    onChange={(e) => setClientInfo({ ...clientInfo, vatNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                    ✓ Validé VIES (BE 0448.553.239)
                  </span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveStep(2)} 
              style={{ marginTop: '28px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', float: 'right' }}
            >
              {isNL ? 'Volgende stap →' : 'Étape suivante →'}
            </button>
          </div>
        )}

        {/* ÉTAPE 2: BIEN & TRAVAUX */}
        {activeStep === 2 && (
          <div>
            <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              {isNL ? 'Stap 2: Kenmerken Gebouw & Werken' : 'Étape 2 : Caractéristiques du Bâtiment & Des Travaux'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {isNL ? 'Ouderdom van het gebouw' : 'Âge de première occupation du bâtiment'}
                </label>
                <select 
                  value={form.buildingAge} 
                  onChange={(e) => setForm({ ...form, buildingAge: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="OVER_EQUAL_10">{isNL ? 'Minstens 10 jaar oud (≥ 10 jaar)' : 'Au moins 10 ans (≥ 10 ans)'}</option>
                  <option value="UNDER_10">{isNL ? 'Minder dan 10 jaar oud (< 10 jaar)' : 'Moins de 10 ans (< 10 ans)'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                  {isNL ? 'Bestemming van het gebouw' : 'Usage du bâtiment'}
                </label>
                <select 
                  value={form.buildingUsage} 
                  onChange={(e) => setForm({ ...form, buildingUsage: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="100_PRIVATE">{isNL ? '100% Privéwoning' : '100% Habitation privée'}</option>
                  <option value="OVER_50_PRIVATE">{isNL ? 'Gemengd (> 50% privégebruik)' : 'Usage mixte (Privé ≥ 50%)'}</option>
                  <option value="UNDER_50_PRIVATE">{isNL ? 'Gemengd (< 50% privégebruik - Opsplitsing)' : 'Usage mixte (Privé < 50% - Ventilation Prorata)'}</option>
                  <option value="100_PRO">{isNL ? '100% Beroepsgebruik' : '100% Commercial / Professionnel'}</option>
                </select>
              </div>
            </div>

            {/* Calculateur de surface au prorata si mixte < 50% */}
            {form.buildingUsage === 'UNDER_50_PRIVATE' && (
              <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                  {isNL ? 'Oppervlakteberekening (Prorata)' : 'Calcul de répartition des surfaces (m²)'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Surface Privée (m²)</label>
                    <input 
                      type="number" 
                      value={form.surfacePrivate} 
                      onChange={(e) => setForm({ ...form, surfacePrivate: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Surface Professionnelle (m²)</label>
                    <input 
                      type="number" 
                      value={form.surfacePro} 
                      onChange={(e) => setForm({ ...form, surfacePro: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                {isNL ? 'Aard van de werkzaamheden' : 'Nature principale des travaux'}
              </label>
              <select 
                value={form.workType} 
                onChange={(e) => setForm({ ...form, workType: e.target.value as any })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="renov_standard">{isNL ? 'Renovatie / Ombouwwerken' : 'Travaux de rénovation / transformation'}</option>
                <option value="energy_insulation">{isNL ? 'Isolatie / Energiebesparing' : 'Isolation thermique / Énergie'}</option>
                <option value="demolition_reconstruction">{isNL ? 'Sloop & Heropbouw' : 'Démolition et reconstruction'}</option>
                <option value="new_construction">{isNL ? 'Nieuwbouw' : 'Nouvelle construction'}</option>
              </select>
            </div>

            {/* Case à cocher pour Démolition / Reconstruction */}
            {form.workType === 'demolition_reconstruction' && (
              <div style={{ marginTop: '16px', background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={form.isUniqueOwnHome} 
                    onChange={(e) => setForm({ ...form, isUniqueOwnHome: e.target.checked })} 
                  /> {isNL ? 'Eigen en enige woning' : 'S\'agit-il du logement propre et unique du maître d\'ouvrage ?'}
                </label>
                <label style={{ display: 'block', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={form.surfaceMax200m2} 
                    onChange={(e) => setForm({ ...form, surfaceMax200m2: e.target.checked })} 
                  /> {isNL ? 'Totale bewoonbare oppervlakte ≤ 200 m²' : 'Surface habitable totale ≤ 200 m² ?'}
                </label>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                {isNL ? 'Adres van de werf' : 'Adresse exacte du chantier'}
              </label>
              <input 
                type="text" 
                value={clientInfo.siteAddress} 
                onChange={(e) => setClientInfo({ ...clientInfo, siteAddress: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button 
              onClick={() => setActiveStep(3)} 
              style={{ marginTop: '28px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', float: 'right' }}
            >
              {isNL ? 'Bereken BTW-tarief →' : 'Calculer le régime TVA →'}
            </button>
          </div>
        )}

        {/* ÉTAPE 3: RESULTAT DU MOTEUR FISCAL */}
        {activeStep === 3 && (
          <div>
            <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              {isNL ? 'Stap 3: BTW-Resultaat & Juridische Vermeldingen' : 'Étape 3 : Résultat Fiscal & Mentions Légales'}
            </h2>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Régime TVA calculé :</span>
                <span style={{ padding: '8px 20px', background: '#dcfce7', color: '#166534', fontWeight: 'bold', borderRadius: '30px', fontSize: '18px' }}>
                  ✓ {vatResult.rate}% {vatResult.secondaryRate ? `/ ${vatResult.secondaryRate}%` : ''} ({vatResult.label})
                </span>
              </div>

              <div style={{ marginTop: '16px', fontSize: '14px', color: '#334155' }}>
                <strong>Motivation juridique :</strong> {vatResult.explanation}
              </div>

              {vatResult.legalNotice && (
                <div style={{ marginTop: '20px', background: '#eff6ff', borderLeft: '4px solid #2563eb', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: '#1e40af', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    {isNL ? 'Verplichte juridische vermelding op factuur:' : 'Mention légale obligatoire à faire figurer sur le document :'}
                  </strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{vatResult.legalNotice}"
                  </p>
                </div>
              )}

              {vatResult.certificateRequired && (
                <div style={{ marginTop: '16px', background: '#fefce8', border: '1px solid #fef08a', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#854d0e' }}>
                  ⚠️ <strong>Attestation 6% obligatoire :</strong> Le client doit confirmer l'affectation résidentielle et l'ancienneté du bâtiment (intégrée directement dans la facture via la clause légale).
                </div>
              )}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleStepChange(4)} 
                style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
              >
                📝 Générer le Devis
              </button>
              <button 
                onClick={() => handleStepChange(5)} 
                style={{ padding: '14px 28px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
              >
                🧾 Générer la Facture
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 & 5: DEVIS & FACTURE */}
        {(activeStep === 4 || activeStep === 5) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>
                  {activeStep === 4 ? (isNL ? 'OFFERTE' : 'DEVIS') : (isNL ? 'FACTUUR' : 'FACTURE')}
                </h2>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  N° {activeStep === 4 ? 'DEV-2026-001' : 'FAC-2026-001'} | Date : {new Date().toLocaleDateString('fr-BE')}
                </span>
              </div>
              <button 
                onClick={() => window.print()} 
                style={{ padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                🖨️ Imprimer / Export PDF
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#475569', textTransform: 'uppercase' }}>Prestataire</h4>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{contractorInfo.name}</p>
                <p style={{ margin: '2px 0' }}>TVA : {contractorInfo.vatNumber}</p>
                <p style={{ margin: '2px 0' }}>{contractorInfo.address}</p>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#475569', textTransform: 'uppercase' }}>Client & Chantier</h4>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{clientInfo.name}</p>
                <p style={{ margin: '2px 0' }}>TVA : {clientInfo.vatNumber || 'Particulier'}</p>
                <p style={{ margin: '2px 0' }}><strong>Chantier :</strong> {clientInfo.siteAddress}</p>
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

            <button onClick={addLineItem} style={{ padding: '8px 16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              + Ajouter une ligne
            </button>

            <div style={{ marginTop: '24px', width: '320px', marginLeft: 'auto', textAlign: 'right', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}>Sous-total HT : <strong>{totalExcl.toFixed(2)} €</strong></p>
              <p style={{ margin: '4px 0', color: '#2563eb' }}>Montant TVA ({vatResult.rate}%) : <strong>{totalVat.toFixed(2)} €</strong></p>
              <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 'bold', borderTop: '2px solid #e2e8f0', paddingTop: '8px' }}>
                Total TTC : {totalIncl.toFixed(2)} €
              </p>
            </div>

            {vatResult.legalNotice && (
              <div style={{ marginTop: '32px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#334155' }}>
                <strong>Mentions Légales Réglementaires Obligatoires :</strong><br />
                <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>{vatResult.legalNotice}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
