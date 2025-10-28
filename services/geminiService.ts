
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // Here, we'll alert and allow the UI to function without Gemini features.
  alert("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const findNearbyPlaces = async (
  query: string,
  location: { latitude: number; longitude: number }
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find ${query} near me.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      places: groundingChunks,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      text: "Sorry, I couldn't find any places right now. Please try again later.",
      places: [],
    };
  }
};
