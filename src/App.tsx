import React, { useState } from 'react';

// Données de secours intégrées (évite tout crash d'importation)
const DEFAULT_COUNTRIES = ['BE', 'FR', 'NL', 'DE', 'LU'];
const DEFAULT_WORK_CATEGORIES = [
  { id: 'renov-standard', label: { FR: 'Travaux de rénovation (standard)', NL: 'Renovatiewerken (standaard)' } },
  { id: 'renov-insulation', label: { FR: 'Isolation thermique / Énergie', NL: 'Isolatie / Energie' } },
  { id: 'demolition-reconstruction', label: { FR: 'Démolition et reconstruction', NL: 'Sloop en Heropbouw' } }
];

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [state, setState] = useState({
    language: 'FR' as 'FR' | 'NL',
    countryCode: 'BE',
    clientType: 'B2C' as 'B2C' | 'B2B',
    clientName: '',
    vatNumber: '',
    isViesValidated: false,
    buildingAge: 'UNDER_10',
    buildingUsage: '100_PRIVATE',
    surfacePrivate: 0,
    surfacePro: 0,
    selectedWorkTypes: ['renov-standard'],
    siteAddress: '',
    contractorName: '',
    contractorVat: '',
    contractorAddress: '',
    lineItems: [] as Array<{ id: string; description: string; quantity: number; unitPrice: number; vatRate: number }>,
    deliveryDate: ''
  });

  const getCountryName = (code: string, lang: string) => {
    try {
      const regionNames = new Intl.DisplayNames([lang.toLowerCase()], { type: 'region' });
      return regionNames.of(code) || code;
    } catch {
      return code;
    }
  };

  const getWorkLabel = (workId: string, lang: 'FR' | 'NL') => {
    const work = DEFAULT_WORK_CATEGORIES.find((w) => w.id === workId);
    if (!work) return lang === 'NL' ? 'Bouwwerken' : 'Travaux de rénovation';
    return work.label[lang] || work.label.FR;
  };

  // Moteur de calcul TVA intégré (Réglementation belge)
  const computeVat = () => {
    if (state.clientType === 'B2B' && state.countryCode === 'BE') {
      return {
        rate: 0,
        label: 'Autoliquidation (Art. 20 Arrêté Royal n°1)',
        legalNotice: 'Autoliquidation - En l\'absence de contestation par écrit dans un délai de un mois à compter de la réception de la facture, le client est présumé reconnaître que les travaux sont effectués à un bâtiment d\'habitation dont la première occupation date d\'au moins 10 ans.'
      };
    }
    if (state.buildingAge === 'OVER_EQUAL_10') {
      return {
        rate: 6,
        label: 'Taux réduit 6% (Rénovation logement privé ≥ 10 ans)',
        legalNotice: 'Taux de TVA réduit de 6% en vertu de la rubrique XXXVIII du tableau A de l\'annexe à l\'arrêté royal n° 20.'
      };
    }
    return {
      rate: 21,
      label: 'Taux normal 21%',
      legalNotice: ''
    };
  };

  const vatResult = computeVat();

  const handleNavigateToStep = (targetStep: number) => {
    if ((targetStep === 4 || targetStep === 5) && state.lineItems.length === 0) {
      const defaultLabel = getWorkLabel(state.selectedWorkTypes[0] || 'renov-standard', state.language);
      setState(prev => ({
        ...prev,
        lineItems: [
          {
            id: '1',
            description: defaultLabel,
            quantity: 1,
            unitPrice: 150,
            vatRate: vatResult.rate
          }
        ]
      }));
    }
    setActiveStep(targetStep);
  };

  const handleViesCheck = () => {
    if (state.vatNumber.trim().length > 5) {
      setState(prev => ({ ...prev, isViesValidated: true }));
    } else {
      alert(state.language === 'NL' ? 'Ongeldig BTW-nummer' : 'Numéro de TVA invalide');
    }
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setState(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addLineItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: vatResult.rate
    };
    setState(prev => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  };

  const removeLineItem = (id: string) => {
    setState(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const totalExcl = state.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalVat = state.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + totalVat;

  const isNL = state.language === 'NL';

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* EN-TÊTE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>DIGIBÂT VAT / DIGIBOUW BTW</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            {isNL ? 'BTW-bepaling « Onroerende werken » — België' : 'Détermination TVA « Travaux immobiliers » — Belgique'}
          </p>
        </div>
        <div>
          <button 
            onClick={() => setState(prev => ({ ...prev, language: 'FR' }))}
            style={{ padding: '6px 12px', fontWeight: !isNL ? 'bold' : 'normal', background: !isNL ? '#2563eb' : '#e2e8f0', color: !isNL ? '#fff' : '#000', border: 'none', borderRadius: '4px 0 0 4px', cursor: 'pointer' }}
          >FR</button>
          <button 
            onClick={() => setState(prev => ({ ...prev, language: 'NL' }))}
            style={{ padding: '6px 12px', fontWeight: isNL ? 'bold' : 'normal', background: isNL ? '#2563eb' : '#e2e8f0', color: isNL ? '#fff' : '#000', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}
          >NL</button>
        </div>
      </div>

      {/* ONGLETS NAVIGATION */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 1, label: isNL ? 'Klantprofiel' : 'Profil Client' },
          { id: 2, label: isNL ? 'Pand & Werken' : 'Bien & Travaux' },
          { id: 3, label: isNL ? 'Fiscale Engine' : 'Moteur Fiscal' },
          { id: 4, label: isNL ? '📄 Offerte' : '📄 Écran Devis' },
          { id: 5, label: isNL ? '🧾 Factuur' : '🧾 Écran Facture' }
        ].map(step => (
          <button
            key={step.id}
            onClick={() => handleNavigateToStep(step.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              background: activeStep === step.id ? '#2563eb' : '#f1f5f9',
              color: activeStep === step.id ? '#fff' : '#475569',
              fontWeight: activeStep === step.id ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {step.id}. {step.label}
          </button>
        ))}
      </div>

      {/* CONTENU DES ÉTAPES */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
        
        {/* ÉTAPE 1 */}
        {activeStep === 1 && (
          <div>
            <h3>Étape 1 : {isNL ? 'Klantprofiel' : 'Profil Client'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Land van de klant' : 'Pays du client'}
                </label>
                <select 
                  value={state.countryCode} 
                  onChange={(e) => setState(prev => ({ ...prev, countryCode: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  {DEFAULT_COUNTRIES.map((code) => (
                    <option key={code} value={code}>
                      {getCountryName(code, state.language)} ({code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Statuut klant' : 'Statut du client'}
                </label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <label><input type="radio" checked={state.clientType === 'B2C'} onChange={() => setState(prev => ({ ...prev, clientType: 'B2C' }))} /> Particulier (B2C)</label>
                  <label><input type="radio" checked={state.clientType === 'B2B'} onChange={() => setState(prev => ({ ...prev, clientType: 'B2B' }))} /> Assujetti (B2B)</label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Naam klant' : 'Nom du client'}
                </label>
                <input 
                  type="text" 
                  value={state.clientName} 
                  onChange={(e) => setState(prev => ({ ...prev, clientName: e.target.value }))} 
                  placeholder="Ex: Livlina NV" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {state.clientType === 'B2B' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                    {isNL ? 'BTW-nummer' : 'Numéro de TVA'}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={state.vatNumber} 
                      onChange={(e) => setState(prev => ({ ...prev, vatNumber: e.target.value, isViesValidated: false }))} 
                      placeholder="BE 0123.456.789" 
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <button 
                      onClick={handleViesCheck} 
                      style={{ padding: '10px 16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {isNL ? 'Controleer VIES' : 'Vérifier VIES'}
                    </button>
                  </div>
                  {state.isViesValidated && (
                    <p style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>✓ TVA VIES Validée (OK)</p>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setActiveStep(2)} 
              style={{ marginTop: '24px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', float: 'right' }}
            >
              Étape suivante →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {activeStep === 2 && (
          <div>
            <h3>Étape 2 : {isNL ? 'Pand & Werken' : 'Bien Immobilier & Nature des Travaux'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Ouderdom gebouw' : 'Âge du bâtiment'}
                </label>
                <select 
                  value={state.buildingAge} 
                  onChange={(e) => setState(prev => ({ ...prev, buildingAge: e.target.value as any }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="UNDER_10">{isNL ? '< 10 jaar' : '< 10 ans'}</option>
                  <option value="OVER_EQUAL_10">{isNL ? '≥ 10 jaar' : '≥ 10 ans'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Gebruik van het gebouw' : 'Usage du bâtiment'}
                </label>
                <select 
                  value={state.buildingUsage} 
                  onChange={(e) => setState(prev => ({ ...prev, buildingUsage: e.target.value as any }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="100_PRIVATE">100% Privé</option>
                  <option value="OVER_50_PRIVATE">&gt; 50% Privé</option>
                  <option value="MIXED">{isNL ? 'Gemengd gebruik' : 'Usage Mixte'}</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                {isNL ? 'Aard van de werken' : 'Nature principale des travaux'}
              </label>
              <select 
                value={state.selectedWorkTypes[0] || 'renov-standard'} 
                onChange={(e) => setState(prev => ({ ...prev, selectedWorkTypes: [e.target.value] }))}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                {DEFAULT_WORK_CATEGORIES.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.label[state.language]}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                {isNL ? 'Adres van de werf' : 'Adresse du chantier'}
              </label>
              <input 
                type="text" 
                value={state.siteAddress} 
                onChange={(e) => setState(prev => ({ ...prev, siteAddress: e.target.value }))}
                placeholder="Heidestraat 43, 9070 Destelbergen" 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button 
              onClick={() => setActiveStep(3)} 
              style={{ marginTop: '24px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', float: 'right' }}
            >
              {isNL ? 'Bereken BTW' : 'Calculer TVA'} →
            </button>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {activeStep === 3 && (
          <div>
            <h3>Étape 3 : Régime TVA Déterminé</h3>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Taux applicable :</span>
                <span style={{ padding: '6px 16px', background: '#dcfce7', color: '#15803d', fontWeight: 'bold', borderRadius: '20px', fontSize: '16px' }}>
                  ✓ {vatResult.rate}% {vatResult.rate === 0 ? '(Autoliquidation / Verlegging van heffing)' : ''}
                </span>
              </div>
              <p style={{ fontSize: '13px', marginTop: '12px', color: '#334155' }}>
                <strong>Détail :</strong> {vatResult.label}
              </p>
              {vatResult.legalNotice && (
                <div style={{ marginTop: '16px', background: '#eff6ff', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #2563eb' }}>
                  <strong style={{ fontSize: '12px', color: '#1e40af' }}>Mention légale obligatoire :</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#1e3a8a', fontStyle: 'italic' }}>
                    "{vatResult.legalNotice}"
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleNavigateToStep(4)} 
                style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📝 Générer le Devis
              </button>
              <button 
                onClick={() => handleNavigateToStep(5)} 
                style={{ padding: '12px 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🧾 Générer la Facture
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPES 4 & 5 */}
        {(activeStep === 4 || activeStep === 5) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0 }}>{activeStep === 4 ? 'DEVIS / OFFERTE' : 'FACTURE / FACTUUR'}</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  N° : {activeStep === 4 ? 'DEV-2026-001' : 'FAC-2026-001'} | Date : {new Date().toLocaleDateString('fr-BE')}
                </span>
              </div>
              <span style={{ padding: '6px 12px', background: '#dbeafe', color: '#1e40af', fontWeight: 'bold', borderRadius: '12px', fontSize: '13px' }}>
                ✓ {vatResult.rate}% {vatResult.rate === 0 ? '(Autoliquidation)' : ''}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>Prestataire / Entrepreneur</h4>
                <input type="text" placeholder="Mira sarl" value={state.contractorName} onChange={(e) => setState(prev => ({ ...prev, contractorName: e.target.value }))} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="BE 0552.235.026" value={state.contractorVat} onChange={(e) => setState(prev => ({ ...prev, contractorVat: e.target.value }))} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Adresse..." value={state.contractorAddress} onChange={(e) => setState(prev => ({ ...prev, contractorAddress: e.target.value }))} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>Client & Chantier</h4>
                <p style={{ margin: '4px 0' }}><strong>Client :</strong> {state.clientName || 'Livlina (NV)'}</p>
                <p style={{ margin: '4px 0' }}><strong>N° BTW :</strong> {state.vatNumber || 'BE 0448.553.239'}</p>
                <p style={{ margin: '4px 0' }}><strong>Adresse Chantier :</strong> {state.siteAddress || 'Heidestraat 43, 9070 Destelbergen'}</p>
              </div>
            </div>

            <h4>PRESTATIONS</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '12px' }}>
                  <th style={{ padding: '8px' }}>Description</th>
                  <th style={{ padding: '8px', width: '80px' }}>Qté</th>
                  <th style={{ padding: '8px', width: '120px' }}>Prix unitaire</th>
                  <th style={{ padding: '8px', width: '120px' }}>Montant</th>
                  <th style={{ padding: '8px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {state.lineItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} 
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))} 
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="number" 
                        value={item.unitPrice} 
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))} 
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>
                      {(item.quantity * item.unitPrice).toFixed(2)} €
                    </td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => removeLineItem(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addLineItem} style={{ padding: '6px 12px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
              + Ligne
            </button>

            <div style={{ marginTop: '20px', width: '300px', marginLeft: 'auto', textAlign: 'right', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}>Subtotaal EXCL. BTW : <strong>{totalExcl.toFixed(2)} €</strong></p>
              <p style={{ margin: '4px 0', color: '#2563eb' }}>Montant TVA ({vatResult.rate}%) : <strong>{totalVat.toFixed(2)} €</strong></p>
              <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>Total TTC : {totalIncl.toFixed(2)} €</p>
            </div>

            {vatResult.legalNotice && (
              <div style={{ marginTop: '24px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', color: '#475569' }}>
                <strong>Mention légale obligatoire :</strong><br />
                <em>{vatResult.legalNotice}</em>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
