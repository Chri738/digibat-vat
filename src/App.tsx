import { useState, useCallback } from 'react';
import type { ClientProfile, LineItem } from './types';
import { REGIME_LABELS } from './types';
import {
  normalizeVatNumber,
  determineRegime,
  computeInvoiceTotals,
  checkVies,
} from './vatEngine';
import { supabase } from './supabase';

const emptyClient: ClientProfile = {
  name: '',
  vatNumber: '',
  country: 'BE',
  address: '',
  isVatSubject: false,
  viesValid: null,
  manualConfirmSubject: false,
};

const newLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
  vatRate: 21,
});

export default function App() {
  const [client, setClient] = useState<ClientProfile>(emptyClient);
  const [items, setItems] = useState<LineItem[]>([newLineItem()]);
  const [viesChecking, setViesChecking] = useState(false);
  const [viesError, setViesError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle',
  );

  const { regime, mention } = determineRegime(client);
  const totals = computeInvoiceTotals(items, regime);

  const updateClient = (patch: Partial<ClientProfile>) => {
    setClient((prev) => ({ ...prev, ...patch }));
    setSaveStatus('idle');
  };

  const handleVatNumberChange = (raw: string) => {
    const normalized = normalizeVatNumber(raw);
    updateClient({ vatNumber: normalized, viesValid: null, manualConfirmSubject: false });
    setViesError(null);
  };

  const handleCountryChange = (country: ClientProfile['country']) => {
    updateClient({
      country,
      viesValid: null,
      manualConfirmSubject: false,
    });
    setViesError(null);
  };

  const handleViesCheck = useCallback(async () => {
    if (!client.vatNumber) return;
    setViesChecking(true);
    setViesError(null);

    const vatToCheck = normalizeVatNumber(client.vatNumber);
    const result = await checkVies(vatToCheck, client.country);

    setViesChecking(false);

    if (result === null) {
      setViesError(
        'Service VIES indisponible. Vous pouvez confirmer manuellement l\'assujettissement ci-dessous.',
      );
      updateClient({ viesValid: null });
    } else if (result) {
      updateClient({ viesValid: true, isVatSubject: true });
    } else {
      setViesError(
        'Numéro de TVA non valide selon VIES. Vous pouvez confirmer manuellement l\'assujettissement ci-dessous.',
      );
      updateClient({ viesValid: false });
    }
  }, [client.vatNumber, client.country]);

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    setSaveStatus('idle');
  };

  const addItem = () => setItems((prev) => [...prev, newLineItem()]);
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');

    try {
      const { error } = await supabase.from('invoices').insert({
        client_name: client.name,
        client_vat_number: client.vatNumber,
        client_country: client.country,
        client_address: client.address,
        client_is_vat_subject: client.isVatSubject,
        client_vies_valid: client.viesValid,
        client_manual_confirm: client.manualConfirmSubject,
        regime,
        vat_mention: mention,
        items: items.map(({ id, ...rest }) => rest),
        total_ht: totals.totalHT,
        total_vat: totals.totalVat,
        total_ttc: totals.totalTTC,
      });

      if (error) throw error;
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const showManualConfirm =
    (client.viesValid === false || viesError !== null) &&
    client.country !== 'BE';

  return (
    <div className="app">
      <header className="app-header">
        <h1>DigiBât</h1>
        <p>Facturation construction — Profil Client &amp; Régime TVA</p>
      </header>

      {/* Profil Client */}
      <section className="card">
        <h2 className="card-title">Profil Client</h2>

        <div className="form-grid">
          <div className="form-field">
            <label>Nom du client</label>
            <input
              type="text"
              value={client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
              placeholder="Nom de l'entreprise"
            />
          </div>

          <div className="form-field">
            <label>Pays</label>
            <select
              value={client.country}
              onChange={(e) =>
                handleCountryChange(
                  e.target.value as ClientProfile['country'],
                )
              }
            >
              <option value="BE">Belgique</option>
              <option value="FR">France</option>
              <option value="NL">Pays-Bas</option>
              <option value="DE">Allemagne</option>
              <option value="LU">Luxembourg</option>
              <option value="other">Hors UE</option>
            </select>
          </div>

          <div className="form-field full">
            <label>Numéro de TVA</label>
            <div className="vat-input-wrapper">
              <span className="vat-prefix">BE</span>
              <input
                type="text"
                value={client.vatNumber.startsWith('BE') ? client.vatNumber.slice(2) : client.vatNumber}
                onChange={(e) => handleVatNumberChange(e.target.value)}
                placeholder="0123.456.789"
              />
              <button
                className="vat-check-button"
                onClick={handleViesCheck}
                disabled={viesChecking || !client.vatNumber}
              >
                {viesChecking ? 'Vérification...' : 'Vérifier VIES'}
              </button>
            </div>
          </div>

          <div className="form-field full">
            <label>Adresse</label>
            <input
              type="text"
              value={client.address}
              onChange={(e) => updateClient({ address: e.target.value })}
              placeholder="Rue, code postal, ville"
            />
          </div>

          <div className="form-field">
            <label>Assujetti à la TVA</label>
            <select
              value={client.isVatSubject ? 'yes' : 'no'}
              onChange={(e) =>
                updateClient({ isVatSubject: e.target.value === 'yes' })
              }
            >
              <option value="no">Non assujetti</option>
              <option value="yes">Assujetti</option>
            </select>
          </div>

          <div className="form-field">
            <label>Statut VIES</label>
            <div style={{ paddingTop: 8 }}>
              {viesChecking && (
                <span className="vat-status checking">
                  Vérification en cours...
                </span>
              )}
              {!viesChecking && client.viesValid === true && (
                <span className="vat-status valid">
                  ✓ Numéro valide (VIES)
                </span>
              )}
              {!viesChecking && client.viesValid === false && (
                <span className="vat-status invalid">
                  ✗ Numéro non valide (VIES)
                </span>
              )}
              {!viesChecking &&
                client.viesValid === null &&
                !viesError &&
                client.vatNumber && (
                  <span className="vat-status checking">
                    Non vérifié — cliquez sur « Vérifier VIES »
                  </span>
                )}
              {!viesChecking && !client.vatNumber && (
                <span style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>
                  Saisissez un numéro de TVA pour vérifier.
                </span>
              )}
            </div>
          </div>
        </div>

        {viesError && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'var(--color-warning-bg)',
              border: '1px solid var(--color-warning)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              color: 'var(--color-warning)',
            }}
          >
            {viesError}
          </div>
        )}

        {/* Case à cocher : confirmation manuelle (secours VIES) */}
        {showManualConfirm && (
          <div
            className="checkbox-field"
            style={{ marginTop: 16 }}
            onClick={() =>
              updateClient({ manualConfirmSubject: !client.manualConfirmSubject })
            }
          >
            <input
              type="checkbox"
              checked={client.manualConfirmSubject}
              onChange={(e) =>
                updateClient({ manualConfirmSubject: e.target.checked })
              }
            />
            <label>
              <strong>Confirmer manuellement client assujetti</strong>
              Cochez cette option pour forcer le régime Co-contractant à 0% en
              cas d'erreur ou d'indisponibilité du service VIES.
            </label>
          </div>
        )}

        {/* Bannière du régime déterminé */}
        <div className={`regime-banner ${regime}`}>
          <div>
            <div>{REGIME_LABELS[regime]}</div>
            {mention && <span className="mention">{mention}</span>}
          </div>
        </div>
      </section>

      {/* Lignes de facturation */}
      <section className="card">
        <h2 className="card-title">Lignes de facturation</h2>

        <table className="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ width: 70 }}>Qté</th>
              <th style={{ width: 100 }}>Prix unit.</th>
              <th style={{ width: 70 }}>TVA %</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                    placeholder="Description de la prestation"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, { quantity: Number(e.target.value) })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, { unitPrice: Number(e.target.value) })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.vatRate}
                    onChange={(e) =>
                      updateItem(item.id, { vatRate: Number(e.target.value) })
                    }
                    disabled={
                      regime === 'co_contractant' ||
                      regime === 'intra_eu' ||
                      regime === 'export'
                    }
                  />
                </td>
                <td>
                  {items.length > 1 && (
                    <button
                      className="remove-line-btn"
                      onClick={() => removeItem(item.id)}
                      title="Supprimer la ligne"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-line-btn" onClick={addItem}>
          + Ajouter une ligne
        </button>

        <div className="totals">
          <div className="totals-row">
            <span>Total HT</span>
            <span>{totals.totalHT.toFixed(2)} €</span>
          </div>
          <div className="totals-row">
            <span>TVA</span>
            <span>{totals.totalVat.toFixed(2)} €</span>
          </div>
          <div className="totals-row grand">
            <span>Total TTC</span>
            <span>{totals.totalTTC.toFixed(2)} €</span>
          </div>
        </div>

        {mention && (
          <div className="mention-box">{mention}</div>
        )}
      </section>

      {/* Sauvegarde */}
      <section className="card">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving || !client.name}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer la facture'}
        </button>
        {saveStatus === 'success' && (
          <div className="save-status success">
            Facture enregistrée avec succès.
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="save-status error">
            Erreur lors de l'enregistrement. Réessayez.
          </div>
        )}
      </section>
    </div>
  );
}
