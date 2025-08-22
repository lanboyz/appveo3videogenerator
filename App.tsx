import React, { useState, useCallback, useEffect, useRef } from 'react';
import VideoGeneratorForm from './components/VideoGeneratorForm';
import VideoPreview from './components/VideoPreview';
import ApiKeyInput from './components/ApiKeyInput';
import SplashScreen from './components/SplashScreen';
import Clock from './components/Clock';
import Notification from './components/Notification';
import { generateVideo } from './services/geminiService';
import type { GenerateVideoParams } from './types';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState('16/9');
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; type: 'warning' | 'error' } | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
    }
    
    const storedCount = localStorage.getItem('generationCount');
    if (storedCount) {
        setGenerationCount(parseInt(storedCount, 10));
    }
  }, []);

  const handleLogin = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
  };

  const handleApiKeySave = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
    setShowApiKeyInput(false);
    
    // Atur ulang jumlah pembuatan untuk kunci baru
    setGenerationCount(0);
    localStorage.setItem('generationCount', '0');
    setNotification(null); // Hapus notifikasi batas apa pun

    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleGenerateVideo = useCallback(async (params: Omit<GenerateVideoParams, 'apiKey'>) => {
    if (!apiKey) {
      setError('Silakan atur Kunci API Google Gemini Anda terlebih dahulu.');
      setShowApiKeyInput(true);
      return;
    }

    // Blokir pembuatan jika batas tercapai
    if (generationCount >= 10) {
        setNotification({
            message: 'Batas 10 kali pembuatan video telah tercapai. Harap masukkan Kunci API yang baru.',
            type: 'error',
        });
        setShowApiKeyInput(true);
        return;
    }

    // Peringatkan pengguna pada percobaan terakhir mereka
    if (generationCount === 9) {
        setNotification({
            message: 'Ini adalah pembuatan video terakhir Anda. Setelah ini, Anda memerlukan Kunci API baru.',
            type: 'warning',
        });
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setPreviewAspectRatio(params.aspectRatio === '16:9' ? '16/9' : '9/16');

    previewRef.current?.scrollIntoView({ behavior: 'smooth' });

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
    }, 3000);

    try {
      setLoadingMessage('Memulai pembuatan video...');
      const videoUrl = await generateVideo({ ...params, apiKey });
      setGeneratedVideoUrl(videoUrl);
      
      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      localStorage.setItem('generationCount', newCount.toString());
      
      // Beri tahu pengguna setelah pembuatan ke-10 selesai
      if (newCount === 10) {
        setNotification({
            message: 'Anda telah mencapai batas 10 pembuatan video. Harap gunakan Kunci API baru untuk melanjutkan.',
            type: 'error'
        });
        setApiKey('');
        localStorage.removeItem('gemini-api-key');
        setShowApiKeyInput(true);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
      
      const isApiKeyError = /API Key|permission denied|quota|400|403/i.test(errorMessage);
      if (isApiKeyError) {
        setError('Kunci API tidak valid atau telah mencapai batasnya. Silakan masukkan yang baru.');
        setApiKey('');
        localStorage.removeItem('gemini-api-key');
        setShowApiKeyInput(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      clearInterval(messageInterval);
      setLoadingMessage('');
    }
  }, [apiKey, generationCount]);

  if (!userName) {
    return <SplashScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 text-blue-900 font-sans p-4 sm:p-8 flex flex-col items-center">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 drop-shadow-sm">
            Generator Video VEO-3
          </h1>
          <p className="text-blue-500 mt-2 text-lg">
            Selamat datang, <span className="font-semibold">{userName}</span>! Wujudkan ide-ide Anda.
          </p>
          <Clock />
        </header>

        <main className="w-full space-y-8">
          {showApiKeyInput && (
            <ApiKeyInput 
              currentApiKey={apiKey}
              onSave={handleApiKeySave}
              disabled={isLoading}
            />
          )}
          <VideoPreview
            ref={previewRef}
            videoUrl={generatedVideoUrl}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
            aspectRatio={previewAspectRatio}
            generationCount={generationCount}
          />
          <VideoGeneratorForm
            ref={formRef}
            onGenerate={handleGenerateVideo}
            isLoading={isLoading}
            isApiKeySet={!!apiKey}
          />
        </main>
        
        <footer className="text-center mt-auto py-4 text-blue-500 text-sm">
          <p>@2025 GENERATOR VIDEO VEO 3 oleh LANBOY</p>
        </footer>
      </div>
    </div>
  );
};

export default App;