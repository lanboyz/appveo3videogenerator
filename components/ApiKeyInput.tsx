import React, { useState, useEffect } from 'react';
import { KeyIcon, CheckCircleIcon } from './Icons';

interface ApiKeyInputProps {
  currentApiKey: string;
  onSave: (apiKey: string) => void;
  disabled: boolean;
}

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-300/50 hover:ring-2 hover:ring-blue-400/50 transform hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ currentApiKey, onSave, disabled }) => {
  const [inputValue, setInputValue] = useState(currentApiKey);

  useEffect(() => {
    setInputValue(currentApiKey);
  }, [currentApiKey]);
  
  const handleSave = () => {
    onSave(inputValue.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <GlassCard>
      <label htmlFor="api-key" className="block text-lg font-semibold text-blue-800 mb-2">
        Kunci API Google Gemini
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
            id="api-key"
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Masukkan kunci API Anda di sini"
            className="w-full p-3 bg-white/50 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-blue-400 text-blue-900"
            disabled={disabled}
            aria-label="Input Kunci API Google Gemini"
        />
        <button 
            onClick={handleSave}
            disabled={disabled || inputValue.trim() === currentApiKey || !inputValue.trim()}
            className="py-3 px-5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
            Simpan
        </button>
      </div>
        {currentApiKey && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-800 bg-green-100/70 p-2 rounded-md">
            <CheckCircleIcon />
            <span>Kunci API telah diatur. Anda sekarang dapat membuat video.</span>
        </div>
    )}
    </GlassCard>
  );
};

export default ApiKeyInput;