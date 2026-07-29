import React, { useState, useEffect, useCallback } from 'react';

export type Language = 'FR' | 'NL';

export interface PrestationLine {
  id: string;
  description: string;
  amount: number | '';
  vatRate: 0 | 6 | 21;
}

export interface HistoryLog {
  timestamp: string;
  actionFR: string;
  actionNL: string;
}

export interface DevisFactureProps {
  lang?: Language;
  defaultVatRate?: 0 | 6 | 21;
  legalMention?: string;
  initialClientName?: string;
  initialClientVat?: string;
  initialSiteAddress?: string;
  onBackToStep3?: () => void;
}

const TRANSLATIONS = {
  FR: {
    quoteTitle: "Écran Devis",
    invoiceTitle: "Écran Facture",
    contractorLabel: "Prestataire de Services / Entrepreneur",
    clientLabel: "Nom / Raison sociale",
    vatLabel: "Numéro de TVA",
    siteLabel: "Adresse du Chantier / Bien",
    deliveryDateLabel: "Date de livraison du chantier (saisie manuelle)",
    createdAtLabel: "Horodatage de création",
    initialQuoteRefLabel: "Référence Devis d'origine",
    
    colDescription: "Prestations & Matériels",
    colAmount: "Montant HTVA (€)",
    colVatRate: "Taux TVA",
    colTotalLine: "Total HTVA",
    addLineBtn: "+ Ajouter une ligne",
    
    subtotal6: "Total HTVA (6%)",
    vat6: "TVA 6%",
    subtotal21: "Total HTVA (21%)",
    vat21: "TVA 21%",
    subtotal0: "Total HTVA (0% Autoliquidation)",
    vat0: "TVA 0%",
    totalHT: "Total Général HTVA",
    totalTVA: "Total TVA",
    totalTTC: "Total Général TTC",

    legalNoticeTitle: "Mention Légale TVA Obligatoire",
    historyTitle: "Historique & Traçabilité (Masqué à l'impression / Peppol)",
    
    btnPrint: "Imprimer / Exporter PDF",
    btnConvertToInvoice: "Convertir en facture",
    btnPeppol: "Transférer via Peppol",
    btnBack: "Retour au Régime TVA",
    
    msgConverted: "Devis converti en facture avec succès.",
    msgPeppolSent: "Facture transmise avec succès au réseau Peppol !"
  },
  NL: {
    quoteTitle: "Offertescherm",
    invoiceTitle: "Factuurscherm",
    contractorLabel: "Dienstverlener / Aannemer",
    clientLabel: "Naam / Bedrijfsnaam",
    vatLabel: "Btw-nummer",
    siteLabel: "Adres van de werf / bouwwerf",
    deliveryDateLabel: "Opleveringsdatum van de werken",
    createdAtLabel: "Aanmaakdatum en -tijd",
    initialQuoteRefLabel: "Oorspronkelijke offertereferentie",
    
    colDescription: "Prestaties & Materialen",
    colAmount: "Bedrag excl. btw (€)",
    colVatRate: "Btw-tarief",
    colTotalLine: "Totaal excl. btw",
    addLineBtn: "+ Regel toevoegen",
    
    subtotal6: "Totaal excl. btw (6%)",
    vat6: "Btw 6%",
    subtotal21: "Totaal excl. btw (21%)",
    vat21: "Btw 21%",
    subtotal0: "Totaal excl. btw (0% Btw verlegd)",
    vat0: "Btw 0%",
    totalHT: "Algemeen Totaal excl. btw",
    totalTVA: "Totaal Btw",
    totalTTC: "Algemeen Totaal incl. btw",

    legalNoticeTitle: "Verplichte Btw-vermelding",
    historyTitle: "Historiek & Traceerbaarheid (Verborgen bij afdrukken / Peppol)",
    
    btnPrint: "Afdrukken / Opslaan",
    btnConvertToInvoice: "Omzetten naar factuur",
    btnPeppol: "Verzenden via Peppol",
    btnBack: "Terug naar Btw-regeling",

    msgConverted: "Offerte succesvol omgezet naar factuur.",
    msgPeppolSent: "Factuur succesvol verzonden via Peppol-netwerk!"
  }
};

