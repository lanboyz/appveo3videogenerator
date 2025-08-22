import React, { useState, useCallback, useEffect, useRef } from 'react';
import VideoGeneratorForm from './components/VideoGeneratorForm';
import VideoPreview from './components/VideoPreview';
import ApiKeyInput from './components/ApiKeyInput';
import { generateVideo } from './services/geminiService';
import type { GenerateVideoParams } from './types';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState('16/9');
  const [generationCount, setGenerationCount] = useState<number>(0);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const handleApiKeySave = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
    setShowApiKeyInput(false);
    
    // Scroll to the generate form after the input is hidden
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleGenerateVideo = useCallback(async (params: Omit<GenerateVideoParams, 'apiKey'>) => {
    if (!apiKey) {
      setError('Please set your Google Gemini API Key first.');
      setShowApiKeyInput(true);
      return;
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
      setLoadingMessage('Initializing video generation...');
      const videoUrl = await generateVideo({ ...params, apiKey });
      setGeneratedVideoUrl(videoUrl);
      setGenerationCount(prevCount => prevCount + 1);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      
      // Check for potential API key errors and reset
      const isApiKeyError = /API Key|permission denied|quota|400|403/i.test(errorMessage);
      if (isApiKeyError) {
        setError('API Key is invalid or has reached its limit. Please enter a new one.');
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
  }, [apiKey]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 text-blue-900 font-sans p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 drop-shadow-sm">
            VEO-3 Video Generator
          </h1>
          <p className="text-blue-500 mt-2 text-lg">
            Bring your ideas to life with AI-powered video creation.
          </p>
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
          <p>@2025 VEO 3 VIDEO GENERATOR by LANBOY</p>
        </footer>
      </div>
    </div>
  );
};

export default App;