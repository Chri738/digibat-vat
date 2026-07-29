import React, { useState } from 'react';
import { DevisFactureScreen } from './components/DevisFactureScreen';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  
  // Données du formulaire
  const [clientType, setClientType] = useState<'b2c' | 'b2b'>('b2b');
  const [clientName, setClientName] = useState<string>('Vicernant(NV)');
  const [clientVat, setClientVat] = useState<string>('BE 0400.075.312');
  const [siteAddress, setSiteAddress] = useState<string>('');
  
  // Régime calculé à l'étape 3
  const [appliedVatRate] = useState<0 | 6 | 21>(0);
  const [legalNotice] = useState<string>(
    "Autoliquidation : En l'absence de contestation par écrit, dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques et que les travaux immobiliers sont affectés à son activité professionnelle (Art. 20 KB n° 1)."
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      
      {/* Sélecteur de langue */}
      <div style={{ maxWidth: '800px', margin: '0 auto 10px auto', textAlign: 'right' }}>
        <button 
          onClick={() => setLang('FR')} 
          style={{ fontWeight: lang === 'FR' ? 'bold' : 'normal', marginRight: '8px', cursor: 'pointer' }}>
          FR
        </button>
        <button 
          onClick={() => setLang('NL')} 
          style={{ fontWeight: lang === 'NL' ? 'bold' : 'normal', cursor: 'pointer' }}>
          NL
        </button>
      </div>

      {step < 4 && (
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '20px', color: '#1e3a8a', marginBottom: '20px' }}>
            Détermination TVA « Travaux immobiliers » — Belgique 2025-2026
          </h1>

          {/* ÉTAPE 1 */}
          {step === 1 && (
            <div>
              <h3>Étape 1 : Profil Client</h3>
              <div style={{ margin: '15px 0' }}>
                <label>
                  <input 
                    type="radio" 
                    name="clientType" 
                    checked={clientType === 'b2c'} 
                    onChange={() => setClientType('b2c')} 
                  /> Particular / Non-assujetti (B2C)
                </label>
                <label style={{ marginLeft: '15px' }}>
                  <input 
                    type="radio" 
                    name="clientType" 
                    checked={clientType === 'b2b'} 
                    onChange={() => setClientType('b2b')} 
                  /> Assujetti à la TVA (B2B)
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                <label>
                  Nom / Raison sociale :
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </label>
                <label>
                  Numéro TVA client :
                  <input 
                    type="text" 
                    value={clientVat} 
                    onChange={(e) => setClientVat(e.target.value)} 
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </label>
                <label>
                  Adresse du chantier :
                  <input 
                    type="text" 
                    value={siteAddress} 
                    onChange={(e) => setSiteAddress(e.target.value)} 
                    placeholder="Rue, N°, Code Postal, Ville"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </label>
              </div>

              <button 
                onClick={() => setStep(3)} 
                style={{ marginTop: '20px', padding: '10px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Passer à l'Étape 3 →
              </button>
            </div>
          )}

          {/* ÉTAPE 3 */}
          {step === 3 && (
            <div>
              <h3>Étape 3 : Régime TVA & Attestation Légale</h3>
              
              <div style={{ border: '2px solid #2563eb', padding: '15px', borderRadius: '6px', background: '#eff6ff', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>RÉGIME TVA APPLICABLE</h4>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1d4ed8', margin: 0 }}>
                  Autoliquidation (Co-contractant) (0% (Autoliquidation / Co-contractant))
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ fontSize: '13px' }}>📜 Mention légale obligatoire à inscrire sur la facture :</strong>
                <blockquote style={{ fontStyle: 'italic', color: '#475569', margin: '10px 0 0 0', paddingLeft: '10px', borderLeft: '3px solid #cbd5e1' }}>
                  « {legalNotice} »
                </blockquote>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setStep(1)} 
                  style={{ padding: '10px 15px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Retour Étape 1
                </button>

                <button 
                  onClick={() => setStep(4)} 
                  style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  📄 Générer le Devis / la Facture →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ÉTAPE 4 : ÉCRAN DEVIS / FACTURE */}
      {step === 4 && (
        <DevisFactureScreen 
          lang={lang}
          defaultVatRate={appliedVatRate}
          legalMention={legalNotice}
          initialClientName={clientName}
          initialClientVat={clientVat}
          initialSiteAddress={siteAddress}
          onBackToStep3={() => setStep(3)}
        />
      )}

    </div>
  );
}
