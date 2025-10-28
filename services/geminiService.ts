import { GoogleGenAI, Type } from "@google/genai";
import { Driver, Location, RideOption, GroundingChunk } from "../types";

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // Here, we'll alert and allow the UI to function without Gemini features.
  alert("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getPlaceSuggestions = async (
  location: { latitude: number; longitude: number }
): Promise<GroundingChunk[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find popular and interesting places nearby. Include a mix of categories like cafes, parks, landmarks, and shopping areas.`,
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
    
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  } catch (error) {
    console.error("Error calling Gemini API for suggestions:", error);
    return [];
  }
};


export const calculateFare = async (
    pickup: Location,
    dropoff: Location,
    ride: RideOption,
    driver: Driver
): Promise<{ fare: number; distance: string; reasoning: string }> => {
    const prompt = `
        Act as a ride-sharing fare calculator for India.
        Calculate the estimated fare in Indian Rupees (₹) for a trip with the following details:
        - Pickup: "${pickup.address}"
        - Destination: "${dropoff.address}"
        - Ride Type: "${ride.name}" (${ride.description})
        - Vehicle: "${driver.vehicleModel}"

        Consider the following:
        1.  Estimate the distance in kilometers between the pickup and destination.
        2.  Factor in a base fare of ₹50.
        3.  Use a per-kilometer rate of ₹12.
        4.  Use a per-minute rate of ₹2 (assume an average speed of 30 km/h for travel time).
        5.  Apply the ride type multiplier of ${ride.multiplier}.
        6.  Consider the vehicle model for a slight fuel efficiency adjustment (e.g., a Prius is cheaper to run than an XL vehicle).
        7.  Provide a brief, one-sentence reasoning for the final price.

        Return the result as a JSON object with the exact keys "fare" (number), "distance" (string, in kilometers e.g., "15 km"), and "reasoning" (string).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fare: { type: Type.NUMBER },
                        distance: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        return {
            fare: data.fare,
            distance: data.distance,
            reasoning: data.reasoning,
        };

    } catch (error) {
        console.error("Error calculating fare with Gemini:", error);
        // Fallback calculation if API fails
        const fallbackFare = (250 * ride.multiplier) + (Math.random() * 50);
        return {
            fare: parseFloat(fallbackFare.toFixed(2)),
            distance: "approx. 8-11 km",
            reasoning: "Could not connect to the live pricing model.",
        };
    }
};