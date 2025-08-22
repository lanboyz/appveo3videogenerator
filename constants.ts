
export const VEO_MODEL_NAME = 'veo-2.0-generate-001';

// Defines the available model choices for the UI.
// The data structure is updated to support a two-line display.
export const VEO_MODEL_CHOICES = [
    { id: 'veo-2.0-generate-001', name: 'VEO 2', subtext: '(veo-2.0-generate-001)' },
    { id: 'veo-3.0-generate-preview', name: 'VEO 3', subtext: '(veo-3.0-generate-preview)' },
] as const;


export const LOADING_MESSAGES = [
  'Warming up the AI model...',
  'Analyzing your prompt and reference image...',
  'Generating initial video frames...',
  'This can take a few minutes, please be patient.',
  'Stitching scenes together...',
  'Adding digital pixie dust...',
  'Rendering the final video...',
  'Almost there, polishing the masterpiece!',
];