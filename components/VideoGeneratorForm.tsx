import React, { useState, forwardRef } from 'react';
import type { GenerateVideoParams, AspectRatio, Resolution, ModelId } from '../types';
import ImageUploader from './ImageUploader';
import { FilmIcon, UploadIcon, KeyIcon } from './Icons';
import { VEO_MODEL_CHOICES } from '../constants';

interface VideoGeneratorFormProps {
  onGenerate: (params: Omit<GenerateVideoParams, 'apiKey'>) => void;
  isLoading: boolean;
  isApiKeySet: boolean;
}

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-300/50 hover:ring-2 hover:ring-blue-400/50 transform hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

const VideoGeneratorForm = forwardRef<HTMLFormElement, VideoGeneratorFormProps>(
  ({ onGenerate, isLoading, isApiKeySet }, ref) => {
    const [prompt, setPrompt] = useState<string>('');
    const [referenceImage, setReferenceImage] = useState<{ base64: string; mimeType: string; } | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [resolution, setResolution] = useState<Resolution>('1080p');
    const [modelId, setModelId] = useState<ModelId>(VEO_MODEL_CHOICES[0].id);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) {
        alert("Please enter a prompt.");
        return;
      }
      onGenerate({ prompt, referenceImage, aspectRatio, soundEnabled, resolution, modelId });
    };
    
    return (
      <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
        <GlassCard>
          <label htmlFor="prompt" className="block text-lg font-semibold text-blue-800 mb-2">
            Your Creative Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A neon hologram of a cat driving a futuristic car at top speed on a rainbow road..."
            className="w-full h-32 p-4 bg-white/50 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-blue-400 text-blue-900 resize-none"
            disabled={isLoading || !isApiKeySet}
          />
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="flex flex-col">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Reference Image (Optional)</h3>
            <ImageUploader onImageUpload={setReferenceImage} disabled={isLoading || !isApiKeySet} />
          </GlassCard>
          <GlassCard>
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Video Settings</h3>
              <div className="space-y-4">
                 <div>
                      <span className="block text-sm font-medium text-blue-700 mb-2">Model</span>
                      <div className="flex gap-2">
                          {VEO_MODEL_CHOICES.map(model => (
                              <button type="button" key={model.id} onClick={() => setModelId(model.id)}
                                  className={`flex-1 py-2 px-2 text-center rounded-lg transition-all border-2 flex flex-col items-center justify-center ${modelId === model.id ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white/60 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
                                  disabled={isLoading || !isApiKeySet}>
                                  <span className="text-sm font-semibold">{model.name}</span>
                                  <span className="text-xs opacity-90">{model.subtext}</span>
                              </button>
                          ))}
                      </div>
                  </div>
                  <div>
                      <span className="block text-sm font-medium text-blue-700 mb-2">Aspect Ratio</span>
                      <div className="flex gap-2">
                          {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
                              <button type="button" key={ratio} onClick={() => setAspectRatio(ratio)}
                                  className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-semibold border-2 ${aspectRatio === ratio ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white/60 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
                                  disabled={isLoading || !isApiKeySet}>
                                  {ratio}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div>
                      <span className="block text-sm font-medium text-blue-700 mb-2">Resolution</span>
                       <div className="flex gap-2">
                          {(['720p', '1080p'] as Resolution[]).map(res => (
                              <button type="button" key={res} onClick={() => setResolution(res)}
                                  className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-semibold border-2 ${resolution === res ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white/60 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
                                  disabled={isLoading || !isApiKeySet}>
                                  {res}
                              </button>
                          ))}
                      </div>
                  </div>
                   <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium text-blue-700">Enable Sound</span>
                       <button type="button" onClick={() => setSoundEnabled(!soundEnabled)} disabled={isLoading || !isApiKeySet}
                          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-blue-200'}`}>
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                  </div>
              </div>
          </GlassCard>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim() || !isApiKeySet}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            isApiKeySet ? (
              <>
                <FilmIcon />
                <span>Generate Video</span>
              </>
            ) : (
               <>
                <KeyIcon />
                <span>Set API Key to Generate</span>
              </>
            )
          )}
        </button>
      </form>
    );
  }
);

VideoGeneratorForm.displayName = 'VideoGeneratorForm';

export default VideoGeneratorForm;