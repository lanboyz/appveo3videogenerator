import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onLogin: (name: string) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onLogin }) => {
  const [animationStep, setAnimationStep] = useState(0); // 0: init, 1: title, 2: desc, 3: form
  const [name, setName] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStep(1), 200),
      setTimeout(() => setAnimationStep(2), 1200),
      setTimeout(() => setAnimationStep(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  
  const handleContinue = () => {
    if (!name.trim()) return;
    setIsExiting(true);
    setTimeout(() => {
      onLogin(name.trim());
    }, 800); // Wait for fade out animation
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 p-4 text-center transition-opacity duration-700 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="w-full max-w-2xl">
        <h1 
            className={`text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 drop-shadow-lg transition-all duration-1000 ease-out ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
        >
          Generator Video VEO-3
        </h1>

        <p 
            className={`mt-4 text-lg text-blue-600 max-w-xl mx-auto transition-opacity duration-1000 ease-in-out delay-500 ${animationStep >= 2 ? 'opacity-100' : 'opacity-0'}`}
        >
          Selamat datang di masa depan pembuatan video. Ubah teks dan gambar Anda menjadi video berkualitas tinggi yang memukau dengan AI canggih dari Google.
        </p>

        <div 
            className={`mt-10 transition-all duration-700 ease-out delay-1000 ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <div className="max-w-md mx-auto bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6">
             <label htmlFor="name-input" className="block text-lg font-semibold text-blue-800 mb-3">
                Masukkan nama Anda untuk memulai
             </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="misalnya, Alex"
                className="w-full p-3 bg-white/50 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-blue-400 text-blue-900"
                aria-label="Masukkan nama Anda"
              />
              <button 
                onClick={handleContinue}
                disabled={!name.trim()}
                className="py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;