export const DevisFactureScreen: React.FC<DevisFactureProps> = ({
  lang = 'FR',
  defaultVatRate = 6,
  legalMention = "TVA acquittée par le cocontractant - Article 20 de l'AR n°1",
  initialClientName = '',
  initialClientVat = '',
  initialSiteAddress = '',
  onBackToStep3
}) => {
  const currentLang = (lang === 'NL' ? 'NL' : 'FR') as Language;
  const t = TRANSLATIONS[currentLang];

  const [docMode, setDocMode] = useState<'quote' | 'invoice'>('quote');
  const [createdAt] = useState<string>(() => new Date().toLocaleString(currentLang === 'FR' ? 'fr-BE' : 'nl-BE'));
  const [quoteRefNumber] = useState<string>(() => `DEV-${Date.now().toString().slice(-6)}`);
  const [invoiceRefNumber, setInvoiceRefNumber] = useState<string>('');

  const [contractorName, setContractorName] = useState<string>('');
  const [clientName, setClientName] = useState<string>(initialClientName);
  const [clientVat, setClientVat] = useState<string>(initialClientVat);
  const [siteAddress, setSiteAddress] = useState<string>(initialSiteAddress);
  const [deliveryDate, setDeliveryDate] = useState<string>('');

  const [lines, setLines] = useState<PrestationLine[]>([
    { id: '1', description: '', amount: '', vatRate: defaultVatRate }
  ]);

  const [history, setHistory] = useState<HistoryLog[]>([]);

  const addHistoryLog = useCallback((actionFR: string, actionNL: string) => {
    const timestamp = new Date().toLocaleString(currentLang === 'FR' ? 'fr-BE' : 'nl-BE');
    setHistory(prev => [...prev, { timestamp, actionFR, actionNL }]);
  }, [currentLang]);

  useEffect(() => {
    addHistoryLog(`Création du devis ${quoteRefNumber}`, `Aanmaak van offerte ${quoteRefNumber}`);
  }, [addHistoryLog, quoteRefNumber]);

  const handleAddLine = () => {
    setLines(prev => [
      ...prev,
      { id: Date.now().toString(), description: '', amount: '', vatRate: defaultVatRate }
    ]);
  };

  const handleRemoveLine = (id: string) => {
    setLines(prev => prev.filter(l => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: keyof PrestationLine, value: string | number) => {
    setLines(prev => prev.map(l => {
      if (l.id !== id) return l;
      return { ...l, [field]: value } as PrestationLine;
    }));
  };

  const ht6 = lines.filter(l => l.vatRate === 6).reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
  const tva6 = ht6 * 0.06;

  const ht21 = lines.filter(l => l.vatRate === 21).reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
  const tva21 = ht21 * 0.21;

  const ht0 = lines.filter(l => l.vatRate === 0).reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
  const tva0 = 0;

  const totalHT = ht6 + ht21 + ht0;
  const totalTVA = tva6 + tva21 + tva0;
  const totalTTC = totalHT + totalTVA;

  const handleConvertToInvoice = () => {
    const invNum = `FAC-${Date.now().toString().slice(-6)}`;
    setInvoiceRefNumber(invNum);
    setDocMode('invoice');
    addHistoryLog(
      `Conversion du devis ${quoteRefNumber} en facture ${invNum}`,
      `Omzetting van offerte ${quoteRefNumber} naar factuur ${invNum}`
    );
    alert(t.msgConverted);
  };

  const handleSendPeppol = () => {
    if (!deliveryDate) {
      alert(currentLang === 'FR' ? "Veuillez saisir la date de livraison des travaux." : "Vul de opleveringsdatum van de werken in.");
      return;
    }
    addHistoryLog(
      `Envoi de la facture ${invoiceRefNumber} via le réseau Peppol`,
      `Verzending van factuur ${invoiceRefNumber} via Peppol-netwerk`
    );
    alert(t.msgPeppolSent);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ border: '2px solid #1e3a8a', padding: '20px', borderRadius: '8px', background: '#fff' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a8a', paddingBottom: '15px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#1e3a8a', fontSize: '24px' }}>
              {docMode === 'quote' ? t.quoteTitle : t.invoiceTitle}
            </h1>
            <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#475569' }}>
              N° {docMode === 'quote' ? quoteRefNumber : invoiceRefNumber}
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
            <p style={{ margin: 0 }}><strong>{t.createdAtLabel} :</strong> {createdAt}</p>
            {docMode === 'invoice' && (
              <p style={{ margin: '4px 0 0 0', color: '#1e3a8a' }}>
                <strong>{t.initialQuoteRefLabel} :</strong> {quoteRefNumber}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', display: 'block' }}>
                {t.contractorLabel}
              </label>
              <input 
                type="text" 
                value={contractorName} 
                onChange={(e) => setContractorName(e.target.value)}
                placeholder="..."
                style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', display: 'block' }}>
                {t.siteLabel}
              </label>
              <input 
                type="text" 
                value={siteAddress} 
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="..."
                style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            {docMode === 'invoice' && (
              <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '4px', border: '1px solid #f59e0b' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', display: 'block' }}>
                  ⚠️ {t.deliveryDateLabel} *
                </label>
                <input 
                  type="date" 
                  value={deliveryDate} 
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{ width: '100%', padding: '6px', border: '1px solid #d97706', borderRadius: '4px', marginTop: '4px' }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', display: 'block' }}>
                {t.clientLabel}
              </label>
              <input 
                type="text" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                placeholder="..."
                style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', display: 'block' }}>
                {t.vatLabel}
              </label>
              <input 
                type="text" 
                value={clientVat} 
                onChange={(e) => setClientVat(e.target.value)}
                placeholder="BE 0..."
                style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '25px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>{t.colDescription}</th>
                <th style={{ padding: '8px', width: '110px', textAlign: 'right' }}>{t.colAmount}</th>
                <th style={{ padding: '8px', width: '100px', textAlign: 'center' }}>{t.colVatRate}</th>
                <th style={{ padding: '8px', width: '110px', textAlign: 'right' }}>{t.colTotalLine}</th>
                <th style={{ padding: '8px', width: '40px' }} className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const lineAmount = Number(line.amount) || 0;
                return (
                  <tr key={line.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="text" 
                        value={line.description} 
                        onChange={(e) => handleUpdateLine(line.id, 'description', e.target.value)}
                        placeholder="..."
                        style={{ width: '100%', border: 'none', background: 'transparent' }}
                      />
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      <input 
                        type="number" 
                        value={line.amount} 
                        onChange={(e) => handleUpdateLine(line.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0.00"
                        style={{ width: '90px', textAlign: 'right', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <select 
                        value={line.vatRate} 
                        onChange={(e) => handleUpdateLine(line.id, 'vatRate', Number(e.target.value))}
                        style={{ padding: '4px', borderRadius: '3px', border: '1px solid #cbd5e1' }}>
                        <option value={6}>6%</option>
                        <option value={21}>21%</option>
                        <option value={0}>0% (Autoliquidation)</option>
                      </select>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      {lineAmount.toFixed(2)} €
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }} className="no-print">
                      <button 
                        onClick={() => handleRemoveLine(line.id)}
                        style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button 
            onClick={handleAddLine} 
            className="no-print" 
            style={{ marginTop: '10px', padding: '6px 12px', background: '#475569', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            {t.addLineBtn}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <div style={{ width: '320px', fontSize: '12px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            
            {ht6 > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span>{t.subtotal6} :</span>
                  <span>{ht6.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#16a34a' }}>
                  <span>{t.vat6} :</span>
                  <span>{tva6.toFixed(2)} €</span>
                </div>
              </>
            )}

            {ht21 > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', marginTop: '4px' }}>
                  <span>{t.subtotal21} :</span>
                  <span>{ht21.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#dc2626' }}>
                  <span>{t.vat21} :</span>
                  <span>{tva21.toFixed(2)} €</span>
                </div>
              </>
            )}

            {ht0 > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', marginTop: '4px' }}>
                  <span>{t.subtotal0} :</span>
                  <span>{ht0.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#2563eb' }}>
                  <span>{t.vat0} :</span>
                  <span>0.00 €</span>
                </div>
              </>
            )}

            <hr style={{ margin: '8px 0', borderColor: '#cbd5e1' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span>{t.totalHT} :</span>
              <strong>{totalHT.toFixed(2)} €</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span>{t.totalTVA} :</span>
              <strong>{totalTVA.toFixed(2)} €</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '2px solid #1e3a8a', marginTop: '6px', fontSize: '14px', color: '#1e3a8a' }}>
              <strong>{t.totalTTC} :</strong>
              <strong>{totalTTC.toFixed(2)} €</strong>
            </div>

          </div>
        </div>

        <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1', fontSize: '11px', color: '#334155', fontStyle: 'italic' }}>
          <strong>{t.legalNoticeTitle} :</strong>
          <p style={{ margin: '4px 0 0 0' }}>{legalMention}</p>
        </div>

      </div>

      <div className="no-print history-block" style={{ marginTop: '25px', background: '#f1f5f9', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#475569' }}>📋 {t.historyTitle}</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#64748b' }}>
          {history.map((h, i) => (
            <li key={i}>
              <strong>[{h.timestamp}]</strong> — {currentLang === 'FR' ? h.actionFR : h.actionNL}
            </li>
          ))}
        </ul>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        {onBackToStep3 && (
          <button onClick={onBackToStep3} style={{ padding: '10px 15px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ← {t.btnBack}
          </button>
        )}

        <button onClick={() => window.print()} style={{ padding: '10px 15px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          🖨️ {t.btnPrint}
        </button>

        {docMode === 'quote' ? (
          <button onClick={handleConvertToInvoice} style={{ padding: '10px 15px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            ➡️ {t.btnConvertToInvoice}
          </button>
        ) : (
          <button onClick={handleSendPeppol} style={{ padding: '10px 15px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            🌐 {t.btnPeppol}
          </button>
        )}
      </div>

      <style>{`
        @media print {
          .no-print, .history-block {
            display: none !important;
          }
          body {
            background: #fff;
            padding: 0;
          }
          input, select {
            border: none !important;
            background: transparent !important;
            appearance: none;
          }
        }
      `}</style>

    </div>
  );
};
