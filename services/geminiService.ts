import { GoogleGenAI } from "@google/genai";
import type { GenerateVideoParams } from '../types';

// Helper function to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVideo = async (params: GenerateVideoParams): Promise<string> => {
  const { prompt, referenceImage, apiKey, modelId } = params;

  if (!apiKey) {
    throw new Error("API Key is not provided. Please set it in the application.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Note: The VEO API as per the provided docs does not currently support
  // aspect ratio, sound, or resolution parameters in the config.
  // These are included in the UI based on the user request, but are not passed to the API call.
  // The API may be updated in the future to support these features.
  
  const videoGenerationParams: any = {
    model: modelId, // Use the user-selected model
    prompt: prompt,
    config: {
      numberOfVideos: 1
    }
  };

  if (referenceImage) {
    videoGenerationParams.image = {
      imageBytes: referenceImage.base64,
      mimeType: referenceImage.mimeType
    };
  }

  try {
    let operation = await ai.models.generateVideos(videoGenerationParams);

    // Polling logic for long-running operation
    while (!operation.done) {
      await sleep(10000); // Poll every 10 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
       throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation completed, but no download link was found.");
    }

    // Fetch the video data using the provided URI and API key
    const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video file. Status: ${videoResponse.statusText}`);
    }
    
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error) {
    console.error("Error in generateVideo service:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`);
    }
    throw new Error("An unknown error occurred during video generation.");
  }
};
