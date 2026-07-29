import React, { useState } from 'react';

export interface EntrepreneurHeaderProps {
  initialLines?: string[];
  onChange?: (lines: string[]) => void;
}

export const EntrepreneurHeader: React.FC<EntrepreneurHeaderProps> = ({
  initialLines = [
    'My Company BV / SRL',
    'BE0123456789',
    'Rue du Progrès 12, 1000 Bruxelles',
    'BE68 0000 1234 5678'
  ],
  onChange
}) => {
  const [lines, setLines] = useState<string[]>(initialLines);

  const handleLineChange = (index: number, val: string) => {
    const updated = [...lines];
    updated[index] = val;
    setLines(updated);
    if (onChange) onChange(updated);
  };

  const addLine = () => {
    const updated = [...lines, ''];
    setLines(updated);
    if (onChange) onChange(updated);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 1) return;
    const updated = lines.filter((_, i) => i !== index);
    setLines(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Prestataire / Entrepreneur
        </h4>
        <button
          type="button"
          onClick={addLine}
          className="text-xs text-blue-600 hover:underline font-medium no-print"
        >
          + Ajouter une ligne
        </button>
      </div>

      <div className="space-y-2">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={line}
              onChange={(e) => handleLineChange(idx, e.target.value)}
              placeholder="Nom, Adresse, TVA, IBAN..."
              className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {lines.length > 1 && (
              <button
                type="button"
                onClick={() => removeLine(idx)}
                className="text-slate-400 hover:text-red-600 text-sm px-1.5 no-print"
                title="Supprimer la ligne"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
