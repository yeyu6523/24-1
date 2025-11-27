import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Helper to ensure we get the fresh key if updated via window.aistudio
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback if not running in specific environment, assume env var is present
};

export const promptApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  } else {
    alert("API Key selection not available in this environment.");
  }
};

export const streamChat = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string,
  onChunk: (text: string) => void
) => {
  const ai = getClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
  });

  const resultStream = await chat.sendMessageStream({ message: newMessage });

  for await (const chunk of resultStream) {
    const responseChunk = chunk as GenerateContentResponse;
    if (responseChunk.text) {
      onChunk(responseChunk.text);
    }
  }
};

export const generateVeoVideo = async (
  imageFile: File,
  prompt: string
): Promise<string> => {
  const ai = getClient();
  
  // Convert File to Base64
  const base64Data = await fileToBase64(imageFile);
  const mimeType = imageFile.type;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Animate this image cinematically.",
    image: {
      imageBytes: base64Data,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p', 
      aspectRatio: '16:9'
    }
  });

  // Polling for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Failed to generate video URI");
  }

  // Append key for access
  return `${videoUri}&key=${process.env.API_KEY}`;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
