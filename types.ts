import type { VEO_MODEL_CHOICES } from './constants';

export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';
export type ModelId = typeof VEO_MODEL_CHOICES[number]['id'];

export interface GenerateVideoParams {
  prompt: string;
  apiKey: string;
  modelId: ModelId;
  referenceImage: {
    base64: string;
    mimeType: string;
  } | null;
  aspectRatio: AspectRatio;
  soundEnabled: boolean;
  resolution: Resolution;
}
