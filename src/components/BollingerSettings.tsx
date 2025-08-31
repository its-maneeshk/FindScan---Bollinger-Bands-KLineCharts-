'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Tabs from './Tabs';

interface Inputs {
  length: number;
  multiplier: number;
  offset: number;
}

interface Styles {
  showBasis: boolean;
  showUpper: boolean;
  showLower: boolean;
  colorBasis: string;
  colorUpper: string;
  colorLower: string;
  lineWidth: number;
  dashed: boolean;
  fillBackground: boolean;
  fillOpacity: number;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: Inputs;
  styles: Styles;
  onChange: (newInputs: Inputs, newStyles: Styles) => void;
}

const NumberInput = ({
  id,
  label,
  value,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}) => (
  <label htmlFor={id} className="flex justify-between items-center">
    {label}
    <input
      id={id}
      type="number"
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="bg-gray-800 p-1 rounded w-24 text-right focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </label>
);

const CheckboxInput = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="cursor-pointer accent-blue-500"
    />
    {label}
  </label>
);

const ColorInput = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <label htmlFor={id} className="flex justify-between items-center gap-3">
    {label}
    <input
      id={id}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-8 cursor-pointer"
    />
  </label>
);

export default function BollingerSettings({
  isOpen,
  onClose,
  inputs,
  styles,
  onChange,
}: SettingsProps) {
  const [tab, setTab] = useState<'Inputs' | 'Style'>('Inputs');
  const [localInputs, setLocalInputs] = useState(inputs);
  const [localStyles, setLocalStyles] = useState(styles);

  const handleSave = () => {
    onChange(localInputs, localStyles);
    onClose();
  };

  const handleReset = () => {
    setLocalInputs(inputs);
    setLocalStyles(styles);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bollinger Bands Settings">
      {/* Scrollable content wrapper */}
      <div className="max-h-[80vh] overflow-y-auto px-1">
        <Tabs
          tabs={['Inputs', 'Style']}
          active={tab}
          onChange={(t) => setTab(t as any)}
        />

        {tab === 'Inputs' && (
          <div className="space-y-3 mt-4">
            <NumberInput
              id="length"
              label="Length:"
              value={localInputs.length}
              onChange={(v) => setLocalInputs({ ...localInputs, length: v })}
            />
            <NumberInput
              id="multiplier"
              label="StdDev Multiplier:"
              step={0.1}
              value={localInputs.multiplier}
              onChange={(v) => setLocalInputs({ ...localInputs, multiplier: v })}
            />
            <NumberInput
              id="offset"
              label="Offset:"
              value={localInputs.offset}
              onChange={(v) => setLocalInputs({ ...localInputs, offset: v })}
            />
          </div>
        )}

        {tab === 'Style' && (
          <div className="space-y-4 mt-4">
            <CheckboxInput
              id="showBasis"
              label="Show Basis"
              checked={localStyles.showBasis}
              onChange={(v) => setLocalStyles({ ...localStyles, showBasis: v })}
            />
            <CheckboxInput
              id="fillBackground"
              label="Fill Background"
              checked={localStyles.fillBackground}
              onChange={(v) => setLocalStyles({ ...localStyles, fillBackground: v })}
            />

            <label
              htmlFor="opacity"
              className="flex justify-between items-center gap-3"
            >
              Opacity: <span>{localStyles.fillOpacity}</span>
              <input
                id="opacity"
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={localStyles.fillOpacity}
                onChange={(e) =>
                  setLocalStyles({
                    ...localStyles,
                    fillOpacity: Number(e.target.value),
                  })
                }
                className="w-40 accent-blue-500"
              />
            </label>

            <div className="space-y-2">
              <ColorInput
                id="colorBasis"
                label="Basis Color:"
                value={localStyles.colorBasis}
                onChange={(v) => setLocalStyles({ ...localStyles, colorBasis: v })}
              />
              <ColorInput
                id="colorUpper"
                label="Upper Band Color:"
                value={localStyles.colorUpper}
                onChange={(v) => setLocalStyles({ ...localStyles, colorUpper: v })}
              />
              <ColorInput
                id="colorLower"
                label="Lower Band Color:"
                value={localStyles.colorLower}
                onChange={(v) => setLocalStyles({ ...localStyles, colorLower: v })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="flex justify-end mt-4 gap-3 border-t pt-3 sticky bottom-0 bg-gray-900">
        <button
          onClick={handleReset}
          className="px-4 py-1 bg-gray-600 rounded hover:bg-gray-500"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-1 bg-blue-500 rounded hover:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
